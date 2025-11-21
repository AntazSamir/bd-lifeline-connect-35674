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
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface AvailabilityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
    onAvailabilityUpdated: () => void;
}

export function AvailabilityDialog({
    open,
    onOpenChange,
    userId,
    onAvailabilityUpdated,
}: AvailabilityDialogProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [isAvailable, setIsAvailable] = useState(false);
    const [notes, setNotes] = useState("");
    const [isDonor, setIsDonor] = useState(false);

    useEffect(() => {
        if (open) {
            fetchDonorStatus();
        }
    }, [open, userId]);

    const fetchDonorStatus = async () => {
        setLoadingStatus(true);
        try {
            // Check if user is registered as a donor
            const { data: donorData, error } = await supabase
                .from("donors")
                .select("is_available, availability_notes")
                .eq("profile_id", userId)
                .single();

            if (error) {
                if (error.code === "PGRST116") {
                    // No donor record found
                    setIsDonor(false);
                } else {
                    throw error;
                }
            } else {
                setIsDonor(true);
                setIsAvailable(donorData.is_available || false);
                setNotes(donorData.availability_notes || "");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to fetch donor status";
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
        } finally {
            setLoadingStatus(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isDonor) {
            toast({
                title: "Not a donor",
                description: "You need to register as a donor first to update availability.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase
                .from("donors")
                .update({
                    is_available: isAvailable,
                    availability_notes: notes,
                    updated_at: new Date().toISOString(),
                })
                .eq("profile_id", userId);

            if (error) throw error;

            toast({
                title: "Success!",
                description: `You are now marked as ${isAvailable ? "available" : "unavailable"} for donation.`,
            });

            onAvailabilityUpdated();
            onOpenChange(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to update availability";
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (loadingStatus) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!isDonor) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Not Registered as Donor</DialogTitle>
                        <DialogDescription>
                            You need to register as a donor before you can update your availability status.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center py-6 space-y-4">
                        <XCircle className="h-16 w-16 text-muted-foreground" />
                        <p className="text-center text-sm text-muted-foreground">
                            Click "Become a Donor" in the header to register as a blood donor.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => onOpenChange(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Availability</DialogTitle>
                    <DialogDescription>
                        Let people know if you're available to donate blood right now.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 py-4">
                        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                            <div className="flex-1 space-y-1">
                                <Label htmlFor="availability" className="text-base font-medium">
                                    Available for Donation
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {isAvailable
                                        ? "You will appear in donor searches"
                                        : "You will not appear in donor searches"}
                                </p>
                            </div>
                            <Switch
                                id="availability"
                                checked={isAvailable}
                                onCheckedChange={setIsAvailable}
                            />
                        </div>

                        {isAvailable && (
                            <div className="flex items-center space-x-2 rounded-lg bg-green-50 dark:bg-green-950 p-4">
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    Great! You're helping save lives.
                                </p>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Additional Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="e.g., Available on weekends only, Prefer morning donations, etc."
                                rows={3}
                            />
                            <p className="text-xs text-muted-foreground">
                                This will be visible to people requesting blood.
                            </p>
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
                            Update Availability
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
