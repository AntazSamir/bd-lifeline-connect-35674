import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabaseClient";
import { Loader2, MapPin, Calendar, Hospital, AlertCircle, User } from "lucide-react";

interface BloodRequestDetails {
    id: string;
    blood_group: string;
    location: string;
    urgency: string;
    hospital_name?: string;
    hospital_address?: string;
    patient_name?: string;
    patient_age?: number;
    contact_number?: string;
    blood_component?: string;
    date_needed?: string;
    units_needed?: number;
    donor_requirements?: string;
    additional_notes?: string;
    created_at: string;
}

interface RespondToRequestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    request: BloodRequestDetails | null;
    donorId: string;
    onResponseSubmitted?: () => void;
}

export function RespondToRequestDialog({
    open,
    onOpenChange,
    request,
    donorId,
    onResponseSubmitted,
}: RespondToRequestDialogProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!request) return;

        setIsLoading(true);

        try {
            // Check if user already responded
            const { data: existingResponse } = await supabase
                .from("donation_responses")
                .select("id")
                .eq("request_id", request.id)
                .eq("donor_id", donorId)
                .single();

            if (existingResponse) {
                toast({
                    title: "Already Responded",
                    description: "You have already responded to this request.",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            // Create response
            const { error } = await supabase
                .from("donation_responses")
                .insert({
                    request_id: request.id,
                    donor_id: donorId,
                    message: message.trim() || null,
                    status: "pending",
                });

            if (error) throw error;

            toast({
                title: "Response Sent!",
                description: "The requester will be notified of your willingness to help.",
            });

            setMessage("");
            onOpenChange(false);
            onResponseSubmitted?.();
        } catch (error) {
            console.error("Error submitting response:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to submit response",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!request) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Respond to Blood Request</DialogTitle>
                    <DialogDescription>
                        Review the request details and confirm your willingness to donate.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Blood Group & Urgency */}
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-primary border-primary text-lg px-3 py-1">
                                {request.blood_group}
                            </Badge>
                            <Badge className={request.urgency === 'immediate' ? 'bg-urgent' : 'bg-primary'}>
                                {request.urgency?.toUpperCase()}
                            </Badge>
                        </div>

                        {/* Patient Information */}
                        {request.patient_name && (
                            <div className="space-y-1">
                                <Label className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Patient Information
                                </Label>
                                <p className="text-sm">
                                    {request.patient_name}
                                    {request.patient_age && `, ${request.patient_age} years old`}
                                </p>
                            </div>
                        )}

                        {/* Hospital Information */}
                        <div className="space-y-1">
                            <Label className="flex items-center gap-2">
                                <Hospital className="h-4 w-4" />
                                Hospital
                            </Label>
                            <p className="text-sm font-medium">{request.hospital_name || "Not specified"}</p>
                            {request.hospital_address && (
                                <p className="text-sm text-muted-foreground">{request.hospital_address}</p>
                            )}
                        </div>

                        {/* Location */}
                        <div className="space-y-1">
                            <Label className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Location
                            </Label>
                            <p className="text-sm">{request.location}</p>
                        </div>

                        {/* Date Needed */}
                        {request.date_needed && (
                            <div className="space-y-1">
                                <Label className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Date Needed
                                </Label>
                                <p className="text-sm">
                                    {new Date(request.date_needed).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        )}

                        {/* Blood Component & Units */}
                        {(request.blood_component || request.units_needed) && (
                            <div className="space-y-1">
                                <Label>Requirements</Label>
                                <p className="text-sm">
                                    {request.blood_component || "Whole Blood"}
                                    {request.units_needed && ` - ${request.units_needed} unit(s)`}
                                </p>
                            </div>
                        )}

                        {/* Donor Requirements */}
                        {request.donor_requirements && (
                            <div className="space-y-1">
                                <Label className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    Donor Requirements
                                </Label>
                                <p className="text-sm text-muted-foreground">{request.donor_requirements}</p>
                            </div>
                        )}

                        {/* Additional Notes */}
                        {request.additional_notes && (
                            <div className="space-y-1">
                                <Label>Additional Notes</Label>
                                <p className="text-sm text-muted-foreground">{request.additional_notes}</p>
                            </div>
                        )}

                        {/* Contact Number */}
                        {request.contact_number && (
                            <div className="space-y-1">
                                <Label>Contact Number</Label>
                                <p className="text-sm font-medium">{request.contact_number}</p>
                            </div>
                        )}

                        {/* Message Field */}
                        <div className="space-y-2">
                            <Label htmlFor="message">Your Message (Optional)</Label>
                            <Textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Add a message for the requester..."
                                rows={3}
                                maxLength={500}
                            />
                            <p className="text-xs text-muted-foreground">
                                {message.length}/500 characters
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
                            Confirm & Respond
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
