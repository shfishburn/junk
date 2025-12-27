import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { JunkAnalyzer } from "@/components/JunkAnalyzer";
import { DemolitionAnalyzer } from "@/components/DemolitionAnalyzer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Phone, Camera, Lightbulb, Ruler, Eye, Trash2, Hammer, XCircle, CheckCircle } from "lucide-react";

const junkTips = [
  {
    icon: Lightbulb,
    title: "Good Lighting",
    description: "Natural light works best. Avoid harsh shadows.",
  },
  {
    icon: Ruler,
    title: "Show Scale",
    description: "Include something for size reference if possible.",
  },
  {
    icon: Eye,
    title: "Capture Everything",
    description: "Make sure all items are visible in the frame.",
  },
];

const demolitionTips = [
  {
    icon: Ruler,
    title: "Full Structure",
    description: "Capture the entire structure from multiple angles.",
  },
  {
    icon: Eye,
    title: "Show Condition",
    description: "Include close-ups of any damage or rot.",
  },
  {
    icon: Lightbulb,
    title: "Access Points",
    description: "Show how we'll access the demolition area.",
  },
];

const noMoreList = [
  "Phone tag with sales reps",
  "Waiting days for a callback",
  "On-site upsells or surprises",
];

const youGetList = [
  "Real price in seconds",
  "No obligation, no pressure",
  "What we quote is what you pay",
  "15% off for seniors & veterans",
];

const AIEstimator = () => {
  return (
    <Layout>
      <SEO
        title="AI Photo Estimator - Skip the Sales Dance"
        description="Know your junk removal price before we arrive. Upload a photo, get a real price. No phone tag, no on-site upsells, no surprises."
        keywords="AI junk estimate, instant junk removal quote, demolition estimate, photo estimate, no hidden fees"
        url="/ai-estimator"
        pageType="tool"
        pagePurpose="AI-powered photo estimator tool. Skip the sales dance - upload photos to get instant, accurate price estimates with no obligation."
      />
      {/* Hero */}
      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Camera className="h-4 w-4" />
              Skip the Sales Dance
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Know Your Price Before We Arrive
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Upload photos. Get a real price. No phone tag. No on-site upsells. No surprises.
            </p>
            
            {/* Anxiety Neutralizers */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
              <div className="flex-1 p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                <p className="text-sm font-medium text-destructive/80 mb-3">No More:</p>
                <ul className="space-y-2">
                  {noMoreList.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <XCircle className="h-4 w-4 text-destructive/60 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm font-medium text-primary mb-3">You Get:</p>
                <ul className="space-y-2">
                  {youGetList.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary/60 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analyzer Section with Tabs */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Tabs defaultValue="junk" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="junk" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Junk Removal
                </TabsTrigger>
                <TabsTrigger value="demolition" className="flex items-center gap-2">
                  <Hammer className="h-4 w-4" />
                  Light Demolition
                </TabsTrigger>
              </TabsList>
              <TabsContent value="junk">
                <JunkAnalyzer />
              </TabsContent>
              <TabsContent value="demolition">
                <DemolitionAnalyzer />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 md:py-24 bg-section-alt">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal text-center mb-8">
              Tips for the Best Estimate
            </h2>
            
            <Tabs defaultValue="junk-tips" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="junk-tips">Junk Removal</TabsTrigger>
                <TabsTrigger value="demolition-tips">Demolition</TabsTrigger>
              </TabsList>
              
              <TabsContent value="junk-tips">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {junkTips.map((tip) => (
                    <div
                      key={tip.title}
                      className="p-6 rounded-xl bg-card border border-border text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <tip.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-charcoal mb-2">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="demolition-tips">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {demolitionTips.map((tip) => (
                    <div
                      key={tip.title}
                      className="p-6 rounded-xl bg-card border border-border text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <tip.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-charcoal mb-2">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Prefer to Talk to a Human?
            </h2>
            <p className="text-muted-foreground mb-2">
              No problem! Give us a call or fill out our contact form.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Same deal — we'll give you a real price with no surprises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/contact">Contact Us</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="tel:+13606109233">
                  <Phone className="mr-2 h-4 w-4" />
                  (360) 610-9233
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="tel:+13604222428">
                  <Phone className="mr-2 h-4 w-4" />
                  (360) 422-2428
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AIEstimator;
