import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Medal,
  ShieldCheck,
  HelpCircle,
  Clock,
  Crown,
  MapPin,
  School,
  Search,
  Filter
} from 'lucide-react';
import { LeaderboardEntry, Badge } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { INITIAL_AVATARS } from '../../data/initialData';

export const MALAWI_DISTRICTS = [
  'All Malawi',
  'Lilongwe',
  'Blantyre',
  'Zomba',
  'Mzuzu / Mzimba',
  'Dedza',
  'Kasungu',
  'Mangochi',
  'Salima',
  'Thyolo',
  'Mulanje',
  'Karonga',
  'Nkhotakota',
  'Balaka',
  'Ntcheu',
  'Dowa',
  'Mchinji'
];

export const MALAWI_POPULAR_SCHOOLS = [
  'Likuni Boys Secondary',
  'Marymount Catholic Girls Secondary',
  'Dedza Secondary School',
  'Chichiri Secondary School',
  'Bwaila Secondary School',
  'Lilongwe Girls Secondary',
  'St. Patricks Secondary',
  'Kamuzu Academy',
  'Robert Laws Secondary',
  'Zingwangwa Secondary',
  'Zomba Catholic Secondary',
  'Mzuzu Government Secondary',
  'Nkhata Bay Secondary',
  'Chaminade Secondary',
  'Blantyre Secondary School (BSS)'
];

