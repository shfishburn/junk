import { XCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks";

const noSurprises = [
  "Hidden fees or 'oh, that's extra' surprises",
  "No-shows or vague arrival windows",
  "Your stuff dumped illegally",
  "Pushy upsells when we arrive",
  "Corporate runaround when something goes wrong",
];

export function NoSurprises() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-10 sm:py-12 md:py-14 lg:py-16 bg-destructive/5 border-y border-destructive/10">
      <div className="container max-w-4xl px-4 sm:px-6">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            What You Won't Get From Us
          </h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {noSurprises.map((item, index) => (
              <div
                key={item}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-background border border-destructive/20 text-xs sm:text-sm text-muted-foreground transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
              >
                <XCircle className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-destructive/60 flex-shrink-0" />
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
