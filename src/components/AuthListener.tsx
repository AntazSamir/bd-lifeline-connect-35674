import { useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { useToast } from "@/hooks/use-toast";

export function AuthListener() {
    const { toast } = useToast();

    useEffect(() => {
        const checkAndUpdateAvatar = async (session: any) => {
            if (!session?.user) return;

            const user = session.user;
            console.log("AuthListener: Checking avatar for user", user.email);

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
                        console.log(`AuthListener: Profile not found, retrying in 1s... (${retries - 1} retries left)`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        retries--;
                    }
                }

                if (!profile) {
                    console.log("AuthListener: Profile not found after retries");
                    return;
                }

                console.log("AuthListener: Current avatar:", profile.avatar_url);

                // 2. If profile exists but has no avatar, try to find one
                if (!profile.avatar_url) {
                    let newAvatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

                    // If no metadata avatar, try unavatar.io
                    if (!newAvatarUrl && user.email) {
                        // Use unavatar.io which aggregates Gravatar and others
                        newAvatarUrl = `https://unavatar.io/${user.email}`;
                    }

                    if (newAvatarUrl) {
                        console.log("AuthListener: Found new avatar URL:", newAvatarUrl);
                        const { error: updateError } = await supabase
                            .from("user_profiles")
                            .update({ avatar_url: newAvatarUrl })
                            .eq("id", user.id);

                        if (updateError) {
                            console.error("AuthListener: Error updating avatar:", updateError);
                        } else {
                            console.log("AuthListener: Successfully updated avatar");
                            toast({
                                title: "Profile Updated",
                                description: "We've automatically set your profile picture.",
                            });
                            // Force a reload or state update if needed, but toast is good enough
                        }
                    } else {
                        console.log("AuthListener: No avatar source found");
                    }
                } else {
                    console.log("AuthListener: Avatar already exists");
                }
            } catch (err) {
                console.error("Error in AuthListener:", err);
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
                checkAndUpdateAvatar(session);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [toast]);

    return null; // This component doesn't render anything
}
