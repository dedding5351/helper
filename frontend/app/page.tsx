import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      
      {/* Navigation */}
      <nav className="flex justify-between items-center py-6 px-8 md:px-16 max-w-7xl mx-auto border-none">
        <div className="font-bold text-xl tracking-tight text-foreground">Project Name</div>
        <div className="hidden md:flex space-x-12 text-sm font-medium">
          <a href="#" className="text-primary border-b-2 border-primary pb-1">Product</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
        </div>
        <div className="flex items-center space-x-6">
          <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium bg-transparent shadow-none hover:bg-primary/5" render={<a href="/signin" />}>Sign In</Button>
          <Button className="bg-primary-gradient text-white rounded-md border-none shadow-md hover:opacity-90">Connect to Support</Button>
        </div>
      </nav>

      <main className="w-full">
        {/* HERO SECTION */}
        <section className="py-24 px-8 md:px-16 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          {/* Left Side */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <Badge variant="secondary" className="mb-10 rounded-full px-4 py-1.5 bg-secondary/10 text-xs tracking-widest text-muted-foreground font-semibold flex items-center shadow-none border-none uppercase">
              <span className="material-symbols-outlined text-[16px] mr-2 text-primary">auto_awesome</span>
              THE RADIANT ARCHIVE
            </Badge>
            
            <h1 className="text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6" style={{ letterSpacing: "-0.03em" }}>
              Resolve Support <br />
              <span className="text-primary bg-clip-text text-transparent bg-primary-gradient">At The Speed Of <br /> Light.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-md font-light">
              Transform complex IT interactions into a weightless experience. Our AI agent seamlessly navigates your enterprise data, turning heavy workflows into luminous clarity.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <Button className="bg-primary-gradient border-none px-8 py-6 text-base rounded-md shadow-xl shadow-primary/20 w-full sm:w-auto hover:opacity-90 transition-opacity">
                Get Started <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
              </Button>
              <Button variant="secondary" className="px-8 py-6 text-base rounded-md bg-secondary/10 text-primary hover:bg-secondary/20 border-none shadow-none w-full sm:w-auto transition-colors">
                View Documentation
              </Button>
            </div>
          </div>

          {/* Right Side Visual */}
          <div className="w-full lg:w-1/2 relative h-[450px] lg:h-[500px] bg-black/[0.02] rounded-[2rem] overflow-hidden flex items-center justify-center shadow-none border-none">
            {/* Subtle grid background */}
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(44,52,55,0.03) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            {/* Wireframe lines */}
            <div className="absolute left-16 top-32 space-y-5">
               <div className="w-24 h-2.5 bg-foreground/5 rounded-full"></div>
               <div className="w-48 h-2.5 bg-foreground/5 rounded-full"></div>
               <div className="w-32 h-2.5 bg-foreground/5 rounded-full"></div>
            </div>

            {/* Floating Modal */}
            <Card className="absolute right-8 bottom-24 w-72 glass-modal border-none rounded-xl overflow-hidden p-6 z-10">
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                  <span className="material-symbols-outlined text-[20px]">support_agent</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground mb-1 tracking-tight">Issue Resolved</div>
                  <div className="text-[13px] text-muted-foreground leading-snug">Network timeout fixed</div>
                </div>
              </div>
              <div className="text-[11px] font-bold text-primary tracking-widest text-right uppercase mt-2">
                Auto-Escalated
              </div>
            </Card>
          </div>
        </section>

        {/* ARCHITECTED FOR CLARITY (Bento Grid) */}
        <section className="py-24 px-8 md:px-16 max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">Architected for Clarity</h2>
            <p className="text-muted-foreground text-lg max-w-2xl font-light">
              Intelligent systems that operate silently in the background, surfacing only what you need, exactly when you need it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Span 1 */}
            <Card className="p-10 border-none bg-card shadow-[0_10px_40px_rgba(44,52,55,0.03)] rounded-2xl flex flex-col md:col-span-1">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight">Ambient Visual Analysis</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                The system continuously monitors environmental context without explicit prompting. It pre-fetches solutions by analyzing on-screen errors and contextual logs before the user even begins typing a query.
              </p>
            </Card>

            {/* Card 2 - Span 2 */}
            <Card className="p-10 border-none bg-card shadow-[0_10px_40px_rgba(44,52,55,0.03)] rounded-2xl flex flex-col md:col-span-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight">Multimodal Conversations</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light max-w-md">
                Interact seamlessly across text, code snippets, and voice. The agent maintains deep context, ensuring complex technical dialogues flow naturally without repetitive clarification.
              </p>
            </Card>

            {/* Card 3 - Span 1 */}
            <Card className="p-10 border-none bg-card shadow-[0_10px_40px_rgba(44,52,55,0.03)] rounded-2xl flex flex-col md:col-span-1">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive mb-8">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call_merge</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight">Autonomous Escalation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                When confidence thresholds are met, the agent automatically routes critical issues to human specialists, compiling a complete, weightless summary of prior troubleshooting steps.
              </p>
            </Card>

            {/* Card 4 - Span 2 */}
            <Card className="p-10 border-none bg-card shadow-[0_10px_40px_rgba(44,52,55,0.03)] rounded-2xl flex flex-col md:flex-row items-center md:col-span-2 overflow-hidden relative">
              <div className="w-full md:w-1/2 relative z-10 pr-0 md:pr-8 mb-10 md:mb-0">
                 <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                   <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
                 </div>
                 <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight">Zero-Friction Integrations</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed font-light">
                   Connects instantly to your existing infrastructure. No borders, no heavy configuration screens. Just a clean flow of data between your tools and the agent.
                 </p>
              </div>
              <div className="w-full md:w-1/2 h-48 relative flex items-center justify-center">
                 {/* Diagram visual */}
                 <div className="absolute w-full h-[1px] bg-border/40 top-1/2 -translate-y-1/2"></div>
                 <div className="flex gap-10 relative z-10 items-center justify-center w-full">
                    <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center shadow-sm"><span className="material-symbols-outlined text-muted-foreground text-[20px]">database</span></div>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm"><span className="material-symbols-outlined text-[28px]">api</span></div>
                    <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center shadow-sm"><span className="material-symbols-outlined text-muted-foreground text-[20px]">cloud</span></div>
                 </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 px-8 md:px-16 mt-16 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl mx-auto gap-8">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            © 2024 Project Name. The Radiant Archive.
          </div>
          <div className="flex flex-wrap justify-center space-x-8 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Security</a>
            <a href="#" className="hover:text-foreground transition-colors">Status</a>
          </div>
        </div>
      </footer>
    </>
  );
}
