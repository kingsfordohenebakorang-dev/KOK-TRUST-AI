import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingSection } from "@/components/PricingSection";

export default function Home() {
  return (
    <main className="dark min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <PricingSection />

      {/* Decorative Blur at bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-20" />
    </main>
  );
}