export const WeeklyLeaderboardView: React.FC = () => {
  const { user } = useAuth();
  const [top10, setTop10] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'badges' | 'rules'>('leaderboard');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Malawi');
  const [schoolSearch, setSchoolSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [leaderboardData, badgesData] = await Promise.all([
          api.getLeaderboard(),
          api.getBadges()
        ]);
        setTop10(leaderboardData.top10);
        setCurrentUserRank(leaderboardData.currentUserEntry);
        setBadges(badgesData);
      } catch (e) {
        console.warn('Leaderboard fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-2xl" title="1st Place (Gold)">🥇</span>;
    if (rank === 2) return <span className="text-2xl" title="2nd Place (Silver)">🥈</span>;
    if (rank === 3) return <span className="text-2xl" title="3rd Place (Bronze)">🥉</span>;
    return <span className="text-sm font-black text-neutral-400">#{rank}</span>;
  };

  // Attach deterministic demo school and district based on user id/index for realistic filtering
  const enrichedLeaderboard = top10.map((entry, idx) => {
    const school = MALAWI_POPULAR_SCHOOLS[idx % MALAWI_POPULAR_SCHOOLS.length];
    let district = 'Lilongwe';
    if (school.includes('Blantyre') || school.includes('Chichiri') || school.includes('Zingwangwa')) district = 'Blantyre';
    else if (school.includes('Zomba')) district = 'Zomba';
    else if (school.includes('Mzuzu') || school.includes('Robert Laws')) district = 'Mzuzu / Mzimba';
    else if (school.includes('Dedza')) district = 'Dedza';
    else if (school.includes('Marymount') || school.includes('Chaminade') || school.includes('Karonga')) district = 'Karonga';
    else if (school.includes('Kamuzu Academy') || school.includes('Kasungu')) district = 'Kasungu';

    return {
      ...entry,
      schoolName: school,
      district
    };
  });

  const filteredEntries = enrichedLeaderboard.filter((entry) => {
    const matchesDistrict = selectedDistrict === 'All Malawi' || entry.district === selectedDistrict;
    const matchesSchool =
      !schoolSearch ||
      entry.schoolName.toLowerCase().includes(schoolSearch.toLowerCase()) ||
      entry.username.toLowerCase().includes(schoolSearch.toLowerCase());
    return matchesDistrict && matchesSchool;
  });

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto">
      {/* Hero Banner */}
      <div className="p-5 rounded-3xl bg-neutral-900 text-white shadow-md border border-neutral-800">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40">
                National Academic Rankings
              </span>
              <span className="text-xs text-neutral-300 font-semibold">Resets Every Sunday</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              Weekly Scholar Leaderboard
            </h1>
            <p className="text-xs text-amber-100/90 font-medium mt-0.5 max-w-md">
              Top highest-achieving secondary school scholars across all 28 districts of Malawi.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
            <Trophy className="w-7 h-7" />
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-white text-slate-950 dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Top Rankings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('badges')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-white text-slate-950 dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Badges Collection ({badges.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-white text-slate-950 dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Points Rules
          </button>
        </div>
      </div>

      {/* Current Student Rank Card if available */}
      {currentUserRank && (
        <div className="p-4 rounded-2xl bg-emerald-950 text-white shadow-xs flex items-center justify-between gap-3 border border-emerald-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sm font-black text-amber-300">
              #{currentUserRank.rank}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Your Current Standing
              </span>
              <h3 className="text-sm font-extrabold text-white">
                {currentUserRank.username} ({currentUserRank.activeForm})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-black text-white">{currentUserRank.weeklyPoints}</span>
            <span className="text-[10px] text-slate-300">pts</span>
          </div>
        </div>
      )}

      {/* TAB 1: LEADERBOARD LIST WITH DISTRICT & SCHOOL FILTER */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-3">
          {/* District & School Filter Bar */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by school (e.g. Likuni, Marymount, Dedza) or scholar name..."
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {MALAWI_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 font-medium">
              <span>Showing {filteredEntries.length} scholars in {selectedDistrict}</span>
              {(selectedDistrict !== 'All Malawi' || schoolSearch) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDistrict('All Malawi');
                    setSchoolSearch('');
                  }}
                  className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Roster Cards */}
          <div className="space-y-2.5">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry, idx) => {
                const avatar = INITIAL_AVATARS.find((a) => a.id === entry.avatarId) || INITIAL_AVATARS[0];
                const isMe = user?.id === entry.userId;

                return (
                  <div
                    key={entry.userId}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-2xs ${
                      isMe
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 flex items-center justify-center shrink-0">
                        {getRankBadge(idx + 1)}
                      </div>

                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${avatar.accentBg}`}>
                        {avatar.emoji}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                            {entry.username}
                          </h4>
                          {entry.isPremium && (
                            <Crown className="w-3 h-3 text-amber-500 fill-amber-400" />
                          )}
                          {isMe && (
                            <span className="text-[9px] font-black text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/80 px-2 py-0.5 rounded-sm uppercase">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          <span className="font-semibold">{entry.activeForm}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                            <School className="w-3 h-3 text-amber-500" />
                            {entry.schoolName} ({entry.district})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-black shrink-0">
                      <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>{entry.weeklyPoints}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">pts</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-400 space-y-2">
                <School className="w-8 h-8 mx-auto text-slate-500" />
                <p className="text-xs font-medium">No scholars found matching your school or district filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDistrict('All Malawi');
                    setSchoolSearch('');
                  }}
                  className="text-xs font-bold text-amber-500 underline cursor-pointer"
                >
                  View All Malawi Rankings
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BADGES SHOWCASE */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badges.map((badge) => {
            const hasUnlocked = user?.badges?.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  hasUnlocked
                    ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700 shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-2xl shrink-0">
                  {badge.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">{badge.name}</h4>
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                      +{badge.pointsReward} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{badge.description}</p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold">
                    {hasUnlocked ? (
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Unlocked & Claimed
                      </span>
                    ) : (
                      <span className="text-slate-400">Locked • Complete criteria</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: POINT RULES & ANTI-CHEAT */}
      {activeTab === 'rules' && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">How Points Are Earned:</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Points fuel your weekly leaderboard rank and unlock rare scholar badges.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Pass Practice Quiz</span>
              <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400">+50 Points</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Study Past Exam Paper</span>
              <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400">+20 Points</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Complete Practice Question</span>
              <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400">+10 Points</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Daily App Login & Study</span>
              <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400">+15 Points</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200 space-y-1">
            <h4 className="font-extrabold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              Anti-Cheat Integrity System
            </h4>
            <p className="text-[11px] leading-relaxed font-medium">
              Points are awarded strictly once per unique topic, question, or assessment. Reloading pages or repeating identical submissions does not artificially inflate points, ensuring 100% fair Malawian academic rankings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
