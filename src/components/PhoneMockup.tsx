import { useState, useEffect } from "react";
import { Shield, Check, X, Wifi, BatteryFull, Lock, Bell, Camera, Flashlight } from "lucide-react";

interface PhoneMockupProps {
  showNotification: boolean;
  showApproval: boolean;
  onApprove: () => void;
  onDeny: () => void;
}

const PhoneMockup = ({ showNotification, showApproval, onApprove, onDeny }: PhoneMockupProps) => {
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
      setDate(now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }));
      setSeconds(now.getSeconds());
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (showNotification) {
      const t = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [showNotification]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-[220px] h-[420px] rounded-[28px] border-2 border-border bg-card/90 shadow-2xl overflow-hidden flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-background rounded-b-xl z-20" />

        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-7 pb-2 text-[9px] text-muted-foreground font-label">
          <span>{time}</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="h-2.5 w-2.5 text-muted-foreground/60" />
            <span className="text-[8px]">5G</span>
            <div className="flex items-end gap-[1px] h-2.5">
              {[40, 55, 70, 85, 100].map((h) => (
                <div key={h} className="w-[2px] bg-muted-foreground/60 rounded-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
            <BatteryFull className="h-3 w-3 text-primary/60 ml-0.5" />
          </div>
        </div>

        {/* Lock screen content */}
        <div className="flex-1 flex flex-col items-center px-4 pt-4">
          {/* Time display */}
          <div className="text-center mb-1">
            <p className="text-3xl font-heading font-bold text-foreground tracking-wider" style={{ fontFamily: "'Orbitron', monospace" }}>
              {time}
            </p>
            <p className="text-[9px] text-muted-foreground/60 mt-1 tracking-wide uppercase">
              {date}
            </p>
          </div>

          {/* Shield icon with pulse */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary/50" strokeWidth={1.5} />
              </div>
              {/* Animated ring */}
              <div
                className="absolute inset-0 rounded-full border border-primary/20"
                style={{
                  animation: "pulse-glow 3s ease-in-out infinite",
                }}
              />
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Lock className="h-2.5 w-2.5 text-muted-foreground/30" />
              <span className="text-[9px] text-muted-foreground/30 font-label uppercase tracking-[0.2em]">
                Aegis Protected
              </span>
            </div>
          </div>

          {/* Fake recent notifications (idle) */}
          {!showNotification && !showApproval && (
            <div className="w-full space-y-1.5 mb-3 animate-fade-in">
              <div className="glass rounded-lg px-2.5 py-1.5 flex items-center gap-2 opacity-40">
                <Bell className="h-3 w-3 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[8px] text-muted-foreground/70">System • 2m ago</p>
                  <p className="text-[9px] text-muted-foreground">All agents idle. No threats.</p>
                </div>
              </div>
              <div className="glass rounded-lg px-2.5 py-1.5 flex items-center gap-2 opacity-30">
                <Shield className="h-3 w-3 text-primary/50 shrink-0" />
                <div>
                  <p className="text-[8px] text-muted-foreground/70">Aegis • 15m ago</p>
                  <p className="text-[9px] text-muted-foreground">Vault sync complete.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-between px-8 pb-1">
          <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center">
            <Flashlight className="h-3.5 w-3.5 text-muted-foreground/40" />
          </div>
          <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center">
            <Camera className="h-3.5 w-3.5 text-muted-foreground/40" />
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pb-2 pt-1">
          <div className="w-24 h-1 rounded-full bg-muted-foreground/20" />
        </div>

        {/* Notification toast */}
        <div
          className={`absolute left-3 right-3 z-30 transition-all duration-500 ease-out ${
            visible ? "top-10 opacity-100" : "-top-24 opacity-0"
          }`}
        >
          <div className="glass rounded-xl p-3 border border-cyber-amber/30 neon-glow-amber">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-md bg-cyber-amber/20 flex items-center justify-center shrink-0">
                <Shield className="h-3 w-3 text-cyber-amber" strokeWidth={2} />
              </div>
              <span className="text-[9px] text-muted-foreground font-label uppercase tracking-wider">Guardian</span>
              <span className="text-[8px] text-muted-foreground/50 ml-auto">now</span>
            </div>
            <p className="text-[11px] text-cyber-amber font-bold tracking-wide text-glow-amber">
              Agent Approval Required
            </p>
            <p className="text-[9px] text-muted-foreground mt-1 leading-relaxed">
              OpenClaw requesting write access to Instagram API
            </p>
          </div>
        </div>

        {/* Approval modal inside phone */}
        {showApproval && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm px-3 animate-fade-in">
            <div className="w-full glass rounded-xl border border-primary/30 neon-glow-green overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-2 px-3 pt-3 pb-2 border-b border-border/50">
                <div className="p-1 rounded bg-primary/10">
                  <Shield className="h-3 w-3 text-primary" strokeWidth={2} />
                </div>
                <span className="font-label text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
                  Guardian
                </span>
              </div>

              {/* Body */}
              <div className="px-3 py-2 space-y-2">
                <p className="text-[10px] font-heading uppercase tracking-wide text-foreground text-glow-green font-bold">
                  Approve Access?
                </p>

                <div className="space-y-1 text-[8px]">
                  <div className="flex justify-between py-0.5 border-b border-border/20">
                    <span className="text-muted-foreground uppercase tracking-wider">Agent</span>
                    <span className="text-cyber-cyan text-glow-cyan">OpenClaw</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-border/20">
                    <span className="text-muted-foreground uppercase tracking-wider">Access</span>
                    <span className="text-cyber-amber text-glow-amber">Write</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-border/20">
                    <span className="text-muted-foreground uppercase tracking-wider">API</span>
                    <span className="text-foreground">Instagram</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-border/20">
                    <span className="text-muted-foreground uppercase tracking-wider">Action</span>
                    <span className="text-cyber-rose text-glow-rose font-semibold">financial_txn</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 px-3 pb-3 pt-1">
                <button
                  onClick={onApprove}
                  className="flex-1 py-2 flex items-center justify-center gap-1 text-[9px] uppercase font-label tracking-[0.12em] bg-primary text-primary-foreground font-bold rounded hover:brightness-110 transition-all"
                >
                  <Check className="h-3 w-3" /> Approve
                </button>
                <button
                  onClick={onDeny}
                  className="flex-1 py-2 flex items-center justify-center gap-1 text-[9px] uppercase font-label tracking-[0.12em] border border-border text-muted-foreground rounded hover:border-destructive hover:text-destructive transition-all"
                >
                  <X className="h-3 w-3" /> Deny
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneMockup;
