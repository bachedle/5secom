// context/OptionsContext.js
import { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";
import * as SecureStore from "expo-secure-store";

export const OptionsContext = createContext();

const API_URL = "https://5secom.dientoan.vn/api";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const CACHE_PREFIX = "options_cache_";

// Cache structure for each option type
const createCacheEntry = (data) => ({
  data,
  timestamp: Date.now(),
  expires: Date.now() + CACHE_DURATION,
});

const isCacheValid = (cacheEntry) => {
  return cacheEntry && Date.now() < cacheEntry.expires;
};

const getCacheKey = (optionType, userId) => {
  // Ensure userId is valid, fallback to 'anonymous' if not
  const validUserId = userId && String(userId).trim() ? String(userId) : 'anonymous';
  return `${CACHE_PREFIX}${optionType}_${validUserId}`;
};

export const OptionsProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const token = authContext?.token ?? authContext?.authState?.token;
  const userId = authContext?.user?.id;
  const isLoggedIn = authContext?.isLoggedIn ?? !!token;

  const [options, setOptions] = useState({
    facilities: [],
    storeTypes: [],
    countries: [],
    stores: [],
    skuOptions: [],
    sizes: [],
    orderTypes: [],
    labelingStandards: [],
  });

  const [loading, setLoading] = useState({
    facilities: false,
    storeTypes: false,
    countries: false,
    stores: false,
    skuOptions: false,
    sizes: false,
    orderTypes: false,
    labelingStandards: false,
  });

  const [errors, setErrors] = useState({});

  // Generic cache operations
  const getCachedData = useCallback(async (optionType) => {
    try {
      const cacheKey = getCacheKey(optionType, userId);
      
      // Validate cache key before using
      if (!cacheKey || cacheKey.includes('undefined') || cacheKey.includes('null')) {
        console.warn(`Invalid cache key for ${optionType}: ${cacheKey}`);
        return null;
      }
      
      const cached = await SecureStore.getItemAsync(cacheKey);
      
      if (cached) {
        const parsedCache = JSON.parse(cached);
        if (isCacheValid(parsedCache)) {
          return parsedCache.data;
        } else {
          // Remove expired cache
          await SecureStore.deleteItemAsync(cacheKey);
        }
      }
    } catch (error) {
      console.warn(`Error reading cache for ${optionType}:`, error.message || error);
    }
    return null;
  }, [userId]);

  const setCachedData = useCallback(async (optionType, data) => {
    try {
      const cacheKey = getCacheKey(optionType, userId);
      
      // Validate cache key before using
      if (!cacheKey || cacheKey.includes('undefined') || cacheKey.includes('null')) {
        console.warn(`Invalid cache key for ${optionType}: ${cacheKey}, skipping cache`);
        return;
      }
      
      const cacheEntry = createCacheEntry(data);
      await SecureStore.setItemAsync(cacheKey, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn(`Error caching data for ${optionType}:`, error.message || error);
    }
  }, [userId]);

  // Generic API fetch with cache
  const fetchWithCache = useCallback(async (optionType, endpoint, transform = (data) => data) => {
    if (!token) return [];

    // Check cache first
    const cached = await getCachedData(optionType);
    if (cached) {
      setOptions(prev => ({ ...prev, [optionType]: cached }));
      return cached;
    }

    // Set loading state
    setLoading(prev => ({ ...prev, [optionType]: true }));
    setErrors(prev => ({ ...prev, [optionType]: null }));

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(`${API_URL}${endpoint}`, { headers });
      const transformedData = transform(response.data.content || response.data || []);

      // Update state and cache
      setOptions(prev => ({ ...prev, [optionType]: transformedData }));
      await setCachedData(optionType, transformedData);

      return transformedData;
    } catch (error) {
      console.error(`Error fetching ${optionType}:`, error);
      setErrors(prev => ({ 
        ...prev, 
        [optionType]: error.response?.data?.message || error.message 
      }));
      return [];
    } finally {
      setLoading(prev => ({ ...prev, [optionType]: false }));
    }
  }, [token, getCachedData, setCachedData]);

  // Specific fetch functions
  const fetchFacilities = useCallback(() => {
    return fetchWithCache('facilities', '/facility/search');
  }, [fetchWithCache]);

  const fetchStoreTypes = useCallback(() => {
    return fetchWithCache('storeTypes', '/org-unit/search?lvl=1');
  }, [fetchWithCache]);

  const fetchCountries = useCallback(() => {
    return fetchWithCache('countries', '/org-unit/search?lvl=2');
  }, [fetchWithCache]);

  const fetchStores = useCallback(() => {
    return fetchWithCache('stores', '/org-unit/search?lvl=3');
  }, [fetchWithCache]);

  const fetchSkuOptions = useCallback(() => {
    return fetchWithCache('skuOptions', '/option/find?optionGroupCode=skudesigns');
  }, [fetchWithCache]);

  const fetchSizes = useCallback(() => {
    return fetchWithCache('sizes', '/option/find?optionGroupCode=state-test');
  }, [fetchWithCache]);

  const fetchOrderTypes = useCallback(() => {
    return fetchWithCache('orderTypes', '/option/find?optionGroupCode=facility-type');
  }, [fetchWithCache]);

  const fetchLabelingStandards = useCallback(() => {
    return fetchWithCache('labelingStandards', '/option/find?optionGroupCode=type-of-goods');
  }, [fetchWithCache]);

  // Load all essential options on login
  const loadEssentialOptions = useCallback(async () => {
    if (!isLoggedIn || !token) return;

    console.log('Loading essential options...');
    
    // Load in parallel for better performance
    await Promise.allSettled([
      fetchFacilities(),
      fetchStoreTypes(),
      fetchCountries(),
      fetchStores(),
      fetchSkuOptions(),
      fetchSizes(),
      fetchOrderTypes(),
      fetchLabelingStandards(),
    ]);

    console.log('Essential options loaded');
  }, [
    isLoggedIn, 
    token, 
    fetchFacilities, 
    fetchStoreTypes, 
    fetchCountries, 
    fetchStores,
    fetchSkuOptions, 
    fetchSizes, 
    fetchOrderTypes, 
    fetchLabelingStandards
  ]);

  // Clean cache for different user
  const cleanCacheForUser = useCallback(async () => {
    if (!userId) {
      console.log('No userId available, skipping cache cleanup');
      return;
    }
    
    try {
      const allKeys = await SecureStore.getAllKeysAsync?.() || [];
      const cacheKeys = allKeys.filter(key => key.startsWith(CACHE_PREFIX));
      
      for (const key of cacheKeys) {
        try {
          // Remove cache entries that don't belong to current user
          const keyParts = key.split('_');
          const keyUserId = keyParts[keyParts.length - 1]; // Get the last part as userId
          
          if (keyUserId !== String(userId) && keyUserId !== 'anonymous') {
            await SecureStore.deleteItemAsync(key);
            console.log(`Cleaned cache key: ${key}`);
          }
        } catch (error) {
          console.warn(`Error processing cache key ${key}:`, error);
        }
      }
    } catch (error) {
      console.warn('Error cleaning cache:', error.message || error);
    }
  }, [userId]);

  // Load options on auth change
  useEffect(() => {
    if (isLoggedIn && token && userId) {
      cleanCacheForUser().then(() => {
        loadEssentialOptions();
      });
    } else {
      // Reset options when logged out
      setOptions({
        facilities: [],
        storeTypes: [],
        countries: [],
        stores: [],
        skuOptions: [],
        sizes: [],
        orderTypes: [],
        labelingStandards: [],
      });
    }
  }, [isLoggedIn, token, userId, loadEssentialOptions, cleanCacheForUser]);

  // Get filtered options (e.g., sizes based on selected SKU)
  const getFilteredSizes = useCallback((skuId) => {
    if (!skuId) return options.sizes;
    // Add your filtering logic here based on your API relationship
    return options.sizes.filter(size => {
      // Example filtering - adjust based on your actual data structure
      return !size.skuOpt || size.skuOpt.id === skuId;
    });
  }, [options.sizes]);

  // Force refresh specific option
  const refreshOption = useCallback(async (optionType) => {
    const cacheKey = getCacheKey(optionType, userId);
    try {
      await SecureStore.deleteItemAsync(cacheKey);
    } catch (error) {
      console.warn(`Error clearing cache for ${optionType}:`, error);
    }

    // Refetch the option
    switch (optionType) {
      case 'facilities': return fetchFacilities();
      case 'storeTypes': return fetchStoreTypes();
      case 'countries': return fetchCountries();
      case 'stores': return fetchStores();
      case 'skuOptions': return fetchSkuOptions();
      case 'sizes': return fetchSizes();
      case 'orderTypes': return fetchOrderTypes();
      case 'labelingStandards': return fetchLabelingStandards();
      default: return Promise.resolve([]);
    }
  }, [
    userId,
    fetchFacilities,
    fetchStoreTypes,
    fetchCountries,
    fetchStores,
    fetchSkuOptions,
    fetchSizes,
    fetchOrderTypes,
    fetchLabelingStandards,
  ]);

  const value = {
    options,
    loading,
    errors,
    
    // Fetch functions
    fetchFacilities,
    fetchStoreTypes,
    fetchCountries,
    fetchStores,
    fetchSkuOptions,
    fetchSizes,
    fetchOrderTypes,
    fetchLabelingStandards,
    
    // Utility functions
    loadEssentialOptions,
    getFilteredSizes,
    refreshOption,
    
    // Loading states
    isLoading: Object.values(loading).some(l => l),
    hasErrors: Object.keys(errors).length > 0,
  };

  return (
    <OptionsContext.Provider value={value}>
      {children}
    </OptionsContext.Provider>
  );
};

export const useOptions = () => {
  const context = useContext(OptionsContext);
  if (!context) {
    throw new Error('useOptions must be used within an OptionsProvider');
  }
  return context;
};