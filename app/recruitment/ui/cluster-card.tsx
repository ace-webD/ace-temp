

import Image from "next/image";
import Link from "next/link";

interface ClusterCardProps {
  title: string;
  imageUrl: string;
  applyLink: string;
}

export function ClusterCard({ title, imageUrl, applyLink }: ClusterCardProps) {
  return (
    <div className="bg-[#0A1735] rounded-2xl shadow-md p-4 flex flex-col items-center justify-between transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div className="w-24 h-24 relative mb-4">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <h3 className="text-white font-semibold text-lg text-center">{title}</h3>
      <Link
      href={applyLink}
      target="_blank"
      rel="noopener noreferrer"
    className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors"
      >
        Click to apply
      </Link>

    </div>
  );
}
