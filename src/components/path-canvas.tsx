"use client";

const NODES = [
  { id: "foundation", label: "Foundation", x: 60, y: 210 },
  { id: "skills", label: "Skills", x: 200, y: 140 },
  { id: "practice", label: "Practice", x: 340, y: 180 },
  { id: "projects", label: "Projects", x: 470, y: 100 },
  { id: "mastery", label: "Mastery", x: 600, y: 70 },
];

export function PathCanvas() {
  return (
    <div className="relative overflow-hidden rounded-[16px] border border-border bg-surface p-4" style={{ perspective: 1200 }}>
      <svg viewBox="0 0 680 280" className="h-auto w-full" role="img" aria-label="Learning path from foundation to mastery">
        <defs>
          <linearGradient id="pathGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
        <path
          d="M60 210 C 140 210, 140 140, 200 140 S 280 180, 340 180 S 410 100, 470 100 S 540 70, 600 70"
          fill="none"
          stroke="url(#pathGrad)"
          strokeWidth="2.2"
          className="animate-draw"
        />
        {NODES.map((n, i) => (
          <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
            <circle r={i === NODES.length - 1 ? 9 : 7} fill={i === NODES.length - 1 ? "var(--accent)" : "var(--primary)"} />
            <circle r={16} fill="none" stroke="var(--primary)" strokeOpacity="0.25" />
            <text y={28} textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="var(--font-mono)">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
