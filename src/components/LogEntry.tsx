import { useState, useEffect, useRef } from "react";

interface LogEntryProps {
  text: string;
  variant: "green" | "amber" | "cyan" | "purple" | "rose" | "muted";
  timestamp: string;
  typewriter?: boolean;
  onComplete?: () => void;
}

const variantStyles: Record<LogEntryProps["variant"], string> = {
  green: "text-primary text-glow-green",
  amber: "text-cyber-amber text-glow-amber",
  cyan: "text-cyber-cyan text-glow-cyan",
  purple: "text-cyber-purple text-glow-purple",
  rose: "text-cyber-rose text-glow-rose",
  muted: "text-muted-foreground",
};

const LogEntry = ({ text, variant, timestamp, typewriter = true, onComplete }: LogEntryProps) => {
  const [displayed, setDisplayed] = useState(typewriter ? "" : text);
  const [done, setDone] = useState(!typewriter);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!typewriter) {
      onCompleteRef.current?.();
      return;
    }
    let i = 0;
    const speed = variant === "muted" ? 8 : 14;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
        onCompleteRef.current?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, typewriter, variant]);

  return (
    <div className="flex gap-3 py-2 px-4 border-b border-border/20 hover:bg-muted/20 transition-colors duration-100">
      <span className="text-xs text-muted-foreground font-label shrink-0 mt-0.5 w-20">
        {timestamp}
      </span>
      <span className="text-xs text-muted-foreground shrink-0 mt-0.5">{">"}</span>
      <p className={`text-sm leading-relaxed tracking-wide ${variantStyles[variant]}`}>
        {displayed}
        {!done && <span className="inline-block w-1.5 h-3.5 bg-current animate-blink ml-0.5 align-middle" />}
      </p>
    </div>
  );
};

export default LogEntry;
