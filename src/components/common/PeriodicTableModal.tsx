import React, { useState } from 'react';
import {
  X,
  FlaskConical,
  Atom
} from 'lucide-react';
import { COMMON_RADICALS } from '../../data/periodicTableData';
import { PeriodicTableView } from '../student/PeriodicTableView';

interface PeriodicTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultElementNumber?: number;
}

export const PeriodicTableModal: React.FC<PeriodicTableModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'table' | 'radicals'>('table');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[92vh] max-h-[850px] text-slate-900 dark:text-white">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white font-black shadow-xs shrink-0">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-none">
                Periodic Table & Common Radicals
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Periodic table and common radicals reference for chemistry
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-200/70 dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-3 sm:px-6 pt-2 pb-2 bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'table'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>Periodic Table</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('radicals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'radicals'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-blue-500" />
            <span>Common Radicals</span>
          </button>
        </div>

        {/* Tab 1: Periodic Table */}
        {activeTab === 'table' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
            <PeriodicTableView />
          </div>
        )}

        {/* Tab 2: Common Radicals & Valency Rules */}
        {activeTab === 'radicals' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            <div className="p-4 rounded-3xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
              <FlaskConical className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-sm text-blue-900 dark:text-blue-100">
                  Writing Chemical Formulas via Cross-Over Valency Rule
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  1. Write symbols or radicals side by side &bull; 2. Write valencies underneath &bull; 3. Cross over numbers &bull; 4. Simplify if divisible (e.g. Ca²⁺ + SO₄²⁻ &rarr; CaSO₄; Al³⁺ + SO₄²⁻ &rarr; Al₂(SO₄)₃).
                </p>
              </div>
            </div>

            {/* Radicals Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                      <th className="p-3">Radical Name</th>
                      <th className="p-3">Chemical Formula</th>
                      <th className="p-3">Valency</th>
                      <th className="p-3">Ionic Charge</th>
                      <th className="p-3">Common Compound Example in Malawi Syllabus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {COMMON_RADICALS.map((rad) => (
                      <tr key={rad.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{rad.name}</td>
                        <td className="p-3 font-mono font-black text-emerald-700 dark:text-emerald-400 text-sm">
                          {rad.formula}
                        </td>
                        <td className="p-3 font-mono font-black text-rose-600 dark:text-rose-400">
                          Valency {rad.valency}
                        </td>
                        <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                          {rad.charge}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{rad.commonCompound}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end text-xs text-slate-500 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
