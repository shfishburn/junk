import { Clock, Shield, Leaf } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const signals = [
  {
    icon: Clock,
    title: "Same-Day Service",
    description: "Need it gone today? We offer same-day pickup when available.",
  },
  {
    icon: Shield,
    title: "Locally Owned & Operated",
    description: "We're your neighbors. We treat your property with respect.",
  },
  {
    icon: Leaf,
    title: "Responsible Disposal",
    description: "We donate, recycle, and dispose of items responsibly.",
  },
];

export function TrustSignals() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-16 md:py-24 bg-section-alt">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {signals.map((signal, index) => (
            <div 
              key={signal.title} 
              className={`text-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${index * 150}ms` : "0ms" }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <signal.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{signal.title}</h3>
              <p className="text-sm text-muted-foreground">{signal.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
