import Image from "next/image"
export default function HeroLogoWithText() {
    return (
        <Image
            className="w-auto h-auto max-w-[90%] md:max-w-[90%] pointer-events-auto rounded-full mix-blend-screen transition-transform duration-500 ease-out lg:hover:scale-105"
            src={"/ACE_SVG_original.svg"}
            alt="Hero Logo"
            width={200}
            height={200}
        />
    )
}
