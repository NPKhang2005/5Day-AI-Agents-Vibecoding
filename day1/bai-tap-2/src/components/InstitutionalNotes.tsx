import React from 'react';
import { Award, Compass, Sparkles } from 'lucide-react';

export const InstitutionalNotes: React.FC = () => {
  return (
    <section id="institutional-notes" className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-t border-stone-200 dark:border-stone-800 pt-10">
        
        {/* Curatorial Header */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-sans font-medium text-stone-500 dark:text-stone-400">
          <span>Curatorial Discourse</span>
          <span aria-hidden="true">·</span>
          <span>Vol. VIII</span>
          <span aria-hidden="true">·</span>
          <span>Archival Monograph</span>
        </div>

        <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
          The Geometry of Falling Ice and Ascending Silks
        </h2>

        {/* Editorial Text with Drop Cap */}
        <div className="mt-5 grid grid-cols-1 gap-8 md:grid-cols-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
          <div>
            <p className="first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-stone-900 dark:first-letter:text-stone-100 first-letter:leading-none">
              In formal ceremonies of state and architectural openings, atmospheric particles establish spatial gravity and celebratory reverence. The descent of crystalline dendrites invokes contemplative stillness, whereas the buoyant ascension of spherical regalia evokes elevation and triumph.
            </p>
            <p className="mt-4">
              By constraining each induction to five precise seconds, the Chamber introduces an intentional rhythm—neither fleeting nor prolonged. The observer engages with the phenomenon in full contemplation, observing the transition of medium-sized forms across the vertical axis of the viewport.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border-l-2 border-stone-300 pl-4 italic font-serif text-stone-700 dark:border-stone-700 dark:text-stone-300 text-sm">
              "To measure five seconds of descent is to capture the stillness of winter; to watch the same span in flight is to witness the buoyancy of human festivity."
            </div>
            
            <dl className="mt-4 divide-y divide-stone-200 text-xs dark:divide-stone-800 border-t border-b border-stone-200 dark:border-stone-800">
              <div className="flex justify-between py-2.5">
                <dt className="text-stone-500 dark:text-stone-400">Chamber Standard</dt>
                <dd className="font-semibold text-stone-800 dark:text-stone-200">ISO-Curatorial 9002/A</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-stone-500 dark:text-stone-400">Temporal Invariant</dt>
                <dd className="font-mono tabular-nums font-semibold text-stone-800 dark:text-stone-200">5.000 Seconds</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-stone-500 dark:text-stone-400">Rendering Architecture</dt>
                <dd className="text-stone-800 dark:text-stone-200">Retina Vectorized Canvas</dd>
              </div>
            </dl>
          </div>
        </div>

      </div>
    </section>
  );
};
