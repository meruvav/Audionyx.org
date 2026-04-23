import { useEffect, useRef, useState } from 'react';

function stepSegments(segments, width) {
  const next = [];
  segments.forEach((segment) => {
    const dx = segment.x2 - segment.x1;
    const dy = segment.y2 - segment.y1;
    const x = segment.x2 + 18;
    const y = segment.y2;
    next.push({ x1: x, y1: y, x2: x - dy, y2: y + dx });
    next.push({ x1: x, y1: y, x2: x + dy, y2: y - dx });
  });

  return next.filter((segment) => segment.x1 < width + 120 && segment.x2 < width + 160);
}

export default function RightAngleGrowthCanvas() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const segmentsRef = useRef([]);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return undefined;
    }

    let generation = 0;

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = Math.max(window.innerHeight * 0.74, 620) * ratio;
      canvas.style.width = '100%';
      canvas.style.height = `${Math.max(window.innerHeight * 0.74, 620)}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (!segmentsRef.current.length) {
        segmentsRef.current = [
          { x1: 120, y1: canvas.height / ratio / 2 - 80, x2: 120, y2: canvas.height / ratio / 2 + 80 },
          { x1: 120, y1: canvas.height / ratio / 2, x2: 240, y2: canvas.height / ratio / 2 },
        ];
      }
      draw();
    }

    function draw() {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'rgba(4, 12, 20, 0.98)';
      context.fillRect(0, 0, width, height);
      context.lineCap = 'round';

      segmentsRef.current.forEach((segment, index) => {
        context.beginPath();
        context.strokeStyle = `hsla(${(generation * 32 + index * 7) % 360}, 85%, 68%, 0.76)`;
        context.lineWidth = Math.max(1, 4 - generation * 0.22);
        context.moveTo(segment.x1, segment.y1);
        context.lineTo(segment.x2, segment.y2);
        context.stroke();
      });
    }

    function tick() {
      if (!running) {
        return;
      }
      const width = canvas.width / (window.devicePixelRatio || 1);
      segmentsRef.current = stepSegments(segmentsRef.current, width);
      generation += 1;
      draw();
      if (segmentsRef.current.length && generation < 12) {
        animationRef.current = window.setTimeout(tick, 420);
      }
    }

    function handleClick() {
      setRunning(false);
      if (animationRef.current) {
        window.clearTimeout(animationRef.current);
      }
    }

    resize();
    draw();
    animationRef.current = window.setTimeout(tick, 300);
    window.addEventListener('resize', resize);
    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleClick);
      if (animationRef.current) {
        window.clearTimeout(animationRef.current);
      }
    };
  }, [running]);

  return (
    <>
      <canvas ref={canvasRef} className="experiment-canvas" />
      <p className="experiment-note">{running ? 'Click anywhere on the canvas to stop the 90-degree growth.' : 'Growth stopped. Refresh to restart.'}</p>
    </>
  );
}
