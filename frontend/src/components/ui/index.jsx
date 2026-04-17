// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = "md" }) {
  const s = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-10 h-10" : "w-6 h-6";
  return (
    <div className={`${s} border-2 border-cyber-border border-t-cyber-accent rounded-full animate-spin`} />
  );
}

// ── Difficulty badge ──────────────────────────────────────────────────────────
const difficultyMap = {
  EASY:   { label: "Easy",   cls: "bg-emerald-950 text-emerald-400 border border-emerald-800" },
  MEDIUM: { label: "Medium", cls: "bg-amber-950 text-amber-400 border border-amber-800" },
  HARD:   { label: "Hard",   cls: "bg-red-950 text-red-400 border border-red-800" },
};

export function DifficultyBadge({ difficulty }) {
  const d = difficultyMap[difficulty] || difficultyMap.EASY;
  return <span className={`badge ${d.cls}`}>{d.label}</span>;
}

// ── Status badge ──────────────────────────────────────────────────────────────
const statusMap = {
  COMPLETED:   { label: "Completed",   cls: "bg-emerald-950 text-emerald-400 border border-emerald-800" },
  IN_PROGRESS: { label: "In Progress", cls: "bg-blue-950 text-blue-400 border border-blue-800" },
  NOT_STARTED: { label: "Not Started", cls: "bg-cyber-surface text-cyber-muted border border-cyber-border" },
};

export function StatusBadge({ status }) {
  const s = statusMap[status] || statusMap.NOT_STARTED;
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

// ── Progress ring ─────────────────────────────────────────────────────────────
export function ProgressRing({ percent = 0, size = 64, strokeWidth = 4 }) {
  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#1e2330" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#00ff87" strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }} />
    </svg>
  );
}

// ── Alert ─────────────────────────────────────────────────────────────────────
export function Alert({ type = "error", message }) {
  if (!message) return null;
  const styles = {
    error:   "bg-red-950 border-red-800 text-red-400",
    success: "bg-emerald-950 border-emerald-800 text-emerald-400",
    info:    "bg-blue-950 border-blue-800 text-blue-400",
  };
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm font-body ${styles[type]}`}>
      {message}
    </div>
  );
}

// ── Icon check / x ────────────────────────────────────────────────────────────
export function CheckIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
    </svg>
  );
}

export function XIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
    </svg>
  );
}

export function LockIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
    </svg>
  );
}
