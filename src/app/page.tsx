import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Chaos } from "@/components/sections/Chaos";
import { Solution } from "@/components/sections/Solution";
import { Roles } from "@/components/sections/Roles";
import { Modules } from "@/components/sections/Modules";
import { ProductStory } from "@/components/sections/ProductStory";
import { Benefits } from "@/components/sections/Benefits";
import { WhyUs } from "@/components/sections/WhyUs";
import { SegmentsGrid } from "@/components/sections/SegmentsGrid";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PricingBlock } from "@/components/sections/PricingBlock";
import { FounderProgram } from "@/components/sections/FounderProgram";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { FAQ_HOME } from "@/content/faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Chaos />
      <Solution />
      <Roles />
      <Modules />
      <ProductStory />
      <Benefits />
      <WhyUs />
      <SegmentsGrid />
      <HowItWorks />
      <PricingBlock />
      <FounderProgram />
      <Faq items={FAQ_HOME} tone="soft" lead="Kulüp sahiplerinin en çok sorduğu on soru ve dürüst cevapları." />
      <FinalCta />
    </>
  );
}
