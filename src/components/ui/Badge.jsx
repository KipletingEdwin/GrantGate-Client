
import {
  CheckCircle2,
  CircleDashed,
  Clock,
  KeyRound,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { cn } from "../../lib/cn";

const tones = {
  neutral: "bg-surface-2 text-muted",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  blocked: "bg-blocked-soft text-blocked",
};

export function Badge({ tone = "neutral", icon: Icon, className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full",
        "text-xs font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {Icon && <Icon size={13} aria-hidden />}
      {children}
    </span>
  );
}

// Request lifecycle: submitted -> investigating -> proposed -> approved/rejected -> granted
const STATUS = {
  submitted: { label: "Submitted", tone: "neutral", icon: CircleDashed },
  investigating: { label: "Investigating", tone: "info", icon: Clock },
  proposed: { label: "Needs review", tone: "warning", icon: Clock },
  approved: { label: "Approved", tone: "success", icon: CheckCircle2 },
  rejected: { label: "Rejected", tone: "danger", icon: XCircle },
  granted: { label: "Granted", tone: "success", icon: KeyRound },
  blocked: { label: "Blocked by policy", tone: "blocked", icon: ShieldAlert },
};

export function StatusBadge({ status, className }) {
  const s = STATUS[status] ?? STATUS.submitted;
  return (
    <Badge tone={s.tone} icon={s.icon} className={className}>
      {s.label}
    </Badge>
  );
}

const RISK = {
  low: { label: "Low risk", tone: "success" },
  medium: { label: "Medium risk", tone: "warning" },
  high: { label: "High risk", tone: "danger" },
  critical: { label: "Critical", tone: "blocked" },
};

export function RiskBadge({ level = "low", className }) {
  const r = RISK[level] ?? RISK.low;
  return (
    <Badge tone={r.tone} className={className}>
      {r.label}
    </Badge>
  );
}

// What the agent proposed: grant, deny, or a narrower grant.
const DECISION = {
  grant: { label: "Grant", tone: "success" },
  narrow: { label: "Narrower grant", tone: "info" },
  deny: { label: "Deny", tone: "danger" },
};

export function DecisionBadge({ decision, className }) {
  const d = DECISION[decision] ?? DECISION.deny;
  return (
    <Badge tone={d.tone} className={className}>
      {d.label}
    </Badge>
  );
}
