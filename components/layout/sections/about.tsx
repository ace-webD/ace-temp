import Image from "next/image";
import HeroIllustration from "@/components/icons/HeroIllustation";
import HeroLogoWithText from "@/components/icons/HeroLogoWithText";
import { Card, CardContent } from "@/components/ui/card";

export const AboutSection = () => {  return (
    <section
      id="about"
      className="py-16 sm:py-24"
    >
      <div className="container">
          <div className="-mx-4 flex flex-wrap items-center justify-center lg:justify-between">
            <div className="w-full px-4 lg:w-1/3 mb-12 lg:mb-0 order-1 lg:order-1">
              <div className="max-w-[540px] lg:max-w-none mx-auto text-center lg:text-left">
                <h2 className="mb-5 text-3xl font-bold leading-tight text-dark dark:text-foreground sm:text-[40px] sm:leading-[1.2]">
                  Official School of Computing Club - Sastra University
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground">
                  ACE provides students with opportunities to enhance their technical skills, explore emerging technologies, and connect with industry professionals. ACE welcomes all students with a passion for computing to join us in our journey of learning, innovation, and growth.
                </p>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/3 mb-12 lg:mb-0 flex justify-center items-center order-2 lg:order-2">
               <div className="relative w-full max-w-sm">
                 <HeroIllustration  />
                 <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                    <HeroLogoWithText  />
                 </div>
               </div>
            </div>
            
            <div className="w-full px-4 lg:w-1/3 order-3 lg:order-3 flex flex-col items-center h-96">
              <Card className="w-full max-w-sm lg:max-w-none bg-card/60 dark:bg-card/40 backdrop-blur-lg border-[hsl(var(--border))]/20 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-3/2 relative overflow-hidden"> 
                    <Image
                      src="/images/about/faculty.jpg"
                      alt="Faculty advisor"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      fill
                      className="h-full w-full object-cover object-center transition-transform duration-300 ease-in-out" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 w-full max-w-sm lg:max-w-none relative z-10 flex items-center justify-center overflow-hidden bg-primary/5 backdrop-blur-sm rounded-lg px-4 py-5 text-center border border-primary/30 shadow-lg">
                 <div className="text-foreground">
                   <span className="block text-3xl sm:text-4xl font-extrabold">
                     02+
                   </span>
                   <span className="mt-1 block text-sm font-semibold">
                     Years of Experience
                   </span>
                   <span className="block text-xs font-medium">
                     in fostering tech talent
                   </span>
                 </div>
               </div>
            </div>

          </div>
        </div>
     </section>
  );
};
