import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-fg hover:opacity-90",
        ghost: "bg-transparent text-fg hover:bg-surface-2 border border-border",
        accent: "bg-accent text-bg-sunken hover:opacity-90",
        danger: "bg-danger text-white hover:opacity-90",
        link: "bg-transparent text-primary underline-offset-4 hover:underline px-0",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-[6px]",
        md: "h-11 px-4 text-sm rounded-[10px]",
        lg: "h-12 px-5 rounded-[10px]",
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
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
} & VariantProps<typeof buttonStyles>) {
  return (
    <Link href={href} className={cn(buttonStyles({ variant, size }), className)}>
      {children}
    </Link>
  );
}

export function Badge({
  children,
  className,
  tone = "muted",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "muted" | "primary" | "accent" | "success" | "danger";
}) {
  const tones = {
    muted: "text-muted border-border",
    primary: "text-primary border-primary/30",
    accent: "text-accent border-accent/30",
    success: "text-success border-success/30",
    danger: "text-danger border-danger/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("surface p-5", className)} {...props} />;
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-[10px] border border-border bg-bg-sunken px-3 text-sm text-fg placeholder:text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-[10px] border border-border bg-bg-sunken px-3 py-2 text-sm text-fg placeholder:text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-1">
      {label ? (
        <div className="flex justify-between font-mono text-[11px] uppercase tracking-wider text-muted">
          <span>{label}</span>
          <span>{v}%</span>
        </div>
      ) : null}
      <div className="h-1.5 overflow-hidden rounded-full bg-bg-sunken">
        <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="surface flex flex-col items-start gap-3 p-8">
      <h2 className="font-display text-2xl">{title}</h2>
      <p className="max-w-md text-muted">{body}</p>
      {action}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-surface-2", className)} />;
}
