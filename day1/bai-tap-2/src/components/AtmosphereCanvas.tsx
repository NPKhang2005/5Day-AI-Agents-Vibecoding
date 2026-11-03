import React, { useEffect, useRef } from 'react';
import { SnowflakeParticle, BalloonParticle, AtmosphereConfig, SnowflakeColorScheme } from '../types/atmosphere';

interface AtmosphereCanvasProps {
  snowflakesActive: boolean;
  balloonsActive: boolean;
  config: AtmosphereConfig;
  onParticleStatsUpdate?: (snowCount: number, balloonCount: number) => void;
}

// Special high-contrast, vivid snowflake color profiles
export const SNOWFLAKE_PALETTES: Record<
  SnowflakeColorScheme,
  { label: string; primary: string; core: string; accent: string; glow: string }
> = {
  sapphire: {
    label: 'Royal Sapphire Ice',
    primary: '#0284C7', // Vivid sky/sapphire blue - stands out strikingly on light & dark
    core: '#38BDF8',
    accent: '#0369A1',
    glow: 'rgba(2, 132, 199, 0.45)',
  },
  cyan: {
    label: 'Aurora Cyan Frost',
    primary: '#0D9488', // Deep teal-cyan
    core: '#2DD4BF',
    accent: '#0F766E',
    glow: 'rgba(13, 148, 136, 0.5)',
  },
  amethyst: {
    label: 'Amethyst Crystal',
    primary: '#7C3AED', // Regal violet
    core: '#C084FC',
    accent: '#5B21B6',
    glow: 'rgba(124, 58, 237, 0.45)',
  },
  golden: {
    label: 'Gilded Topaz Frost',
    primary: '#D97706', // Burnished amber/gold
    core: '#FDE047',
    accent: '#92400E',
    glow: 'rgba(217, 119, 6, 0.45)',
  },
};

// Formal balloon color schemes
const FORMAL_PALETTES = {
  regal: [
    { main: '#8B1E2F', highlight: '#E57373', string: '#C29B38' }, // Imperial Burgundy
    { main: '#B38B3F', highlight: '#FBE8A6', string: '#8C6C26' }, // Burnished Gold
    { main: '#1A365D', highlight: '#63B3ED', string: '#B38B3F' }, // Royal Oxford Sapphire
    { main: '#1F4738', highlight: '#68D391', string: '#D8C38B' }, // Malachite Green
    { main: '#2A2826', highlight: '#A0AEC0', string: '#B38B3F' }, // Formal Obsidian
  ],
  classic: [
    { main: '#C5A059', highlight: '#FEF08A', string: '#8C6C26' }, // Warm Gold
    { main: '#E2E8F0', highlight: '#FFFFFF', string: '#9E9484' }, // Pure Pearl
    { main: '#9F1239', highlight: '#FDA4AF', string: '#B38B3F' }, // Bordeaux
    { main: '#1E293B', highlight: '#94A3B8', string: '#B38B3F' }, // Sovereign Slate
    { main: '#6B21A8', highlight: '#D8B4FE', string: '#D8C38B' }, // Antique Plum
  ],
  midnight: [
    { main: '#0F172A', highlight: '#64748B', string: '#94A3B8' }, // Midnight Slate
    { main: '#312E81', highlight: '#818CF8', string: '#CBD5E1' }, // Deep Indigo
    { main: '#831843', highlight: '#F472B6', string: '#FBCFE8' }, // Midnight Rose
    { main: '#064E3B', highlight: '#34D399', string: '#A7F3D0' }, // Nocturne Emerald
    { main: '#713F12', highlight: '#FDE047', string: '#FEF08A' }, // Antique Bronze
  ],
};

