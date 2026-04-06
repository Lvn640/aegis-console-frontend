import { useState, useEffect, useRef, useCallback, KeyboardEvent } from "react";
import ConsoleHeader from "./ConsoleHeader";
import LogEntry from "./LogEntry";
import VaultPanel from "./VaultPanel";
import PhoneMockup from "./PhoneMockup";
import RightPanel from "./RightPanel";
import HistoryPanel, { HistoryEntry } from "./HistoryPanel";

interface LogItem {
  id: number;
  text: string;
  variant: "green" | "amber" | "cyan" | "purple" | "rose" | "muted";
  timestamp: string;
  typing: boolean; // true = currently typing, false = done
}

interface QueuedLog {
  text: string;
  variant: LogItem["variant"];
  offsetSec: number;
  onAdded?: () => void;
}

const makeTs = (offset: number) => {
  const d = new Date();
  d.setSeconds(d.getSeconds() + offset);
  return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

const HELP_TEXT = `Available commands:
  simulate  — Run the Human-in-the-Loop security demo
  vault     — Open the secure environment vault
  history   — View past approval decisions
  clear     — Clear all logs
  status    — Show current agent status
  help      — Show this help message
  whoami    — Display current identity
  ping      — Test secure tunnel latency
  scan      — Run a security perimeter scan
  agents    — List registered AI agents
  uptime    — Show system uptime
  network   — Display active connections
  encrypt   — Encrypt a test payload`;

const AegisConsole = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [approved, setApproved] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [approvalHistory, setApprovalHistory] = useState<HistoryEntry[]>([]);
  const [showPhoneNotification, setShowPhoneNotification] = useState(false);
  const [agentStatus, setAgentStatus] = useState<"locked" | "authorized">("locked");
  const [unlockedResource, setUnlockedResource] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const feedRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(0);
  const historyIdRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Queue for sequential typing
  const queueRef = useRef<QueuedLog[]>([]);
  const isTypingRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (feedRef.current) {
        feedRef.current.scrollTop = feedRef.current.scrollHeight;
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [logs, scrollToBottom]);

  const processQueue = useCallback(() => {
    if (isTypingRef.current || queueRef.current.length === 0) return;
    isTypingRef.current = true;
    const next = queueRef.current.shift()!;
    idRef.current += 1;
    const entry: LogItem = {
      id: idRef.current,
      text: next.text,
      variant: next.variant,
      timestamp: makeTs(next.offsetSec),
      typing: true,
    };
    setLogs((prev) => [...prev, entry]);
    next.onAdded?.();
  }, []);

  const handleLogComplete = useCallback((logId: number) => {
    setLogs((prev) => prev.map((l) => (l.id === logId ? { ...l, typing: false } : l)));
    isTypingRef.current = false;
    // Natural pause between lines (randomized for realism)
    const delay = 250 + Math.random() * 350;
    setTimeout(() => {
      if (queueRef.current.length > 0) {
        processQueue();
      }
    }, delay);
  }, [processQueue]);

  const addLog = useCallback((text: string, variant: LogItem["variant"], offsetSec: number = 0, onAdded?: () => void) => {
    queueRef.current.push({ text, variant, offsetSec, onAdded });
    processQueue();
  }, [processQueue]);

  // Immediate log (no queue, for user commands)
  const addImmediate = useCallback((text: string, variant: LogItem["variant"], offsetSec: number = 0) => {
    idRef.current += 1;
    const entry: LogItem = {
      id: idRef.current,
      text,
      variant,
      timestamp: makeTs(offsetSec),
      typing: false,
    };
    setLogs((prev) => [...prev, entry]);
  }, []);

  useEffect(() => {
    addLog("[🛡️ AEGIS] Welcome. Type 'help' or 'simulate' to begin.", "green", 0);
  }, [addLog]);

  const focusFeed = () => inputRef.current?.focus();

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const startCountdown = useCallback(() => {
    setCountdown(60);
    setUnlockedResource("instagram");
    setAgentStatus("authorized");
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          countdownRef.current = null;
          setUnlockedResource(null);
          setAgentStatus("locked");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const runSimulation = useCallback(() => {
    if (simRunning) {
      addImmediate("[WARN] Simulation already in progress. Wait for completion or type 'clear' to reset.", "amber");
      return;
    }
    setSimRunning(true);
    setApproved(false);
    setShowModal(false);
    setShowPhoneNotification(false);
    clearTimers();
    queueRef.current = [];
    isTypingRef.current = false;

    addLog("[SYS] Initiating security simulation...", "muted");
    addLog("[AGENT] OpenClaw v3.2.1 initialized. Fingerprint: 0xAE91...F4D2", "green", 0);
    addLog("[INFO] Secure tunnel established. TLS 1.3 active.", "muted", 1);
    addLog("[⚠ ALERT] TOOL INTERCEPT: financial_transaction via Instagram API. Awaiting authorization...", "amber", 2);
    addLog("[📱 PUSH] Biometric approval requested on mobile device.", "cyan", 3, () => {
      setShowPhoneNotification(true);
      setTimeout(() => setShowModal(true), 600);
    });
  }, [simRunning, addLog, addImmediate]);

  // Post-approval
  useEffect(() => {
    if (!approved) return;
    clearTimers();
    setShowPhoneNotification(false);
    startCountdown();

    addLog("[🔑 VAULT] Approved. Scoped token issued for write:social_media.", "purple", 0);
    addLog("[✓ DONE] Token delivered. Access window active.", "green", 0, () => {
      setSimRunning(false);
    });

    return clearTimers;
  }, [approved, addLog, startCountdown]);

  const handleApprove = () => {
    setShowModal(false);
    setApproved(true);
    historyIdRef.current += 1;
    setApprovalHistory((prev) => [
      {
        id: historyIdRef.current,
        action: "financial_transaction",
        resource: "Instagram API",
        user: "@alice_wonder_land",
        result: "approved",
        timestamp: makeTs(0),
      },
      ...prev,
    ]);
  };

  const handleDeny = () => {
    setShowModal(false);
    setShowPhoneNotification(false);
    addLog("[❌ DENIED] Authorization denied by user. Agent execution terminated. Returning to Idle-Secure state.", "rose", 7);
    setSimRunning(false);
    historyIdRef.current += 1;
    setApprovalHistory((prev) => [
      {
        id: historyIdRef.current,
        action: "financial_transaction",
        resource: "Instagram API",
        user: "@alice_wonder_land",
        result: "denied",
        timestamp: makeTs(0),
      },
      ...prev,
    ]);
  };

  const processCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    addImmediate(`$ ${cmd}`, "muted");

    if (trimmed) {
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);
    }

    switch (trimmed) {
      case "simulate":
        runSimulation();
        break;
      case "vault":
        addLog("[🔑 VAULT] Opening secure environment vault...", "purple");
        setTimeout(() => setShowVault(true), 400);
        break;
      case "history":
        addLog("[📋 HISTORY] Opening approval history...", "cyan");
        setTimeout(() => setShowHistory(true), 400);
        break;
      case "clear":
        setLogs([]);
        setSimRunning(false);
        setApproved(false);
        setShowModal(false);
        setShowPhoneNotification(false);
        clearTimers();
        queueRef.current = [];
        isTypingRef.current = false;
        addLog("[SYS] Console cleared. Type 'help' for commands.", "muted");
        break;
      case "help":
        HELP_TEXT.split("\n").forEach((line) => addLog(line, "muted"));
        break;
      case "status":
        addLog(`[SYS] Agent: OpenClaw v3.2.1 | Mode: ${simRunning ? "SIMULATION ACTIVE" : "IDLE-SECURE"} | Proxy: ACTIVE | Encryption: TLS 1.3`, "green");
        break;
      case "whoami":
        addLog("[SYS] User: root@aegis-console | Role: SECURITY_ADMIN | Clearance: LEVEL-5 | Session: 0xF9A2...B1C7", "cyan");
        break;
      case "ping":
        addLog("[SYS] Pinging secure gateway...", "muted");
        addLog("[SYS] Reply from gateway-01.aegis.internal: latency=2ms status=OK", "green");
        break;
      case "scan": {
        addLog("[SCAN] Initiating perimeter scan...", "muted");
        addLog("[SCAN] Checking firewall rules... 42 rules active.", "muted");
        addLog("[SCAN] Port scan: 443/tcp OPEN (expected), all others FILTERED.", "green");
        addLog("[SCAN] Intrusion detection: No anomalies in last 24h.", "green");
        addLog("[SCAN] ✓ Perimeter secure. Threat level: LOW.", "green");
        break;
      }
      case "agents":
        addLog("[AGENTS] Registered agents:", "cyan");
        addLog("  → OpenClaw v3.2.1   status: IDLE      scope: social_media", "muted");
        addLog("  → SentinelAI v1.0   status: ACTIVE    scope: monitoring", "muted");
        addLog("  → DataWeaver v2.7   status: SLEEPING  scope: analytics", "muted");
        break;
      case "uptime": {
        const hrs = Math.floor(Math.random() * 200) + 50;
        const mins = Math.floor(Math.random() * 60);
        addLog(`[SYS] Uptime: ${hrs}h ${mins}m | Load: 0.12 0.08 0.03 | Memory: 847MB / 4096MB`, "green");
        break;
      }
      case "network":
        addLog("[NET] Active connections:", "cyan");
        addLog("  → gateway-01.aegis.internal:443   TLS 1.3   ESTABLISHED", "muted");
        addLog("  → vault.aegis.internal:8200       mTLS      ESTABLISHED", "muted");
        addLog("  → monitor.aegis.internal:9090     TLS 1.3   ESTABLISHED", "muted");
        addLog("[NET] 3 active, 0 pending, 0 failed.", "green");
        break;
      case "encrypt":
        addLog("[CRYPTO] Generating 256-bit AES key...", "muted");
        addLog("[CRYPTO] Encrypting payload: 'HELLO_AEGIS' → 0xA7F2...9B1D", "purple");
        addLog("[CRYPTO] ✓ Encryption complete. HMAC verified.", "green");
        break;
      case "":
        break;
      default:
        addLog(`[ERR] Unknown command: '${trimmed}'. Type 'help' for available commands.`, "rose");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processCommand(inputValue);
      setInputValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputValue("");
        } else {
          setHistoryIndex(newIndex);
          setInputValue(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-2 md:p-4 circuit-grid scanlines overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* 3-column layout */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-3 items-stretch h-[85vh] max-h-[800px]">
        {/* Left: Phone mockup */}
        <div className="hidden lg:flex w-[260px] shrink-0 border border-border bg-card/40 backdrop-blur-sm cyber-chamfer items-center justify-center">
          <PhoneMockup
            showNotification={showPhoneNotification}
            showApproval={showModal}
            onApprove={handleApprove}
            onDeny={handleDeny}
          />
        </div>

        {/* Center: Console */}
        <div className="flex-1 border border-border bg-card/95 backdrop-blur-sm cyber-chamfer overflow-hidden shadow-2xl flex flex-col min-w-0 min-h-0">
          <ConsoleHeader />

          {/* Tab bar */}
          <div className="flex items-center gap-1 px-4 py-1.5 border-b border-border/50 bg-card/60 shrink-0">
            <span className="text-[10px] font-label uppercase tracking-[0.15em] text-primary px-2 py-1 border-b border-primary">
              Console
            </span>
            <button
              onClick={() => setShowHistory(true)}
              className="text-[10px] font-label uppercase tracking-[0.15em] text-muted-foreground px-2 py-1 hover:text-foreground transition-colors"
            >
              History
            </button>
          </div>

          {/* Log feed - scrollable */}
          <div
            ref={feedRef}
            className="flex-1 overflow-y-auto bg-background/80 cursor-text min-h-0"
            onClick={focusFeed}
          >
            {logs.map((log) => (
              <LogEntry
                key={log.id}
                text={log.text}
                variant={log.variant}
                timestamp={log.timestamp}
                typewriter={log.typing}
                onComplete={() => handleLogComplete(log.id)}
              />
            ))}
          </div>

          {/* Command input */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-card/80 shrink-0">
            <span className="text-primary text-sm font-bold text-glow-green">{">"}</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command... (try 'simulate' or 'help')"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none font-mono tracking-wide caret-primary"
              autoFocus
              spellCheck={false}
            />
            <span className="inline-block w-2 h-4 bg-primary animate-blink" />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-card text-xs text-muted-foreground font-label uppercase tracking-[0.15em] shrink-0">
            <span>
              Status:{" "}
              <span className={showModal ? "text-cyber-amber text-glow-amber" : simRunning ? "text-cyber-cyan text-glow-cyan" : "text-primary text-glow-green"}>
                {showModal ? "AWAITING APPROVAL" : simRunning ? "SIMULATION" : "IDLE-SECURE"}
              </span>
            </span>
            <span>Logs: {logs.length}</span>
            <span className="hidden md:inline">TLS 1.3 • E2E Encrypted</span>
          </div>
        </div>

        {/* Right: Panel */}
        <div className="hidden lg:block w-[240px] shrink-0 border border-border bg-card/40 backdrop-blur-sm cyber-chamfer overflow-hidden">
          <RightPanel agentStatus={agentStatus} unlockedResource={unlockedResource} countdown={countdown} />
        </div>
      </div>

      {/* Modals (vault & history stay as overlays) */}
      {showVault && <VaultPanel onClose={() => setShowVault(false)} />}
      {showHistory && <HistoryPanel entries={approvalHistory} onClose={() => setShowHistory(false)} />}
    </div>
  );
};

export default AegisConsole;
