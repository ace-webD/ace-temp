import Image from "next/image";
export function HeroLogo(props: React.SVGProps<SVGSVGElement>) {
    return (
        <Image 
            src={"/logo.svg"}
            alt="Hero Logo"
            width={35}
            height={35}
            className="p-1"
        />
    );
}