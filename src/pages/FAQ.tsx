import { Layout } from "@/components/layout";
import { SEO, Breadcrumbs } from "@/components/shared";
import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

const faqCategories = [
  {
    title: "Services",
    questions: [
      {
        question: "What types of items do you remove?",
        answer: "We remove almost anything that's not hazardous! This includes furniture, appliances, electronics, mattresses, yard waste, construction debris, office equipment, and general household junk. If you're unsure about a specific item, just give us a call."
      },
      {
        question: "Do you offer same-day junk removal?",
        answer: "Yes! We offer same-day service when availability allows. Call us in the morning, and we'll do our best to get to you the same day. For guaranteed scheduling, we recommend booking at least 24 hours in advance."
      },
      {
        question: "What items can't you take?",
        answer: "For safety and regulatory reasons, we cannot remove hazardous materials (chemicals, paint, asbestos), medical waste, biohazards, explosives, ammunition, or radioactive materials. If you have questions about specific items, please contact us."
      },
      {
        question: "Do you clean up after removing items?",
        answer: "Absolutely! We don't just haul your junk away—we also sweep up the area where items were removed. Our goal is to leave your space cleaner than we found it."
      },
      {
        question: "Can you remove items from anywhere on my property?",
        answer: "Yes, we handle all the heavy lifting! Whether your items are in the attic, basement, backyard, garage, or anywhere else on your property, our team will do the work. You just point, and we haul."
      }
    ]
  },
  {
    title: "Pricing",
    questions: [
      {
        question: "How is pricing determined?",
        answer: "Our pricing is based on the volume of space your items take up in our truck. We offer transparent, upfront pricing after a quick assessment. You'll always know the price before we start, with no hidden fees or surprises."
      },
      {
        question: "Do you offer free estimates?",
        answer: "Yes! We provide free, no-obligation estimates. You can get a rough estimate over the phone or by using our AI Estimator tool online. For the most accurate quote, we offer free on-site estimates."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept cash, all major credit cards, debit cards, and digital payment methods. Payment is due upon completion of the job."
      },
      {
        question: "Are there any additional fees I should know about?",
        answer: "Our quotes include labor, loading, hauling, and disposal. Additional fees may apply for extremely heavy items, items requiring special handling, or locations with difficult access (like items that need to go down multiple flights of stairs)."
      },
      {
        question: "Do you offer discounts?",
        answer: "We offer competitive pricing and occasional promotions. Senior citizens, military personnel, and returning customers may qualify for special discounts. Ask us when you call!"
      }
    ]
  },
  {
    title: "Scheduling",
    questions: [
      {
        question: "How do I schedule a pickup?",
        answer: "Scheduling is easy! You can call us at (360) 610-9233, text us, or use our online contact form. We'll work with you to find a time that fits your schedule."
      },
      {
        question: "What are your hours of operation?",
        answer: "We operate Monday through Saturday, 8 AM to 5 PM. We're closed on Sundays. For urgent needs, give us a call and we'll do our best to accommodate you."
      },
      {
        question: "How far in advance should I book?",
        answer: "While we often have same-day availability, we recommend booking at least 24-48 hours in advance to guarantee your preferred time slot, especially during busy seasons."
      },
      {
        question: "What if I need to cancel or reschedule?",
        answer: "We understand plans change! Please give us at least 24 hours notice if you need to cancel or reschedule. Late cancellations or no-shows may result in a small fee."
      },
      {
        question: "Do I need to be home during the pickup?",
        answer: "While it's preferred that you or an authorized representative be present, we can work with you if that's not possible. Just let us know the items to be removed and ensure we have access to them."
      }
    ]
  },
  {
    title: "Service Area",
    questions: [
      {
        question: "What areas do you serve?",
        answer: "We proudly serve Mount Vernon and the entire Puget Sound Region, including Skagit County, Whatcom County, Snohomish County, and parts of King County. This includes cities like Bellingham, Burlington, Anacortes, Sedro-Woolley, Everett, and surrounding areas."
      },
      {
        question: "Do you charge extra for locations outside Mount Vernon?",
        answer: "Our pricing is consistent throughout our service area. There's no extra charge for standard locations. For areas at the edge of our service area, a small travel fee may apply—we'll always let you know upfront."
      },
      {
        question: "Do you serve commercial locations?",
        answer: "Yes! We work with businesses of all sizes, including offices, retail stores, warehouses, and construction sites. We offer flexible scheduling to minimize disruption to your operations."
      }
    ]
  },
  {
    title: "Environmental Responsibility",
    questions: [
      {
        question: "What happens to my junk after you take it?",
        answer: "We're committed to responsible disposal. We sort through all items and donate usable goods to local charities, recycle appropriate materials (metal, electronics, cardboard), and only send items to the landfill as a last resort."
      },
      {
        question: "Do you donate usable items?",
        answer: "Absolutely! We partner with local charities and donation centers to give your gently used items a second life. If you have items you'd like donated, just let us know."
      },
      {
        question: "Are you licensed and insured?",
        answer: "Yes, Junky Gurus is fully licensed and insured. You can have peace of mind knowing your property is protected and we operate in full compliance with local regulations."
      }
    ]
  }
];

// Generate FAQ schema from categories
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqCategories.flatMap(category => 
    category.questions.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  )
};

export default function FAQ() {
  return (
    <Layout>
      <SEO 
        title="FAQ" 
        description="Find answers to frequently asked questions about Junky Gurus junk removal services, pricing, scheduling, and service areas in Mount Vernon and the Puget Sound Region."
        url="/faq"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container">
          <Breadcrumbs items={[{ label: "FAQ" }]} />
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Got questions? We've got answers. Find everything you need to know about our junk removal services below.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-12">
            {faqCategories.map((category) => (
              <div key={category.title}>
                <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b border-border">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.title}-${index}`}>
                      <AccordionTrigger className="text-left text-foreground hover:text-primary">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground mb-8">
              Can't find the answer you're looking for? Our friendly team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="tel:+13606109233" className="gap-2">
                  <Phone className="h-5 w-5" />
                  Call (360) 610-9233
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Us Online</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
