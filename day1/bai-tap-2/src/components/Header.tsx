import React from 'react';
import { Sparkles, Sun, Moon, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSpecs: () => void;
  activeEffect: 'snowflakes' | 'balloons' | null;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  soundEnabled,
  onToggleSound,
  onOpenSpecs,
  activeEffect,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-stone-200 bg-stone-50/90 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/90 transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="flex items-center gap-2.5 text-lg font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-xs">
            <Sparkles className="h-4 w-4" />
          </span>
          <span>Aethelgard Atrium</span>
        </a>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-sans font-medium text-stone-600 dark:text-stone-400">
          <a
            href="#pedestal"
            className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0"
          >
            Ceremony Pedestal
          </a>
          <a
            href="#atmosphere-specs"
            onClick={(e) => {
              e.preventDefault();
              onOpenSpecs();
            }}
            className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0"
          >
            Atmospheric Specs
          </a>
          <a
            href="#registry"
            className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0"
          >
            Ceremonial Log
          </a>
          <a
            href="#institutional-notes"
            className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0"
          >
            Curatorial Charter
          </a>
        </nav>

        {/* Zone 3: 1 primary action group */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute acoustic accompaniment' : 'Enable acoustic accompaniment'}
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
            title={soundEnabled ? 'Acoustic Harmonics Active' : 'Sound Muted'}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-stone-400" />}
          </button>

          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label="Toggle theme appearance"
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenSpecs}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium tracking-wide uppercase text-stone-100 bg-stone-900 rounded-sm hover:bg-stone-800 dark:text-stone-900 dark:bg-stone-100 dark:hover:bg-stone-200 transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Chamber Charter</span>
          </button>
        </div>

      </div>
    </header>
  );
};
