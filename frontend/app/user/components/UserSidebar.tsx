"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CreateRequestModal } from "./CreateRequestModal";

type NavItem = {
  label: string;
  icon: string;
  href: string;
  exact?: boolean;
};

const primaryNav: NavItem[] = [
  { label: "Overview", icon: "dashboard", href: "/user", exact: true },
  { label: "Knowledge Base", icon: "menu_book", href: "/user/knowledge" },
  { label: "Tickets", icon: "confirmation_number", href: "/user/tickets" },
];

const footerNav: NavItem[] = [
  { label: "Settings", icon: "settings", href: "/user/settings" },
  { label: "Support", icon: "help", href: "/user/support" },
];

function SidebarNavLink({
  item,
  currentPath,
}: {
  item: NavItem;
  currentPath: string;
}) {
  const isActive = item.exact
    ? currentPath === item.href
    : currentPath.startsWith(item.href);

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-card text-primary shadow-[0_2px_8px_rgba(44,52,55,0.04)]"
          : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
      }`}
    >
      <span
        className="material-symbols-outlined text-[20px]"
        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
      >
        {item.icon}
      </span>
      <span className="tracking-tight">{item.label}</span>
    </Link>
  );
}

export function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isRequestModalOpen, setIsRequestModalOpen] = React.useState(false);

  return (
    <>
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

          <button
            type="button"
            onClick={() => setIsRequestModalOpen(true)}
            className="bg-primary-gradient mb-8 flex h-auto w-full items-center justify-center gap-2 rounded-md border-none px-4 py-3 text-sm font-medium text-white shadow-md shadow-primary/20 transition-opacity hover:opacity-90"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Request
          </button>

          <nav className="flex flex-col gap-1">
            {primaryNav.map((item) => (
              <SidebarNavLink
                key={item.href}
                item={item}
                currentPath={pathname}
              />
            ))}
          </nav>
        </div>

        <nav className="flex flex-col gap-1">
          {footerNav.map((item) => (
            <SidebarNavLink
              key={item.href}
              item={item}
              currentPath={pathname}
            />
          ))}
        </nav>
      </aside>

      <CreateRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={(issueId) => {
          setIsRequestModalOpen(false);
          router.push(`/user/tickets?issue=${issueId}`);
          router.refresh();
        }}
      />
    </>
  );
}
