import React, { useState } from 'react';
import { LABORATORY_APPARATUS, HAZARD_SYMBOLS } from '../../data/apparatusData';
import { ApparatusItem } from '../../types/chemistry';
import { Search, ShieldAlert, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export const ApparatusGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'apparatus' | 'hazards'>('apparatus');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ApparatusItem | null>(LABORATORY_APPARATUS[0]);

  const categories = [
    { id: 'all', label: 'All Apparatus' },
    { id: 'reaction', label: 'Reaction & Mixing' },
    { id: 'measurement', label: 'Measurement' },
    { id: 'heating', label: 'Heating' },
    { id: 'separation', label: 'Separation' },
    { id: 'support', label: 'Support & Stands' },
    { id: 'holding', label: 'Holding & Cleaning' },
  ];

  const filteredApparatus = LABORATORY_APPARATUS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.primaryUse.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Vector SVG renderers for each of the 16 laboratory apparatuses
  const renderApparatusSvg = (type: string) => {
    switch (type) {
      case 'test-tube':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-emerald-600 fill-none" strokeWidth="2.5" strokeLinecap="round">
            <path d="M40,15 L40,85 C40,96 60,96 60,85 L60,15" />
            <ellipse cx="50" cy="15" rx="10" ry="3" className="stroke-emerald-600 fill-emerald-100" />
            <path d="M40,65 Q50,68 60,65 L60,85 C60,96 40,96 40,85 Z" className="fill-emerald-200 stroke-emerald-600" />
            <circle cx="48" cy="72" r="1.5" className="fill-emerald-600" />
            <circle cx="53" cy="78" r="1" className="fill-emerald-600" />
          </svg>
        );
      case 'brush':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-indigo-600 fill-none" strokeWidth="2">
            <line x1="20" y1="100" x2="80" y2="20" className="stroke-slate-500" strokeWidth="3" />
            <line x1="50" y1="50" x2="65" y2="40" className="stroke-indigo-600" />
            <line x1="55" y1="55" x2="70" y2="45" className="stroke-indigo-600" />
            <line x1="60" y1="60" x2="75" y2="50" className="stroke-indigo-600" />
            <line x1="65" y1="65" x2="80" y2="55" className="stroke-indigo-600" />
            <line x1="45" y1="45" x2="60" y2="35" className="stroke-indigo-600" />
            <circle cx="80" cy="20" r="4" className="stroke-slate-400 fill-slate-300" />
          </svg>
        );
      case 'conical-flask':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-blue-600 fill-none" strokeWidth="2.5" strokeLinecap="round">
            <path d="M43,15 L43,35 L20,95 C18,102 24,105 30,105 L70,105 C76,105 82,102 80,95 L57,35 L57,15" />
            <ellipse cx="50" cy="15" rx="7" ry="2.5" className="stroke-blue-600 fill-blue-100" />
            <path d="M26,80 L74,80 L79,95 C81,102 75,105 70,105 L30,105 C25,105 19,102 21,95 Z" className="fill-blue-100 stroke-none" />
            <line x1="33" y1="65" x2="43" y2="65" strokeWidth="1.5" className="stroke-blue-400" />
            <line x1="30" y1="80" x2="44" y2="80" strokeWidth="1.5" className="stroke-blue-400" />
            <line x1="26" y1="95" x2="45" y2="95" strokeWidth="1.5" className="stroke-blue-400" />
          </svg>
        );
      case 'round-bottom-flask':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-purple-600 fill-none" strokeWidth="2.5" strokeLinecap="round">
            <path d="M45,15 L45,45 C30,52 20,68 20,82 C20,98 33,110 50,110 C67,110 80,98 80,82 C80,68 70,52 55,45 L55,15" />
            <ellipse cx="50" cy="15" rx="5" ry="2" className="stroke-purple-600 fill-purple-100" />
            <path d="M22,82 C22,98 34,108 50,108 C66,108 78,98 78,82 Q50,78 22,82 Z" className="fill-purple-100 stroke-none" />
          </svg>
        );
      case 'evaporating-dish':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-amber-600 fill-none" strokeWidth="2.5">
            <path d="M15,55 C15,85 85,85 85,55 L88,52" />
            <ellipse cx="50" cy="55" rx="35" ry="8" className="stroke-amber-600 fill-amber-50" />
            <ellipse cx="50" cy="62" rx="25" ry="5" className="fill-amber-200 stroke-none" />
            <path d="M45,40 Q42,30 46,20 M52,42 Q56,32 50,22 M60,40 Q63,30 58,22" className="stroke-amber-500" strokeWidth="1.5" strokeDasharray="3,3" />
          </svg>
        );
      case 'glass-rod':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-indigo-500 fill-none" strokeWidth="2">
            <rect x="46" y="15" width="8" height="90" rx="4" className="stroke-indigo-500 fill-indigo-100" />
            <line x1="49" y1="20" x2="49" y2="100" className="stroke-indigo-300" strokeWidth="1" />
          </svg>
        );
      case 'burette':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-teal-600 fill-none" strokeWidth="2">
            <rect x="44" y="10" width="12" height="75" rx="1" className="fill-teal-50" />
            <line x1="44" y1="20" x2="50" y2="20" />
            <line x1="44" y1="30" x2="52" y2="30" />
            <line x1="44" y1="40" x2="50" y2="40" />
            <line x1="44" y1="50" x2="52" y2="50" />
            <line x1="44" y1="60" x2="50" y2="60" />
            <line x1="44" y1="70" x2="52" y2="70" />
            <circle cx="50" cy="90" r="5" className="fill-teal-600 stroke-teal-700" />
            <line x1="38" y1="90" x2="62" y2="90" strokeWidth="3" className="stroke-teal-700" />
            <path d="M47,95 L49,112 L51,112 L53,95" className="fill-teal-600" />
          </svg>
        );
      case 'measuring-cylinder':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-sky-600 fill-none" strokeWidth="2.5">
            <rect x="38" y="15" width="24" height="85" rx="2" className="fill-sky-50" />
            <path d="M28,100 L72,100 L72,108 L28,108 Z" className="fill-slate-200 stroke-sky-600" />
            <line x1="38" y1="30" x2="48" y2="30" strokeWidth="1.5" />
            <line x1="38" y1="45" x2="52" y2="45" strokeWidth="2" />
            <line x1="38" y1="60" x2="48" y2="60" strokeWidth="1.5" />
            <line x1="38" y1="75" x2="52" y2="75" strokeWidth="2" />
            <path d="M38,60 Q50,65 62,60 L62,99 L38,99 Z" className="fill-sky-200 stroke-sky-600" />
          </svg>
        );
      case 'funnel':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-emerald-600 fill-none" strokeWidth="2.5">
            <path d="M20,20 L80,20 L55,60 L55,105 L45,110 L45,60 Z" />
            <ellipse cx="50" cy="20" rx="30" ry="5" className="fill-emerald-50" />
            <path d="M30,23 L70,23 L50,56 Z" className="fill-emerald-100 stroke-emerald-500 stroke-dasharray-2" />
          </svg>
        );
      case 'mortar-pestle':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-rose-600 fill-none" strokeWidth="2.5">
            <path d="M15,60 C15,95 85,95 85,60 L90,56 C90,56 10,56 10,56 Z" className="fill-rose-50" />
            <path d="M45,20 L68,60 C70,68 60,72 55,66 L38,28 Z" className="fill-slate-200 stroke-rose-600" />
          </svg>
        );
      case 'clamp-stand':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-slate-700 fill-none" strokeWidth="2.5">
            <rect x="15" y="100" width="70" height="12" rx="2" className="fill-slate-300 stroke-slate-600" />
            <line x1="30" y1="100" x2="30" y2="15" strokeWidth="4" className="stroke-slate-700" />
            <circle cx="30" cy="45" r="4" className="fill-amber-500 stroke-amber-600" />
            <line x1="30" y1="45" x2="65" y2="45" strokeWidth="3" className="stroke-slate-700" />
            <path d="M65,38 L75,38 M65,52 L75,52" strokeWidth="3" className="stroke-amber-600" />
          </svg>
        );
      case 'beaker':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-cyan-600 fill-none" strokeWidth="2.5">
            <path d="M22,20 L22,95 C22,102 28,105 35,105 L65,105 C72,105 78,102 78,95 L78,20 L84,16 L78,20 L22,20 L16,16" />
            <path d="M23,55 L77,55 L77,95 C77,101 72,104 65,104 L35,104 C28,104 23,101 23,95 Z" className="fill-cyan-100 stroke-none" />
            <line x1="25" y1="40" x2="38" y2="40" strokeWidth="1.5" />
            <line x1="25" y1="60" x2="44" y2="60" strokeWidth="2" />
            <line x1="25" y1="80" x2="38" y2="80" strokeWidth="1.5" />
          </svg>
        );
      case 'tripod-stand':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-slate-700 fill-none" strokeWidth="2.5">
            <ellipse cx="50" cy="35" rx="35" ry="8" className="stroke-slate-600 fill-slate-200" />
            <line x1="22" y1="38" x2="12" y2="105" strokeWidth="3" />
            <line x1="50" y1="42" x2="50" y2="108" strokeWidth="3" />
            <line x1="78" y1="38" x2="88" y2="105" strokeWidth="3" />
          </svg>
        );
      case 'wire-gauze':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-slate-500 fill-none" strokeWidth="1.5">
            <rect x="20" y="35" width="60" height="50" rx="3" className="stroke-slate-500 fill-slate-50" />
            <circle cx="50" cy="60" r="16" className="fill-slate-300 stroke-slate-400" />
            <line x1="30" y1="35" x2="30" y2="85" />
            <line x1="40" y1="35" x2="40" y2="85" />
            <line x1="60" y1="35" x2="60" y2="85" />
            <line x1="70" y1="35" x2="70" y2="85" />
            <line x1="20" y1="45" x2="80" y2="45" />
            <line x1="20" y1="55" x2="80" y2="55" />
            <line x1="20" y1="65" x2="80" y2="65" />
            <line x1="20" y1="75" x2="80" y2="75" />
          </svg>
        );
      case 'bunsen-burner':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-amber-600 fill-none" strokeWidth="2.5">
            <ellipse cx="50" cy="105" rx="32" ry="7" className="fill-slate-200 stroke-slate-500" />
            <rect x="45" y="45" width="10" height="55" className="fill-slate-100 stroke-slate-500" />
            <rect x="43" y="78" width="14" height="10" rx="1" className="fill-amber-500 stroke-amber-600" />
            <circle cx="50" cy="83" r="2" className="fill-slate-800" />
            <path d="M45,95 L22,95 L18,102" className="stroke-slate-500" strokeWidth="3" />
            <path d="M46,45 C46,25 50,15 50,15 C50,15 54,25 54,45 Z" className="fill-blue-500 stroke-cyan-500" />
            <path d="M48,45 C48,32 50,22 50,22 C50,22 52,32 52,45 Z" className="fill-amber-300 stroke-yellow-400" />
          </svg>
        );
      case 'tongs':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-slate-600 fill-none" strokeWidth="2.5">
            <path d="M30,105 C30,85 45,65 50,55 C55,45 42,30 38,20" />
            <path d="M70,105 C70,85 55,65 50,55 C45,45 58,30 62,20" />
            <circle cx="50" cy="55" r="3" className="fill-amber-500 stroke-amber-600" />
            <circle cx="28" cy="105" r="5" />
            <circle cx="72" cy="105" r="5" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xs text-slate-800 dark:text-slate-200">
      {/* Header with Sub-tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Interactive Laboratory Visual Guide
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Master the 16 core syllabus apparatus and chemical hazard warning pictograms for MANEB JCE & MSCE practicals.
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 self-stretch sm:self-auto shrink-0">
          <button
            type="button"
            id="tab-apparatus-btn"
            onClick={() => setActiveTab('apparatus')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'apparatus'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Apparatus Gallery ({LABORATORY_APPARATUS.length})
          </button>
          <button
            type="button"
            id="tab-hazards-btn"
            onClick={() => setActiveTab('hazards')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'hazards'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Hazard Warning Symbols ({HAZARD_SYMBOLS.length})
          </button>
        </div>
      </div>

      {activeTab === 'apparatus' ? (
        <div>
          {/* Search & Category Filter Controls */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="search-apparatus-input"
                type="text"
                placeholder="Search apparatus name, use, or keywords (e.g. titration, beaker, heating)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  id={`cat-filter-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 font-bold shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of 16 Apparatus Cards + Detailed Safety Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[520px] overflow-y-auto pr-1">
              {filteredApparatus.length === 0 ? (
                <div className="col-span-full p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">No laboratory apparatus matched "{searchQuery}".</p>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredApparatus.map(item => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      id={`apparatus-card-${item.id}`}
                      onClick={() => setSelectedItem(item)}
                      className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500 shadow-xs scale-[1.02]'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100/70 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="w-16 h-16 mb-2 flex items-center justify-center p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700 group-hover:scale-105 transition-transform shadow-2xs">
                        {renderApparatusSvg(item.svgType)}
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize mt-0.5 font-medium">
                        {item.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Selected Apparatus Inspector */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
              {selectedItem ? (
                <div>
                  <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {selectedItem.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">{selectedItem.name}</h3>
                    </div>
                    <div className="w-16 h-16 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xs shrink-0 flex items-center justify-center">
                      {renderApparatusSvg(selectedItem.svgType)}
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <h4 className="text-slate-500 dark:text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-blue-500" />
                        Description:
                      </h4>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                        {selectedItem.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-emerald-800 dark:text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Primary Practical Use:
                      </h4>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                        {selectedItem.primaryUse}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-amber-800 dark:text-amber-400 font-bold mb-1 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        Essential Safety Tip:
                      </h4>
                      <p className="text-amber-950 dark:text-amber-200 leading-relaxed bg-amber-50 dark:bg-amber-950/50 p-3 rounded-xl border border-amber-200 dark:border-amber-800 shadow-2xs">
                        {selectedItem.safetyTip}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs py-8">
                  Select an apparatus from the grid to view detailed handling & safety guidelines.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Chemical Hazard Warning Symbols Grid */
        <div className="space-y-4">
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">MANEB Practical Exam Warning:</span> Questions testing laboratory hazard symbols, meaning, and emergency precautions frequently appear in Form 1–4 chemistry theory and practical papers.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {HAZARD_SYMBOLS.map(hazard => (
              <div
                key={hazard.id}
                id={`hazard-card-${hazard.id}`}
                className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl p-4 flex flex-col justify-between shadow-2xs transition-all hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl shadow-2xs">
                      <span role="img" aria-label={hazard.name}>{hazard.symbol}</span>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${hazard.badgeBg || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {hazard.dangerLevel}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                    {hazard.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {hazard.meaning}
                  </p>

                  <div className="space-y-2 text-[11px] bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    <div>
                      <span className="font-bold text-amber-800 dark:text-amber-400">Precaution: </span>
                      <span className="text-slate-700 dark:text-slate-300">{hazard.precaution}</span>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-800 dark:text-emerald-400">Common Examples: </span>
                      <span className="text-slate-700 dark:text-slate-300">{hazard.example}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
