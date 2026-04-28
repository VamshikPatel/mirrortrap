import { useEffect, useRef } from 'react';

/**
 * Animated Security Radar — The visual centerpiece
 *
 * Features:
 * - 4 concentric rings with subtle glow
 * - Rotating radar sweep with gradient trail
 * - Pulsing threat dots at radar positions
 * - Cross-hair targeting lines
 * - Data labels around the perimeter
 * - Glowing center point
 * - All driven by CSS keyframes + RAF for smooth performance
 */
export default function SecurityRadar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);

  // Threat dots positioned on the radar (angle in degrees, distance from center 0-1)
  const threats = [
    { angle: 45, dist: 0.65, severity: 'high', label: 'Phishing' },
    { angle: 130, dist: 0.45, severity: 'medium', label: 'Pretexting' },
    { angle: 200, dist: 0.8, severity: 'high', label: 'Credential' },
    { angle: 280, dist: 0.35, severity: 'low', label: 'OSINT' },
    { angle: 330, dist: 0.55, severity: 'medium', label: 'Baiting' },
    { angle: 90, dist: 0.9, severity: 'high', label: 'Spear' },
  ];

  useEffect(() => {
    // Staggered dot appearance
    dotsRef.current.forEach((dot, i) => {
      if (dot) {
        dot.style.opacity = '0';
        dot.style.transform = 'scale(0)';
        setTimeout(() => {
          dot.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
          dot.style.opacity = '1';
          dot.style.transform = 'scale(1)';
        }, 1200 + i * 200);
      }
    });
  }, []);

  const size = 400;
  const center = size / 2;
  const rings = [0.25, 0.45, 0.65, 0.85];

  const severityColors: Record<string, string> = {
    high: 'var(--text-primary)',
    medium: 'var(--text-secondary)',
    low: 'var(--text-muted)',
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: size,
        height: size,
        maxWidth: '90vw',
        maxHeight: '90vw',
        aspectRatio: '1',
      }}
    >
      {/* SVG rings + crosshairs */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          {/* Sweep gradient */}
          <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowStrong">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Concentric rings */}
        {rings.map((r, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={center * r}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth={1}
            style={{
              opacity: 0,
              animation: `radarRingIn 0.8s ${0.3 + i * 0.15}s ease-out forwards`,
            }}
          />
        ))}

        {/* Crosshair lines */}
        <line x1={center} y1={center * 0.1} x2={center} y2={center * 1.9}
          stroke="var(--border-subtle)" strokeWidth={0.5}
          strokeDasharray="4 4"
          style={{ opacity: 0, animation: 'radarRingIn 0.6s 0.8s ease-out forwards' }}
        />
        <line x1={center * 0.1} y1={center} x2={center * 1.9} y2={center}
          stroke="var(--border-subtle)" strokeWidth={0.5}
          strokeDasharray="4 4"
          style={{ opacity: 0, animation: 'radarRingIn 0.6s 0.8s ease-out forwards' }}
        />
        {/* Diagonal crosshairs */}
        <line x1={center + center * 0.85 * Math.cos(Math.PI / 4)} y1={center - center * 0.85 * Math.sin(Math.PI / 4)}
          x2={center - center * 0.85 * Math.cos(Math.PI / 4)} y2={center + center * 0.85 * Math.sin(Math.PI / 4)}
          stroke="var(--border-subtle)" strokeWidth={0.5}
          style={{ opacity: 0, animation: 'radarRingIn 0.6s 0.9s ease-out forwards' }}
        />
        <line x1={center - center * 0.85 * Math.cos(Math.PI / 4)} y1={center - center * 0.85 * Math.sin(Math.PI / 4)}
          x2={center + center * 0.85 * Math.cos(Math.PI / 4)} y2={center + center * 0.85 * Math.sin(Math.PI / 4)}
          stroke="var(--border-subtle)" strokeWidth={0.5}
          style={{ opacity: 0, animation: 'radarRingIn 0.6s 0.9s ease-out forwards' }}
        />

        {/* Center glow */}
        <circle cx={center} cy={center} r={4} fill="var(--text-muted)" filter="url(#glowStrong)"
          style={{ opacity: 0, animation: 'radarRingIn 0.5s 1s ease-out forwards' }}
        />
        <circle cx={center} cy={center} r={2} fill="var(--text-primary)"
          style={{ opacity: 0, animation: 'radarRingIn 0.5s 1s ease-out forwards' }}
        />
      </svg>

      {/* Rotating sweep */}
      <div
        ref={sweepRef}
        style={{
          position: 'absolute',
          inset: 0,
          animation: 'radarSweep 4s linear infinite',
          opacity: 0,
          animationDelay: '1s',
          animationFillMode: 'forwards',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: center,
            left: center,
            width: center * 0.85,
            height: 1,
            transformOrigin: '0 50%',
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0))',
            filter: 'blur(0.5px)',
          }}
        />
        {/* Sweep trail (conic gradient) */}
        <div
          style={{
            position: 'absolute',
            inset: center * 0.15,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, rgba(255, 255, 255, 0.05) 0deg, transparent 40deg)',
          }}
        />
      </div>

      {/* Threat dots */}
      {threats.map((threat, i) => {
        const rad = (threat.angle * Math.PI) / 180;
        const r = center * threat.dist;
        const x = center + r * Math.cos(rad);
        const y = center - r * Math.sin(rad);
        const color = severityColors[threat.severity];

        return (
          <div
            key={i}
            ref={(el) => { if (el) dotsRef.current[i] = el; }}
            style={{
              position: 'absolute',
              left: `${(x / size) * 100}%`,
              top: `${(y / size) * 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
            }}
          >
            {/* Pulse ring */}
            <div
              style={{
                position: 'absolute',
                inset: -8,
                borderRadius: '50%',
                border: `1px solid ${color}`,
                opacity: 0.3,
                animation: 'threatPulse 2s ease-out infinite',
                animationDelay: `${i * 0.3}s`,
              }}
            />
            {/* Core dot */}
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: color,
                boxShadow: `0 0 12px ${color}60, 0 0 4px ${color}`,
              }}
            />
            {/* Label */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 14,
                transform: 'translateX(-50%)',
                fontSize: 9,
                fontWeight: 600,
                color: color,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                opacity: 0.7,
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              {threat.label}
            </div>
          </div>
        );
      })}

      {/* Perimeter data readouts */}
      {['N', 'E', 'S', 'W'].map((dir, i) => {
        const positions = [
          { left: '50%', top: '2%', transform: 'translateX(-50%)' },
          { right: '2%', top: '50%', transform: 'translateY(-50%)' },
          { left: '50%', bottom: '2%', transform: 'translateX(-50%)' },
          { left: '2%', top: '50%', transform: 'translateY(-50%)' },
        ];
        return (
          <div
            key={dir}
            style={{
              position: 'absolute',
              ...positions[i],
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono, monospace)',
              letterSpacing: '0.1em',
              opacity: 0,
              animation: `radarRingIn 0.5s ${1.5 + i * 0.1}s ease-out forwards`,
            } as React.CSSProperties}
          >
            {dir}
          </div>
        );
      })}

      {/* Outer glow ring */}
      <div
        style={{
          position: 'absolute',
          inset: -1,
          borderRadius: '50%',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 0 40px rgba(255, 255, 255, 0.02), inset 0 0 40px rgba(255, 255, 255, 0.01)',
          opacity: 0,
          animation: 'radarRingIn 1s 0.2s ease-out forwards',
        }}
      />

      {/* Keyframes */}
      <style>{`
        @keyframes radarSweep {
          0% { transform: rotate(0deg); opacity: 1; }
          100% { transform: rotate(360deg); opacity: 1; }
        }
        @keyframes radarRingIn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes threatPulse {
          0% { transform: scale(1); opacity: 0.4; }
          70% { transform: scale(2.5); opacity: 0; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
