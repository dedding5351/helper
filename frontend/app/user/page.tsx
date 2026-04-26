import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type NavItem = {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
};

const primaryNav: NavItem[] = [
  { label: "Overview", icon: "dashboard", href: "/user", active: true },
  { label: "Knowledge Base", icon: "menu_book", href: "/user/knowledge" },
  { label: "Tickets", icon: "confirmation_number", href: "/user/tickets" },
];

const footerNav: NavItem[] = [
  { label: "Settings", icon: "settings", href: "/user/settings" },
  { label: "Support", icon: "help", href: "/user/support" },
];

type QuickLink = {
  title: string;
  description: string;
  icon: string;
  href: string;
};

const quickLinks: QuickLink[] = [
  {
    title: "Documentation",
    description:
      "Explore comprehensive guides, API references, and tutorials.",
    icon: "description",
    href: "/user/docs",
  },
  {
    title: "Community Forum",
    description:
      "Join the conversation, share solutions, and get help from peers.",
    icon: "forum",
    href: "/user/community",
  },
  {
    title: "Ticket History",
    description:
      "View past requests, track current statuses, and manage your issues.",
    icon: "history",
    href: "/user/tickets",
  },
];

function SidebarNavLink({ item }: { item: NavItem }) {
  return (
    <Link
      href={item.href}
      aria-current={item.active ? "page" : undefined}
      className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        item.active
          ? "bg-card text-primary shadow-[0_2px_8px_rgba(44,52,55,0.04)]"
          : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
      }`}
    >
      <span
        className="material-symbols-outlined text-[20px]"
        style={{ fontVariationSettings: item.active ? "'FILL' 1" : "'FILL' 0" }}
      >
        {item.icon}
      </span>
      <span className="tracking-tight">{item.label}</span>
    </Link>
  );
}

export default function UserDashboardPage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar — Layer 1 (#eaeff2) */}
        <aside className="hidden w-64 shrink-0 flex-col justify-between bg-[#eaeff2] px-5 py-7 md:flex">
          <div>
            <Link href="/user" className="mb-10 flex items-center gap-3 px-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-gradient text-sm font-bold text-white">
                P
              </span>
              <span className="flex flex-col leading-tight">
                <span
                  className="text-sm font-bold tracking-tight text-foreground"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Project Name
                </span>
                <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  AI IT Agent
                </span>
              </span>
            </Link>

            <Button className="bg-primary-gradient mb-8 h-auto w-full justify-center gap-2 rounded-md border-none px-4 py-3 text-sm text-white shadow-md shadow-primary/20 transition-opacity hover:opacity-90">
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Request
            </Button>

            <nav className="flex flex-col gap-1">
              {primaryNav.map((item) => (
                <SidebarNavLink key={item.href} item={item} />
              ))}
            </nav>
          </div>

          <nav className="flex flex-col gap-1">
            {footerNav.map((item) => (
              <SidebarNavLink key={item.href} item={item} />
            ))}
          </nav>
        </aside>

        {/* Main column */}
        <div className="flex min-h-screen flex-1 flex-col">
          {/* Top bar */}
          <header className="flex items-center justify-between gap-8 px-8 py-5 md:px-12">
            <div className="relative flex w-full max-w-sm items-center">
              <span className="material-symbols-outlined pointer-events-none absolute left-4 text-[18px] text-muted-foreground">
                search
              </span>
              <input
                type="search"
                placeholder="Search..."
                aria-label="Search"
                className="h-10 w-full rounded-md bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex items-center gap-8">
              <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground md:flex">
                <Link
                  href="/user/docs"
                  className="transition-colors hover:text-foreground"
                >
                  Docs
                </Link>
                <Link
                  href="/user/updates"
                  className="transition-colors hover:text-foreground"
                >
                  Updates
                </Link>
                <Link
                  href="/user/community"
                  className="transition-colors hover:text-foreground"
                >
                  Community
                </Link>
              </nav>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    notifications
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Account"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    person
                  </span>
                </button>
              </div>
            </div>
          </header>

          {/* Hero / content */}
          <main className="flex-1 px-8 pb-20 pt-8 md:px-12">
            <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
              <Badge
                variant="secondary"
                className="mb-10 flex items-center rounded-full border-none bg-card px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shadow-none"
              >
                <span className="mr-2 inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                All Systems Operational
              </Badge>

              <h1
                className="mb-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl"
                style={{ letterSpacing: "-0.03em" }}
              >
                How can we assist you today?
              </h1>

              <p className="mb-12 max-w-xl text-base font-light leading-relaxed text-muted-foreground">
                Find answers in our documentation, ask the community, or connect
                directly with our support engineers.
              </p>

              <Card className="mb-16 w-full max-w-3xl rounded-2xl border-none p-12 ring-0 shadow-[0_10px_40px_rgba(44,52,55,0.04)]">
                <div className="flex flex-col items-center">
                  <Button
                    render={<Link href="/user/session" />}
                    className="bg-primary-gradient h-auto justify-center gap-3 rounded-md border-none px-10 py-5 text-base text-white shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      headset_mic
                    </span>
                    Connect to Live Support
                  </Button>
                  <p className="mt-6 text-xs font-medium text-muted-foreground">
                    Average wait time:{" "}
                    <span className="font-semibold text-primary">
                      ~2 minutes
                    </span>
                  </p>
                </div>
              </Card>

              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group block text-left"
                  >
                    <Card className="h-full rounded-2xl border-none p-8 ring-0 shadow-[0_10px_40px_rgba(44,52,55,0.03)] transition-shadow group-hover:shadow-[0_20px_50px_rgba(44,52,55,0.06)]">
                      <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <span
                          className="material-symbols-outlined text-[22px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {link.icon}
                        </span>
                      </div>
                      <h3
                        className="mb-3 text-base font-bold tracking-tight text-foreground"
                        style={{ letterSpacing: "-0.01em" }}
                      >
                        {link.title}
                      </h3>
                      <p className="text-sm font-light leading-relaxed text-muted-foreground">
                        {link.description}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
