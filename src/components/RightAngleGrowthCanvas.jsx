import { useEffect, useRef, useState } from 'react';

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

export default function RightAngleGrowthCanvas() {
  const canvasRef = useRef(null);
  const bubblesRef = useRef([]);
  const rafRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, inside: false });
  const [bubbleCount, setBubbleCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return undefined;
    }

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      const height = Math.max(window.innerHeight * 0.74, 620);
      canvas.width = window.innerWidth * ratio;
      canvas.height = height * ratio;
      canvas.style.width = '100%';
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function spawnBubble(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const radius = randomBetween(14, 54);
      const hue = 180 + Math.random() * 120;

      bubblesRef.current.push({
        x: x + randomBetween(-18, 18),
        y: y + randomBetween(-18, 18),
        radius,
        lineWidth: randomBetween(1.2, 3.6),
        hue,
        alpha: randomBetween(0.28, 0.7),
        driftX: randomBetween(-0.4, 0.4),
        driftY: randomBetween(-0.8, -0.08),
        pulse: randomBetween(0.4, 1.6),
        pulseSpeed: randomBetween(0.008, 0.024),
      });

      if (bubblesRef.current.length > 420) {
        bubblesRef.current.splice(0, bubblesRef.current.length - 420);
      }

      setBubbleCount(bubblesRef.current.length);
    }

    function draw() {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'rgba(4, 12, 20, 0.96)';
      context.fillRect(0, 0, width, height);

      context.save();
      context.fillStyle = 'rgba(124, 232, 255, 0.08)';
      context.beginPath();
      context.arc(pointerRef.current.x, pointerRef.current.y, 72, 0, Math.PI * 2);
      context.fill();
      context.restore();

      bubblesRef.current.forEach((bubble, index) => {
        bubble.x += bubble.driftX;
        bubble.y += bubble.driftY;
        bubble.pulse += bubble.pulseSpeed;

        const wobbleRadius = bubble.radius + Math.sin(bubble.pulse) * 4;

        if (bubble.y + wobbleRadius < -40) {
          bubble.y = height + wobbleRadius;
        }
        if (bubble.x - wobbleRadius > width + 40) {
          bubble.x = -wobbleRadius;
        }
        if (bubble.x + wobbleRadius < -40) {
          bubble.x = width + wobbleRadius;
        }

        context.beginPath();
        context.strokeStyle = `hsla(${(bubble.hue + index * 2) % 360}, 90%, 72%, ${bubble.alpha})`;
        context.fillStyle = `hsla(${bubble.hue}, 92%, 60%, ${bubble.alpha * 0.12})`;
        context.lineWidth = bubble.lineWidth;
        context.arc(bubble.x, bubble.y, wobbleRadius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
      });

      rafRef.current = window.requestAnimationFrame(draw);
    }

    function handlePointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        inside: true,
      };

      const spawnTotal = 1 + Math.floor(Math.random() * 3);
      for (let index = 0; index < spawnTotal; index += 1) {
        spawnBubble(event.clientX, event.clientY);
      }
    }

    function handlePointerLeave() {
      pointerRef.current.inside = false;
    }

    resize();
    rafRef.current = window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  function handleClear() {
    bubblesRef.current = [];
    setBubbleCount(0);
  }

  return (
    <>
      <div className="experiment-toolbar">
        <p className="experiment-note">
          Move your mouse across the canvas to auto-generate random bubbles. They will keep accumulating until you clear them.
        </p>
        <button type="button" className="button-link experiment-clear" onClick={handleClear}>
          Clear bubbles
        </button>
      </div>
      <canvas ref={canvasRef} className="experiment-canvas" />
      <p className="experiment-note">Active bubbles: {bubbleCount}</p>
    </>
  );
}
