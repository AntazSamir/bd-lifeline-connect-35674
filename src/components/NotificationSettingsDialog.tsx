import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabaseClient";
import { Loader2, Bell, Mail, MessageSquare } from "lucide-react";

interface NotificationSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}

export function NotificationSettingsDialog({
    open,
    onOpenChange,
    userId,
}: NotificationSettingsDialogProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [settings, setSettings] = useState({
        email_notifications: true,
        sms_notifications: false,
        urgent_requests: true,
        donation_reminders: true,
        marketing_emails: false,
    });

    useEffect(() => {
        if (open) {
            fetchNotificationSettings();
        }
    }, [open, userId]);

    const fetchNotificationSettings = async () => {
        setLoadingSettings(true);
        try {
            const { data, error } = await supabase
                .from("user_profiles")
                .select("notification_preferences")
                .eq("id", userId)
                .single();

            if (error) throw error;

            if (data?.notification_preferences) {
                setSettings(data.notification_preferences);
            }
        } catch (error) {
            console.error("Error fetching notification settings:", error);
            // Continue with default settings
        } finally {
            setLoadingSettings(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase
                .from("user_profiles")
                .update({
                    notification_preferences: settings,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", userId);

            if (error) throw error;

            toast({
                title: "Success!",
                description: "Your notification preferences have been updated.",
            });

            onOpenChange(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to update settings";
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const updateSetting = (key: keyof typeof settings, value: boolean) => {
        setSettings({ ...settings, [key]: value });
    };

    if (loadingSettings) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[500px]">
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Notification Settings</DialogTitle>
                    <DialogDescription>
                        Manage how you receive notifications about blood donation requests.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Email Notifications */}
                        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                            <div className="flex items-center space-x-3 flex-1">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div className="space-y-0.5">
                                    <Label htmlFor="email" className="text-base font-medium">
                                        Email Notifications
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive notifications via email
                                    </p>
                                </div>
                            </div>
                            <Switch
                                id="email"
                                checked={settings.email_notifications}
                                onCheckedChange={(checked) => updateSetting("email_notifications", checked)}
                            />
                        </div>

                        {/* SMS Notifications */}
                        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                            <div className="flex items-center space-x-3 flex-1">
                                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                                <div className="space-y-0.5">
                                    <Label htmlFor="sms" className="text-base font-medium">
                                        SMS Notifications
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive notifications via SMS
                                    </p>
                                </div>
                            </div>
                            <Switch
                                id="sms"
                                checked={settings.sms_notifications}
                                onCheckedChange={(checked) => updateSetting("sms_notifications", checked)}
                            />
                        </div>

                        {/* Urgent Requests */}
                        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                            <div className="flex items-center space-x-3 flex-1">
                                <Bell className="h-5 w-5 text-destructive" />
                                <div className="space-y-0.5">
                                    <Label htmlFor="urgent" className="text-base font-medium">
                                        Urgent Blood Requests
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified about urgent donation needs
                                    </p>
                                </div>
                            </div>
                            <Switch
                                id="urgent"
                                checked={settings.urgent_requests}
                                onCheckedChange={(checked) => updateSetting("urgent_requests", checked)}
                            />
                        </div>

                        {/* Donation Reminders */}
                        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                            <div className="flex items-center space-x-3 flex-1">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <div className="space-y-0.5">
                                    <Label htmlFor="reminders" className="text-base font-medium">
                                        Donation Reminders
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Reminders when you're eligible to donate again
                                    </p>
                                </div>
                            </div>
                            <Switch
                                id="reminders"
                                checked={settings.donation_reminders}
                                onCheckedChange={(checked) => updateSetting("donation_reminders", checked)}
                            />
                        </div>

                        {/* Marketing Emails */}
                        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                            <div className="flex items-center space-x-3 flex-1">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div className="space-y-0.5">
                                    <Label htmlFor="marketing" className="text-base font-medium">
                                        Marketing Emails
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Updates and news about blood donation
                                    </p>
                                </div>
                            </div>
                            <Switch
                                id="marketing"
                                checked={settings.marketing_emails}
                                onCheckedChange={(checked) => updateSetting("marketing_emails", checked)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Preferences
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