export const AtmosphereCanvas: React.FC<AtmosphereCanvasProps> = ({
  snowflakesActive,
  balloonsActive,
  config,
  onParticleStatsUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snowflakesRef = useRef<SnowflakeParticle[]>([]);
  const balloonsRef = useRef<BalloonParticle[]>([]);
  const nextParticleId = useRef(1);
  const animFrameRef = useRef<number | null>(null);

  // Independent spawn accumulator timers
  const snowAccumulator = useRef<number>(0);
  const balloonAccumulator = useRef<number>(0);
  const wasSnowActive = useRef<boolean>(false);
  const wasBalloonActive = useRef<boolean>(false);

  // Density configuration
  const densityMap = {
    subtle: { snowInterval: 0.12, balloonInterval: 0.32, snowBatch: 1, balloonBatch: 1, initialSnow: 8, initialBalloons: 4 },
    standard: { snowInterval: 0.07, balloonInterval: 0.19, snowBatch: 2, balloonBatch: 1, initialSnow: 16, initialBalloons: 7 },
    grand: { snowInterval: 0.04, balloonInterval: 0.12, snowBatch: 3, balloonBatch: 2, initialSnow: 25, initialBalloons: 11 },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const spawnSnowflake = (startY?: number) => {
      // Radius: 14 to 20 px => Diameter: 28 to 40 px (Medium size, clearly visible)
      const radius = 14 + Math.random() * 6;
      const palette = SNOWFLAKE_PALETTES[config.snowflakeColor] || SNOWFLAKE_PALETTES.sapphire;

      let windX = 0;
      if (config.windDirection === 'gentle-east') windX = 26;
      else if (config.windDirection === 'gentle-west') windX = -26;

      snowflakesRef.current.push({
        id: nextParticleId.current++,
        x: Math.random() * (width + 80) - 40,
        y: startY !== undefined ? startY : -radius * 2 - Math.random() * 20,
        size: radius,
        speedY: 85 + Math.random() * 70, // Graceful fall rate
        speedX: (Math.random() - 0.5) * 20 + windX,
        swayAmplitude: 16 + Math.random() * 18,
        swaySpeed: 1.2 + Math.random() * 1.5,
        swayOffset: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 1.4,
        opacity: 0.92,
        dendriteBranches: 6,
        branchType: Math.floor(Math.random() * 3),
        primaryColor: palette.primary,
        coreColor: palette.core,
        glowColor: palette.glow,
      });
    };

    const spawnBalloon = (startY?: number) => {
      // Medium size balloons: width 44 - 54 px, height 56 - 68 px
      const bWidth = 44 + Math.random() * 8;
      const bHeight = bWidth * 1.26;
      const palette = FORMAL_PALETTES[config.colorTheme] || FORMAL_PALETTES.classic;
      const colorPair = palette[Math.floor(Math.random() * palette.length)];

      let windX = 0;
      if (config.windDirection === 'gentle-east') windX = 24;
      else if (config.windDirection === 'gentle-west') windX = -24;

      balloonsRef.current.push({
        id: nextParticleId.current++,
        x: Math.random() * (width - 120) + 60,
        y: startY !== undefined ? startY : height + bHeight + 30 + Math.random() * 40,
        width: bWidth,
        height: bHeight,
        speedY: 90 + Math.random() * 75, // Graceful upward ascent
        speedX: (Math.random() - 0.5) * 15 + windX * 0.4,
        swayAmplitude: 18 + Math.random() * 22,
        swaySpeed: 1.1 + Math.random() * 1.3,
        swayOffset: Math.random() * Math.PI * 2,
        wobble: 0,
        color: colorPair.main,
        highlightColor: colorPair.highlight,
        stringLength: 55 + Math.random() * 25,
        stringCurl: (Math.random() - 0.5) * 14,
        opacity: 0.98,
      });
    };

    // Instant initial batch upon activation so the user sees particles immediately!
    const densityConfig = densityMap[config.density] || densityMap.standard;

    if (snowflakesActive && !wasSnowActive.current) {
      for (let i = 0; i < densityConfig.initialSnow; i++) {
        // Distribute initial snowflakes across top 35% of the screen so they appear right away
        const staggeredY = -20 + Math.random() * (height * 0.35);
        spawnSnowflake(staggeredY);
      }
    }
    wasSnowActive.current = snowflakesActive;

    if (balloonsActive && !wasBalloonActive.current) {
      for (let i = 0; i < densityConfig.initialBalloons; i++) {
        // Distribute initial balloons across bottom 35% of the screen
        const staggeredY = height - Math.random() * (height * 0.35);
        spawnBalloon(staggeredY);
      }
    }
    wasBalloonActive.current = balloonsActive;

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // 1. Continuous Spawning for Snowflakes (Falling top to bottom for 5 seconds)
      if (snowflakesActive) {
        snowAccumulator.current += delta;
        while (snowAccumulator.current >= densityConfig.snowInterval) {
          snowAccumulator.current -= densityConfig.snowInterval;
          for (let i = 0; i < densityConfig.snowBatch; i++) {
            spawnSnowflake();
          }
        }
      } else {
        snowAccumulator.current = 0;
      }

      // 2. Continuous Spawning for Balloons (Floating bottom to top for 5 seconds)
      if (balloonsActive) {
        balloonAccumulator.current += delta;
        while (balloonAccumulator.current >= densityConfig.balloonInterval) {
          balloonAccumulator.current -= densityConfig.balloonInterval;
          for (let i = 0; i < densityConfig.balloonBatch; i++) {
            spawnBalloon();
          }
        }
      } else {
        balloonAccumulator.current = 0;
      }

      // 3. Render and Update Snowflakes (Fall from top to bottom)
      const survivingSnow: SnowflakeParticle[] = [];
      const snowCount = snowflakesRef.current.length;

      for (let i = 0; i < snowCount; i++) {
        const flake = snowflakesRef.current[i];

        // Motion physics
        flake.y += flake.speedY * delta;
        flake.rotation += flake.rotationSpeed * delta;
        const swayX = Math.sin((time / 1000) * flake.swaySpeed + flake.swayOffset) * flake.swayAmplitude;
        const currentX = flake.x + swayX + flake.speedX * delta;

        // Render medium snowflake with special vivid color & contrast
        ctx.save();
        ctx.translate(currentX, flake.y);
        ctx.rotate(flake.rotation);
        ctx.globalAlpha = flake.opacity;

        drawFormalVividSnowflake(ctx, flake);

        ctx.restore();

        // Keep until passed bottom of screen
        if (flake.y < height + flake.size * 3) {
          flake.x += flake.speedX * delta * 0.15;
          survivingSnow.push(flake);
        }
      }
      snowflakesRef.current = survivingSnow;

      // 4. Render and Update Balloons (Float from bottom to top)
      const survivingBalloons: BalloonParticle[] = [];
      const balloonCount = balloonsRef.current.length;

      for (let i = 0; i < balloonCount; i++) {
        const b = balloonsRef.current[i];

        // Motion physics: ascends toward top
        b.y -= b.speedY * delta;
        const swayX = Math.sin((time / 1000) * b.swaySpeed + b.swayOffset) * b.swayAmplitude;
        const currentX = b.x + swayX + b.speedX * delta;
        const tilt = Math.sin((time / 1000) * b.swaySpeed + b.swayOffset) * 0.08;

        ctx.save();
        ctx.translate(currentX, b.y);
        ctx.rotate(tilt);
        ctx.globalAlpha = b.opacity;

        drawFormalBalloon(ctx, b, time);

        ctx.restore();

        // Keep until passed top of screen
        if (b.y > -b.height - b.stringLength - 30) {
          b.x += b.speedX * delta * 0.15;
          survivingBalloons.push(b);
        }
      }
      balloonsRef.current = survivingBalloons;

      // Telemetry update
      if (onParticleStatsUpdate && Math.floor(time) % 15 === 0) {
        onParticleStatsUpdate(survivingSnow.length, survivingBalloons.length);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [snowflakesActive, balloonsActive, config, onParticleStatsUpdate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 w-full h-full"
      aria-hidden="true"
    />
  );
};

/**
 * Procedurally draws a crisp, medium-sized symmetrical snowflake crystal
 * with striking vivid sapphire/cyan/amethyst color and drop shadow for maximum visibility!
 */
function drawFormalVividSnowflake(ctx: CanvasRenderingContext2D, flake: SnowflakeParticle) {
  const radius = flake.size;
  const branches = 6;
  const angleStep = (Math.PI * 2) / branches;

  // Soft luminous aura around the crystal
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 1.3);
  glow.addColorStop(0, flake.glowColor);
  glow.addColorStop(0.6, flake.glowColor.replace('0.45', '0.2'));
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.3, 0, Math.PI * 2);
  ctx.fill();

  // Outer shadow for unmistakable visibility on light surfaces
  ctx.shadowColor = 'rgba(15, 23, 42, 0.45)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  // Central multifaceted geometric hexagon (filled with crystal core color)
  ctx.beginPath();
  const hexR = radius * 0.32;
  for (let i = 0; i < 6; i++) {
    const a = i * angleStep;
    const x = Math.cos(a) * hexR;
    const y = Math.sin(a) * hexR;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = flake.coreColor;
  ctx.fill();
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = flake.primaryColor;
  ctx.stroke();

  // Crystal Facet Star: 6 triangular facets connecting to the arms
  ctx.beginPath();
  const starInnerR = radius * 0.22;
  const starOuterR = radius * 0.48;
  for (let i = 0; i < 12; i++) {
    const a = i * (Math.PI / 6);
    const r = i % 2 === 0 ? starOuterR : starInnerR;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = flake.glowColor;
  ctx.fill();

  // Reset shadow for crisp sharp crystal arms
  ctx.shadowBlur = 0;

  // Draw 6 main dendritic crystal arms in vibrant special color
  ctx.strokeStyle = flake.primaryColor;
  ctx.lineWidth = 2.2; // Solid, medium-gauge crystal spine
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let i = 0; i < branches; i++) {
    const angle = i * angleStep;
    ctx.save();
    ctx.rotate(angle);

    // Main spine
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius);
    ctx.stroke();

    // Outer chevron branches
    const sideAngle = Math.PI / 3; // 60 degrees
    const pos1 = -radius * 0.72;
    const sideBranchLen = radius * 0.42;

    ctx.beginPath();
    ctx.moveTo(0, pos1);
    ctx.lineTo(Math.sin(sideAngle) * sideBranchLen, pos1 + Math.cos(sideAngle) * sideBranchLen);
    ctx.moveTo(0, pos1);
    ctx.lineTo(-Math.sin(sideAngle) * sideBranchLen, pos1 + Math.cos(sideAngle) * sideBranchLen);
    ctx.stroke();

    // Inner chevron branches
    const pos2 = -radius * 0.44;
    const innerLen = radius * 0.3;
    ctx.beginPath();
    ctx.moveTo(0, pos2);
    ctx.lineTo(Math.sin(sideAngle) * innerLen, pos2 + Math.cos(sideAngle) * innerLen);
    ctx.moveTo(0, pos2);
    ctx.lineTo(-Math.sin(sideAngle) * innerLen, pos2 + Math.cos(sideAngle) * innerLen);
    ctx.stroke();

    // Dendritic tips
    const tipPos = -radius * 0.92;
    const tipLen = radius * 0.2;
    ctx.beginPath();
    ctx.moveTo(0, tipPos);
    ctx.lineTo(Math.sin(sideAngle) * tipLen, tipPos + Math.cos(sideAngle) * tipLen);
    ctx.moveTo(0, tipPos);
    ctx.lineTo(-Math.sin(sideAngle) * tipLen, tipPos + Math.cos(sideAngle) * tipLen);
    ctx.stroke();

    // Small jewel crystal point at the tip
    ctx.fillStyle = flake.coreColor;
    ctx.beginPath();
    ctx.arc(0, -radius, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Brilliant center spark dot
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draws a formal, medium-sized balloon with 3D specular sheen and swaying ribbon/string
 */
function drawFormalBalloon(ctx: CanvasRenderingContext2D, b: BalloonParticle, time: number) {
  const w = b.width;
  const h = b.height;
  const halfW = w / 2;
  const halfH = h / 2;

  // 1. Draw Trailing String beneath balloon knot
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, halfH); // Start at bottom knot

  // Elegant natural sine wave sway for string
  const stringWave = Math.sin(time / 280 + b.swayOffset) * 8 + b.stringCurl;
  const midY = halfH + b.stringLength * 0.5;
  const endY = halfH + b.stringLength;

  ctx.bezierCurveTo(
    stringWave * 1.4,
    midY - 10,
    -stringWave * 0.8,
    midY + 15,
    stringWave * 0.4,
    endY
  );

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.9)'; // Gilded silk string
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.restore();

  // 2. Draw Bottom Knot / Neck
  ctx.save();
  ctx.fillStyle = b.color;
  ctx.beginPath();
  ctx.moveTo(-4, halfH - 2);
  ctx.lineTo(4, halfH - 2);
  ctx.lineTo(6, halfH + 4);
  ctx.lineTo(-6, halfH + 4);
  ctx.closePath();
  ctx.fill();

  // Little golden ring tie
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-3, halfH + 1);
  ctx.lineTo(3, halfH + 1);
  ctx.stroke();
  ctx.restore();

  // 3. Draw Balloon Body with Realistic 3D Elliptical Shading
  ctx.save();

  // Balloon geometry (teardrop-oval)
  ctx.beginPath();
  ctx.moveTo(0, -halfH);
  ctx.bezierCurveTo(halfW * 1.15, -halfH, halfW * 1.05, halfH * 0.4, 0, halfH);
  ctx.bezierCurveTo(-halfW * 1.05, halfH * 0.4, -halfW * 1.15, -halfH, 0, -halfH);
  ctx.closePath();

  // Drop shadow for clear elevation
  ctx.shadowColor = 'rgba(15, 23, 42, 0.35)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;

  // Radial volumetric gradient
  const grad = ctx.createRadialGradient(
    -halfW * 0.32,
    -halfH * 0.38,
    w * 0.08,
    0,
    0,
    halfH * 1.1
  );
  grad.addColorStop(0, b.highlightColor);
  grad.addColorStop(0.35, b.color);
  grad.addColorStop(0.9, shadeHexColor(b.color, -30));
  grad.addColorStop(1, shadeHexColor(b.color, -50));

  ctx.fillStyle = grad;
  ctx.fill();

  // Reset shadow for crisp highlights
  ctx.shadowBlur = 0;

  // Subtle luxury rim light
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 4. Elegant Curved Specular Highlight Reflection (Chandelier/Atrium light)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(-halfW * 0.36, -halfH * 0.38, halfW * 0.26, halfH * 0.32, -Math.PI / 5, 0, Math.PI * 2);
  const specGrad = ctx.createRadialGradient(
    -halfW * 0.36,
    -halfH * 0.38,
    0,
    -halfW * 0.36,
    -halfH * 0.38,
    halfW * 0.26
  );
  specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  specGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.45)');
  specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = specGrad;
  ctx.fill();
  ctx.restore();

  // Secondary soft specular crescent
  ctx.save();
  ctx.beginPath();
  ctx.arc(-halfW * 0.38, -halfH * 0.42, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

/**
 * Helper to adjust hex color lightness for 3D depth
 */
function shadeHexColor(hex: string, percent: number): string {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}
