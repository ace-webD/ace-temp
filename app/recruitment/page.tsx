

import { ClusterCard } from "./ui/cluster-card";

const domains = [
  {
    title: "Web Development",
    imageUrl: "/images/Clusters/WD.png",
    applyLink: "https://www.youtube.com/",
  },
  {
    title: "App Development",
    imageUrl: "/images/Clusters/AD.png",
    applyLink: "https://www.youtube.com/",
  },
  {
    title: "AI ML",
    imageUrl: "/images/Clusters/AIML.png",
    applyLink: "https://www.youtube.com/",
  },
  {
    title: "Cybersecurity",
    imageUrl: "/images/Clusters/cyber.png",
    applyLink: "https://www.youtube.com/",
  },
  {
    title: "IOT & Embedded Systems",
    imageUrl: "/images/Clusters/iot.png",
    applyLink: "https://www.youtube.com/",
  },
  {
    title: "Competitive Programming",
    imageUrl: "/images/Clusters/cp.png",
    applyLink: "https://www.youtube.com/",
  },
  {
    title: "Graphic Designing",
    imageUrl: "/images/Clusters/GD.png",
    applyLink: "https://www.youtube.com/",
  },
  {
    title: "Video Editing",
    imageUrl: "/images/Clusters/video.png",
    applyLink: "https://www.youtube.com/",
  },
  {
    title: "Content Writing",
    imageUrl: "/images/Clusters/cw.png",
    applyLink: "https://www.youtube.com/",
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
