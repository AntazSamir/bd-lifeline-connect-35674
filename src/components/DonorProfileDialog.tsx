import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Heart, ShieldCheck, Droplet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Donor } from "@/services/dbService";

interface DonorProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    donor: Donor | null;
}

export function DonorProfileDialog({ open, onOpenChange, donor }: DonorProfileDialogProps) {
    const navigate = useNavigate();
    if (!donor) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex flex-col items-center gap-4 pt-4">
                        <Avatar className="h-24 w-24">
                            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                {(donor.name || '').split(' ').map(n => n[0]).join('') || 'D'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <DialogTitle className="text-2xl font-bold">{donor.name}</DialogTitle>
                            <DialogDescription className="flex items-center justify-center gap-2 mt-1">
                                <MapPin className="h-3 w-3" />
                                {donor.location}
                            </DialogDescription>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="outline" className="text-primary border-primary px-3 py-1 text-sm">
                                {donor.blood_group}
                            </Badge>
                            <Badge className={`${donor.is_available ? "bg-success text-white" : "bg-secondary text-secondary-foreground"} px-3 py-1 text-sm`}>
                                {donor.is_available ? "Available" : "Unavailable"}
                            </Badge>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Heart className="h-4 w-4" /> Last Donation
                            </h4>
                            <p className="font-medium">{donor.last_donation_date || "No record"}</p>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            Donor Status
                        </h4>
                        <div className="grid gap-2 text-sm">
                            <div className="flex justify-between py-1 border-b border-border/50">
                                <span className="text-muted-foreground">Availability Status</span>
                                <span className={donor.is_available ? "text-success font-medium" : "text-muted-foreground"}>
                                    {donor.is_available ? "Ready to donate" : "Currently unavailable"}
                                </span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-border/50">
                                <span className="text-muted-foreground">Member Since</span>
                                <span>{donor.created_at ? new Date(donor.created_at).toLocaleDateString() : "Unknown"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-2">
                        <Button className="w-full sm:w-auto gap-2" onClick={() => navigate("/request-blood")}>
                            <Droplet className="h-4 w-4" />
                            Request Blood
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
