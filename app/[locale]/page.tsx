import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/landing/hero";
import FeaturesSection from "@/components/landing/features";
import CTASection from "@/components/landing/cta";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="flex flex-col gap-24 py-12">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </div>

      <Footer />
    </main>
  );
}
