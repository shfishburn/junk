import { Layout } from "@/components/layout";
import { SEO } from "@/components/shared";
import {
  HeroSection,
  HowItWorks,
  ServicesOverview,
  AIEstimatorCTA,
  TestimonialsSection,
  NoSurprises,
  TrustSignals,
  ServiceAreaSection,
  CTASection,
} from "@/components/home";

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
