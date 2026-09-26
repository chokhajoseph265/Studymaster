import React, { useState } from 'react';
import { FIRST_TWENTY_ELEMENTS, LATIN_ORIGIN_ELEMENTS } from '../../data/chemistryData';
import { ChemicalElement } from '../../types';
import { Table, BookOpen } from 'lucide-react';

export const PeriodicTableView: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(FIRST_TWENTY_ELEMENTS[10]); // Sodium default
  const [activeFilter, setActiveFilter] = useState<'all' | 'metals' | 'nonmetals' | 'metalloids' | 'latin'>('all');

  const filters = [
    { id: 'all', label: 'All 20 Elements' },
    { id: 'metals', label: 'Metals (Gr I-III)' },
    { id: 'nonmetals', label: 'Non-Metals (Gr IV-VIII)' },
    { id: 'metalloids', label: 'Metalloids (B, Si)' },
    { id: 'latin', label: 'Latin Roots Only' },
  ] as const;

  const getLatinName = (el: ChemicalElement) => {
    return LATIN_ORIGIN_ELEMENTS.find(l => l.symbol === el.symbol)?.latinOrigin;
  };

  const getElementFamilyColor = (el: ChemicalElement) => {
    if (el.group === 1 && el.symbol !== 'H') return 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/70';
    if (el.group === 2) return 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/70';
    if (el.group === 7) return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/70';
    if (el.group === 8) return 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/70';
    if (el.category === 'metalloid') return 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/70';
    if (el.category === 'non-metal') return 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/70';
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700';
  };

  const matchesFilter = (el: ChemicalElement) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'metals') return el.category === 'metal';
    if (activeFilter === 'nonmetals') return el.category === 'non-metal';
    if (activeFilter === 'metalloids') return el.category === 'metalloid';
    if (activeFilter === 'latin') return !!getLatinName(el);
    return true;
  };

  const renderCell = (atomicNumber: number) => {
    const el = FIRST_TWENTY_ELEMENTS.find(e => e.atomicNumber === atomicNumber);
    if (!el) return <div className="p-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-800/20" />;

    const isSelected = selectedElement?.atomicNumber === el.atomicNumber;
    const isHighlighted = matchesFilter(el);
    const latinName = getLatinName(el);

    return (
      <button
        key={el.atomicNumber}
        id={`ptable-cell-${el.symbol}`}
        onClick={() => setSelectedElement(el)}
        className={`p-1.5 sm:p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all relative cursor-pointer min-h-[66px] ${
          isSelected
            ? 'ring-2 ring-emerald-600 scale-105 z-20 shadow-md bg-white dark:bg-slate-800 font-bold'
            : getElementFamilyColor(el)
        } ${!isHighlighted ? 'opacity-30 grayscale' : 'opacity-100'}`}
      >
        {/* Nuclide notation: mass number (A) as superscript on the left, atomic number (Z) as subscript on the left */}
        <div className="flex items-center justify-center font-mono leading-none my-0.5">
          <div className="flex flex-col text-right pr-0.5 select-none font-bold">
            <span
              className="text-[9px] sm:text-[10px] leading-tight text-slate-700 dark:text-slate-200"
              title={`Mass Number (A): ${el.massNumber}`}
            >
              {el.massNumber}
            </span>
            <span
              className="text-[9px] sm:text-[10px] leading-tight text-amber-700 dark:text-amber-400"
              title={`Atomic Number (Z): ${el.atomicNumber}`}
            >
              {el.atomicNumber}
            </span>
          </div>
          <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
            {el.symbol}
          </span>
        </div>

        <div className="text-[9px] font-semibold truncate w-full text-center px-0.5 text-slate-700 dark:text-slate-300">
          {el.name}
        </div>

        {latinName && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full" title="Latin Origin Symbol" />
        )}
      </button>
    );
  };

  const selectedConfigStr = selectedElement?.electronConfig.join('.');
  const selectedValency = selectedElement?.electronConfig[selectedElement.electronConfig.length - 1];
  const selectedLatin = selectedElement ? getLatinName(selectedElement) : undefined;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Periodic Table of Elements (First 20 Elements & Latin Roots)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Arranged by Groups I-VIII (valence electrons) and Periods 1-4 (electron shells).
          </p>
        </div>

        {/* MANEB Notation Guide Badge */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl shrink-0">
          <div className="flex items-center font-mono leading-none">
            <div className="flex flex-col text-[10px] leading-tight text-right pr-1 font-bold select-none">
              <span className="text-slate-700 dark:text-slate-200" title="Mass Number (A)">A</span>
              <span className="text-amber-700 dark:text-amber-400" title="Atomic Number (Z)">Z</span>
            </div>
            <span className="text-base font-black text-slate-900 dark:text-white">X</span>
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
            <span className="font-bold text-slate-800 dark:text-slate-100"><sup>A</sup>Mass No. (top)</span>
            <span className="mx-1 text-slate-400">&bull;</span>
            <span className="font-bold text-amber-700 dark:text-amber-400"><sub>Z</sub>Atomic No. (bottom)</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin">
        {filters.map(f => (
          <button
            key={f.id}
            id={`filter-${f.id}`}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === f.id
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Periodic Table Grid (8 Groups) */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-5 overflow-x-auto">
        <div className="min-w-[650px]">
          <div className="grid grid-cols-8 gap-2 text-center text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 font-mono">
            <div>Group I<span className="block text-[9px] text-slate-500 dark:text-slate-400 font-normal">1 val e⁻</span></div>
            <div>Group II<span className="block text-[9px] text-slate-500 dark:text-slate-400 font-normal">2 val e⁻</span></div>
            <div>Group III<span className="block text-[9px] text-slate-500 dark:text-slate-400 font-normal">3 val e⁻</span></div>
            <div>Group IV<span className="block text-[9px] text-slate-500 dark:text-slate-400 font-normal">4 val e⁻</span></div>
            <div>Group V<span className="block text-[9px] text-slate-500 dark:text-slate-400 font-normal">5 val e⁻</span></div>
            <div>Group VI<span className="block text-[9px] text-slate-500 dark:text-slate-400 font-normal">6 val e⁻</span></div>
            <div>Group VII<span className="block text-[9px] text-slate-500 dark:text-slate-400 font-normal">7 val e⁻</span></div>
            <div>Group VIII<span className="block text-[9px] text-slate-500 dark:text-slate-400 font-normal">8 val e⁻</span></div>
          </div>

          <div className="grid grid-cols-8 gap-2 mb-2">
            {renderCell(1)}
            <div className="col-span-6" />
            {renderCell(2)}
          </div>
          <div className="grid grid-cols-8 gap-2 mb-2">
            {renderCell(3)}
            {renderCell(4)}
            {renderCell(5)}
            {renderCell(6)}
            {renderCell(7)}
            {renderCell(8)}
            {renderCell(9)}
            {renderCell(10)}
          </div>
          <div className="grid grid-cols-8 gap-2 mb-2">
            {renderCell(11)}
            {renderCell(12)}
            {renderCell(13)}
            {renderCell(14)}
            {renderCell(15)}
            {renderCell(16)}
            {renderCell(17)}
            {renderCell(18)}
          </div>
          <div className="grid grid-cols-8 gap-2">
            {renderCell(19)}
            {renderCell(20)}
            <div className="col-span-6" />
          </div>
        </div>
      </div>

      {/* Selected Element Detailed Profile Card */}
      {selectedElement && (
        <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{selectedElement.name}</span>
                <div className="inline-flex items-center font-mono px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 leading-none">
                  <div className="flex flex-col text-[10px] leading-tight text-right pr-1 font-bold select-none">
                    <span className="text-slate-700 dark:text-slate-200" title="Mass Number (A)">{selectedElement.massNumber}</span>
                    <span className="text-amber-700 dark:text-amber-400" title="Atomic Number (Z)">{selectedElement.atomicNumber}</span>
                  </div>
                  <span className="text-xl font-black text-slate-900 dark:text-white leading-none">{selectedElement.symbol}</span>
                </div>
                {selectedLatin && (
                  <span className="text-xs bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-lg font-medium">
                    Latin: <em>{selectedLatin}</em>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Classification: <strong className="text-slate-800 dark:text-slate-200 capitalize">{selectedElement.family || selectedElement.category}</strong> | Group {selectedElement.group} | Period {selectedElement.period}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-4 text-center shadow-2xs">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Atomic Number (Z)</span>
                <span className="font-mono text-base font-bold text-amber-700 dark:text-amber-400">{selectedElement.atomicNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Mass Number (A)</span>
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white">{selectedElement.massNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Electron Config</span>
                <span className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-400">{selectedConfigStr}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <div className="text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">Chemical Group Explanation:</strong> Has{' '}
                <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{selectedValency} valence electron(s)</strong> in its outer shell, placing it in Group {selectedElement.group}.
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">Period Explanation:</strong> Has{' '}
                <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{selectedElement.period} occupied electron shell(s)</strong>, placing it in Period {selectedElement.period}.
              </div>
            </div>

            <div className="space-y-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <div className="text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">Subatomic Particle Breakdown:</strong>
                <div className="font-mono text-xs text-sky-700 dark:text-sky-400 font-bold mt-1">
                  {selectedElement.atomicNumber} Protons, {selectedElement.neutrons} Neutrons, {selectedElement.atomicNumber} Electrons
                </div>
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                {selectedElement.summary}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Latin Origin Reference Table */}
      <div className="mt-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          Elements with Symbols Derived from Ancient Latin Names
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {LATIN_ORIGIN_ELEMENTS.map(item => (
            <div key={item.symbol} className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-2xs">
              <span className="text-sm font-black font-mono text-amber-700 dark:text-amber-400 block">{item.symbol}</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">{item.englishName}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 italic block">({item.latinOrigin})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
