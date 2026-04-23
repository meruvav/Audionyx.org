import { useEffect, useRef } from 'react';

export default function MouseTrailCanvas() {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return undefined;
    }

    let active = false;

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = Math.max(window.innerHeight * 0.74, 620) * ratio;
      canvas.style.width = '100%';
      canvas.style.height = `${Math.max(window.innerHeight * 0.74, 620)}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      redraw();
    }

    function redraw() {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'rgba(4, 14, 24, 0.96)';
      context.fillRect(0, 0, width, height);

      if (pointsRef.current.length < 2) {
        return;
      }

      context.lineCap = 'round';
      context.lineJoin = 'round';

      for (let i = 1; i < pointsRef.current.length; i += 1) {
        const start = pointsRef.current[i - 1];
        const end = pointsRef.current[i];
        context.beginPath();
        context.strokeStyle = `hsla(${(i * 11) % 360}, 92%, 70%, 0.78)`;
        context.lineWidth = 1 + (i / pointsRef.current.length) * 4;
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();
      }
    }

    function addPoint(event) {
      if (!active) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      pointsRef.current.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
      if (pointsRef.current.length > 1400) {
        pointsRef.current.shift();
      }
      redraw();
    }

    function enter() {
      active = true;
    }

    function leave() {
      active = false;
    }

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mouseenter', enter);
    canvas.addEventListener('mouseleave', leave);
    canvas.addEventListener('mousemove', addPoint);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mouseenter', enter);
      canvas.removeEventListener('mouseleave', leave);
      canvas.removeEventListener('mousemove', addPoint);
    };
  }, []);

  return <canvas ref={canvasRef} className="experiment-canvas" />;
}
