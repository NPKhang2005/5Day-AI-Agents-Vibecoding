import React from 'react';
import { History, Snowflake, CircleDot, Trash2, RotateCcw } from 'lucide-react';
import { ActivationEvent } from '../types/atmosphere';

interface CeremonialLogProps {
  events: ActivationEvent[];
  onClear: () => void;
  onReplay: (type: 'snowflakes' | 'balloons') => void;
}

export const CeremonialLog: React.FC<CeremonialLogProps> = ({
  events,
  onClear,
  onReplay,
}) => {
  return (
    <section id="registry" className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-sm border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-stone-700 dark:text-stone-300" />
            <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
              Ceremonial Accession Registry
            </h3>
          </div>

          {events.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Purge Archive</span>
            </button>
          )}
        </div>

        {/* Content list or empty state */}
        {events.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="font-serif italic text-sm text-stone-500 dark:text-stone-400">
              No atmospheric inductions recorded in this session.
            </p>
            <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
              Engage the "Snowflakes" or "Balloons" console controls to register an accession.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600 dark:text-stone-400">
              <thead className="bg-stone-50 dark:bg-stone-950/60 uppercase tracking-widest text-[11px] font-semibold text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="py-3 px-6">Accession ID</th>
                  <th className="py-3 px-6">Atmospheric Phenomenon</th>
                  <th className="py-3 px-6">Motion Vector</th>
                  <th className="py-3 px-6">Span</th>
                  <th className="py-3 px-6 text-right">Time</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-sans">
                {events.map((event) => {
                  const isSnow = event.type === 'snowflakes';
                  return (
                    <tr
                      key={event.id}
                      className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-6 font-mono text-[11px] text-stone-400 dark:text-stone-500">
                        {event.id}
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-2">
                          {isSnow ? (
                            <span className="flex h-6 w-6 items-center justify-center rounded-xs bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                              <Snowflake className="h-3.5 w-3.5" />
                            </span>
                          ) : (
                            <span className="flex h-6 w-6 items-center justify-center rounded-xs bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                              <CircleDot className="h-3.5 w-3.5" />
                            </span>
                          )}
                          <span className="font-semibold capitalize text-stone-800 dark:text-stone-200">
                            {event.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        {isSnow ? 'Vertical Descent (Top → Bottom)' : 'Buoyant Ascent (Bottom → Top)'}
                      </td>
                      <td className="py-3.5 px-6 font-mono tabular-nums">
                        {event.durationSeconds.toFixed(1)}s
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono text-[11px] tabular-nums">
                        {event.timestamp}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => onReplay(event.type)}
                          className="inline-flex items-center gap-1 font-medium text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white transition-colors"
                          title={`Re-trigger ${event.type}`}
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Replay</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </section>
  );
};
