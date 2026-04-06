import { useState, useRef } from "react";
import { Plus, Trash2, Eye, EyeOff, Pencil, X, Shield } from "lucide-react";

interface EnvVar {
  id: string;
  key: string;
  value: string;
}

interface VaultPanelProps {
  onClose: () => void;
}

const VaultPanel = ({ onClose }: VaultPanelProps) => {
  const [vars, setVars] = useState<EnvVar[]>([
    { id: "1", key: "INSTAGRAM_API_KEY", value: "sk_live_••••••••••••" },
    { id: "2", key: "AUTH0_CLIENT_SECRET", value: "dN8x••••••••••••" },
    { id: "3", key: "VAULT_TOKEN", value: "hvs.••••••••••••" },
  ]);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  const toggle = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const remove = (id: string) => setVars((p) => p.filter((v) => v.id !== id));

  const addVar = () => {
    const k = newKey.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "");
    const v = newValue.trim();
    if (!k || !v) return;
    setVars((p) => [...p, { id: Date.now().toString(), key: k, value: v }]);
    setNewKey("");
    setNewValue("");
    setShowAdd(false);
  };

  const saveEdit = (id: string, val: string) => {
    setVars((p) => p.map((v) => (v.id === id ? { ...v, value: val } : v)));
    setEditing(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl mx-4 border border-border bg-card cyber-chamfer overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary animate-pulse-glow" strokeWidth={1.5} />
            <span className="font-heading text-sm uppercase tracking-[0.15em] text-foreground">
              Secure Vault
            </span>
            <span className="text-xs text-muted-foreground font-label ml-2">
              {vars.length} secrets
            </span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Vars list */}
        <div className="max-h-[50vh] overflow-y-auto">
          {vars.map((v) => (
            <div key={v.id} className="flex items-center gap-3 px-5 py-3 border-b border-border/30 hover:bg-muted/20 transition-colors group">
              <span className="text-xs text-cyber-cyan font-mono w-48 shrink-0 truncate tracking-wide">
                {v.key}
              </span>
              <span className="text-xs text-foreground/60 mx-1">=</span>
              {editing === v.id ? (
                <input
                  ref={editRef}
                  defaultValue={v.value}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(v.id, (e.target as HTMLInputElement).value);
                    if (e.key === "Escape") setEditing(null);
                  }}
                  onBlur={(e) => saveEdit(v.id, e.target.value)}
                  className="flex-1 bg-input border border-primary/30 text-sm text-foreground px-2 py-1 outline-none font-mono tracking-wide"
                  autoFocus
                  spellCheck={false}
                />
              ) : (
                <span className="flex-1 text-sm font-mono text-muted-foreground truncate tracking-wide">
                  {revealed.has(v.id) ? v.value : "••••••••••••"}
                </span>
              )}
              <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggle(v.id)} className="p-1.5 hover:text-primary transition-colors" title="Toggle visibility">
                  {revealed.has(v.id) ? <EyeOff className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />}
                </button>
                <button onClick={() => { setEditing(v.id); }} className="p-1.5 hover:text-cyber-amber transition-colors" title="Edit">
                  <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
                <button onClick={() => remove(v.id)} className="p-1.5 hover:text-destructive transition-colors" title="Remove">
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}

          {vars.length === 0 && (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm font-label uppercase tracking-wider">
              No secrets stored
            </div>
          )}
        </div>

        {/* Add new */}
        <div className="px-5 py-3 border-t border-border">
          {showAdd ? (
            <div className="flex items-center gap-2">
              <input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ""))}
                placeholder="KEY_NAME"
                className="w-40 bg-input border border-border text-xs text-cyber-cyan px-2 py-2 outline-none font-mono tracking-wide focus:border-primary/50"
                autoFocus
                spellCheck={false}
                maxLength={64}
              />
              <span className="text-xs text-foreground/40">=</span>
              <input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="secret_value"
                type="password"
                className="flex-1 bg-input border border-border text-xs text-foreground px-2 py-2 outline-none font-mono tracking-wide focus:border-primary/50"
                onKeyDown={(e) => e.key === "Enter" && addVar()}
                spellCheck={false}
                maxLength={256}
              />
              <button onClick={addVar} className="text-xs text-primary font-label uppercase tracking-wider px-3 py-2 border border-primary/30 hover:bg-primary/10 transition-colors">
                Save
              </button>
              <button onClick={() => { setShowAdd(false); setNewKey(""); setNewValue(""); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors p-2">
                <X className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary font-label uppercase tracking-wider transition-colors"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
              Add Secret
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaultPanel;
