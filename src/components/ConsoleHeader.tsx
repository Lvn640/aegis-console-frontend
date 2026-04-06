import { Shield } from "lucide-react";

const ConsoleHeader = () => {
  return (
    <div className="border-b border-border bg-card">
      {/* Window controls bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50">
        <div className="w-3 h-3 rounded-full bg-cyber-rose/80" />
        <div className="w-3 h-3 rounded-full bg-cyber-amber/80" />
        <div className="w-3 h-3 rounded-full bg-primary/80" />
        <span className="ml-3 text-xs text-muted-foreground font-label uppercase tracking-[0.2em]">
          aegis-console-v2.4.1
        </span>
      </div>

      {/* Main header */}
      <div className="flex items-center gap-4 px-6 py-4">
        <Shield
          className="h-7 w-7 text-primary animate-pulse-glow"
          strokeWidth={1.5}
        />
        <div>
          <h1 className="font-heading text-lg md:text-xl uppercase tracking-[0.15em] text-foreground">
            Aegis Secure Console
          </h1>
          <p className="text-xs text-muted-foreground font-label uppercase tracking-[0.2em] mt-0.5">
            OpenClaw Agent{" "}
            <span className="text-primary text-glow-green">[MANAGED]</span>
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-xs text-primary font-label uppercase tracking-wider">
            LIVE
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConsoleHeader;
