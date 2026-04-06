import { Shield } from "lucide-react";

interface ApprovalModalProps {
  onApprove: () => void;
  onDeny: () => void;
}

const ApprovalModal = ({ onApprove, onDeny }: ApprovalModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="glass w-full max-w-md mx-4 rounded-sm overflow-hidden border border-primary/20 neon-glow-green">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-border/50">
          <div className="p-2 rounded-sm bg-primary/10 neon-glow-green">
            <Shield className="h-5 w-5 text-primary" strokeWidth={1.5} />
          </div>
          <span className="font-label text-sm uppercase tracking-[0.15em] text-muted-foreground">
            Auth0 Guardian Authentication
          </span>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          <h2 className="font-heading text-xl uppercase tracking-wide text-foreground text-glow-green">
            Agent Approval Required
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border/30">
              <span className="text-muted-foreground uppercase tracking-wider text-xs">Agent</span>
              <span className="text-cyber-cyan text-glow-cyan">OpenClaw</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/30">
              <span className="text-muted-foreground uppercase tracking-wider text-xs">Access</span>
              <span className="text-cyber-amber text-glow-amber">Write</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/30">
              <span className="text-muted-foreground uppercase tracking-wider text-xs">API</span>
              <span className="text-foreground">Instagram API</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/30">
              <span className="text-muted-foreground uppercase tracking-wider text-xs">Profile</span>
              <span className="text-cyber-magenta text-glow-magenta">@alice_wonder_land</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/30">
              <span className="text-muted-foreground uppercase tracking-wider text-xs">Action</span>
              <span className="text-cyber-rose font-semibold text-glow-rose">financial_transaction</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            OpenClaw Agent is requesting 'Write' access to Instagram API for profile @alice_wonder_land. Action: financial_transaction. Approve?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onApprove}
            className="flex-1 py-3 px-4 uppercase font-label text-sm tracking-[0.15em] bg-primary text-primary-foreground font-bold cyber-chamfer-sm hover:brightness-110 transition-all duration-150 neon-glow-green"
          >
            Approve
          </button>
          <button
            onClick={onDeny}
            className="flex-1 py-3 px-4 uppercase font-label text-sm tracking-[0.15em] border border-border text-muted-foreground cyber-chamfer-sm hover:border-destructive hover:text-destructive transition-all duration-150"
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
