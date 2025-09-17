import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAllOptions } from '../api/options';

// Cache keys
const CACHE_KEYS = {
  OPTIONS_DATA: 'options_cache',
  LAST_UPDATED: 'options_last_updated'
};

// Cache duration (24 hours in milliseconds)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Initial state
const initialState = {
  // Data
  storeTypes: [],
  countries: [],
  stores: [],
  sizes: [],
  orderTypes: [],
  skuOptions: [],
  labelingStandards: [],
  
  // Loading states
  isLoading: false,
  isInitialized: false,
  
  // Error states
  errors: {},
  
  // Cache info
  lastUpdated: null,
  cacheValid: false
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_OPTIONS: 'SET_OPTIONS',
  SET_ERROR: 'SET_ERROR',
  SET_INITIALIZED: 'SET_INITIALIZED',
  UPDATE_CACHE_STATUS: 'UPDATE_CACHE_STATUS',
  RESET_ERRORS: 'RESET_ERRORS'
};

// Reducer
const optionsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case ACTIONS.SET_OPTIONS:
      return {
        ...state,
        ...action.payload.data,
        errors: action.payload.errors || {},
        lastUpdated: Date.now(),
        cacheValid: true,
        isLoading: false
      };
    
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        errors: { ...state.errors, [action.payload.type]: action.payload.error },
        isLoading: false
      };
    
    case ACTIONS.SET_INITIALIZED:
      return { ...state, isInitialized: action.payload };
    
    case ACTIONS.UPDATE_CACHE_STATUS:
      return { ...state, cacheValid: action.payload };
    
    case ACTIONS.RESET_ERRORS:
      return { ...state, errors: {} };
    
    default:
      return state;
  }
};

// Create context
const OptionsContext = createContext();

// Provider component
export const OptionsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(optionsReducer, initialState);

  // Check if cache is valid
  const isCacheValid = (timestamp) => {
    if (!timestamp) return false;
    return Date.now() - timestamp < CACHE_DURATION;
  };

  // Load options from cache
  const loadFromCache = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.OPTIONS_DATA);
      const lastUpdated = await AsyncStorage.getItem(CACHE_KEYS.LAST_UPDATED);
      
      if (cachedData && lastUpdated) {
        const parsedData = JSON.parse(cachedData);
        const timestamp = parseInt(lastUpdated);
        
        if (isCacheValid(timestamp)) {
          dispatch({
            type: ACTIONS.SET_OPTIONS,
            payload: { data: parsedData, errors: {} }
          });
          dispatch({ type: ACTIONS.SET_INITIALIZED, payload: true });
          return true;
        }
      }
    } catch (error) {
      console.error('Error loading from cache:', error);
    }
    return false;
  };

  // Save options to cache
  const saveToCache = async (data) => {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.OPTIONS_DATA, JSON.stringify(data));
      await AsyncStorage.setItem(CACHE_KEYS.LAST_UPDATED, Date.now().toString());
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  // Fetch fresh options from API
  const fetchFreshOptions = async (force = false) => {
    if (state.isLoading && !force) return;
    
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.RESET_ERRORS });

    try {
      const result = await fetchAllOptions();
      
      // Extract data (exclude errors)
      const { errors, ...optionsData } = result;
      
      dispatch({
        type: ACTIONS.SET_OPTIONS,
        payload: { data: optionsData, errors }
      });

      // Save to cache
      await saveToCache(optionsData);
      
      if (!state.isInitialized) {
        dispatch({ type: ACTIONS.SET_INITIALIZED, payload: true });
      }

    } catch (error) {
      console.error('Error fetching options:', error);
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: { type: 'fetch', error: error.message }
      });
    }
  };

  // Initialize options (try cache first, then API)
  const initializeOptions = async () => {
    const cacheLoaded = await loadFromCache();
    
    if (!cacheLoaded) {
      await fetchFreshOptions();
    }
  };

  // Refresh options (force fetch from API)
  const refreshOptions = async () => {
    await fetchFreshOptions(true);
  };

  // Clear cache
  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS.OPTIONS_DATA);
      await AsyncStorage.removeItem(CACHE_KEYS.LAST_UPDATED);
      dispatch({ type: ACTIONS.UPDATE_CACHE_STATUS, payload: false });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  // Initialize on mount
  useEffect(() => {
    initializeOptions();
  }, []);

  // Context value
  const value = {
    // State
    ...state,
    
    // Actions
    refreshOptions,
    clearCache,
    initializeOptions,
    
    // Utilities
    isCacheValid: () => isCacheValid(state.lastUpdated),
  };

  return (
    <OptionsContext.Provider value={value}>
      {children}
    </OptionsContext.Provider>
  );
};

// Custom hook to use options context
export const useOptionsContext = () => {
  const context = useContext(OptionsContext);
  if (!context) {
    throw new Error('useOptionsContext must be used within an OptionsProvider');
  }
  return context;
};