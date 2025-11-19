import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface RealtimeStatusIndicatorProps {
  className?: string;
}

export const RealtimeStatusIndicator = ({ className }: RealtimeStatusIndicatorProps) => {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // Listen for custom realtime update events
    const handleRealtimeUpdate = () => {
      setIsConnected(true);
      setLastUpdate(new Date());
    };

    window.addEventListener('realtime-update', handleRealtimeUpdate);

    return () => {
      window.removeEventListener('realtime-update', handleRealtimeUpdate);
    };
  }, []);

  return (
    <Badge 
      variant={isConnected ? "default" : "secondary"} 
      className={`flex items-center gap-1.5 ${className}`}
    >
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3" />
          <span className="text-xs">Live Updates</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span className="text-xs">Offline</span>
        </>
      )}
    </Badge>
  );
};
