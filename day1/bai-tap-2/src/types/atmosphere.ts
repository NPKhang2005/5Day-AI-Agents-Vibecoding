/**
 * Atmospheric particle and simulation type definitions
 */

export type EffectType = 'snowflakes' | 'balloons';

export type SnowflakeColorScheme = 'sapphire' | 'cyan' | 'amethyst' | 'golden';

export interface SnowflakeParticle {
  id: number;
  x: number;
  y: number;
  size: number; // 24px - 38px (medium size)
  speedY: number; // fall rate
  speedX: number; // drift
  swayAmplitude: number;
  swaySpeed: number;
  swayOffset: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  dendriteBranches: number; // usually 6
  branchType: number; // crystal variation
  primaryColor: string; // special vivid color for high contrast
  glowColor: string;
  coreColor: string;
}

export interface BalloonParticle {
  id: number;
  x: number;
  y: number;
  width: number; // 42px - 54px (medium size)
  height: number; // 52px - 66px
  speedY: number; // ascent rate
  speedX: number; // gentle draft
  swayAmplitude: number;
  swaySpeed: number;
  swayOffset: number;
  wobble: number;
  color: string;
  highlightColor: string;
  stringLength: number;
  stringCurl: number;
  opacity: number;
}

export interface AtmosphereConfig {
  density: 'subtle' | 'standard' | 'grand';
  windDirection: 'calm' | 'gentle-east' | 'gentle-west';
  soundEnabled: boolean;
  colorTheme: 'classic' | 'regal' | 'midnight';
  snowflakeColor: SnowflakeColorScheme;
}

export interface ActivationEvent {
  id: string;
  type: EffectType;
  timestamp: string;
  durationSeconds: number;
  particleCountEstimate: number;
}
