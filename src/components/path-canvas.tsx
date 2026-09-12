"use client";

import Link from "next/link";
import { useRef, useState } from "react";

/**
 * The hero constellation: the actual LearnPath loop as an ascending path.
 * SVG + CSS only (no WebGL): cheap to paint, crisp at any density, and every
 * node is a real link into the product. Parallax and float collapse to
 * nothing under prefers-reduced-motion.
 */
const NODES = [
  { id: "roadmap", label: "Roadmap", href: "/roadmaps", x: 8, y: 78 },
  { id: "skill", label: "Skill", href: "/roadmaps/python-developer", x: 22, y: 62 },
  { id: "watch", label: "Watch", href: "/resources", x: 37, y: 70 },
  { id: "practice", label: "Practice", href: "/practice", x: 52, y: 48 },
  { id: "challenge", label: "Challenge", href: "/challenges", x: 66, y: 56 },
  { id: "build", label: "Build", href: "/projects", x: 80, y: 30 },
  { id: "progress", label: "Progress", href: "/me", x: 93, y: 16 },
];

const STARS = [
  [14, 22], [30, 12], [44, 30], [58, 14], [72, 8], [86, 44], [20, 44], [64, 82], [88, 70], [40, 90], [6, 40], [96, 58],
];

export function PathCanvas() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function onMove(e: React.PointerEvent) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 10,
      y: ((e.clientY - r.top) / r.height - 0.5) * 8,
    });
  }

  const pts = NODES.map((n) => ({ ...n, px: (n.x / 100) * 720, py: (n.y / 100) * 320 }));
  const path = pts
    .map((p, i) => {
      if (i === 0) return `M ${p.px} ${p.py}`;
      const prev = pts[i - 1];
      const mx = (prev.px + p.px) / 2;
      return `C ${mx} ${prev.py}, ${mx} ${p.py}, ${p.px} ${p.py}`;
    })
    .join(" ");

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className="glass edge-accent relative overflow-hidden rounded-xl p-2"
      style={{ perspective: 1200 }}
    >
      <div
        className="transition-transform duration-300 ease-out"
        style={{ transform: `rotateX(${-tilt.y * 0.4}deg) rotateY(${tilt.x * 0.4}deg)` }}
      >
        <svg viewBox="0 0 720 320" className="h-auto w-full" role="img" aria-label="The LearnPath loop: roadmap, skill, watch, practice, challenge, build, progress">
          <defs>
            <linearGradient id="heroPath" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>

          {STARS.map(([x, y], i) => (
            <circle
              key={i}
              cx={(x / 100) * 720}
              cy={(y / 100) * 320}
              r={i % 3 === 0 ? 1.6 : 1}
              fill="var(--muted)"
              opacity={0.35}
              className="animate-pulse-node"
              style={{ animationDelay: `${(i % 5) * 0.6}s` }}
            />
          ))}

          <path
            d={path}
            fill="none"
            stroke="url(#heroPath)"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="animate-draw"
            style={{ ["--draw-length" as string]: "1400" }}
          />

          {pts.map((p, i) => {
            const last = i === pts.length - 1;
            return (
              <g key={p.id} className="animate-float" style={{ animationDelay: `${i * 0.7}s` }}>
                <a href={p.href} aria-label={p.label}>
                  <circle cx={p.px} cy={p.py} r={18} fill="transparent" />
                  <circle
                    cx={p.px}
                    cy={p.py}
                    r={last ? 9 : 6.5}
                    fill={last ? "var(--accent)" : "var(--primary)"}
                  />
                  <circle cx={p.px} cy={p.py} r={last ? 16 : 12} fill="none" stroke={last ? "var(--accent)" : "var(--primary)"} strokeOpacity="0.28" />
                  <text
                    x={p.px}
                    y={p.py + (p.y > 55 ? 34 : -22)}
                    textAnchor="middle"
                    fill="var(--fg)"
                    fontSize="12"
                    fontFamily="var(--font-mono)"
                    letterSpacing="0.08em"
                  >
                    {p.label.toUpperCase()}
                  </text>
                </a>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="meta px-4 pb-3 pt-1">
        Every node is a real page —{" "}
        <Link className="text-primary hover:underline" href="/roadmaps/python-developer">
          open a roadmap
        </Link>{" "}
        and follow the same shape.
      </p>
    </div>
  );
}
