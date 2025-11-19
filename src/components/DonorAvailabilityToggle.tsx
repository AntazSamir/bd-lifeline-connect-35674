import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";

interface DonorAvailabilityToggleProps {
  donorId: number;
  currentAvailability: boolean;
  donorName: string;
}

export const DonorAvailabilityToggle = ({ 
  donorId, 
  currentAvailability, 
  donorName 
}: DonorAvailabilityToggleProps) => {
  const [isAvailable, setIsAvailable] = useState(currentAvailability);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleAvailability = async (newAvailability: boolean) => {
    setIsUpdating(true);
    console.log(`🔄 Toggling availability for donor ${donorId} to ${newAvailability}`);
    
    try {
      const { error } = await supabase
        .from('donors')
        .update({ is_available: newAvailability })
        .eq('id', donorId);

      if (error) throw error;

      setIsAvailable(newAvailability);
      toast.success(
        `Availability updated to ${newAvailability ? 'Available' : 'Not Available'}`,
        {
          description: "This change will appear instantly for all users viewing the donor list"
        }
      );
      console.log(`✅ Successfully updated donor ${donorId} availability`);
    } catch (error) {
      console.error('❌ Error updating availability:', error);
      toast.error("Failed to update availability");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{donorName}</CardTitle>
            <CardDescription>Donor ID: {donorId}</CardDescription>
          </div>
          <Badge variant={isAvailable ? "default" : "secondary"} className="gap-1">
            {isAvailable ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Available
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Not Available
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <label htmlFor={`toggle-${donorId}`} className="text-sm font-medium">
            Change Availability Status
          </label>
          <div className="flex items-center gap-2">
            {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <Switch
              id={`toggle-${donorId}`}
              checked={isAvailable}
              onCheckedChange={toggleAvailability}
              disabled={isUpdating}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Changes will appear in real-time for all users
        </p>
      </CardContent>
    </Card>
  );
};
