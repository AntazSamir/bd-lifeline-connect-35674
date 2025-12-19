import { useMemo, useState, memo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Droplets,
  MapPin,
  Clock,
  AlertTriangle,
  Phone,
  Hospital,
  User,
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useBloodRequests } from "@/hooks/useDatabase";
import { BloodRequest, BloodRequestFilters } from "@/services/dbService";
import { useLanguage } from "@/contexts/LanguageContext";

// Utility functions
const getUrgencyStyle = (urgency: string, t: (key: string) => string) => {
  switch (urgency) {
    case "immediate":
      return {
        badge: "bg-destructive text-destructive-foreground",
        icon: <AlertTriangle className="h-3 w-3" />,
        text: t('immediate')
      };
    case "urgent":
      return {
        badge: "bg-primary text-primary-foreground",
        icon: <Clock className="h-3 w-3" />,
        text: t('urgent')
      };
    case "flexible":
      return {
        badge: "bg-secondary text-secondary-foreground",
        icon: <Clock className="h-3 w-3" />,
        text: t('flexible')
      };
    default:
      return {
        badge: "bg-muted text-muted-foreground",
        icon: <Clock className="h-3 w-3" />,
        text: urgency
      };
  }
};

const formatDistrict = (district: string) => {
  if (!district) return "";
  return district.charAt(0).toUpperCase() + district.slice(1);
};

const formatTimeAgo = (dateString: string, t: (key: string, variables?: any) => string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) {
    return t('secondsAgo', { count: 30 }); // Defaulting to 30 for simplicity
  }
  if (diffInMinutes < 60) {
    return t('minutesAgo', { count: diffInMinutes });
  } else if (diffInMinutes < 1440) {
    return t('hoursAgo', { count: Math.floor(diffInMinutes / 60) });
  } else {
    return t('daysAgo', { count: Math.floor(diffInMinutes / 1440) });
  }
};

// Memoized request card component for better performance
const BloodRequestCard = memo(({ request }: { request: BloodRequest }) => {
  const { t } = useLanguage();
  const urgencyStyle = useMemo(() => getUrgencyStyle(request.urgency, t), [request.urgency, t]);
  const timeAgo = useMemo(() => formatTimeAgo(request.created_at || new Date().toISOString(), t), [request.created_at, t]);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h3 className="font-semibold text-foreground text-sm sm:text-base">{t('patient')} #{request.id}</h3>
                <Badge variant="secondary" className="text-xs font-bold">
                  {request.blood_group}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                {timeAgo}
              </p>
            </div>
          </div>
          <Badge className={`${urgencyStyle.badge} flex-shrink-0 text-xs`}>
            {urgencyStyle.icon}
            <span className="ml-1">{urgencyStyle.text}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="flex items-start space-x-2">
            <Hospital className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <span className="text-foreground line-clamp-2">{request.patient_info || "---"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground">{formatDistrict(request.location)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground">{t('contactPerson')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground">{t('unitsNeeded', { units: request.units_needed })}</span>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{request.contact_number}</span>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="flex-1 sm:flex-none text-xs sm:text-sm">
              {t('share')}
            </Button>
            <Button size="sm" className="bg-destructive hover:bg-destructive/90 flex-1 sm:flex-none text-xs sm:text-sm">
              {t('iCanHelp')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

BloodRequestCard.displayName = "BloodRequestCard";

import { ITEMS_PER_PAGE } from '@/lib/constants';

interface BloodRequestFeedProps {
  filters?: BloodRequestFilters;
}

const BloodRequestFeed = ({ filters = {} }: BloodRequestFeedProps) => {
  const { t } = useLanguage();
  const { requests, loading, error, page, setPage, totalPages } = useBloodRequests(1, ITEMS_PER_PAGE, filters);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters.searchQuery, filters.bloodGroup, filters.urgency]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-muted-foreground mb-4">
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span>{t('loadingRequests')}</span>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{t('failedToLoadDonors')} {error}</div>; // Reusing key or adding new if needed
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {requests.map((request) => (
          <BloodRequestCard key={request.id} request={request} />
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {filters.searchQuery
              ? t('noMatchFound', { query: filters.searchQuery })
              : t('noRequestsFound')}
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            {(() => {
              const pages: (number | string)[] = [];
              const maxVisible = 7;

              if (totalPages <= maxVisible) {
                // Show all pages if total is small
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // Always show first page
                pages.push(1);

                if (page > 3) {
                  pages.push('...');
                }

                // Show pages around current page
                const start = Math.max(2, page - 1);
                const end = Math.min(totalPages - 1, page + 1);

                for (let i = start; i <= end; i++) {
                  pages.push(i);
                }

                if (page < totalPages - 2) {
                  pages.push('...');
                }

                // Always show last page
                pages.push(totalPages);
              }

              return pages.map((p, idx) => {
                if (p === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(p as number)}
                    className="w-10"
                  >
                    {p}
                  </Button>
                );
              });
            })()}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default BloodRequestFeed;