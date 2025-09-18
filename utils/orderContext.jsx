// context/OrderContext.js
import {
  getOrders,
  getOrderByID,
  createOrder,
  updateOrder,
  getFacilities,
} from "../api/order"; // ✅ reuse API helpers
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import * as SecureStore from "expo-secure-store";

export const OrderContext = createContext();

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
};

const cleanOrder = (draft) => {
  const cleaned = { ...draft };
  ["facilityType", "stateOpt", "orgUnit", "skuOpt"].forEach((key) => {
    if (cleaned[key] && !cleaned[key].id) {
      cleaned[key] = null;
    }
  });
  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === "") cleaned[key] = null;
  });
  return cleaned;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [draftOrder, setDraftOrder] = useState(initialDraft);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Edit mode states
  const [editMode, setEditMode] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);

  // Facilities state
  const [facilities, setFacilities] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);

  // Fetch facilities
  const fetchFacilities = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) return;
      setLoadingFacilities(true);
      const data = await getFacilities(token);
      setFacilities(data || []);
    } catch (err) {
      console.error("Error fetching facilities:", err);
      setFacilities([]);
    } finally {
      setLoadingFacilities(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) return;
      setLoading(true);

      const data = await getOrders(token); // ✅ reuse order.js
      const allOrders = data?.content || [];

      allOrders.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );

      setOrders(allOrders);
      setTotalOrders(data?.totalElements || allOrders.length);
      setPage(0);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (newOrder) => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) throw new Error("Not authenticated");

      const created = await createOrder(newOrder, token); // ✅ reuse order.js
      await fetchOrders();
      await resetDraft();
      return created;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

const editOrder = async (id, updates) => {
  try {
    const token = await SecureStore.getItemAsync("authToken");
    if (!token) throw new Error("Not authenticated");

    const updated = await updateOrder(id, updates, token);
    
    // Remove this line - let fetchOrders handle the update
    // setOrders((prev) => prev.map((order) => (order.id === id ? updated : order)));
    
    await fetchOrders(); // This will get the latest data from API
    return updated;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

const submitDraft = async () => {
  if (draftOrder.id) {
    // editing an existing order
    return await updateOrder(draftOrder);
  } else {
    // creating new order
    return await createOrder(draftOrder);
  }
};


  const loadOrderForEdit = async (id) => {
  try {
    const token = await SecureStore.getItemAsync("authToken");
    if (!token) throw new Error("Not authenticated");

    const order = await getOrderByID(id, token);
    setDraftOrder(order);
    setEditMode(true);
    setEditingOrderId(id);
  } catch (error) {
    console.error("Error loading order for edit:", error);
  }
};

  const updateDraft = (partial) =>
    setDraftOrder((prev) => ({ ...prev, ...partial }));

  const updateDraftPath = (field, value) =>
    setDraftOrder((prev) => ({ ...prev, [field]: value }));

  const resetDraft = async () => {
    setDraftOrder(initialDraft);
    try {
      await SecureStore.deleteItemAsync("orderDraft");
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  };

  // Load saved draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const savedDraft = await SecureStore.getItemAsync("orderDraft");
        if (savedDraft) setDraftOrder(JSON.parse(savedDraft));
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    };
    loadDraft();
  }, []);

  // Auto-save draft
  useEffect(() => {
    const saveDraft = async () => {
      try {
        await SecureStore.setItemAsync("orderDraft", JSON.stringify(draftOrder));
      } catch (error) {
        console.error("Error saving draft:", error);
      }
    };
    saveDraft();
  }, [draftOrder]);

  // Initial load
  useEffect(() => {
    fetchOrders();
    fetchFacilities();
  }, []);

  const value = useMemo(
    () => ({
      orders,
      setOrders,
      loading,
      fetchOrders,
      totalOrders,
      addOrder,
      editOrder,
      draftOrder,
      updateDraft,
      updateDraftPath,
      resetDraft,
      submitDraft,
      draft: draftOrder,
      setDraft: setDraftOrder,
      page,
      hasMore,
      loadingMore,
      facilities,
      fetchFacilities,
      loadingFacilities,
      editMode,
      setEditMode,
      editingOrderId,
      setEditingOrderId,
      loadOrderForEdit
    }),
    [
      orders,
      loading,
      draftOrder,
      facilities,
      loadingFacilities,
      editMode,
      editingOrderId,
    ]
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
