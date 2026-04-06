import { X, CheckCircle, XCircle } from "lucide-react";

export interface HistoryEntry {
  id: number;
  action: string;
  resource: string;
  user: string;
  result: "approved" | "denied";
  timestamp: string;
}

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onClose: () => void;
}

const HistoryPanel = ({ entries, onClose }: HistoryPanelProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl mx-4 border border-border bg-card cyber-chamfer overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="font-heading text-sm uppercase tracking-[0.15em] text-foreground">
            Approval History
          </span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {entries.length === 0 ? (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm font-label uppercase tracking-wider">
              No approval history yet. Run 'simulate' first.
            </div>
          ) : (
            entries.map((e) => (
              <div key={e.id} className="flex items-center gap-3 px-5 py-3 border-b border-border/30 hover:bg-muted/20 transition-colors">
                {e.result === "approved" ? (
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />
                ) : (
                  <XCircle className="h-4 w-4 text-cyber-rose shrink-0" strokeWidth={1.5} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-foreground/80 truncate">
                    <span className="text-cyber-cyan">{e.resource}</span>
                    {" — "}
                    <span className="text-muted-foreground">{e.action}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    {e.user} • {e.timestamp}
                  </p>
                </div>
                <span
                  className={`text-[9px] font-label uppercase tracking-wider px-2 py-0.5 border ${
                    e.result === "approved"
                      ? "text-primary border-primary/30"
                      : "text-cyber-rose border-cyber-rose/30"
                  }`}
                >
                  {e.result}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
