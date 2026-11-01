
import { cn } from "../../lib/cn";

export function Card({ className, children, ...props }) {
  return (
    <section
      className={cn(
        "bg-surface border border-border rounded-card shadow-card",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

// Title row with an optional action slot (buttons, filters, counts).
export function CardHeader({ title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 px-5 py-4 border-b border-border",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-base text-fg">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ className, children }) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}
