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
      imageUrl: "/images/leads/Ayswar.jpg",
      firstName: "Ayswar",
      lastName: "GSS",
      positions: ["President"],
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
        //  {
        //   name: "Gmail",
        //   url: "https://mail.google.com/mail/?view=cm&to=generalsecretary.ace@gmail.com", 
        // },
      ],
    },
    {
      imageUrl: "/images/CORE/Madahesh.jpg",
      firstName: "Madhaesh",
      lastName: "Parasuraman",
      positions: ["General Secretary"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/madhaesh-parasuraman-93a42824a",
        },
        {
          name: "Github",
          url: "https://github.com/Client0-0",
        },
        {
          name: "Gmail",
          url: "https://mail.google.com/mail/?view=cm&to=generalsecretary.ace@gmail.com", 
        },
      ],
    },
    {
      imageUrl: "/images/CORE/Srihari_i_Treasurer.jpg",
      firstName: "Srihari",
      lastName: "I",
      positions: ["Treasurer"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: " https://www.linkedin.com/in/srihari1501",
        },
        {
          name: "Github",
          url: "https://github.com/Srihari-1501",
        },
        {
          name: "Instagram",
          url: "https://www.instagram.com/srihari.ilango/profilecard/?igsh=dHFjems1YnBnNTY3",
        },
         {
          name: "Gmail",
          url: "https://mail.google.com/mail/?view=cm&to=treasurer.ace25@gmail.com", 
        },
      ],
    },
    {
      imageUrl: "/images/CORE/Gss_Eaishwar_Organising_Secretary.jpg",
      firstName: "Eaishwar",
      lastName: "GSS",
      positions: ["Organizing secretary"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/eaishwar-gss-315a4a284",
        },
        {
          name: "Github",
          url: "https://github.com/Easihwar011",
        },
        {
          name: "Instagram",
          url: "https://www.instagram.com/eaishwar_011?igsh=MXJnazltYzVjMXR4cw==",
        },
         {
          name: "Gmail",
          url: "https://mail.google.com/mail/?view=cm&to=organisingsecretary.ace@gmail.com", 
        },
      ],
    },
    {
      imageUrl: "/images/CORE/Tejaswini_Creative_Head.jpg",
      firstName: "Tejaswini",
      lastName: "",
      positions: ["Creative head"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/tejaswini-kirti/",
        },
        {
          name: "Github",
          url: "https://github.com/mistbik",
        },
        {
          name: "Instagram",
          url: " https://www.instagram.com/tejasaa_/",
        },
         {
          name: "Gmail",
          url: "https://mail.google.com/mail/?view=cm&to=creativemediahead.ace@gmail.com", 
        },
      ],
    },
    {
      imageUrl: "/images/CORE/Yashwenth_S_Technical_Head.jpg",
      firstName: "Yashwenth",
      lastName: "S",
      positions: ["Technical head"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/its-yashwenth/",
        },
        {
          name: "Github",
          url: "https://github.com/Yashwenth27",
        },
         {
          name: "Instagram",
          url: "https://instagram.com/aviator.yash.27?utm_source=qr&igshid=MzNlNGNkZWQ4Mg%3D%3D",
        },
         {
          name: "Gmail",
          url: "https://mail.google.com/mail/?view=cm&to=technicalhead.ace@gmail.com", 
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
        return <GmailIcon />
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
