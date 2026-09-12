"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

/** URL-driven tab/filter bar: state lives in the query string, so filtered
 *  views are linkable, crawlable and back-button friendly. */
export function Tabs({
  tabs,
  active,
  hrefBase,
  label,
  className,
  param = "category",
}: {
  tabs: { id: string; label: string }[];
  active: string;
  hrefBase: string;
  label: string;
  className?: string;
  param?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  function go(id: string) {
    const next = new URLSearchParams(params.toString());
    if (id === tabs[0].id) next.delete(param);
    else next.set(param, id);
    const qs = next.toString();
    router.push(qs ? `${hrefBase}?${qs}` : hrefBase, { scroll: false });
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "flex flex-wrap gap-1 rounded-pill border border-line bg-bg-sunken p-1",
        className,
      )}
    >
      {tabs.map((t) => {
        const selected = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => go(t.id)}
            onKeyDown={(e) => {
              const i = tabs.findIndex((x) => x.id === active);
              if (e.key === "ArrowRight") go(tabs[(i + 1) % tabs.length].id);
              if (e.key === "ArrowLeft") go(tabs[(i - 1 + tabs.length) % tabs.length].id);
            }}
            className={cn(
              "min-h-9 rounded-pill px-3.5 text-sm transition-colors duration-150",
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

