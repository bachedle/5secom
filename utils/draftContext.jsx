// context/DraftContext.js
import { createContext, useState, useEffect, useContext, useCallback, useRef } from "react";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "./authContext";
import { AppState } from "react-native";

export const DraftContext = createContext();

const initialDraft = {
  version: 0,
  id: null,
  name: null,
  address: null,
  phone: null,
  email: null,
  area: null,
  areaAdmin: null,
  labelingStandard: null,
  lat: null,
  lon: null,
  facilityType: null,
  stateOpt: null,
  orgUnit: null,
  skuOpt: null,
  ownerName: null,
  ownerPhoneNumber: null,
  storeType: null,
  country: null,
  store: null,
  sku: null,
  code: null,
  idNumber: null,
  sampleSource: null,
  isPriority: false,
  note: null,
  attr1: null,
  attr2: null,
  attr3: null,
  attr4: null,
  attr5: null,
  _lastModified: null,
  _userId: null,
};

// Utility functions
const generateDraftKey = (userId) => `orderDraft_${userId}`;
const generateTempKey = () => `orderDraft_temp_${Date.now()}`;

const cleanOrder = (draft) => {
  const cleaned = { ...draft };
  ["facilityType", "stateOpt", "orgUnit", "skuOpt"].forEach((key) => {
    if (cleaned[key] && !cleaned[key].id) {
      cleaned[key] = null;
    }
  });
  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === "") cleaned[key] = null;
    if (key.startsWith('_')) delete cleaned[key]; // Remove internal fields
  });
  return cleaned;
};

export const DraftProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const userId = user?.id;
  const isLoggedIn = authContext?.isLoggedIn;

  const [draftOrder, setDraftOrder] = useState(initialDraft);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs for optimization
  const saveTimeoutRef = useRef(null);
  const batchUpdatesRef = useRef({});
  const lastSavedRef = useRef(null);

  // Cleanup expired drafts
  const cleanupExpiredDrafts = useCallback(async () => {
    try {
      const allKeys = await SecureStore.getAllKeysAsync?.() || [];
      const draftKeys = allKeys.filter(key => key.startsWith('orderDraft_'));
      
      for (const key of draftKeys) {
        try {
          const draftData = await SecureStore.getItemAsync(key);
          if (draftData) {
            const parsed = JSON.parse(draftData);
            const lastModified = new Date(parsed._lastModified);
            const daysSinceModified = (Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24);
            
            // Remove drafts older than 7 days or from different users when logged in
            if (daysSinceModified > 7 || (userId && parsed._userId && parsed._userId !== userId)) {
              await SecureStore.deleteItemAsync(key);
              console.log(`Cleaned up expired/foreign draft: ${key}`);
            }
          }
        } catch (error) {
          // If we can't parse, delete the corrupted entry
          await SecureStore.deleteItemAsync(key);
        }
      }
    } catch (error) {
      console.error("Error cleaning up drafts:", error);
    }
  }, [userId]);

  // Load user-specific draft
  const loadDraft = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      await cleanupExpiredDrafts();
      
      const draftKey = generateDraftKey(userId);
      const savedDraft = await SecureStore.getItemAsync(draftKey);
      
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        
        // Verify ownership and validity
        if (parsed._userId === userId) {
          const lastModified = new Date(parsed._lastModified);
          const hoursSinceModified = (Date.now() - lastModified.getTime()) / (1000 * 60 * 60);
          
          // Auto-expire drafts older than 24 hours
          if (hoursSinceModified < 24) {
            setDraftOrder(parsed);
            lastSavedRef.current = JSON.stringify(parsed);
            console.log(`Loaded draft for user ${userId}`);
          } else {
            await SecureStore.deleteItemAsync(draftKey);
            console.log(`Expired draft deleted for user ${userId}`);
          }
        } else {
          // Wrong user's draft, delete it
          await SecureStore.deleteItemAsync(draftKey);
        }
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, cleanupExpiredDrafts]);

  // Optimized save function with batching
  const saveDraft = useCallback(async (immediate = false) => {
    if (!userId) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    const performSave = async () => {
      try {
        const currentDraft = {
          ...draftOrder,
          ...batchUpdatesRef.current,
          _lastModified: new Date().toISOString(),
          _userId: userId
        };

        const serialized = JSON.stringify(currentDraft);
        
        // Only save if data actually changed
        if (serialized !== lastSavedRef.current) {
          const draftKey = generateDraftKey(userId);
          await SecureStore.setItemAsync(draftKey, serialized);
          lastSavedRef.current = serialized;
          setIsDirty(false);
          batchUpdatesRef.current = {};
          console.log(`Draft saved for user ${userId}`);
        }
      } catch (error) {
        console.error("Error saving draft:", error);
      }
    };

    if (immediate) {
      await performSave();
    } else {
      // Debounced save (2 seconds)
      saveTimeoutRef.current = setTimeout(performSave, 2000);
    }
  }, [userId, draftOrder]);

  // Optimized update function with batching
  const updateDraft = useCallback((updates) => {
    // Batch updates for performance
    batchUpdatesRef.current = { ...batchUpdatesRef.current, ...updates };
    
    // Update local state immediately for UI responsiveness
    setDraftOrder(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
    
    // Trigger debounced save
    saveDraft(false);
  }, [saveDraft]);

  const updateDraftPath = useCallback((field, value) => {
    updateDraft({ [field]: value });
  }, [updateDraft]);

  // Force immediate save (for navigation, app backgrounding)
  const saveImmediately = useCallback(async () => {
    await saveDraft(true);
  }, [saveDraft]);

  // Reset draft with proper cleanup
  const resetDraft = useCallback(async () => {
    if (!userId) return;

    try {
      const draftKey = generateDraftKey(userId);
      await SecureStore.deleteItemAsync(draftKey);
      
      setDraftOrder(initialDraft);
      setIsDirty(false);
      batchUpdatesRef.current = {};
      lastSavedRef.current = null;
      
      // Clear any pending saves
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      
      console.log(`Draft reset for user ${userId}`);
    } catch (error) {
      console.error("Error resetting draft:", error);
    }
  }, [userId]);

  // Handle auth state changes
  useEffect(() => {
    if (isLoggedIn && userId) {
      loadDraft();
    } else {
      // User logged out or no user - reset everything
      setDraftOrder(initialDraft);
      setIsDirty(false);
      batchUpdatesRef.current = {};
      lastSavedRef.current = null;
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    }
  }, [isLoggedIn, userId, loadDraft]);

  // Save immediately when app goes to background
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' && isDirty) {
        saveImmediately();
      }
    };

    const subscription = AppState?.addEventListener?.('change', handleAppStateChange);
    return () => subscription?.remove?.();
  }, [isDirty, saveImmediately]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Save any pending changes before unmounting
      if (isDirty && userId) {
        saveDraft(true);
      }
    };
  }, [isDirty, userId, saveDraft]);

  const value = {
    draftOrder,
    updateDraft,
    updateDraftPath,
    resetDraft,
    saveImmediately,
    isDirty,
    isLoading,
    cleanOrder: () => cleanOrder(draftOrder),
    
    // Backward compatibility
    draft: draftOrder,
    setDraft: setDraftOrder,
  };

  return (
    <DraftContext.Provider value={value}>
      {children}
    </DraftContext.Provider>
  );
};

export const useDraft = () => {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error('useDraft must be used within a DraftProvider');
  }
  return context;
};