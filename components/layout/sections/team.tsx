import GithubIcon from "@/components/icons/GithubIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
interface TeamProps {
  imageUrl: string;
  firstName: string;
  lastName: string;
  positions: string[];
  socialNetworks: SocialNetworkProps[];
}
interface SocialNetworkProps {
  name: string;
  url: string;
}
export const TeamSection = () => {
  const teamList: TeamProps[] = [
    {
      imageUrl: "/images/leads/Tulip raaj.jpg",
      firstName: "Tulip",
      lastName: "Raaj",
      positions: ["President"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/tulip-raaj-k-405400239",
        },
        {
          name: "Github",
          url: "https://github.com/Tulipraaj",
        },
        {
          name: "Instagram",
          url: "https://www.instagram.com/_.tulipraaj007._/",
        },
      ],
    },
    {
      imageUrl: "/images/leads/Ananya C.jpg",
      firstName: "Ananya",
      lastName: "Chandrasekaran",
      positions: ["General Secretary"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/ananya-chandrasekaran",
        },
        {
          name: "Github",
          url: "https://github.com/ananya-chandrasekaran03",
        },
      ],
    },
    {
      imageUrl: "/images/leads/Rengasayee.jpeg",
      firstName: "Srinivasa",
      lastName: "Rengasayee",
      positions: ["Treasurer"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/srinivasa-rengasayee-r-185072235?trk=contact-info",
        },
        {
          name: "Github",
          url: "https://github.com/rengasayee",
        },
      ],
    },
    {
      imageUrl: "/images/leads/Tharun S K.jpg",
      firstName: "Tharun",
      lastName: "Senthil Kumar",
      positions: ["Organizing secretary"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/tharun-s-k-bab26b248",
        },
        {
          name: "Github",
          url: "https://github.com/Tharun-Senthilkumar",
        },
        {
          name: "Instagram",
          url: "https://www.instagram.com/_tharun.sk._?igsh=eThobXNxdGs1YTli",
        },
      ],
    },
    {
      imageUrl: "/images/leads/ShinyGrace.jpg",
      firstName: "Shiny",
      lastName: "Grace",
      positions: ["Creative head"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/shiny-grace-975a72246/",
        },
        {
          name: "Github",
          url: "https://github.com/shinygrace/",
        },
      ],
    },
    {
      imageUrl: "/images/leads/SherlinPreethiJ.jpg",
      firstName: "Sherlin",
      lastName: "Preethi",
      positions: ["Technical head"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/sherlin-preethi-2958a5244/",
        },
        {
          name: "Github",
          url: "https://github.com/Sherlin-Preethi",
        },
      ],
    },
    {
      imageUrl: "/images/leads/Naveen Kumar.jpg",
      firstName: "Naveen",
      lastName: "Kumar",
      positions: ["Public relations officer"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/naveen-kumar-444920243",
        },
        {
          name: "Github",
          url: "https://github.com/NaveenKumar16-git",
        },
        {
          name: "Instagram",
          url: "https://www.instagram.com/_naveen._.nk?igsh=aDRzaWNlYnlhc3Ny",
        },
      ],
    },
    {
      imageUrl: "/images/leads/Ayswar.jpg",
      firstName: "Ayswar",
      lastName: "GSS",
      positions: ["Vice President"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://linkedin.com/in/gssayswar",
        },
        {
          name: "Github",
          url: "https://github.com/ayswar-gss-code",
        },
        {
          name: "Instagram",
          url: "https://www.instagram.com/gss.ayswar?igsh=MWF4OHl2MDEwMnV4dg==",
        },
      ],
    },
    {
      imageUrl: "/images/leads/Madahesh.jpg",
      firstName: "Madahesh",
      lastName: "Parasuraman",
      positions: ["Vice General Secretary"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "http://linkedin.com/in/madhaesh-parasuraman-93a42824a/",
        },
        {
          name: "Github",
          url: "https://github.com/StarBuckAce",
        },
      ],
    },
  ];
  const socialIcon = (socialName: string) => {
    switch (socialName) {
      case "LinkedIn":
        return <LinkedInIcon />;
      case "Github":
        return <GithubIcon />;
      case "Instagram":
        return <InstagramIcon />;
    }
  };
  return (
    <section id="team" className="container lg:w-[50%] py-16 sm:py-24">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Team
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Meet Our Club Bearers
        </h2>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {teamList.map(
          (
            { imageUrl, firstName, lastName, positions, socialNetworks },
            index
          ) => (
            <Card
              key={index}
              className="bg-muted/60 dark:bg-card flex flex-col h-full overflow-hidden group/hoverimg w-72"
            >
              <CardHeader className="p-0 gap-0">
                <div className="h-full overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={`${firstName} ${lastName}`}
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover saturate-0 transition-all duration-200 ease-linear size-full group-hover/hoverimg:saturate-100 group-hover/hoverimg:scale-[1.01]"
                  />
                </div>
                <CardTitle className="py-6 pb-4 px-6 text-xl">
                  {firstName}
                  <span className="text-primary ml-2">{lastName}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6 text-muted-foreground">
                {positions.join(", ")}
              </CardContent>

              <CardFooter className="space-x-4 mt-auto">
                {socialNetworks.map(({ name, url }, index) => (
                  <Link
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${firstName} ${lastName} on ${name}`}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    {socialIcon(name)}
                  </Link>
                ))}
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
