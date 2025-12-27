import { Clock, Shield, Leaf, Star, Award, Recycle, Heart } from "lucide-react";
import { useScrollAnimation } from "@/hooks";

const signals = [
  {
    icon: Clock,
    title: "Reliable Scheduling",
    description: "When we say Tuesday at 10, we mean Tuesday at 10. No vague arrival windows.",
  },
  {
    icon: Shield,
    title: "Licensed & Insured",
    description: "Fully covered so you don't have to worry about a thing.",
  },
  {
    icon: Leaf,
    title: "Eco-First Disposal",
    description: "Furniture gets donated. Metals get recycled. Landfill is our last resort—not our default.",
  },
  {
    icon: Heart,
    title: "Senior & Veteran Discount",
    description: "15% off for those who've served our country and community. No paperwork—just let us know.",
  },
  {
    icon: Award,
    title: "Locally Owned",
    description: "We live here. We answer our own phones. Your neighbor's driveway matters to us.",
  },
  {
    icon: Recycle,
    title: "Responsible Disposal",
    description: "We actively sort every load. Usable items get second lives, not buried.",
  },
];

const stats = [
  { value: "500+", label: "Jobs Completed" },
  { value: "4.9", label: "Star Rating" },
  { value: "Same Day", label: "Service Available" },
  { value: "100%", label: "Satisfaction" },
];

export function TrustSignals() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-16 md:py-24 bg-section-alt">
      <div className="container">
        {/* Stats bar */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 pb-12 border-b border-border transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center"
              style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trust signals grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {signals.map((signal, index) => (
            <div
              key={signal.title}
              className={`flex items-start gap-4 p-4 rounded-lg bg-card border border-border transition-all duration-700 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${(index + 4) * 100}ms` : "0ms" }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <signal.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{signal.title}</h3>
                <p className="text-sm text-muted-foreground">{signal.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
