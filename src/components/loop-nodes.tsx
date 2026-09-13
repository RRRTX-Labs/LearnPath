"use client";

import { Hammer, Map as MapIcon, Play, Terminal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const STEPS = [
  { icon: MapIcon, t: "Roadmap", d: "Staged graphs with prerequisites, so you always know what comes next and why." },
  { icon: Play, t: "Learn", d: "Editorially verified free resources — official YouTube embeds, never rehosted." },
  { icon: Terminal, t: "Practice", d: "Python, JS, TS, SQL and HTML run in your browser. Your code never touches our servers." },
  { icon: Hammer, t: "Build", d: "Challenges with real tests, then project briefs you can put in a portfolio." },
];

/**
 * The learning loop as a connected node graph: four cards hanging off one
 * path, exactly like roadmap nodes. The connector draws itself when the
 * section scrolls into view; nodes pulse with a staggered, restrained neon
 * glow. All motion collapses under prefers-reduced-motion (globals.css).
 */
export function LoopNodes() {
  const ref = useRef<HTMLOListElement | null>(null);
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  return (
    <ol
      ref={ref}
      data-visible={visible}
      className="loop-graph relative mt-12 grid gap-8 md:grid-cols-4 md:gap-4"
    >
      {/* horizontal connector (desktop) */}
      <div aria-hidden className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[7px] hidden md:block">
        <div className="loop-line h-px w-full bg-gradient-to-r from-primary/10 via-primary/60 to-primary/10" />
        <div className="loop-traveler absolute top-[-2px] h-[5px] w-[5px] rounded-full bg-primary shadow-[0_0_10px_2px_var(--glow)]" />
      </div>
      {/* vertical connector (mobile) */}
      <div aria-hidden className="pointer-events-none absolute bottom-6 left-[7px] top-2 w-px md:hidden">
        <div className="loop-line-v h-full w-full bg-gradient-to-b from-primary/10 via-primary/60 to-primary/10" />
      </div>

      {STEPS.map((s, i) => (
        <li key={s.t} className="group relative pl-8 md:pl-0">
          {/* node */}
          <span
            aria-hidden
            className="loop-node absolute left-0 top-0 md:left-1/2 md:-translate-x-1/2"
            style={{ ["--d" as string]: `${i * 180}ms` }}
          >
            <span className="relative grid h-[15px] w-[15px] place-items-center">
              <span
                className="animate-pulse-node absolute inset-0 rounded-full bg-primary/30 blur-[6px]"
                style={{ animationDelay: `${i * 700}ms` }}
              />
              <span className="relative h-[9px] w-[9px] rounded-full bg-primary shadow-[0_0_8px_1px_var(--glow)] transition-shadow duration-300 group-hover:shadow-[0_0_14px_3px_var(--glow)]" />
              <span className="absolute inset-[-5px] rounded-full border border-primary/40 transition-colors duration-300 group-hover:border-primary/80" />
            </span>
          </span>

          <div className="surface card-hover mt-5 h-full rounded-lg p-5 md:mt-8">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-primary-soft text-primary">
                <s.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="meta">0{i + 1}</span>
            </div>
            <p className="mt-4 font-medium">{s.t}</p>
            <p className="mt-1 text-sm text-muted">{s.d}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
