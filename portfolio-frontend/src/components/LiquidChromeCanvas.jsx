import { useEffect, useRef } from "react";

export default function LiquidChromeCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let time = 0;
    let mouse = { x: width * 0.7, y: height * 0.3, targetX: width * 0.7, targetY: height * 0.3 };
    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Universo de ondas de cromo líquido distribuidas en el espacio 3D (a lo largo de todo el scroll)
    const spatialRibbons = [
      // Zona 1: Hero & Encabezado (0 - 800px)
      { worldY: 180, depth: 0.85, amplitude: 50, speed: 0.005, frequency: 0.0016, thickness: 55, colorAlpha: 0.45 },
      { worldY: 420, depth: 0.45, amplitude: 70, speed: 0.0035, frequency: 0.0012, thickness: 80, colorAlpha: 0.25 },
      { worldY: 700, depth: 1.1, amplitude: 60, speed: 0.006, frequency: 0.0018, thickness: 60, colorAlpha: 0.5 },

      // Zona 2: Proyectos (900 - 1800px)
      { worldY: 1050, depth: 0.6, amplitude: 65, speed: 0.004, frequency: 0.0014, thickness: 70, colorAlpha: 0.35 },
      { worldY: 1400, depth: 0.9, amplitude: 80, speed: 0.0055, frequency: 0.0015, thickness: 65, colorAlpha: 0.45 },
      { worldY: 1750, depth: 0.35, amplitude: 55, speed: 0.003, frequency: 0.0011, thickness: 90, colorAlpha: 0.2 },

      // Zona 3: Experiencia (1900 - 2700px)
      { worldY: 2100, depth: 0.8, amplitude: 75, speed: 0.0048, frequency: 0.0016, thickness: 70, colorAlpha: 0.4 },
      { worldY: 2450, depth: 0.5, amplitude: 60, speed: 0.0038, frequency: 0.0013, thickness: 75, colorAlpha: 0.28 },
      { worldY: 2800, depth: 1.05, amplitude: 85, speed: 0.0065, frequency: 0.0017, thickness: 60, colorAlpha: 0.48 },

      // Zona 4: Skills, Educación & Footer (2900 - 4200px)
      { worldY: 3150, depth: 0.7, amplitude: 70, speed: 0.0042, frequency: 0.0014, thickness: 65, colorAlpha: 0.35 },
      { worldY: 3550, depth: 0.4, amplitude: 55, speed: 0.0032, frequency: 0.0012, thickness: 85, colorAlpha: 0.22 },
      { worldY: 3950, depth: 0.95, amplitude: 80, speed: 0.0058, frequency: 0.0015, thickness: 70, colorAlpha: 0.42 },
      { worldY: 4350, depth: 0.6, amplitude: 65, speed: 0.004, frequency: 0.0013, thickness: 75, colorAlpha: 0.3 },
    ];

    // Micro-partículas metálicas en suspensión 3D en el vacío
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      worldY: Math.random() * 4500,
      depth: 0.3 + Math.random() * 0.9,
      size: 1 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.6,
      speed: 0.2 + Math.random() * 0.5,
    }));

    const render = () => {
      time += 1;

      // Suavizado del scroll para sensación de flotación espacial inercial
      scrollY += (targetScrollY - scrollY) * 0.08;

      mouse.x += (mouse.targetX - mouse.x) * 0.025;
      mouse.y += (mouse.targetY - mouse.y) * 0.025;

      // Fondo ónix ultra profundo
      ctx.fillStyle = "#030304";
      ctx.fillRect(0, 0, width, height);

      // Spotlight dinámico que acompaña levemente el viewport
      const spotlight = ctx.createRadialGradient(
        width * 0.5,
        -80,
        40,
        width * 0.5,
        height * 0.6,
        width * 0.8
      );
      spotlight.addColorStop(0, "rgba(255, 255, 255, 0.04)");
      spotlight.addColorStop(0.6, "rgba(255, 255, 255, 0.008)");
      spotlight.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = spotlight;
      ctx.fillRect(0, 0, width, height);

      // Dibujar micro-partículas metálicas en profundidad
      particles.forEach((p) => {
        const screenY = p.worldY - scrollY * p.depth + Math.sin(time * 0.01 * p.speed + p.x) * 15;
        if (screenY >= -20 && screenY <= height + 20) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, screenY, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * p.depth})`;
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 4;
          ctx.fill();
          ctx.restore();
        }
      });

      // Dibujar cintas espaciales de cromo líquido a diferentes profundidades
      spatialRibbons.forEach((ribbon, index) => {
        // Cálculo de posición en pantalla según la profundidad 3D
        const currentBaseY = ribbon.worldY - scrollY * ribbon.depth;

        // Descarte de rendimiento (Culling): Si la onda está fuera de la pantalla, no procesar
        if (currentBaseY < -ribbon.thickness - 150 || currentBaseY > height + ribbon.thickness + 150) {
          return;
        }

        ctx.save();
        ctx.beginPath();

        const step = 7;
        const points = [];

        for (let x = -60; x <= width + 60; x += step) {
          const distToMouse = Math.hypot(x - mouse.x, currentBaseY - mouse.y);
          const mouseInfluence = Math.max(0, 1 - distToMouse / 450) * (20 * ribbon.depth);

          const wave1 = Math.sin(x * ribbon.frequency + time * ribbon.speed + index * 1.8) * ribbon.amplitude;
          const wave2 = Math.cos(x * ribbon.frequency * 1.5 - time * ribbon.speed * 0.7) * (ribbon.amplitude * 0.35);

          const y = currentBaseY + wave1 + wave2 + mouseInfluence;
          points.push({ x, y });
        }

        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

        for (let i = points.length - 1; i >= 0; i--) {
          const p = points[i];
          const thicknessMod = Math.sin(p.x * 0.002 + time * 0.004) * 12 + ribbon.thickness;
          ctx.lineTo(p.x, p.y + thicknessMod);
        }
        ctx.closePath();

        // Gradiente metálico oscuro con brillo proporcional a la cercanía 3D
        const grad = ctx.createLinearGradient(0, currentBaseY - 20, 0, currentBaseY + ribbon.thickness + 20);
        grad.addColorStop(0, "rgba(3, 3, 5, 0.95)");
        grad.addColorStop(0.2, `rgba(18, 20, 28, ${0.4 * ribbon.depth})`);
        grad.addColorStop(0.46, `rgba(60, 68, 85, ${0.2 * ribbon.depth})`);
        grad.addColorStop(0.52, `rgba(200, 215, 235, ${ribbon.colorAlpha})`); // Reflejo plateado
        grad.addColorStop(0.62, `rgba(30, 35, 45, ${0.25 * ribbon.depth})`);
        grad.addColorStop(0.88, "rgba(8, 10, 14, 0.7)");
        grad.addColorStop(1, "rgba(3, 3, 4, 0.98)");

        ctx.fillStyle = grad;
        ctx.fill();

        // Cresta especular fina de luz de cromo
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.35 * ribbon.depth})`;
        ctx.lineWidth = 1;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 5 * ribbon.depth;
        ctx.stroke();

        ctx.restore();
      });

      // Viñeta oscura central para legibilidad perfecta del texto
      const centerVignette = ctx.createRadialGradient(
        width * 0.48,
        height * 0.48,
        140,
        width * 0.48,
        height * 0.48,
        width * 0.75
      );
      centerVignette.addColorStop(0, "rgba(3, 3, 4, 0.7)");
      centerVignette.addColorStop(0.6, "rgba(3, 3, 4, 0.35)");
      centerVignette.addColorStop(1, "rgba(3, 3, 4, 0)");
      ctx.fillStyle = centerVignette;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 select-none"
    />
  );
}
