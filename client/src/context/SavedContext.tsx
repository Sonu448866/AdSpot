import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { Listing } from '../types';

interface SavedItem {
  _id: string;
  listing: Listing;
  savedAt: string;
}

interface SavedContextType {
  savedListings: SavedItem[];
  savedIds: Set<string>;
  loading: boolean;
  isSaved: (listingId: string) => boolean;
  toggleSave: (listing: Listing) => Promise<boolean>;
  refreshSaved: () => Promise<void>;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export const SavedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [savedListings, setSavedListings] = useState<SavedItem[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const refreshSaved = async () => {
    if (!isAuthenticated) {
      setSavedListings([]);
      setSavedIds(new Set());
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/saved');
      setSavedListings(res.data.data || []);
      const ids = new Set<string>((res.data.data || []).map((item: SavedItem) => item.listing?._id));
      setSavedIds(ids);
    } catch (err) {
      console.error('[SavedContext] Error fetching saved listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSaved();
  }, [isAuthenticated]);

  const isSaved = (listingId: string) => {
    return savedIds.has(listingId);
  };

  const toggleSave = async (listing: Listing): Promise<boolean> => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return false;
    }

    const listingId = listing._id;
    const currentlySaved = savedIds.has(listingId);

    // Optimistic UI update
    const updatedIds = new Set(savedIds);
    if (currentlySaved) {
      updatedIds.delete(listingId);
      setSavedIds(updatedIds);
      setSavedListings((prev) => prev.filter((item) => item.listing?._id !== listingId));
      try {
        await api.delete(`/saved/${listingId}`);
        return false;
      } catch (err) {
        // Rollback
        refreshSaved();
        return true;
      }
    } else {
      updatedIds.add(listingId);
      setSavedIds(updatedIds);
      setSavedListings((prev) => [
        { _id: `temp_${Date.now()}`, listing, savedAt: new Date().toISOString() },
        ...prev,
      ]);
      try {
        await api.post(`/saved/${listingId}`);
        return true;
      } catch (err) {
        // Rollback
        refreshSaved();
        return false;
      }
    }
  };

  return (
    <SavedContext.Provider
      value={{
        savedListings,
        savedIds,
        loading,
        isSaved,
        toggleSave,
        refreshSaved,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
};
