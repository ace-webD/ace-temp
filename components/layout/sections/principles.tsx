import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface PrinciplesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: PrinciplesProps[] = [
  {
    icon: "Sparkles",
    title: "Innovation",
    description:
      "We believe in fostering a culture of innovation by encouraging creative thinking, problem-solving, and the exploration of new ideas in the field of computing.",
  },
  {
    icon: "Award",
    title: "Excellence",
    description:
      "Our commitment to excellence drives us to strive for the highest standards of quality in all our endeavors, whether it's organizing events, hackathons, webinars, or any other activities.",
  },
  {
    icon: "UsersRound",
    title: "Collaboration",
    description:
      "We value collaboration and teamwork, recognizing that collective effort and diverse perspectives lead to greater success and innovation.",
  },
  {
    icon: "GraduationCap",
    title: "Education",
    description:
      "ACE is dedicated to promoting continuous learning and skill development among its members, providing opportunities for growth and advancement in the ever-evolving field of computing.",
  },
  {
    icon: "Heart",
    title: "Community",
    description:
      "We are committed to building a strong and supportive community of computing enthusiasts, where members can connect, share knowledge, and inspire each other to achieve their goals.",
  },  {
    icon: "View",
    title: "Transparency",
    description:
      "We believe in transparency and open communication, ensuring that our members are informed about our activities, decisions, and initiatives.",
  },

];

export const PrinciplesSection = () => {
  return (
    <section id="principles" className="container py-16 sm:py-24">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Principles
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        What Makes Us Different
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
      The Association of Computing Engineers (ACE) is the official club of the School of Computing at SASTRA Deemed University. <br/>We abide by the principles 
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={24}
                    color="hsl(var(--primary))"
                    className="text-primary"
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
