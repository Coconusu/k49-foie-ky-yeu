"use client";

import { useEffect, useRef, useState } from "react";

// Bung 1 lần khi vào trang: hạt phóng nhanh ra mọi hướng (giảm tốc dần),
// lơ lửng nhẹ tại chỗ, rồi mờ dần. Canvas riêng, pointer-events-none nên
// không chặn tương tác các phần khác của hero.
const COLORS = ["#7EC8E3", "#B6E3FF", "#FFFFFF", "#163A6B", "#0B1E3F"];
const SHAPES = ["dot", "star", "spiral"] as const;
type Shape = (typeof SHAPES)[number];

const MOBILE_BREAKPOINT = 640;
const DESKTOP_COUNT = 155;
const MOBILE_COUNT_RATIO = 0.4;
const MOBILE_RADIUS_RATIO = 0.6;

type Particle = {
  shape: Shape;
  color: string;
  size: number;
  angle: number;
  targetDistance: number;
  burstDuration: number;
  settleDuration: number;
  fadeDuration: number;
  startDelay: number;
  rotSpeed: number;
  rotation: number;
  wobbleFreqX: number;
  wobbleFreqY: number;
  wobblePhaseX: number;
  wobblePhaseY: number;
  wobbleAmp: number;
  x: number;
  y: number;
  opacity: number;
};

function createParticles(count: number, maxRadius: number): Particle[] {
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    // sqrt(random) trải đều theo DIỆN TÍCH (không dồn cụm ở giữa) để hạt
    // phủ toàn màn hình, kể cả các góc xa tâm.
    const targetDistance = maxRadius * (0.15 + 0.85 * Math.sqrt(Math.random()));

    return {
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 3 + Math.random() * 5,
      angle,
      targetDistance,
      burstDuration: 600 + Math.random() * 300,
      settleDuration: 1000 + Math.random() * 1000,
      fadeDuration: 1000 + Math.random() * 500,
      startDelay: Math.random() * 80,
      rotSpeed: (Math.random() - 0.5) * 6,
      rotation: Math.random() * Math.PI * 2,
      wobbleFreqX: 1.5 + Math.random() * 1.5,
      wobbleFreqY: 1.5 + Math.random() * 1.5,
      wobblePhaseX: Math.random() * Math.PI * 2,
      wobblePhaseY: Math.random() * Math.PI * 2,
      wobbleAmp: 3 + Math.random() * 4,
      x: 0,
      y: 0,
      opacity: 1,
    };
  });
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function drawStar(ctx: CanvasRenderingContext2D, size: number) {
  const spikes = 5;
  const outer = size * 0.9;
  const inner = outer * 0.45;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / spikes) * i - Math.PI / 2;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, cx: number, cy: number) {
  if (p.opacity <= 0) return;

  ctx.save();
  ctx.globalAlpha = p.opacity;
  ctx.translate(cx + p.x, cy + p.y);
  ctx.rotate(p.rotation);
  ctx.fillStyle = p.color;

  if (p.shape === "dot") {
    ctx.beginPath();
    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.shape === "star") {
    drawStar(ctx, p.size);
  } else {
    // hình xoắn: dải mảnh xoay liên tục mô phỏng dải ruy băng vặn xoắn
    ctx.fillRect(-p.size * 1.2, -p.size * 0.3, p.size * 2.4, p.size * 0.6);
  }

  ctx.restore();
}

export default function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const isMobile = width < MOBILE_BREAKPOINT;
    const diagonal = Math.hypot(width, height);
    const maxRadius = (diagonal / 2) * (isMobile ? MOBILE_RADIUS_RATIO : 1);
    const count = Math.round(DESKTOP_COUNT * (isMobile ? MOBILE_COUNT_RATIO : 1));

    const particles = createParticles(count, maxRadius);
    const cx = width / 2;
    const cy = height / 2;

    let rafId = 0;
    let start: number | null = null;
    let last: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      if (last === null) last = now;
      const dt = (now - last) / 1000;
      last = now;
      const elapsed = now - start;

      ctx.clearRect(0, 0, width, height);
      let aliveCount = 0;

      for (const p of particles) {
        const t = elapsed - p.startDelay;
        if (t < 0) {
          aliveCount++;
          continue;
        }

        const burstEnd = p.burstDuration;
        const settleEnd = burstEnd + p.settleDuration;
        const fadeEnd = settleEnd + p.fadeDuration;

        if (t <= burstEnd) {
          const progress = easeOutCubic(Math.min(t / burstEnd, 1));
          const dist = p.targetDistance * progress;
          p.x = Math.cos(p.angle) * dist;
          p.y = Math.sin(p.angle) * dist;
          p.opacity = 1;
          aliveCount++;
        } else if (t <= settleEnd) {
          const settleT = (t - burstEnd) / 1000;
          const wobbleX = Math.sin(settleT * p.wobbleFreqX + p.wobblePhaseX) * p.wobbleAmp;
          const wobbleY = Math.cos(settleT * p.wobbleFreqY + p.wobblePhaseY) * p.wobbleAmp;
          p.x = Math.cos(p.angle) * p.targetDistance + wobbleX;
          p.y = Math.sin(p.angle) * p.targetDistance + wobbleY;
          p.opacity = 1;
          aliveCount++;
        } else if (t <= fadeEnd) {
          const fadeT = (t - settleEnd) / p.fadeDuration;
          p.opacity = Math.max(0, 1 - fadeT);
          aliveCount++;
        } else {
          p.opacity = 0;
        }

        p.rotation += p.rotSpeed * dt;
        drawParticle(ctx, p, cx, cy);
      }

      if (aliveCount > 0) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  if (done) return null;

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-40" aria-hidden />;
}
