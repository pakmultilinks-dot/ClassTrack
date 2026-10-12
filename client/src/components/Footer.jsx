import { FiGithub, FiInstagram, FiLinkedin, FiTwitter } from "react-icons/fi";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#stats" },
  { label: "Contact", href: "#contact" }
];
const socials = [
  { label: "Twitter", href: "#", icon: FiTwitter },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/malik-abdur-rehman-9b4228358/", icon: FiLinkedin },
  { label: "GitHub", href: "https://github.com/rehmantechx", icon: FiGithub },
  { label: "Instagram", href: "#", icon: FiInstagram }
];

const Footer = () => {
  return (
    <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary font-extrabold">
              CT
            </span>
            <div>
              <p className="text-lg font-bold text-white">ClassTrack</p>
              <p className="text-sm text-brand-muted">AI-powered attendance intelligence</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-brand-muted">
            © {new Date().getFullYear()} ClassTrack. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-brand-muted transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {socials.map((social) => {
            const Icon = social.icon;

            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-brand-muted transition hover:border-brand-primary/60 hover:text-white"
              >
                <Icon />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
