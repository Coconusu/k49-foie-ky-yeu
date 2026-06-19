"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export type SignaturePadHandle = {
  isEmpty: () => boolean;
  toDataURL: () => string;
  clear: () => void;
};

type Point = { x: number; y: number };

const SignaturePad = forwardRef<
  SignaturePadHandle,
  { onChangeEmpty?: (isEmpty: boolean) => void }
>(function SignaturePad({ onChangeEmpty }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const hasDrawnRef = useRef(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const updateEmpty = (value: boolean) => {
    hasDrawnRef.current = !value;
    setIsEmpty(value);
    onChangeEmpty?.(value);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setupCanvas = () => {
      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(ratio, ratio);
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#0b1e3f";
      }
    };

    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    return () => window.removeEventListener("resize", setupCanvas);
  }, []);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawingRef.current = true;
    lastPointRef.current = getPoint(event);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    const last = lastPointRef.current;
    if (!ctx || !last) return;

    const point = getPoint(event);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;

    if (!hasDrawnRef.current) updateEmpty(false);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  useImperativeHandle(ref, () => ({
    isEmpty: () => !hasDrawnRef.current,
    toDataURL: () => canvasRef.current?.toDataURL("image/png") ?? "",
    clear: () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      updateEmpty(true);
    },
  }));

  return (
    <div>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
        className="h-40 w-full touch-none rounded-2xl bg-white"
      />
      {isEmpty && (
        <p className="mt-1 text-center font-be-vietnam text-xs text-white/50">
          Ký tên vào khung phía trên
        </p>
      )}
    </div>
  );
});

export default SignaturePad;
