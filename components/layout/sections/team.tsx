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
import GmailIcon from "@/components/icons/GmailIcon";
interface TeamProps {
  imageUrl?: string;
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
      imageUrl: "/images/CORE/Sruthi_Keerthi_President.jpg",
      firstName: "Sruthi Keerthi",
      lastName: "Mailari",
      positions: ["President"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/mailari-sruthi-keerthi-46a16a29a/",
        },
        {
          name: "GitHub",
          url: "https://github.com/SruthiKeerthi05",
        },
        {
          name: "Instagram",
          url: "https://www.instagram.com/sk_killer__000",
        },
        {
          name: "Gmail",
          url: "https://mail.google.com/mail/?view=cm&to=msruthi5505@gmail.com",
        },
      ],
    },
    {
      imageUrl: "/images/CORE/RasswanthGPN_GeneralSecretary.jpg",
      firstName: "Rasswanth",
      lastName: "GPN",
      positions: ["General Secretary"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/rasswanth-gpn-57a1b3273/",
        },
        {
          name: "Github",
          url: "https://github.com/ras-07",
        },
        {
          name: "Instagram",
          url: "https://www.instagram.com/rasswanth__07",
        },
        {
          name: "Gmail",
          url: "https://mail.google.com/mail/?view=cm&to=rasswanthgpn07@gmail.com",
        },
      ],
    },
    {
      imageUrl: "/images/CORE/Someshwar_S_Project_Lead.jpg",
      firstName: "Someshwar",
      lastName: "S",
      positions: ["Project Lead"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/soms36/",
        },
        {
          name: "Github",
          url: "https://github.com/soms36-DefSec/",
        },
        {
          name: "Instagram",
          url: "https://www.instagram.com/somesh_36/",
        },
        {
          name: "Gmail",
          url: "https://mail.google.com/mail/?view=cm&to=someshsuresh0306@gmail.com",
        },
      ],
    },
    {
      imageUrl: "/images/CORE/Chandresh.webp",
      firstName: "Chandresh",
      lastName: "J",
      positions: ["Technical Head"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/chandresh-j-8288302a8/",
        },
        {
          name: "Github",
          url: "https://github.com/CHANDRESH0503",
        },
      
        {
          name: "Gmail",
          url: "https://mail.google.com/mail/?view=cm&to=jchandresh05@gmail.com",
        },
      ],
    },
    {
      imageUrl: "/images/CORE/PALANIAPPAN.S.png",
      firstName: "Palaniappan",
      lastName: "S",
      positions: ["Treasurer"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/coeuspalani",
        },
        {
          name: "Github",
          url: "https://github.com/coeuspalani",
        },
        {
          name: "Instagram",
          url: "https://www.instagram.com/coeus_palani",
        },
        {
          name: "Gmail",
          url: "https://mail.google.com/mail/?view=cm&to=palani232006@gmail.com",
        },
      ],
    },
    {
      imageUrl: "/images/CORE/Pranathi-Kankati.jpeg",
      firstName: "Pranathi",
      lastName: "Kankati",
      positions: ["Creative Media Head"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/kankatipranathi-a9667a330/",
        },
        {
          name: "Github",
          url: "https://github.com/pranathikankati",
        },
        {
          name: "Instagram",
          url: "https://www.instagram.com/pranathiiii_03",
        },
        {
          name: "Gmail",
          url: "https://mail.google.com/mail/?view=cm&to=pranathikankati0312@gmail.com",
        },
      ],
    },
    {
      imageUrl: "/images/CORE/Rohith_J_Organizing_Secretary.jpg",
      firstName: "Rohith",
      lastName: "Jayaraman",
      positions: ["Organizing Secretary"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/rohith-jayaraman-b-3b14a6300/",
        },
        {
          name: "Gmail",
          url: "https://mail.google.com/mail/?view=cm&to=rohithjayaramanb@gmail.com",
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
      
      case "Gmail":
        return <GmailIcon />;
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
            index,
          ) => (
            <Card
              key={index}
              className="bg-muted/60 dark:bg-card flex flex-col h-full overflow-hidden group/hoverimg w-72"
            >
              <CardHeader className="p-0 gap-0">
                <div className="aspect-square w-full overflow-hidden bg-primary/10">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={`${firstName} ${lastName}`}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover saturate-0 transition-all duration-200 ease-linear group-hover/hoverimg:saturate-100 group-hover/hoverimg:scale-[1.01]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-primary">
                      {firstName.charAt(0)}
                      {lastName.charAt(0)}
                    </div>
                  )}
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
          ),
        )}
      </div>
    </section>
  );
};
