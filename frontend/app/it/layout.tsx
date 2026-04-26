import { Sidebar } from "./components/Sidebar";

export default function ITLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          {children}
        </div>
      </div>
    </>
  );
}
