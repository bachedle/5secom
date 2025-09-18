import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = "https://5secom.dientoan.vn/api";

// Get auth headers
const getAuthHeaders = async () => {
  const token = await SecureStore.getItemAsync("authToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

// Organization unit API calls
export const fetchStoreTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/org-unit/search?lvl=1`);
    return response.data.content || [];
  } catch (error) {
    console.error("Error fetching store types:", error);
    throw error;
  }
};

export const fetchCountries = async () => {
  try {
    const response = await axios.get(`${API_URL}/org-unit/search?lvl=2`);
    return response.data.content || [];
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export const fetchStores = async () => {
  try {
    const response = await axios.get(`${API_URL}/org-unit/search?lvl=3`);
    return response.data.content || [];
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
};

// Option group API calls (require auth)
export const fetchSizes = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(
      `${API_URL}/option/find?optionGroupCode=state-test`,
      { headers }
    );
    return response.data.content || [];
  } catch (error) {
    console.error("Error fetching sizes:", error);
    throw error;
  }
};

export const fetchOrderTypes = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(
      `${API_URL}/option/find?optionGroupCode=facility-type`,
      { headers }
    );
    return response.data.content || [];
  } catch (error) {
    console.error("Error fetching order types:", error);
    throw error;
  }
};

export const fetchSKUOptions = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(
      `${API_URL}/option/find?optionGroupCode=skudesigns`,
      { headers }
    );
    return response.data.content || [];
  } catch (error) {
    console.error("Error fetching SKU options:", error);
    throw error;
  }
};

export const fetchLabelingStandards = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(
      `${API_URL}/option/find?optionGroupCode=type-of-goods`,
      { headers }
    );
    return response.data.content || [];
  } catch (error) {
    console.error("Error fetching labeling standards:", error);
    throw error;
  }
};

// Batch fetch all options (for initial app load)
export const fetchAllOptions = async () => {
  try {
    const [
      storeTypes,
      countries,
      stores,
      sizes,
      orderTypes,
      skuOptions,
      labelingStandards
    ] = await Promise.allSettled([
      fetchStoreTypes(),
      fetchCountries(),
      fetchStores(),
      fetchSizes(),
      fetchOrderTypes(),
      fetchSKUOptions(),
      fetchLabelingStandards()
    ]);

    return {
      storeTypes: storeTypes.status === 'fulfilled' ? storeTypes.value : [],
      countries: countries.status === 'fulfilled' ? countries.value : [],
      stores: stores.status === 'fulfilled' ? stores.value : [],
      sizes: sizes.status === 'fulfilled' ? sizes.value : [],
      orderTypes: orderTypes.status === 'fulfilled' ? orderTypes.value : [],
      skuOptions: skuOptions.status === 'fulfilled' ? skuOptions.value : [],
      labelingStandards: labelingStandards.status === 'fulfilled' ? labelingStandards.value : [],
      errors: {
        storeTypes: storeTypes.status === 'rejected' ? storeTypes.reason : null,
        countries: countries.status === 'rejected' ? countries.reason : null,
        stores: stores.status === 'rejected' ? stores.reason : null,
        sizes: sizes.status === 'rejected' ? sizes.reason : null,
        orderTypes: orderTypes.status === 'rejected' ? orderTypes.reason : null,
        skuOptions: skuOptions.status === 'rejected' ? skuOptions.reason : null,
        labelingStandards: labelingStandards.status === 'rejected' ? labelingStandards.reason : null,
      }
    };
  } catch (error) {
    console.error("Error in fetchAllOptions:", error);
    throw error;
  }
};