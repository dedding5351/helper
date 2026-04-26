import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modern Next.js Application",
  description: "A fluent and modern application scaffolded following AGENTS.md",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
