import { useEffect, useRef } from 'react';

export default function ParticleOverlay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return undefined;
    }

    const particles = Array.from({ length: 38 }, () => ({
      angle: Math.random() * Math.PI * 2,
      distance: 20 + Math.random() * 180,
      speed: 0.002 + Math.random() * 0.005,
      size: 1 + Math.random() * 3,
      x: 0,
      y: 0,
    }));

    let animationId = 0;
    let mouseX = window.innerWidth * 0.5;
    let mouseY = window.innerHeight * 0.3;

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function handlePointerMove(event) {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }

    function render() {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((particle, index) => {
        particle.angle += particle.speed;
        particle.x += ((mouseX + Math.cos(particle.angle + index) * particle.distance) - particle.x) * 0.08;
        particle.y += ((mouseY + Math.sin(particle.angle - index) * particle.distance * 0.48) - particle.y) * 0.08;

        context.beginPath();
        context.fillStyle = index % 2 === 0 ? 'rgba(110, 183, 238, 0.55)' : 'rgba(126, 255, 221, 0.42)';
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      animationId = window.requestAnimationFrame(render);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove);
    animationId = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-overlay" aria-hidden="true" />;
}
