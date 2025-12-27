import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { JunkAnalyzer } from "@/components/JunkAnalyzer";
import { DemolitionAnalyzer } from "@/components/DemolitionAnalyzer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Phone, Camera, Lightbulb, Ruler, Eye, Trash2, Hammer } from "lucide-react";

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

const AIEstimator = () => {
  return (
    <Layout>
      <SEO
        title="AI Junk & Demolition Estimator"
        description="Get an instant junk removal or demolition estimate with AI. Upload a photo and receive a price quote in seconds. Free and easy!"
        keywords="AI junk estimate, instant junk removal quote, demolition estimate, photo estimate, junk removal calculator"
        url="/ai-estimator"
        pageType="tool"
        pagePurpose="AI-powered photo estimator tool. Upload photos of junk or demolition projects to get instant price estimates."
      />
      {/* Hero */}
      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Camera className="h-4 w-4" />
              AI-Powered Estimates
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Snap It. Know It. Done.
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload a photo of your junk pile or demolition project and our AI will give you an instant estimate. 
              It's like having a removal guru in your pocket (minus the heavy lifting).
            </p>
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
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-4">
              Prefer to Talk to a Human?
            </h2>
            <p className="text-muted-foreground mb-8">
              No problem! Give us a call or fill out our contact form. 
              We're real people who genuinely love talking about junk and demolition.
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
