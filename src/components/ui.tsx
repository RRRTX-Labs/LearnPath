"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { forwardRef, useId, useState, type ButtonHTMLAttributes, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ button */

export const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-[background-color,border-color,color,opacity,transform] duration-150 select-none disabled:opacity-50 disabled:pointer-events-none active:translate-y-px",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-fg hover:opacity-90 shadow-1",
        accent: "bg-accent text-bg-sunken hover:opacity-90 shadow-1",
        ghost: "bg-transparent text-fg hover:bg-surface-2 border border-line",
        subtle: "bg-surface-2 text-fg hover:border-line-strong border border-transparent",
        danger: "bg-danger text-white hover:opacity-90",
        link: "bg-transparent text-primary underline-offset-4 hover:underline px-0",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-md",
        md: "h-11 px-4 text-sm rounded-md",
        lg: "h-12 px-6 text-base rounded-md",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}

export function ButtonLink({
  href,
  className,
  variant,
  size,
  children,
  external,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
} & VariantProps<typeof buttonStyles>) {
  if (external) {
    return (
      <a
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        className={cn(buttonStyles({ variant, size }), className)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(buttonStyles({ variant, size }), className)}>
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------- badge */

export function Badge({
  children,
  className,
  tone = "muted",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "muted" | "primary" | "accent" | "success" | "danger" | "warning";
}) {
  const tones = {
    muted: "text-muted border-line",
    primary: "text-primary border-primary/30 bg-primary-soft",
    accent: "text-accent border-accent/30 bg-accent-soft",
    success: "text-success border-success/30",
    danger: "text-danger border-danger/30",
    warning: "text-warning border-warning/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------- card */

export function Card({
  className,
  interactive,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return <div className={cn("surface p-5", interactive && "card-hover spotlight", className)} {...props} />;
}

/* ------------------------------------------------------------------- input */

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-md border border-line bg-bg-sunken px-3 text-sm text-fg placeholder:text-muted",
          "focus:border-line-strong",
          className,
        )}
        {...props}
      />
    );
  },
);

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-md border border-line bg-bg-sunken px-3 py-2 text-sm text-fg placeholder:text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 rounded-md border border-line bg-bg-sunken px-2 text-sm text-fg",
        className,
      )}
      {...props}
    />
  );
}

/* ---------------------------------------------------------------- progress */

export function ProgressBar({ value, label, tone = "accent" }: { value: number; label?: string; tone?: "accent" | "primary" }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-1">
      {label ? (
        <div className="flex justify-between font-mono text-[11px] uppercase tracking-wider text-muted">
          <span>{label}</span>
          <span>{v}%</span>
        </div>
      ) : null}
      <div
        className="h-1.5 overflow-hidden rounded-pill bg-bg-sunken"
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "progress"}
      >
        <div
          className={cn("h-full rounded-pill transition-[width] duration-500", tone === "accent" ? "bg-accent" : "bg-primary")}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- empty/load */

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="surface flex flex-col items-start gap-3 p-8">
      {icon ? <div className="text-muted" aria-hidden>{icon}</div> : null}
      <h2 className="font-display text-2xl">{title}</h2>
      <p className="max-w-md text-muted">{body}</p>
      {action}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton-shimmer rounded-md", className)} />;
}

/* ------------------------------------------------------------------- tabs */

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
  className,
  label,
}: {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
  label: string;
}) {
  const id = useId();
  return (
    <div role="tablist" aria-label={label} className={cn("flex flex-wrap gap-1 rounded-pill border border-line bg-bg-sunken p-1", className)}>
      {tabs.map((t) => {
        const selected = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            id={`${id}-tab-${t.id}`}
            aria-selected={selected}
            aria-controls={`${id}-panel-${t.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => {
              const i = tabs.findIndex((x) => x.id === active);
              if (e.key === "ArrowRight") onChange(tabs[(i + 1) % tabs.length].id);
              if (e.key === "ArrowLeft") onChange(tabs[(i - 1 + tabs.length) % tabs.length].id);
            }}
            className={cn(
              "min-h-9 rounded-pill px-3.5 text-sm capitalize transition-colors duration-150",
              selected ? "bg-surface-2 text-fg shadow-1" : "text-muted hover:text-fg",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({ id, active, children, label }: { id: string; active: string; children: React.ReactNode; label?: string }) {
  if (id !== active) return null;
  return (
    <div role="tabpanel" id={`panel-${id}`} aria-label={label} className="animate-fade-up">
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- layout */

export function SectionHeader({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl leading-tight md:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...props} />;
}

/* Collapses after the first N items with an honest "show more" toggle. */
export function ShowMore({ children, count }: { children: React.ReactNode[]; count: number }) {
  const [open, setOpen] = useState(false);
  const visible = open ? children : children.slice(0, count);
  return (
    <>
      {visible}
      {children.length > count ? (
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? "Show fewer" : `Show ${children.length - count} more`}
        </Button>
      ) : null}
    </>
  );
}
