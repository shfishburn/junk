import { Camera, Truck, PartyPopper } from "lucide-react";
import { useScrollAnimation } from "@/hooks";

const steps = [
  {
    icon: Camera,
    step: "1",
    title: "Get a Quote",
    description: "Snap a photo or give us a call. Get a real price—what we quote is what you pay.",
  },
  {
    icon: Truck,
    step: "2",
    title: "We Haul It",
    description: "Our crew arrives when scheduled—not 'sometime between 8 and 5.' Then we load everything and sweep up after.",
  },
  {
    icon: PartyPopper,
    step: "3",
    title: "You Relax",
    description: "That's it. Your space is clear. Time to celebrate (or fill it with new junk).",
  },
];

export function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-12 sm:py-16 md:py-24 bg-section-alt">
      <div className="container px-4 sm:px-6">
        <div
          className={`text-center mb-8 sm:mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Getting rid of junk shouldn't be complicated. Here's our foolproof, 3-step process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`relative text-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${index * 150}ms` : "0ms" }}
            >
              {/* Step number badge */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center z-10">
                {step.step}
              </div>
              
              <div className="pt-6 pb-4 sm:pb-6 px-3 sm:px-4">
                <div className="inline-flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-primary/10 mb-3 sm:mb-4">
                  <step.icon className="h-7 sm:h-8 w-7 sm:w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-base sm:text-lg mb-2 leading-snug">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {/* Connector line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
