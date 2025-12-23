import HomeFooter from "@/components/home/HomeFooter";
import HomeHeader from "@/components/home/HomeHeader";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeHeader />

      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>

      <HomeFooter />
    </div>
  );
}