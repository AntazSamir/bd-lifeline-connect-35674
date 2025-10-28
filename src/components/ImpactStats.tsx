import { TrendingUp, Users, Droplets, MapPin } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Active Donors",
    color: "text-blue-500",
  },
  {
    icon: Droplets,
    value: "125,000+",
    label: "Lives Saved",
    color: "text-red-500",
  },
  {
    icon: MapPin,
    value: "64",
    label: "Districts Covered",
    color: "text-green-500",
  },
  {
    icon: TrendingUp,
    value: "98%",
    label: "Success Rate",
    color: "text-purple-500",
  },
];

const ImpactStats = () => {
  return (
    <section className="py-16 px-4 bg-primary/5">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Together, we're building a stronger, healthier community
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="text-center group transition-all duration-300 hover:scale-110"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-background shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                    <IconComponent className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
