import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { ServiceAreaSection } from "@/components/home/ServiceAreaSection";
import { TrustSignals } from "@/components/home/TrustSignals";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesOverview />
      <TrustSignals />
      <ServiceAreaSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
