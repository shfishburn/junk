import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { ServiceAreaSection } from "@/components/home/ServiceAreaSection";
import { TrustSignals } from "@/components/home/TrustSignals";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <SEO
        title="Junk Removal Mount Vernon WA"
        description="Professional junk removal in Mount Vernon, WA. Simple pricing, responsible disposal. From single items to full cleanouts. Call (360) 610-9233 for a free quote."
        keywords="junk removal, Mount Vernon, Skagit County, hauling, cleanout, appliance removal, furniture removal"
        url="/"
      />
      <HeroSection />
      <ServicesOverview />
      <TrustSignals />
      <ServiceAreaSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
