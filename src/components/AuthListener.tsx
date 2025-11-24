import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

export function AuthListener() {
    const { toast } = useToast();

    const navigate = useNavigate();

    useEffect(() => {
        const checkAndUpdateAvatar = async (session: any) => {
            if (!session?.user) return;

            const user = session.user;
            logger.debug("AuthListener: Checking avatar for user", user.email);

            try {
                // 1. Check if user has a profile (with retries)
                let profile = null;
                let retries = 3;

                while (retries > 0 && !profile) {
                    const { data, error } = await supabase
                        .from("user_profiles")
                        .select("avatar_url")
                        .eq("id", user.id)
                        .single();

                    if (!error && data) {
                        profile = data;
                    } else {
                        // Wait a bit if profile not found (might be creating via trigger)
                        logger.debug(`AuthListener: Profile not found, retrying in 1s... (${retries - 1} retries left)`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        retries--;
                    }
                }

                if (!profile) {
                    logger.debug("AuthListener: Profile not found after retries");
                    return;
                }

                logger.debug("AuthListener: Current avatar:", profile.avatar_url);

                // 2. If profile exists but has no avatar, try to find one
                if (!profile.avatar_url) {
                    let newAvatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

                    // If no metadata avatar, try unavatar.io
                    if (!newAvatarUrl && user.email) {
                        // Use unavatar.io which aggregates Gravatar and others
                        newAvatarUrl = `https://unavatar.io/${user.email}`;
                    }

                    if (newAvatarUrl) {
                        logger.debug("AuthListener: Found new avatar URL:", newAvatarUrl);
                        const { error: updateError } = await supabase
                            .from("user_profiles")
                            .update({ avatar_url: newAvatarUrl })
                            .eq("id", user.id);

                        if (updateError) {
                            logger.error("AuthListener: Error updating avatar:", updateError);
                        } else {
                            logger.debug("AuthListener: Successfully updated avatar");
                            toast({
                                title: "Profile Updated",
                                description: "We've automatically set your profile picture.",
                            });
                            // Force a reload or state update if needed, but toast is good enough
                        }
                    } else {
                        logger.debug("AuthListener: No avatar source found");
                    }
                } else {
                    logger.debug("AuthListener: Avatar already exists");
                }
            } catch (err) {
                logger.error("Error in AuthListener:", err);
            }
        };

        const checkProfileCompletion = async (session: any) => {
            if (!session?.user) return;

            // Skip check if already on complete-profile page
            if (window.location.pathname === "/complete-profile") return;

            try {
                let profile = null;
                let retries = 3;

                // Retry fetching profile in case trigger hasn't finished yet
                while (retries > 0 && !profile) {
                    const { data, error } = await supabase
                        .from("user_profiles")
                        .select("phone, blood_group, district, division")
                        .eq("id", session.user.id)
                        .single();

                    if (!error && data) {
                        profile = data;
                    } else {
                        // Wait a bit if profile not found
                        logger.debug(`AuthListener: Profile not found for completion check, retrying in 1s... (${retries - 1} retries left)`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        retries--;
                    }
                }

                if (!profile) {
                    logger.error("AuthListener: Profile not found after retries (completion check)");
                    // If we still can't find the profile, we probably should redirect to complete profile anyway
                    // because it means they definitely don't have the data we need.
                    // However, if the table insert failed entirely, this page might also fail.
                    // Let's try redirecting as a fallback if it's a new user.
                    navigate("/complete-profile");
                    return;
                }

                // Check if essential fields are missing
                if (!profile.phone || !profile.blood_group || !profile.district) {
                    logger.info("AuthListener: Profile incomplete, redirecting to completion page");
                    navigate("/complete-profile");
                    toast({
                        title: "Complete Your Profile",
                        description: "Please provide your contact details to continue.",
                    });
                }
            } catch (err) {
                logger.error("Error in checkProfileCompletion:", err);
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
                checkAndUpdateAvatar(session);
                checkProfileCompletion(session);
            }

            if (event === "PASSWORD_RECOVERY") {
                logger.info("AuthListener: Password recovery event detected");
                navigate("/reset-password");
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [toast, navigate]);

    return null; // This component doesn't render anything
}
