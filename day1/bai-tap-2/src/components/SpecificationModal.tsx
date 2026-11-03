import React from 'react';
import { X, CheckCircle2, Compass, Layers, Shield } from 'lucide-react';

interface SpecificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecificationModal: React.FC<SpecificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-2xl rounded-sm border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-900 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 dark:text-stone-400">
          <Shield className="h-3.5 w-3.5" />
          <span>Curatorial Specification Standard</span>
        </div>

        <h3 id="modal-title" className="mt-2 font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
          Chamber Atmospheric Charter & Calibration
        </h3>

        <div className="mt-4 space-y-4 text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
          <p>
            The Aethelgard Atrium operates under strict ceremonial guidelines to provide dignified visual experiences. Every induction adheres to verified spatial and temporal tolerances:
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
            
            <div className="rounded-xs border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-950">
              <div className="flex items-center gap-2 font-serif font-semibold text-stone-900 dark:text-stone-100">
                <Compass className="h-4 w-4 text-sky-600" />
                <span>Snowflake Crystallography</span>
              </div>
              <ul className="mt-2.5 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <li>• <strong>Medium Scale:</strong> 26px to 38px diameter</li>
                <li>• <strong>Trajectory:</strong> Top boundary to bottom boundary</li>
                <li>• <strong>Duration:</strong> 5.00 seconds active generation</li>
                <li>• <strong>Geometry:</strong> 6-fold dendritic hexagonal symmetry</li>
              </ul>
            </div>

            <div className="rounded-xs border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-950">
              <div className="flex items-center gap-2 font-serif font-semibold text-stone-900 dark:text-stone-100">
                <Layers className="h-4 w-4 text-amber-600" />
                <span>Balloon Regalia Physics</span>
              </div>
              <ul className="mt-2.5 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <li>• <strong>Medium Scale:</strong> 44px to 54px width, 54px to 66px height</li>
                <li>• <strong>Trajectory:</strong> Bottom boundary to top boundary</li>
                <li>• <strong>Duration:</strong> 5.00 seconds active generation</li>
                <li>• <strong>Finish:</strong> 3D radial lustre with weighted silk tether</li>
              </ul>
            </div>

          </div>

          <div className="rounded-xs border border-stone-200/80 bg-stone-50/50 p-3.5 text-xs text-stone-500 dark:border-stone-800/80 dark:bg-stone-950/40">
            <span className="font-semibold text-stone-700 dark:text-stone-300">Invariant Assurance:</span> Both atmospheric states operate on high-precision HTML5 Canvas renderers synchronized with browser refresh timing, guaranteeing smooth 60fps presentation regardless of viewport dimensions.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 rounded-xs hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
