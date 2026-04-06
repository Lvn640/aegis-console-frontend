import { useState, useEffect } from "react";
import { Lock, Unlock, CheckCircle, User, ArrowRight } from "lucide-react";
import openclawLogo from "@/assets/openclaw.png";

type AgentStatus = "locked" | "authorized";

interface ProtectedResource {
  name: string;
  icon: string;
  key: string;
}

const RESOURCES: ProtectedResource[] = [
  { name: "Instagram", icon: "📸", key: "instagram" },
  { name: "Stripe", icon: "💳", key: "stripe" },
  { name: "Gmail", icon: "📧", key: "gmail" },
  { name: "Slack", icon: "💬", key: "slack" },
];

interface RightPanelProps {
  agentStatus: AgentStatus;
  unlockedResource: string | null;
  countdown: number;
}

const RightPanel = ({ agentStatus, unlockedResource, countdown }: RightPanelProps) => {
  return (
    <div className="h-full flex flex-col border-l border-border bg-card/60 overflow-y-auto">
      {/* OpenClaw Logo + Badge */}
      <div className="flex flex-col items-center gap-3 px-4 pt-5 pb-4 border-b border-border/50">
        <img src={openclawLogo} alt="OpenClaw" className="w-16 h-16 rounded-xl" />
        <span className="text-[10px] font-heading uppercase tracking-[0.2em] text-muted-foreground">
          OpenClaw Agent
        </span>
        {/* Dynamic status badge */}
        <div
          className={`px-3 py-1.5 text-[10px] font-label uppercase tracking-[0.2em] font-bold border ${
            agentStatus === "authorized"
              ? "text-primary border-primary/40 bg-primary/10 text-glow-green neon-glow-green"
              : "text-cyber-rose border-cyber-rose/40 bg-cyber-rose/10 text-glow-rose"
          }`}
        >
          {agentStatus === "authorized" ? "⬢ AUTHORIZED / ACTIVE" : "⬡ LOCKED / RESTRICTED"}
        </div>
      </div>

      {/* Protected Resources */}
      <div className="px-4 py-3 border-b border-border/50">
        <span className="text-[9px] font-label uppercase tracking-[0.2em] text-muted-foreground">
          Protected Resources
        </span>
        <div className="mt-2 space-y-1.5">
          {RESOURCES.map((r) => {
            const isUnlocked = unlockedResource === r.key;
            return (
              <div
                key={r.key}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-sm border transition-all duration-300 ${
                  isUnlocked
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/30 bg-muted/10"
                }`}
              >
                <span className="text-sm">{r.icon}</span>
                <span className="text-[11px] text-foreground/80 font-mono tracking-wide flex-1">
                  {r.name}
                </span>
                {isUnlocked ? (
                  <div className="flex items-center gap-1.5">
                    <Unlock className="h-3 w-3 text-primary" strokeWidth={2} />
                    <span className="text-[9px] font-mono text-primary text-glow-green font-bold">
                      {countdown}s
                    </span>
                  </div>
                ) : (
                  <Lock className="h-3 w-3 text-muted-foreground/40" strokeWidth={1.5} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* User profile */}
      <div className="px-4 py-3 border-b border-border/50">
        <span className="text-[9px] font-label uppercase tracking-[0.2em] text-muted-foreground">
          User Profile
        </span>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-cyber-purple/20 border border-cyber-purple/30 flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-cyber-purple" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[11px] text-foreground/90 font-mono">@alice_wonder_land</p>
            <div className="flex items-center gap-1 mt-0.5">
              <CheckCircle className="h-2.5 w-2.5 text-primary" strokeWidth={2} />
              <span className="text-[8px] text-primary/70 font-label uppercase tracking-wider">
                Auth0 Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FGA Map */}
      <div className="px-4 py-3 flex-1">
        <span className="text-[9px] font-label uppercase tracking-[0.2em] text-muted-foreground">
          FGA Authorization Map
        </span>
        <div className="mt-3 flex flex-col items-center gap-1.5">
          {[
            { label: "User", sub: "@alice", color: "text-cyber-purple" },
            { label: "Agent", sub: "OpenClaw", color: "text-cyber-cyan" },
            { label: "Enclave", sub: "Token Vault", color: "text-primary" },
          ].map((node, i, arr) => (
            <div key={node.label} className="flex flex-col items-center">
              <div className="px-3 py-1.5 border border-border/40 bg-muted/20 rounded-sm text-center min-w-[100px]">
                <p className={`text-[10px] font-heading uppercase tracking-wider ${node.color}`}>
                  {node.label}
                </p>
                <p className="text-[8px] text-muted-foreground/60 font-mono">{node.sub}</p>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight className="h-3 w-3 text-muted-foreground/30 rotate-90 my-0.5" strokeWidth={1.5} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
