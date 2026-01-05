import { Star, Quote } from "lucide-react";
import { useScrollAnimation, useLoadingDelay } from "@/hooks";
import { TestimonialSkeletonGrid } from "@/components/skeletons";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Mount Vernon, WA",
    rating: 5,
    text: "These guys were amazing! They cleared out my entire garage in under 2 hours. Professional, friendly, and way more affordable than I expected.",
  },
  {
    name: "Mike T.",
    location: "Burlington, WA",
    rating: 5,
    text: "Called in the morning, they were at my house by noon. The old hot tub that's been haunting my backyard for 3 years is finally gone. Highly recommend!",
  },
  {
    name: "Linda K.",
    location: "Anacortes, WA",
    rating: 5,
    text: "Estate cleanout after my mom passed was overwhelming. The Junky Gurus team was respectful, efficient, and made a hard situation so much easier.",
  },
];

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const isLoading = useLoadingDelay(400);

  return (
    <section ref={ref} className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="container max-w-6xl px-4 sm:px-6">
        <div
          className={`text-center mb-8 sm:mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
            What Our Customers Say
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it — our neighbors love us.
          </p>
        </div>

        {isLoading ? (
          <TestimonialSkeletonGrid />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className={`relative p-4 sm:p-6 rounded-lg bg-card border border-border transition-all duration-700 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: isVisible ? `${index * 150}ms` : "0ms" }}
              >
                <Quote className="absolute top-3 sm:top-4 right-3 sm:right-4 h-6 sm:h-8 w-6 sm:w-8 text-primary/10" />
                
                {/* Stars */}
                <div className="flex gap-1 mb-3 sm:mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-3 sm:mb-4 text-sm leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="border-t border-border pt-3 sm:pt-4">
                  <p className="font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
