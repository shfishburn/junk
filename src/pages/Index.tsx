import { Layout } from "@/components/layout";
import { SEO } from "@/components/shared";
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
      <section id="hero">
        <HeroSection />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="services">
        <ServicesOverview />
      </section>
      <section id="estimator">
        <AIEstimatorCTA />
      </section>
      <section id="games">
        <GamificationCTA />
      </section>
      <section id="testimonials">
        <TestimonialsSection />
      </section>
      <section id="pricing">
        <NoSurprises />
      </section>
      <section id="trust">
        <TrustSignals />
      </section>
      <section id="service-area">
        <ServiceAreaSection />
      </section>
      <section id="contact">
        <CTASection />
      </section>
    </Layout>
  );
};

export default Index;
