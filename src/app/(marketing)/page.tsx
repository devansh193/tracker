import FAQSection from "@/modules/landing/sections/faq-section";
import { FeaturesSection } from "@/modules/landing/sections/features-section";
import Footer from "@/modules/landing/sections/footer-section";
import { MainSection } from "@/modules/landing/sections/main-section";

export default function Home() {
  return (
    <div>
      <MainSection />
      <FeaturesSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
