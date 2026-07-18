import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScribblePadProps {
  backgroundColor?: string;
  colors?: string[];
  strokeWidths?: number[];
  defaultStrokeWidth?: number;
  defaultStrokeColor?: string;
  borderRadius?: string;
  wiggle?: { enable: boolean; movement: number; speed: number };
  width?: string;
  height?: string;
}

interface StrokeData {
  points: { x: number; y: number; t: number }[];
  color: string;
  strokeWidth: number;
  canvasWidth: number;
  canvasHeight: number;
}

const ScribblePad: React.FC<ScribblePadProps> = ({
  backgroundColor = '#1a1a1a',
  colors = ['#FF6B6B', '#FFA94D', '#69DB7C', '#4DABF7', '#CC5DE8'],
  strokeWidths = [4, 8, 12, 16, 20],
  defaultStrokeWidth = 8,
  defaultStrokeColor = '#4DABF7',
  borderRadius = '16px',
  wiggle = { enable: true, movement: 0.65, speed: 2 },
  width = '100%',
  height = '400px',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const [color, setColor] = useState(colors[0] || defaultStrokeColor);
  const [strokeWidth, setStrokeWidth] = useState(strokeWidths[0] || defaultStrokeWidth);
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [showStrokePanel, setShowStrokePanel] = useState(false);

  const isDrawingRef = useRef(false);
  const pointsRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const allStrokesRef = useRef<StrokeData[]>([]);
  const startTimeRef = useRef(0);
  const turbulenceTimeRef = useRef(0);
  const animationIdRef = useRef<number | null>(null);

  const colorRef = useRef(color);
  const strokeWidthRef = useRef(strokeWidth);
  const wiggleRef = useRef(wiggle);

  useEffect(() => { colorRef.current = color; }, [color]);
  useEffect(() => { strokeWidthRef.current = strokeWidth; }, [strokeWidth]);
  useEffect(() => { wiggleRef.current = wiggle; }, [wiggle]);

  const applyTurbulence = useCallback((x: number, y: number, t: number) => {
    if (!wiggleRef.current.enable) return { x, y };
    const amount = wiggleRef.current.movement * 2;
    if (amount <= 0) return { x, y };
    const frequency = 0.5;
    const offsetX = Math.sin(x * frequency + t * 0.01) * Math.sin(y * frequency * 0.5 + t * 0.02) * amount;
    const offsetY = Math.sin(y * frequency + t * 0.015) * Math.sin(x * frequency * 0.5 + t * 0.025) * amount;
    return { x: x + offsetX, y: y + offsetY };
  }, []);

  const redrawAllStrokes = useCallback(() => {
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);
    const t = turbulenceTimeRef.current;

    for (const stroke of allStrokesRef.current) {
      let scaleX = 1, scaleY = 1, offsetX = 0, offsetY = 0;
      if (stroke.canvasWidth && stroke.canvasHeight) {
        const scale = Math.min(w / stroke.canvasWidth, h / stroke.canvasHeight);
        scaleX = scale;
        scaleY = scale;
        offsetX = (w - stroke.canvasWidth * scale) / 2;
        offsetY = (h - stroke.canvasHeight * scale) / 2;
      }
      ctx.save();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.strokeWidth * scaleX;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.points.length === 1) {
        ctx.fillStyle = stroke.color;
        ctx.beginPath();
        const pt = stroke.points[0];
        const sx = pt.x * scaleX + offsetX;
        const sy = pt.y * scaleY + offsetY;
        const turb = applyTurbulence(sx, sy, t);
        ctx.arc(turb.x, turb.y, stroke.strokeWidth * scaleX / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (stroke.points.length > 1) {
        ctx.beginPath();
        const first = stroke.points[0];
        const fs = applyTurbulence(first.x * scaleX + offsetX, first.y * scaleY + offsetY, t);
        ctx.moveTo(fs.x, fs.y);
        for (let i = 1; i < stroke.points.length; i++) {
          const pt = stroke.points[i];
          const turb = applyTurbulence(pt.x * scaleX + offsetX, pt.y * scaleY + offsetY, t);
          ctx.lineTo(turb.x, turb.y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  }, [applyTurbulence]);

  const redrawCurrentStroke = useCallback(() => {
    redrawAllStrokes();
    const ctx = contextRef.current;
    if (!ctx || pointsRef.current.length === 0) return;
    const currentColor = colorRef.current;
    const currentWidth = strokeWidthRef.current;
    const t = turbulenceTimeRef.current;

    if (pointsRef.current.length === 1) {
      ctx.save();
      ctx.fillStyle = currentColor;
      ctx.beginPath();
      const pt = pointsRef.current[0];
      const turb = applyTurbulence(pt.x, pt.y, t);
      ctx.arc(turb.x, turb.y, currentWidth / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const first = pointsRef.current[0];
    const fs = applyTurbulence(first.x, first.y, t);
    ctx.moveTo(fs.x, fs.y);
    for (let i = 1; i < pointsRef.current.length; i++) {
      const pt = pointsRef.current[i];
      const turb = applyTurbulence(pt.x, pt.y, t);
      ctx.lineTo(turb.x, turb.y);
    }
    ctx.stroke();
    ctx.restore();
  }, [applyTurbulence, redrawAllStrokes]);

  // Initialize canvas
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    contextRef.current = ctx;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resizeCanvas = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      redrawAllStrokes();
    };
    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [redrawAllStrokes]);

  const getCoordinates = useCallback((event: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return { x: 0, y: 0 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = container.getBoundingClientRect();
    const rectW = container.clientWidth || 1;
    const rectH = container.clientHeight || 1;

    const toCanvasCssX = (clientX: number) => (clientX - rect.left) * canvas.width / rectW / dpr;
    const toCanvasCssY = (clientY: number) => (clientY - rect.top) * canvas.height / rectH / dpr;

    if ('touches' in event && event.touches.length > 0) {
      return { x: toCanvasCssX(event.touches[0].clientX), y: toCanvasCssY(event.touches[0].clientY) };
    }
    if ('clientX' in event) {
      return { x: toCanvasCssX(event.clientX), y: toCanvasCssY(event.clientY) };
    }
    return { x: 0, y: 0 };
  }, []);

  const startDrawing = useCallback((event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    pointsRef.current = [];
    startTimeRef.current = Date.now();
    const coords = getCoordinates(event);
    pointsRef.current.push({ ...coords, t: 0 });
    const ctx = contextRef.current;
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }
    isDrawingRef.current = true;
  }, [getCoordinates]);

  const draw = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDrawingRef.current) return;
    event.preventDefault();
    const coords = getCoordinates(event);
    const t = Date.now() - startTimeRef.current;
    pointsRef.current.push({ ...coords, t });
    redrawCurrentStroke();
  }, [getCoordinates, redrawCurrentStroke]);

  const finishDrawing = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (pointsRef.current.length > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr || 1;
      const h = canvas.height / dpr || 1;
      allStrokesRef.current.push({
        points: [...pointsRef.current],
        color: colorRef.current,
        strokeWidth: strokeWidthRef.current,
        canvasWidth: w,
        canvasHeight: h,
      });
    }
    redrawAllStrokes();
  }, [redrawAllStrokes]);

  const clearCanvas = useCallback(() => {
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);
    pointsRef.current = [];
    allStrokesRef.current = [];
  }, []);

  // Event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleMouseDown = (e: MouseEvent) => startDrawing(e);
    const handleMouseMove = (e: MouseEvent) => draw(e);
    const handleMouseUp = () => finishDrawing();
    const handleMouseLeave = () => finishDrawing();
    const handleTouchStart = (e: TouchEvent) => { e.preventDefault(); startDrawing(e); };
    const handleTouchMove = (e: TouchEvent) => { e.preventDefault(); draw(e); };
    const handleTouchEnd = (e: TouchEvent) => { e.preventDefault(); finishDrawing(); };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startDrawing, draw, finishDrawing]);

  // Wiggle animation
  useEffect(() => {
    const animate = () => {
      if (wiggleRef.current.enable) {
        turbulenceTimeRef.current += wiggleRef.current.speed;
        if (allStrokesRef.current.length > 0 || isDrawingRef.current) {
          if (isDrawingRef.current) {
            redrawCurrentStroke();
          } else {
            redrawAllStrokes();
          }
        }
      }
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animationIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [redrawAllStrokes, redrawCurrentStroke]);

  const showControls = () => {
    setShowColorPanel(false);
    setShowStrokePanel(false);
  };

  const transition = { type: 'tween' as const, ease: [0.44, 0, 0, 1] as [number, number, number, number], duration: 0.25 };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius,
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          cursor: 'crosshair',
          touchAction: 'none',
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />

      {/* Clear Button */}
      <AnimatePresence initial={false}>
        {!(showColorPanel || showStrokePanel) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={transition}
            onClick={clearCanvas}
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              display: 'flex',
              alignItems: 'center',
              padding: '6px 14px',
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: '"Inter", "Outfit", sans-serif',
              fontSize: 14,
              fontWeight: 500,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '19px',
              userSelect: 'none',
              transition: 'background-color 0.2s, color 0.2s',
            }}
            whileHover={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            Clear
          </motion.button>
        )}
      </AnimatePresence>

      {/* Stroke Width & Color Selector */}
      <AnimatePresence initial={false}>
        {!(showColorPanel || showStrokePanel) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={transition}
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              height: 38,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <motion.div
              style={{ display: 'flex', gap: 12, alignItems: 'center' }}
              initial={{ filter: 'blur(4px)' }}
              animate={{ filter: 'blur(0px)' }}
              exit={{ filter: 'blur(4px)' }}
              transition={transition}
            >
              {/* Stroke Width Button */}
              <motion.div
                onClick={() => { setShowStrokePanel(true); setShowColorPanel(false); }}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  style={{
                    width: Math.max(strokeWidth * 0.7, 4),
                    height: Math.max(strokeWidth * 0.7, 4),
                    backgroundColor: '#666',
                    borderRadius: '50%',
                  }}
                />
              </motion.div>

              {/* Color Button */}
              <motion.div
                onClick={() => { setShowColorPanel(true); setShowStrokePanel(false); }}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    backgroundColor: color,
                    boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Color Picker Panel */}
      <AnimatePresence initial={false}>
        {showColorPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              minHeight: 38,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            {colors.map((c, index) => (
              <motion.div
                key={c}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { ...transition, delay: index * 0.04 } }}
                exit={{ opacity: 0, y: 30, transition: { duration: 0.1 } }}
                onClick={() => { setColor(c); showControls(); }}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    backgroundColor: c,
                    boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </motion.div>
            ))}
            {/* Close button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { ...transition, delay: colors.length * 0.04 } }}
              exit={{ opacity: 0, y: 30, transition: { duration: 0.1 } }}
              onClick={showControls}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 8L12.5 3.5M8 8L3.5 3.5M8 8L3.5 12.5M8 8L12.5 12.5" stroke="white" strokeOpacity={0.5} strokeWidth={2.5} strokeLinecap="round" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stroke Width Panel */}
      <AnimatePresence initial={false}>
        {showStrokePanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            {strokeWidths.map((w, index) => (
              <motion.div
                key={w}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { ...transition, delay: index * 0.04 } }}
                exit={{ opacity: 0, y: 30, transition: { duration: 0.1 } }}
                onClick={() => { setStrokeWidth(w); showControls(); }}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  style={{
                    width: Math.max(w * 0.7, 3),
                    height: Math.max(w * 0.7, 3),
                    backgroundColor: '#666',
                    borderRadius: '50%',
                  }}
                />
              </motion.div>
            ))}
            {/* Close button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { ...transition, delay: strokeWidths.length * 0.04 } }}
              exit={{ opacity: 0, y: 30, transition: { duration: 0.1 } }}
              onClick={showControls}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 8L12.5 3.5M8 8L3.5 3.5M8 8L3.5 12.5M8 8L12.5 12.5" stroke="white" strokeOpacity={0.5} strokeWidth={2.5} strokeLinecap="round" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScribblePad;
