import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { AIEstimatorCTA } from "@/components/home/AIEstimatorCTA";
import { GamificationCTA } from "@/components/home/GamificationCTA";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { NoSurprises } from "@/components/home/NoSurprises";
import { TrustSignals } from "@/components/home/TrustSignals";
import { ServiceAreaSection } from "@/components/home/ServiceAreaSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <SEO
        title="Junk Removal Mount Vernon WA"
        description="Mount Vernon junk removal with no hidden fees, reliable scheduling, and responsible disposal. Know your price before we arrive. Call (360) 610-9233."
        keywords="junk removal, Mount Vernon, Skagit County, hauling, cleanout, appliance removal, furniture removal"
        url="/"
        pageType="homepage"
        pagePurpose="Main landing page for Junky Gurus junk removal services. Book appointments, get quotes, view services and pricing."
      />
      <HeroSection />
      <HowItWorks />
      <ServicesOverview />
      <AIEstimatorCTA />
      <GamificationCTA />
      <TestimonialsSection />
      <NoSurprises />
      <TrustSignals />
      <ServiceAreaSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
