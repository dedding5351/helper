import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureCard } from "@/components/FeatureCard/FeatureCard";
import { HeroIllustration } from "@/components/HeroIllustration/HeroIllustration";
import {
  Eye,
  MessageSquare,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  {
    icon: <Eye className="size-5" strokeWidth={1.5} />,
    title: "Ambient Visual Analysis",
    description:
      "The system continuously monitors environmental context without explicit prompting. It pre-fetches solutions by analyzing on-screen errors and contextual logs before the user even begins typing a query.",
  },
  {
    icon: <MessageSquare className="size-5" strokeWidth={1.5} />,
    title: "Multimodal Conversations",
    description:
      "Interact seamlessly across text, code snippets, and voice. The agent maintains deep context, ensuring complex technical dialogues flow naturally without repetitive clarification.",
  },
  {
    icon: <TrendingUp className="size-5" strokeWidth={1.5} />,
    title: "Autonomous Escalation",
    description:
      "When confidence thresholds are met, the agent automatically routes critical issues to human specialists, compiling a complete, weightless summary of prior troubleshooting steps.",
  },
  {
    icon: <Sparkles className="size-5" strokeWidth={1.5} />,
    title: "Zero-Friction Integrations",
    description:
      "Connects instantly to your existing infrastructure. No borders, no heavy configuration screens. Just a clean flow of data between your tools and the agent.",
  },
] as const;

const NAV_LINKS = ["Product", "Features", "Case Studies", "Documentation"];

const FOOTER_LINKS = [
  "Privacy Policy",
  "Terms of Service",
  "Security",
  "Status",
];

/**
 * Landing Page — "The Radiant Archive"
 *
 * Server Component (no 'use client' directive) per AGENTS.md §1.
 * Semantic HTML with <main>, <header>, <nav>, <section>, <footer> per AGENTS.md §7.
 */
export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ============================
          NAVBAR
          ============================ */}
      <header className="w-full">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5 lg:px-16"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <div className="text-base font-bold text-[var(--on-surface)]">
            Project Name
          </div>

          {/* Navigation Links */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className={`text-sm transition-colors duration-200 ${
                  link === "Product"
                    ? "font-medium text-[var(--primary)] underline underline-offset-4"
                    : "text-[var(--on-surface-variant)] hover:text-[var(--primary-fixed-dim)]"
                }`}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <a
              href="#sign-in"
              className="hidden text-sm text-[var(--on-surface-variant)] transition-colors duration-200 hover:text-[var(--primary-fixed-dim)] sm:inline-block"
            >
              Sign In
            </a>
            <Button variant="default" size="sm">
              Connect to Support
            </Button>
          </div>
        </nav>
      </header>

      {/* ============================
          HERO SECTION
          ============================ */}
      <section
        id="hero"
        className="mx-auto grid max-w-7xl items-center gap-12 px-8 pt-20 pb-24 lg:grid-cols-2 lg:px-16 lg:pt-28 lg:pb-32"
      >
        {/* Left column — Text content */}
        <div className="flex max-w-xl flex-col gap-8">
          <Badge variant="chip">
            <Sparkles className="size-3" strokeWidth={1.5} />
            The Radiant Archive
          </Badge>

          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight lg:text-5xl">
            <span className="text-[var(--on-surface)]">Resolve Support</span>
            <br />
            <span className="text-[var(--primary)]">
              At The Speed Of Light.
            </span>
          </h1>

          <p className="max-w-md text-base leading-relaxed text-[var(--on-surface-variant)]">
            Transform complex IT interactions into a weightless experience. Our
            AI agent seamlessly navigates your enterprise data, turning heavy
            workflows into luminous clarity.
          </p>

          <div className="flex items-center gap-4">
            <Button variant="default" size="lg">
              Get Started →
            </Button>
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </div>
        </div>

        {/* Right column — Illustration */}
        <div className="hidden justify-center lg:flex">
          <HeroIllustration />
        </div>
      </section>

      {/* ============================
          FEATURES SECTION
          ============================ */}
      <section
        id="features"
        className="w-full bg-[var(--surface-container-low)]"
      >
        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-16 lg:py-28">
          {/* Section header */}
          <div className="mb-14 max-w-lg">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--on-surface)]">
              Architected for Clarity
            </h2>
            <p className="text-base leading-relaxed text-[var(--on-surface-variant)]">
              Intelligent systems that operate silently in the background,
              surfacing only what you need, exactly when you need it.
            </p>
          </div>

          {/* Feature grid — 2×2 */}
          <div className="grid gap-6 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          FOOTER
          ============================ */}
      <footer className="w-full bg-[var(--surface-container-low)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 py-8 sm:flex-row lg:px-16">
          <p className="text-xs tracking-[0.05em] text-[var(--on-surface-variant)] uppercase">
            © 2024 Project Name. The Radiant Archive.
          </p>
          <div className="flex items-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-xs tracking-[0.05em] text-[var(--on-surface-variant)] uppercase transition-colors duration-200 hover:text-[var(--primary-fixed-dim)]"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
