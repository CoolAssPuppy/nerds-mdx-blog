import type { ReactNode } from "react";

type CalloutVariant = "warning" | "info" | "tip" | "note" | "danger";

type CalloutProps = {
  readonly emoji?: string;
  readonly title?: string;
  readonly children: ReactNode;
  readonly variant?: CalloutVariant;
  readonly borderColor?: string;
  readonly backgroundColor?: string;
  readonly className?: string;
};

const variantStyles: Record<
  CalloutVariant,
  { bg: string; border: string; title: string }
> = {
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-400",
    title: "text-amber-800",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-400",
    title: "text-blue-800",
  },
  tip: {
    bg: "bg-green-50",
    border: "border-green-400",
    title: "text-green-800",
  },
  note: {
    bg: "bg-gray-50",
    border: "border-gray-400",
    title: "text-gray-800",
  },
  danger: {
    bg: "bg-red-50",
    border: "border-red-400",
    title: "text-red-800",
  },
};

const defaultEmojis: Record<CalloutVariant, string> = {
  warning: "⚠️",
  info: "ℹ️",
  tip: "💡",
  note: "📝",
  danger: "🚨",
};

const PROSE_CLASSES =
  "text-foreground prose prose-sm max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:my-2 prose-p:first:mt-0 prose-p:last:mb-0";

export function Callout({
  emoji,
  title,
  children,
  variant = "note",
  borderColor,
  backgroundColor,
  className = "",
}: CalloutProps): React.ReactElement {
  const styles = variantStyles[variant];
  const displayEmoji = emoji ?? defaultEmojis[variant];

  const bgClass = backgroundColor ? "" : styles.bg;
  const borderClass = borderColor ? "" : styles.border;

  return (
    <div className={`my-8 ${className}`}>
      <div
        className={`${bgClass} ${borderClass} border-l-4 rounded-r-lg p-6 shadow-sm`}
        style={{
          ...(backgroundColor && { backgroundColor }),
          ...(borderColor && { borderLeftColor: borderColor }),
        }}
      >
        {title ? (
          <div>
            <div className="flex items-center gap-3 mb-2">
              {displayEmoji && (
                <span className="text-2xl flex-shrink-0" aria-hidden="true">
                  {displayEmoji}
                </span>
              )}
              <p className={`font-bold ${styles.title} leading-tight`}>
                {title}
              </p>
            </div>
            <div
              className={`${PROSE_CLASSES} ${displayEmoji ? "pl-9" : ""}`}
            >
              {children}
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            {displayEmoji && (
              <span className="text-2xl flex-shrink-0" aria-hidden="true">
                {displayEmoji}
              </span>
            )}
            <div className={`flex-1 min-w-0 ${PROSE_CLASSES}`}>
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
