import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { StudentUser, FormLevel, Badge } from '../types';
import { api } from '../services/api';
import { offlineStorage } from '../services/offlineStorage';

interface AuthContextType {
  user: StudentUser | null;
  activeForm: FormLevel;
  setActiveForm: (form: FormLevel) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  isLoading: boolean;
  login: (usernameOrIdentifier: string, password: string) => Promise<void>;
  register: (payload: { username: string; emailOrPhone: string; password: string; avatarId: string; activeForm: FormLevel }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setLocalPremiumStatus: (isPremium: boolean, planId?: 'monthly' | 'two_month') => void;
  updateAvatar: (avatarId: string) => Promise<void>;
  triggerCelebration: (title?: string) => void;
  recentBadgesEarned: Badge[];
  clearRecentBadges: () => void;
  syncOfflineData: () => Promise<number>;
  awardPoints: (points: number, reason: string, activityId?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StudentUser | null>(() => {
    try {
      const stored = localStorage.getItem('studymaster_current_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.username && (/scholar_pass_holder/i.test(parsed.username) || parsed.username === 'kondwani_scholar')) {
          parsed.username = /scholar_pass_holder/i.test(parsed.username) ? 'Student' : 'Kondwani';
          localStorage.setItem('studymaster_current_user', JSON.stringify(parsed));
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [activeForm, setActiveFormState] = useState<FormLevel>(() => {
    if (user?.activeForm) return user.activeForm;
    try {
      const saved = localStorage.getItem('studymaster_default_form') as FormLevel;
      if (saved && ['Form 1', 'Form 2', 'Form 3', 'Form 4'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'Form 2';
  });

  const [isOffline, setIsOfflineState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recentBadgesEarned, setRecentBadgesEarned] = useState<Badge[]>([]);

  useEffect(() => {
    if (user) {
      api.setUserId(user.id);
      localStorage.setItem('studymaster_current_user', JSON.stringify(user));
    } else {
      api.setUserId(null);
      localStorage.removeItem('studymaster_current_user');
    }
  }, [user]);

  // Sync activeForm with user when user changes
  useEffect(() => {
    if (user?.activeForm) {
      setActiveFormState(user.activeForm);
    }
  }, [user?.activeForm]);

  const setIsOffline = (offline: boolean) => {
    setIsOfflineState(offline);
    api.setOfflineSimulation(offline);
    if (!offline) {
      // Trigger sync upon reconnect
      syncOfflineData();
    }
  };

  const setActiveForm = async (form: FormLevel) => {
    setActiveFormState(form);
    try {
      localStorage.setItem('studymaster_default_form', form);
    } catch {}
    if (user && !isOffline) {
      try {
        const res = await api.updateProfile({ activeForm: form });
        setUser(res.user);
      } catch (e) {
        console.warn('Form update profile sync warning:', e);
      }
    }
  };

  const login = async (usernameOrIdentifier: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ usernameOrIdentifier, password });
      setUser(res.user);
      setActiveFormState(res.user.activeForm);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: { username: string; emailOrPhone: string; password: string; avatarId: string; activeForm: FormLevel }) => {
    setIsLoading(true);
    try {
      const res = await api.register(payload);
      setUser(res.user);
      setActiveFormState(res.user.activeForm);
      triggerCelebration('Welcome to StudyMaster!');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studymaster_current_user');
  };

  const refreshUser = async () => {
    if (!user || isOffline) return;
    try {
      const res = await api.getCurrentUser();
      if (res && res.user) {
        // Detect newly activated premium
        if (!user.isPremium && res.user.isPremium) {
          triggerCelebration('🎉 Premium Student Access Activated by Admin!');
        }
        setUser(res.user);
      }
    } catch (e: any) {
      if (e.message && (e.message.includes('deactivated') || e.message.includes('Unauthorized'))) {
        // If student was deactivated
        logout();
      }
    }
  };

  // Live polling: Check for admin approvals and profile updates
  useEffect(() => {
    if (!user || isOffline) return;

    // Refresh immediately on mount or user id change
    refreshUser();

    // Poll every 6 seconds
    const interval = setInterval(() => {
      refreshUser();
    }, 6000);

    // Refresh when user comes back to the tab/app
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        refreshUser();
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [user?.id, isOffline, user?.isPremium]);

  const updateAvatar = async (avatarId: string) => {
    if (!user) return;
    if (!isOffline) {
      const res = await api.updateProfile({ avatarId });
      setUser(res.user);
    } else {
      setUser({ ...user, avatarId });
    }
  };

  const triggerCelebration = (title?: string) => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#166534', '#dc2626', '#111827', '#eab308']
      });
    } catch (e) {
      console.log('Celebration triggered:', title);
    }
  };

  const clearRecentBadges = () => setRecentBadgesEarned([]);

  const syncOfflineData = async (): Promise<number> => {
    try {
      const { syncedCount } = await api.syncOfflineQueue();
      if (syncedCount > 0) {
        await refreshUser();
      }
      return syncedCount;
    } catch {
      return 0;
    }
  };

  const awardPoints = async (points: number, reason: string, activityId?: string) => {
    if (!user) return;
    const actId = activityId || `activity-${Date.now()}`;
    try {
      const res = await api.awardActivityPoints({
        userId: user.id,
        activityId: actId,
        points,
        activityName: reason
      });
      if (res && 'user' in res && res.user) {
        setUser(res.user);
        if ('newBadges' in res && res.newBadges && res.newBadges.length > 0) {
          setRecentBadgesEarned((prev) => [...prev, ...res.newBadges]);
        }
      } else {
        // Offline or queued
        const updatedUser: StudentUser = {
          ...user,
          points: (user.points || 0) + points,
          weeklyPoints: (user.weeklyPoints || 0) + points,
          completedActivityIds: [...(user.completedActivityIds || []), actId]
        };
        setUser(updatedUser);
        localStorage.setItem('studymaster_current_user', JSON.stringify(updatedUser));
      }
    } catch {
      // Local optimistic fallback
      const updatedUser: StudentUser = {
        ...user,
        points: (user.points || 0) + points,
        weeklyPoints: (user.weeklyPoints || 0) + points,
        completedActivityIds: [...(user.completedActivityIds || []), actId]
      };
      setUser(updatedUser);
      localStorage.setItem('studymaster_current_user', JSON.stringify(updatedUser));
    }
  };

  const setLocalPremiumStatus = (isPremium: boolean, planId: 'monthly' | 'two_month' = 'monthly') => {
    const durationDays = planId === 'two_month' ? 60 : 30;
    const expiry = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (user) {
      const updatedUser: StudentUser = {
        ...user,
        isPremium,
        premiumExpiry: expiry
      };
      setUser(updatedUser);
      localStorage.setItem('studymaster_current_user', JSON.stringify(updatedUser));
    } else {
      const guestUser: StudentUser = {
        id: `guest-${Date.now()}`,
        username: 'Student',
        emailOrPhone: 'student@studymaster.mw',
        avatarId: 'academic-cap',
        activeForm: 'Form 4',
        points: 500,
        weeklyPoints: 500,
        badges: [],
        completedActivityIds: [],
        isPremium: true,
        premiumExpiry: expiry,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      setUser(guestUser);
      localStorage.setItem('studymaster_current_user', JSON.stringify(guestUser));
    }
    if (isPremium) {
      triggerCelebration('🎉 StudyMaster Premium Access Activated!');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeForm,
        setActiveForm,
        isOffline,
        setIsOffline,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        setLocalPremiumStatus,
        updateAvatar,
        triggerCelebration,
        recentBadgesEarned,
        clearRecentBadges,
        syncOfflineData,
        awardPoints
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
