import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AtmosphereCanvas } from './components/AtmosphereCanvas';
import { Header } from './components/Header';
import { PedestalConsole } from './components/PedestalConsole';
import { AtmosphericControls } from './components/AtmosphericControls';
import { CeremonialLog } from './components/CeremonialLog';
import { SpecificationModal } from './components/SpecificationModal';
import { InstitutionalNotes } from './components/InstitutionalNotes';
import { AtmosphereConfig, ActivationEvent } from './types/atmosphere';
import { soundEngine } from './utils/audio';

export default function App() {
  // Theme state (formal alabaster paper vs formal obsidian)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sound configuration
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Atmospheric simulation configuration
  const [config, setConfig] = useState<AtmosphereConfig>({
    density: 'standard',
    windDirection: 'calm',
    soundEnabled: true,
    colorTheme: 'classic',
    snowflakeColor: 'sapphire',
  });

  // 5-second timers and states for Snowflakes
  const [snowflakesActive, setSnowflakesActive] = useState<boolean>(false);
  const [snowflakesTimeLeft, setSnowflakesTimeLeft] = useState<number>(0);
  const snowTimerRef = useRef<NodeJS.Timeout | null>(null);
  const snowIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 5-second timers and states for Balloons
  const [balloonsActive, setBalloonsActive] = useState<boolean>(false);
  const [balloonsTimeLeft, setBalloonsTimeLeft] = useState<number>(0);
  const balloonTimerRef = useRef<NodeJS.Timeout | null>(null);
  const balloonIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stats and history registry
  const [events, setEvents] = useState<ActivationEvent[]>([]);
  const [currentSnowCount, setCurrentSnowCount] = useState<number>(0);
  const [currentBalloonCount, setCurrentBalloonCount] = useState<number>(0);
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);

  // Sync dark mode class on root HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync sound mute setting with audio engine
  useEffect(() => {
    soundEngine.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Handle Snowflake Trigger: Exactly 5 seconds
  const triggerSnowflakes = useCallback(() => {
    // Play ethereal crystalline chime
    if (soundEnabled) {
      soundEngine.playSnowflakeChime();
    }

    // Set 5-second active state
    setSnowflakesActive(true);
    setSnowflakesTimeLeft(5.0);

    // Clear any existing timers
    if (snowTimerRef.current) clearTimeout(snowTimerRef.current);
    if (snowIntervalRef.current) clearInterval(snowIntervalRef.current);

    const startTime = performance.now();
    const DURATION = 5000; // 5 seconds

    snowIntervalRef.current = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, (DURATION - elapsed) / 1000);
      setSnowflakesTimeLeft(remaining);
      if (remaining <= 0) {
        if (snowIntervalRef.current) clearInterval(snowIntervalRef.current);
      }
    }, 100);

    snowTimerRef.current = setTimeout(() => {
      setSnowflakesActive(false);
      setSnowflakesTimeLeft(0);
      if (snowIntervalRef.current) clearInterval(snowIntervalRef.current);
    }, DURATION);

    // Record in archival history
    const now = new Date();
    const newEvent: ActivationEvent = {
      id: `ACC-${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(events.length + 1).padStart(3, '0')}`,
      type: 'snowflakes',
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      durationSeconds: 5.0,
      particleCountEstimate: config.density === 'grand' ? 120 : config.density === 'subtle' ? 45 : 75,
    };
    setEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
  }, [soundEnabled, events.length, config.density]);

  // Handle Balloons Trigger: Exactly 5 seconds
  const triggerBalloons = useCallback(() => {
    // Play ascending celestial harp glissando
    if (soundEnabled) {
      soundEngine.playBalloonAscent();
    }

    // Set 5-second active state
    setBalloonsActive(true);
    setBalloonsTimeLeft(5.0);

    // Clear any existing timers
    if (balloonTimerRef.current) clearTimeout(balloonTimerRef.current);
    if (balloonIntervalRef.current) clearInterval(balloonIntervalRef.current);

    const startTime = performance.now();
    const DURATION = 5000; // 5 seconds

    balloonIntervalRef.current = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, (DURATION - elapsed) / 1000);
      setBalloonsTimeLeft(remaining);
      if (remaining <= 0) {
        if (balloonIntervalRef.current) clearInterval(balloonIntervalRef.current);
      }
    }, 100);

    balloonTimerRef.current = setTimeout(() => {
      setBalloonsActive(false);
      setBalloonsTimeLeft(0);
      if (balloonIntervalRef.current) clearInterval(balloonIntervalRef.current);
    }, DURATION);

    // Record in archival history
    const now = new Date();
    const newEvent: ActivationEvent = {
      id: `ACC-${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(events.length + 1).padStart(3, '0')}`,
      type: 'balloons',
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      durationSeconds: 5.0,
      particleCountEstimate: config.density === 'grand' ? 50 : config.density === 'subtle' ? 18 : 30,
    };
    setEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
  }, [soundEnabled, events.length, config.density]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (snowTimerRef.current) clearTimeout(snowTimerRef.current);
      if (snowIntervalRef.current) clearInterval(snowIntervalRef.current);
      if (balloonTimerRef.current) clearTimeout(balloonTimerRef.current);
      if (balloonIntervalRef.current) clearInterval(balloonIntervalRef.current);
    };
  }, []);

  const handleUpdateConfig = (partial: Partial<AtmosphereConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const handleParticleStats = useCallback((snowCount: number, balloonCount: number) => {
    setCurrentSnowCount(snowCount);
    setCurrentBalloonCount(balloonCount);
  }, []);

  return (
    <div className="min-h-screen bg-stone-100/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* High-DPI Fullscreen Particle Canvas */}
      <AtmosphereCanvas
        snowflakesActive={snowflakesActive}
        balloonsActive={balloonsActive}
        config={config}
        onParticleStatsUpdate={handleParticleStats}
      />

      {/* Top Bar adheres to 3-zone contract */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenSpecs={() => setIsSpecsOpen(true)}
        activeEffect={snowflakesActive ? 'snowflakes' : balloonsActive ? 'balloons' : null}
      />

      {/* Main Chamber Stage */}
      <main className="flex-1 relative z-10 py-6 sm:py-10">
        
        {/* The Central Focal Pedestal with the two core buttons: "Snowflakes" and "Balloons" */}
        <PedestalConsole
          snowflakesActive={snowflakesActive}
          snowflakesTimeLeft={snowflakesTimeLeft}
          onTriggerSnowflakes={triggerSnowflakes}
          balloonsActive={balloonsActive}
          balloonsTimeLeft={balloonsTimeLeft}
          onTriggerBalloons={triggerBalloons}
          soundEnabled={soundEnabled}
          totalActivations={events.length}
          snowflakeColor={config.snowflakeColor}
        />

        {/* Atmospheric Calibration Controls */}
        <AtmosphericControls
          config={config}
          onChangeConfig={handleUpdateConfig}
          currentSnowCount={currentSnowCount}
          currentBalloonCount={currentBalloonCount}
        />

        {/* Accession History Registry */}
        <CeremonialLog
          events={events}
          onClear={() => setEvents([])}
          onReplay={(type) => {
            if (type === 'snowflakes') triggerSnowflakes();
            else triggerBalloons();
          }}
        />

        {/* Curatorial & Physics Notes */}
        <InstitutionalNotes />

      </main>

      {/* Formal Institutional Footer */}
      <footer className="border-t border-stone-200 bg-stone-50 py-8 text-center text-xs text-stone-500 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-400">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif italic text-stone-600 dark:text-stone-300">
            Aethelgard Atrium · Chamber of Atmospheric Arts & Ceremonies
          </p>
          <div className="flex items-center gap-4">
            <span>Standard: 5.00s Continuous Induction</span>
            <span aria-hidden="true">·</span>
            <span>Medium Scale Particles</span>
          </div>
        </div>
      </footer>

      {/* Formal Charter & Specifications Modal */}
      <SpecificationModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />

    </div>
  );
}
