import React from 'react';
import { Snowflake, CircleDot, Play, CheckCircle2 } from 'lucide-react';
import { SnowflakeColorScheme } from '../types/atmosphere';
import { SNOWFLAKE_PALETTES } from './AtmosphereCanvas';

interface PedestalConsoleProps {
  snowflakesActive: boolean;
  snowflakesTimeLeft: number; // in seconds, e.g. 4.2
  onTriggerSnowflakes: () => void;
  balloonsActive: boolean;
  balloonsTimeLeft: number; // in seconds
  onTriggerBalloons: () => void;
  soundEnabled: boolean;
  totalActivations: number;
  snowflakeColor: SnowflakeColorScheme;
}

export const PedestalConsole: React.FC<PedestalConsoleProps> = ({
  snowflakesActive,
  snowflakesTimeLeft,
  onTriggerSnowflakes,
  balloonsActive,
  balloonsTimeLeft,
  onTriggerBalloons,
  totalActivations,
  snowflakeColor,
}) => {
  const snowPalette = SNOWFLAKE_PALETTES[snowflakeColor] || SNOWFLAKE_PALETTES.sapphire;

  return (
    <section id="pedestal" className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Formal Curatorial Plinth Container */}
      <div className="relative overflow-hidden rounded-sm border border-stone-200 bg-white/95 p-8 shadow-sm backdrop-blur-sm sm:p-12 dark:border-stone-800 dark:bg-stone-900/95 transition-all">
        
        {/* Subtle decorative gold-line header trim */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-stone-200 via-amber-600/40 to-stone-200 dark:from-stone-800 dark:via-amber-500/30 dark:to-stone-800" />

        {/* Ceremonial Header Block */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-sans font-medium text-stone-500 dark:text-stone-400">
            <span>Protocol Chamber</span>
            <span aria-hidden="true">·</span>
            <span>Atrium Atmospheric Suite</span>
            <span aria-hidden="true">·</span>
            <span>Duration 5.0s</span>
          </div>

          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold tracking-tight text-stone-900 dark:text-stone-50 text-balance">
            Atmospheric Ceremony Console
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-stone-600 dark:text-stone-400">
            Select an atmospheric induction to initiate precision particle motion across the Grand Atrium. Each sequence executes for a measured duration of five seconds.
          </p>
        </div>

        {/* Central Activation Pedestal: Two Buttons */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">

          {/* Button 1: "Snowflakes" */}
          <div className="relative flex flex-col items-stretch">
            <button
              type="button"
              onClick={onTriggerSnowflakes}
              className={`group relative flex flex-col items-center justify-between overflow-hidden rounded-sm border p-6 text-center transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 dark:focus-visible:outline-stone-100 ${
                snowflakesActive
                  ? 'border-sky-500 bg-sky-50/80 shadow-md ring-2 ring-sky-500/30 dark:border-sky-400 dark:bg-sky-950/50'
                  : 'border-stone-200 bg-stone-50/60 hover:border-stone-400 hover:bg-stone-100/80 hover:shadow-xs dark:border-stone-800 dark:bg-stone-950/50 dark:hover:border-stone-700 dark:hover:bg-stone-800/70'
              }`}
            >
              {/* Active countdown meter fill */}
              {snowflakesActive && (
                <div
                  className="absolute bottom-0 left-0 h-1 transition-all duration-100"
                  style={{
                    width: `${(snowflakesTimeLeft / 5) * 100}%`,
                    backgroundColor: snowPalette.primary,
                  }}
                />
              )}

              {/* Icon Crest with active snowflake color */}
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-sm transition-transform duration-200 group-hover:scale-105 ${
                  snowflakesActive
                    ? 'text-white shadow-sm'
                    : 'bg-white shadow-xs border border-stone-200 dark:bg-stone-800 dark:border-stone-700'
                }`}
                style={
                  snowflakesActive
                    ? { backgroundColor: snowPalette.primary }
                    : { color: snowPalette.primary }
                }
              >
                <Snowflake
                  className={`h-7 w-7 transition-transform ${snowflakesActive ? 'animate-spin' : ''}`}
                  style={{ animationDuration: '4s' }}
                />
              </div>

              {/* Primary Label strictly matching requirement: "Snowflakes" */}
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Snowflakes
              </span>

              {/* Subtitle / Spec Note mentioning color */}
              <span className="mt-1.5 text-xs font-sans text-stone-500 dark:text-stone-400 flex items-center justify-center gap-1.5">
                <span>Medium Crystals</span>
                <span aria-hidden="true">·</span>
                <span className="font-medium" style={{ color: snowPalette.primary }}>
                  {snowPalette.label}
                </span>
              </span>

              {/* Live status badge */}
              <div className="mt-5 flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                {snowflakesActive ? (
                  <span
                    className="font-semibold tabular-nums"
                    style={{ color: snowPalette.primary }}
                  >
                    Falling · {snowflakesTimeLeft.toFixed(1)}s remaining
                  </span>
                ) : (
                  <span className="text-stone-600 dark:text-stone-400 flex items-center gap-1 group-hover:text-stone-900 dark:group-hover:text-stone-200">
                    <Play className="h-3 w-3 fill-current" />
                    <span>Initiate 5s Cascade</span>
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Button 2: "Balloons" */}
          <div className="relative flex flex-col items-stretch">
            <button
              type="button"
              onClick={onTriggerBalloons}
              className={`group relative flex flex-col items-center justify-between overflow-hidden rounded-sm border p-6 text-center transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 dark:focus-visible:outline-stone-100 ${
                balloonsActive
                  ? 'border-amber-600 bg-amber-50/70 shadow-md ring-2 ring-amber-600/20 dark:border-amber-500 dark:bg-amber-950/40'
                  : 'border-stone-200 bg-stone-50/60 hover:border-stone-400 hover:bg-stone-100/80 hover:shadow-xs dark:border-stone-800 dark:bg-stone-950/50 dark:hover:border-stone-700 dark:hover:bg-stone-800/70'
              }`}
            >
              {/* Active countdown meter fill */}
              {balloonsActive && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-amber-600 transition-all duration-100"
                  style={{ width: `${(balloonsTimeLeft / 5) * 100}%` }}
                />
              )}

              {/* Icon Crest */}
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-sm transition-transform duration-200 group-hover:scale-105 ${
                  balloonsActive
                    ? 'bg-amber-600 text-white dark:bg-amber-500'
                    : 'bg-white text-stone-800 shadow-xs border border-stone-200 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <CircleDot className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                  <span className="absolute -bottom-1 h-3 w-0.5 bg-stone-400 dark:bg-stone-500" />
                </div>
              </div>

              {/* Primary Label strictly matching requirement: "Balloons" */}
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Balloons
              </span>

              {/* Subtitle / Spec Note */}
              <span className="mt-1.5 text-xs font-sans text-stone-500 dark:text-stone-400">
                Medium Regalia · Floating Bottom to Top
              </span>

              {/* Live status badge */}
              <div className="mt-5 flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                {balloonsActive ? (
                  <span className="text-amber-700 dark:text-amber-400 font-semibold tabular-nums">
                    Floating · {balloonsTimeLeft.toFixed(1)}s remaining
                  </span>
                ) : (
                  <span className="text-stone-600 dark:text-stone-400 flex items-center gap-1 group-hover:text-stone-900 dark:group-hover:text-stone-200">
                    <Play className="h-3 w-3 fill-current" />
                    <span>Initiate 5s Ascent</span>
                  </span>
                )}
              </div>
            </button>
          </div>

        </div>

        {/* Curatorial Invariant Guarantee Ribbon */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-stone-200/80 pt-6 text-xs text-stone-500 dark:border-stone-800/80 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500 shrink-0" />
            <span>Formal Atmospheric Chamber Calibrated</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Execution Window: <strong className="font-semibold text-stone-700 dark:text-stone-300">5.00s</strong></span>
            <span aria-hidden="true">·</span>
            <span>Particle Scale: <strong className="font-semibold text-stone-700 dark:text-stone-300">Medium (Standardized)</strong></span>
            <span aria-hidden="true">·</span>
            <span>Total Ceremonies: <strong className="font-semibold text-stone-700 dark:text-stone-300 tabular-nums">{totalActivations}</strong></span>
          </div>
        </div>

      </div>
    </section>
  );
};
