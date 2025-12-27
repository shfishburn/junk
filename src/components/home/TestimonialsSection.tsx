import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useLoadingDelay } from "@/hooks/use-loading-delay";
import { TestimonialSkeletonGrid } from "@/components/skeletons/TestimonialCardSkeleton";

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
    <section ref={ref} className="py-16 md:py-24">
      <div className="container">
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it — our neighbors love us.
          </p>
        </div>

        {isLoading ? (
          <TestimonialSkeletonGrid />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className={`relative p-6 rounded-lg bg-card border border-border transition-all duration-700 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: isVisible ? `${index * 150}ms` : "0ms" }}
              >
                <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
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
