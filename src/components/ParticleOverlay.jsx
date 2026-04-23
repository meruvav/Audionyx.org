import { useEffect, useRef } from 'react';

export default function ParticleOverlay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return undefined;
    }

    const starField = Array.from({ length: 220 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: 0.4 + Math.random() * 2.8,
      alpha: 0.16 + Math.random() * 0.84,
      drift: 0.02 + Math.random() * 0.18,
      tint: Math.random() > 0.86 ? 'warm' : Math.random() > 0.72 ? 'blue' : 'white',
    }));

    const dustNodes = Array.from({ length: 40 }, (_, index) => ({
      x: 0.1 + (index / 39) * 0.8 + (Math.random() - 0.5) * 0.05,
      y: 0.34 + Math.sin(index * 0.42) * 0.11 + (Math.random() - 0.5) * 0.06,
      radius: 90 + Math.random() * 180,
      blur: 0.16 + Math.random() * 0.34,
      hue: index % 3 === 0 ? 'rgba(121, 124, 255, 0.16)' : index % 3 === 1 ? 'rgba(255, 97, 198, 0.14)' : 'rgba(102, 214, 255, 0.13)',
    }));

    let animationId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let pointerX = width * 0.5;
    let pointerY = height * 0.4;
    let sceneShiftX = 0;
    let sceneShiftY = 0;
    let time = 0;

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function handlePointerMove(event) {
      pointerX = event.clientX;
      pointerY = event.clientY;
    }

    function drawNebula(cx, cy, radius, color, alphaMultiplier) {
      const gradient = context.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, color.replace(/0?\.\d+\)/, `${alphaMultiplier})`));
      gradient.addColorStop(0.35, color.replace(/0?\.\d+\)/, `${alphaMultiplier * 0.42})`));
      gradient.addColorStop(1, color.replace(/0?\.\d+\)/, '0)'));
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.fill();
    }

    function drawMilkyWayBand() {
      context.save();
      context.translate(width * 0.5 + sceneShiftX * 10, height * 0.44 + sceneShiftY * 8);
      context.rotate(-0.38);

      const band = context.createLinearGradient(-width * 0.55, 0, width * 0.55, 0);
      band.addColorStop(0, 'rgba(40, 72, 160, 0)');
      band.addColorStop(0.25, 'rgba(127, 86, 255, 0.1)');
      band.addColorStop(0.5, 'rgba(255, 221, 182, 0.22)');
      band.addColorStop(0.72, 'rgba(96, 201, 255, 0.1)');
      band.addColorStop(1, 'rgba(40, 72, 160, 0)');

      context.fillStyle = band;
      context.filter = 'blur(18px)';
      context.fillRect(-width * 0.62, -height * 0.1, width * 1.24, height * 0.22);

      context.filter = 'blur(42px)';
      context.fillStyle = 'rgba(255, 242, 202, 0.12)';
      context.fillRect(-width * 0.42, -height * 0.05, width * 0.84, height * 0.1);
      context.restore();
      context.filter = 'none';
    }

    function starColor(star, glow) {
      if (star.tint === 'warm') {
        return `rgba(255, 231, 190, ${glow})`;
      }
      if (star.tint === 'blue') {
        return `rgba(150, 218, 255, ${glow})`;
      }
      return `rgba(255, 255, 255, ${glow})`;
    }

    function render() {
      time += 0.0035;
      sceneShiftX += (((pointerX / width) - 0.5) * 24 - sceneShiftX) * 0.028;
      sceneShiftY += (((pointerY / height) - 0.5) * 18 - sceneShiftY) * 0.028;

      context.clearRect(0, 0, width, height);

      const sky = context.createLinearGradient(0, 0, width, height);
      sky.addColorStop(0, '#040511');
      sky.addColorStop(0.45, '#090b1f');
      sky.addColorStop(1, '#14051f');
      context.fillStyle = sky;
      context.fillRect(0, 0, width, height);

      drawNebula(width * 0.18 + sceneShiftX * 0.6, height * 0.2 + sceneShiftY * 0.3, width * 0.18, 'rgba(96, 142, 255, 0.2)', 0.2);
      drawNebula(width * 0.78 + sceneShiftX * -0.5, height * 0.18 + sceneShiftY * 0.4, width * 0.16, 'rgba(229, 87, 194, 0.16)', 0.16);
      drawNebula(width * 0.72 + sceneShiftX * -0.3, height * 0.72 + sceneShiftY * -0.2, width * 0.22, 'rgba(56, 136, 255, 0.14)', 0.14);

      drawMilkyWayBand();

      dustNodes.forEach((node, index) => {
        const pulse = 0.7 + Math.sin(time * 2.8 + index * 0.35) * 0.18;
        drawNebula(
          node.x * width + sceneShiftX * (0.25 + node.blur * 0.7),
          node.y * height + sceneShiftY * (0.18 + node.blur * 0.5),
          node.radius * pulse,
          node.hue,
          node.blur
        );
      });

      starField.forEach((star, index) => {
        const driftX = Math.sin(time * star.drift + index) * (3 + star.size * 2);
        const driftY = Math.cos(time * star.drift * 0.7 + index) * (2 + star.size);
        const x = star.x * width + sceneShiftX * (0.4 + star.size * 0.08) + driftX;
        const y = star.y * height + sceneShiftY * (0.25 + star.size * 0.05) + driftY;
        const twinkle = 0.45 + Math.sin(time * (2 + star.drift * 8) + index * 1.73) * 0.3;

        context.beginPath();
        context.fillStyle = starColor(star, Math.max(0.2, star.alpha * twinkle));
        context.arc(x, y, star.size, 0, Math.PI * 2);
        context.fill();

        if (star.size > 1.5) {
          context.beginPath();
          context.fillStyle = starColor(star, 0.08);
          context.arc(x, y, star.size * 4.5, 0, Math.PI * 2);
          context.fill();
        }
      });

      for (let index = 0; index < 3; index += 1) {
        const cometX = ((time * (55 + index * 13) * width) % (width * 1.4)) - width * 0.2;
        const cometY = height * (0.18 + index * 0.16) + Math.sin(time * (index + 2.5) * 1.4) * 24;
        const comet = context.createLinearGradient(cometX - 80, cometY - 20, cometX + 8, cometY + 4);
        comet.addColorStop(0, 'rgba(255,255,255,0)');
        comet.addColorStop(0.75, 'rgba(160,225,255,0.05)');
        comet.addColorStop(1, 'rgba(255,255,255,0.8)');
        context.strokeStyle = comet;
        context.lineWidth = 1.2;
        context.beginPath();
        context.moveTo(cometX - 70, cometY - 12);
        context.lineTo(cometX, cometY);
        context.stroke();
      }

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
