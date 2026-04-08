import { Closing } from "@/components/Closing";
import { Footer } from "@/components/Footer";
import { FrameworkOverview } from "@/components/FrameworkOverview";
import { Hero } from "@/components/Hero";
import { HowToRespond } from "@/components/HowToRespond";
import { MemoFeature } from "@/components/MemoFeature";
import { Navbar } from "@/components/Navbar";
import { QuickContext } from "@/components/QuickContext";
import { UsefulInput } from "@/components/UsefulInput";
import { WhyThisExists } from "@/components/WhyThisExists";
import { WhyThisSite } from "@/components/WhyThisSite";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <QuickContext />
        <WhyThisExists />
        <MemoFeature />
        <FrameworkOverview />
        <WhyThisSite />
        <UsefulInput />
        <HowToRespond />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
