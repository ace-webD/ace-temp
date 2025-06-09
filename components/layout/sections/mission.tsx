import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface MissionProps {
  icon: string;
  title: string;
  description: string;
}

const missionList: MissionProps[] = [
  {
    icon: "Lightbulb",
    title: "Inspiring Innovation",
    description:
      "Sparking creativity and innovation by providing a space to explore new technologies and solve real-world problems.",
  },
  {
    icon: "Handshake",
    title: "Supporting Collaboration",
    description:
      "Fostering collaboration by connecting students with peers, faculty, and industry professionals to share ideas and work together.",
  },
  {
    icon: "Trophy",
    title: "Encouraging Excellence",
    description:
      "Promoting excellence in computing through events, workshops, and seminars designed to build skills, knowledge, and careers.",
  },
  {
    icon: "Microscope",
    title: "Research Advancement",
    description:
      "Encouraging research by connecting members with SoC faculty and researchers for publications and collaborations.",
  },
];

export const MissionSection = () => {
  return (
    <section id="Mission" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">Mission</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Shortcut to Success
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            At ACE, our mission is to create an exciting and collaborative environment within the School of Computing. We want to help students thrive in the world of computing through events, hackathons, webinars, and more...
          </p>
        </div>        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {missionList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background hover:shadow-md hover:border-primary/20 transition-all duration-300 ease-in-out group/number hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={32}
                    color="hsl(var(--primary))"
                    className="mb-6 text-primary transition-transform duration-300 ease-in-out group-hover/number:scale-110"
                  />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all duration-300 ease-in-out group-hover/number:text-muted-foreground/50 group-hover/number:scale-105">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle className="transition-colors duration-300 ease-in-out group-hover/number:text-primary">
                  {title}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground transition-colors duration-300 ease-in-out group-hover/number:text-foreground/80">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
