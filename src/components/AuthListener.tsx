import { useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { useToast } from "@/hooks/use-toast";

export function AuthListener() {
    const { toast } = useToast();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
                const user = session.user;

                try {
                    // 1. Check if user has a profile
                    const { data: profile, error } = await supabase
                        .from("user_profiles")
                        .select("avatar_url")
                        .eq("id", user.id)
                        .single();

                    if (error && error.code !== "PGRST116") {
                        console.error("Error fetching profile:", error);
                        return;
                    }

                    // 2. If profile exists but has no avatar, try to find one
                    if (profile && !profile.avatar_url) {
                        let newAvatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

                        // If no metadata avatar, try unavatar.io (which checks Gravatar, etc.)
                        if (!newAvatarUrl && user.email) {
                            newAvatarUrl = `https://unavatar.io/${user.email}`;
                        }

                        if (newAvatarUrl) {
                            const { error: updateError } = await supabase
                                .from("user_profiles")
                                .update({ avatar_url: newAvatarUrl })
                                .eq("id", user.id);

                            if (updateError) {
                                console.error("Error updating avatar:", updateError);
                            } else {
                                console.log("Automatically updated user avatar from email/provider");
                                toast({
                                    title: "Profile Updated",
                                    description: "We've automatically set your profile picture.",
                                });
                            }
                        }
                    }
                } catch (err) {
                    console.error("Error in AuthListener:", err);
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [toast]);

    return null; // This component doesn't render anything
}
