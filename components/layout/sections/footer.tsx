import { HeroLogo } from "@/components/icons/HeroLogo";
import Link from "next/link";
import { Youtube, Instagram, Linkedin, MessageCircleMore } from 'lucide-react';

export const FooterSection = () => {
  return (
    <footer id="footer" className="container">
      <div className="p-8 bg-card border border-secondary rounded-2xl">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-6">

          <div className="flex flex-col items-center md:items-start text-center md:text-left">            <Link
              href="/"
              className="flex items-center gap-1 font-bold text-lg cursor-pointer"
            >
              <HeroLogo />
              ACE
            </Link>
            <p className="text-muted-foreground text-sm">
              Code_Build_Progress
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex space-x-4">              <Link
                href="https://www.instagram.com/ace_soc_sastra"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on Instagram"
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <Instagram size={20} />
              </Link>              <Link
                href="https://www.linkedin.com/company/ace-sastra-soc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on LinkedIn"
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <Linkedin size={20} />
              </Link>              <Link
                href="https://chat.whatsapp.com/FOQW8hoUiIaLCHRAOMelVh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on whatsapp"
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <MessageCircleMore size={20} />
              </Link>              <Link
                href="https://youtu.be/dQw4w9WgXcQ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on Youtube"
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <Youtube size={20} />
              </Link>
            </div>

            <h3 className="text-sm text-muted-foreground text-center">
              &copy; 2025 developed by{" "}              <Link
                target="_blank"
                href="https://github.com/ace-webD"
                className="text-primary hover:underlin whitespace-nowrap cursor-pointer"
                rel="noopener noreferrer"
              >
                ace-webD
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </footer>
  );
};