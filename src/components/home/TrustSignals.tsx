import { Clock, Shield, Leaf } from "lucide-react";

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
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {signals.map((signal) => (
            <div key={signal.title} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <signal.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">{signal.title}</h3>
              <p className="text-sm text-muted-foreground">{signal.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
