import React from 'react';
import { Sliders, Wind, Layers, Palette, Sparkles } from 'lucide-react';
import { AtmosphereConfig, SnowflakeColorScheme } from '../types/atmosphere';
import { SNOWFLAKE_PALETTES } from './AtmosphereCanvas';

interface AtmosphericControlsProps {
  config: AtmosphereConfig;
  onChangeConfig: (updated: Partial<AtmosphereConfig>) => void;
  currentSnowCount: number;
  currentBalloonCount: number;
}

export const AtmosphericControls: React.FC<AtmosphericControlsProps> = ({
  config,
  onChangeConfig,
  currentSnowCount,
  currentBalloonCount,
}) => {
  return (
    <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-sm border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 shadow-xs">
        
        {/* Section Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-stone-700 dark:text-stone-300" />
            <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
              Atmospheric Calibration & Colors
            </h2>
          </div>
          
          {/* Active Particle Telemetry */}
          <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
            <span>Live Particles:</span>
            <span className="font-mono tabular-nums font-semibold text-sky-600 dark:text-sky-400">
              {currentSnowCount} Snowflakes
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums font-semibold text-amber-600 dark:text-amber-400">
              {currentBalloonCount} Balloons
            </span>
          </div>
        </div>

        {/* Control Grid - 4 Columns */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* 1. Special Snowflake Color Selector */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
              <Sparkles className="h-3.5 w-3.5 text-sky-600" />
              <span>Snowflake Color</span>
            </label>
            <div className="mt-2.5 flex flex-col gap-1 rounded-sm bg-stone-100 p-1 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
              {(Object.keys(SNOWFLAKE_PALETTES) as SnowflakeColorScheme[]).map((scheme) => {
                const pal = SNOWFLAKE_PALETTES[scheme];
                const isSelected = config.snowflakeColor === scheme;
                return (
                  <button
                    key={scheme}
                    type="button"
                    onClick={() => onChangeConfig({ snowflakeColor: scheme })}
                    className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-xs transition-colors ${
                      isSelected
                        ? 'bg-white text-stone-900 shadow-xs dark:bg-stone-800 dark:text-stone-100 font-semibold'
                        : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                    }`}
                  >
                    <span className="truncate">{pal.label}</span>
                    <span
                      className="h-3 w-3 rounded-full border border-stone-300 dark:border-stone-600 shrink-0"
                      style={{ backgroundColor: pal.primary }}
                    />
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[11px] text-stone-500 dark:text-stone-400">
              Vivid crystal tone optimized for high visibility.
            </p>
          </div>

          {/* 2. Density Segmented Control */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              <Layers className="h-3.5 w-3.5 text-stone-500" />
              <span>Chamber Density</span>
            </label>
            <div className="mt-2.5 flex items-center rounded-sm bg-stone-100 p-1 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
              {(['subtle', 'standard', 'grand'] as const).map((density) => (
                <button
                  key={density}
                  type="button"
                  onClick={() => onChangeConfig({ density })}
                  className={`flex-1 py-1.5 text-xs font-medium capitalize rounded-xs transition-colors whitespace-nowrap ${
                    config.density === density
                      ? 'bg-white text-stone-900 shadow-xs dark:bg-stone-800 dark:text-stone-100'
                      : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                >
                  {density}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-stone-500 dark:text-stone-400">
              Volume emitted continuously across 5.0 seconds.
            </p>
          </div>

          {/* 3. Lateral Air Draft */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              <Wind className="h-3.5 w-3.5 text-stone-500" />
              <span>Air Draft</span>
            </label>
            <div className="mt-2.5 flex items-center rounded-sm bg-stone-100 p-1 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
              {[
                { id: 'gentle-west', label: 'West' },
                { id: 'calm', label: 'Zenith' },
                { id: 'gentle-east', label: 'East' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChangeConfig({ windDirection: item.id as AtmosphereConfig['windDirection'] })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-xs transition-colors whitespace-nowrap ${
                    config.windDirection === item.id
                      ? 'bg-white text-stone-900 shadow-xs dark:bg-stone-800 dark:text-stone-100'
                      : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-stone-500 dark:text-stone-400">
              Lateral wind physics affecting sway and drift.
            </p>
          </div>

          {/* 4. Balloon Palette Scheme */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              <Palette className="h-3.5 w-3.5 text-stone-500" />
              <span>Balloon Palette</span>
            </label>
            <div className="mt-2.5 flex items-center rounded-sm bg-stone-100 p-1 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
              {(['classic', 'regal', 'midnight'] as const).map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => onChangeConfig({ colorTheme: theme })}
                  className={`flex-1 py-1.5 text-xs font-medium capitalize rounded-xs transition-colors whitespace-nowrap ${
                    config.colorTheme === theme
                      ? 'bg-white text-stone-900 shadow-xs dark:bg-stone-800 dark:text-stone-100'
                      : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-stone-500 dark:text-stone-400">
              Lustrous 3D metallic & jewel balloon tones.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
