import { ClusterCard } from "./ui/cluster-card";

const domains = [
  {
    title: "Web Development",
    imageUrl: "/images/Clusters/WD.png",
    applyLink: "https://forms.gle/mydq2ATYJhkUdpVm8",
  },
  {
    title: "App Development",
    imageUrl: "/images/Clusters/AD.png",
    applyLink: "https://forms.gle/foPvbSbgFh8NkVNt6",
  },
  {
    title: "AI ML",
    imageUrl: "/images/Clusters/AIML.png",
    applyLink: "https://forms.gle/q4PmwSXXWMNAJboq8",
  },
  {
    title: "Cybersecurity",
    imageUrl: "/images/Clusters/cyber.png",
    applyLink: "https://docs.google.com/forms/d/e/1FAIpQLSdKlIAh1uwL62yZy2bbmvdqrLbN7JcCyWs-bHZ8qwxxviF8ZA/viewform?usp=sharing&ouid=115116019650032199853",
  },
  {
    title: "IOT & Embedded Systems",
    imageUrl: "/images/Clusters/Iot.png",
    applyLink: "https://docs.google.com/forms/d/e/1FAIpQLScDnQJB2lNlKIbYA1Q4so9ztf2FgIdFvY43o6mqCKKRpsGl_A/viewform?usp=header",
  },
  {
    title: "Competitive Programming",
    imageUrl: "/images/Clusters/CP.png",
    applyLink: "https://forms.gle/ihwKWsq7LL2czw9v5",
  },
     {
    title: "OpCon & PR",
    imageUrl: "/images/Clusters/Opcon.png",
    applyLink: "https://forms.gle/hDiMsumx5qxMhhsz9",
  },
  {
    title: "Graphic Designing",
    imageUrl: "/images/Clusters/GD.png",
    applyLink: "https://forms.gle/W3nyrbn4qm8LrRaB9",
  },
  {
    title: "Video Editing",
    imageUrl: "/images/Clusters/video.png",
    applyLink: "https://forms.gle/bvFhh2aMJS4EoR3G8",
  },
  {
    title: "Content Writing",
    imageUrl: "/images/Clusters/CW.png",
    applyLink: "https://docs.google.com/forms/d/e/1FAIpQLSfkyKaui4LbPIAHm15yAPs4AopoPutPOdhUJxNGSHc5F6ofmQ/viewform",
  },
 
];
export default function RecruitPage() {
  return (
    <main className="min-h-screen bg-[#07152A] py-12 px-6">
      <h1 className="text-white text-3xl font-bold text-center mb-10">
        ACE Club Recruitment Drive 2025
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {domains.map((domain, idx) => (
          <ClusterCard
            key={idx}
            title={domain.title}
            imageUrl={domain.imageUrl}
            applyLink={domain.applyLink}
          />
        ))}
      </div>
    </main>
  );
}
