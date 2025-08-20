import { MissionSection } from "@/components/layout/sections/mission";
import { ContactSection } from "@/components/layout/sections/contact";
import { FAQSection } from "@/components/layout/sections/faq";
import { PrinciplesSection } from "@/components/layout/sections/principles";
import { HeroSection } from "@/components/layout/sections/hero";
import { AboutSection } from "@/components/layout/sections/about";
import { TeamSection } from "@/components/layout/sections/team";
export const metadata = {
  title: "ACE - Sastra",
  description: "At ACE, our mission is to create an exciting and collaborative environment within the School of Computing. ",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <MissionSection />
      <PrinciplesSection />
      <TeamSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
