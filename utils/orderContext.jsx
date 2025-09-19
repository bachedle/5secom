// context/OrderContext.js
import {
  getOrders,
  getAllOrders,
  getOrderByID,
  createOrder,
  updateOrder,
  getFacilities,
} from "../api/order";
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
  // 🔹 Separate states
  const [orders, setOrders] = useState([]);      // paginated list
  const [allOrders, setAllOrders] = useState([]); // full dataset

  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [draftOrder, setDraftOrder] = useState(initialDraft);

  // Infinite scrolling states
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

  // 🔹 Fetch paginated orders
  const fetchOrders = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) return;

      setLoading(true);
      setPage(0);

      const data = await getOrders(token, 0, 20);
      const newOrders = data?.content || [];

      newOrders.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

      setOrders(newOrders);
      setTotalOrders(data?.totalElements || newOrders.length);
      setHasMore(!data?.last && newOrders.length > 0);
      setPage(1); // next page
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load more orders (infinite scroll)
  const loadMoreOrders = async () => {
    if (loadingMore || !hasMore) return;

    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) return;

      setLoadingMore(true);

      const data = await getOrders(token, page, 20);
      const newOrders = data?.content || [];

      if (newOrders.length > 0) {
        newOrders.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        setOrders((prev) => [...prev, ...newOrders]);
        setPage((prev) => prev + 1);
        setHasMore(!data?.last);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more orders:", err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  // 🔹 Fetch ALL orders (separate state)
  const fetchAllOrders = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) return;

      setLoading(true);

      const data = await getAllOrders(token);
      const everything = data?.content || [];

      everything.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

      setAllOrders(everything);
      setTotalOrders(data?.totalElements || everything.length);

    } catch (err) {
      console.error("Error fetching all orders:", err);
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Other CRUD operations (unchanged) ---
  const addOrder = async (newOrder) => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) throw new Error("Not authenticated");

      const created = await createOrder(newOrder, token);
      await fetchOrders(); // refresh
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
      await fetchOrders();
      return updated;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
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

  // Draft autosave/load (unchanged)
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

  // Initial load → paginated fetch by default
  useEffect(() => {
    fetchOrders();
    fetchFacilities();
  }, []);

  // 🔹 Final provided context value
  const value = useMemo(
    () => ({
      orders,        // paginated list
      allOrders,     // full dataset
      setOrders,
      setAllOrders,
      loading,
      fetchOrders,
      fetchAllOrders,
      loadMoreOrders,
      totalOrders,
      addOrder,
      editOrder,
      draftOrder,
      updateDraft,
      updateDraftPath,
      resetDraft,
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
      allOrders,
      loading,
      loadingMore,
      hasMore,
      page,
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
