// context/OrderContext.js
import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { getOrders, getOrderByID, createOrder, updateOrder } from "../api/order";
import { AuthContext } from "./authContext";
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
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext?.isLoggedIn ?? !!authContext?.authState?.token;
  const token = authContext?.token ?? authContext?.authState?.token;

  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [draftOrder, setDraftOrder] = useState(initialDraft);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 
  const [loadingMore, setLoadingMore] = useState(false);


  // Load saved draft
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

const fetchOrders = async () => {
  if (!isLoggedIn || !token) return;
  setLoading(true);

  try {
    const data = await getOrders(token);   // no more pageNumber/pageSize
    const allOrders = data?.content || [];

    // sort latest first
    allOrders.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

    setOrders(allOrders);
    setTotalOrders(data?.totalElements || allOrders.length);

    // setHasMore(false);  // disable infinite scroll
    setPage(0);
    
  } catch (err) {
    console.error("Error fetching orders:", err);
    setOrders([]);
  } finally {
    setLoading(false);
  }
};



  const addOrder = async (newOrder) => {
    if (!isLoggedIn || !token) {
      console.error("No authentication found!");
      return;
    }
    try {
      const created = await createOrder(newOrder, token);
      console.log("✅ Order created:", created);

      // Refresh from backend to stay in sync
      await fetchOrders();
      await resetDraft();
      return created;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const submitDraft = async () => {
    try {
      const cleaned = cleanOrder(draftOrder);
      return await addOrder(cleaned); // ✅ reuse addOrder
    } catch (error) {
      console.error("❌ Error in submitDraft:", error);
      throw error;
    }
  };

  const editOrder = async (id, updates) => {
    if (!isLoggedIn || !token) {
      console.error("No authentication found!");
      return;
    }
    try {
      const updated = await updateOrder(id, updates, token);
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updated : order))
      );
      
      await fetchOrders();

      return updated;
      
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchOrders();
    }
  }, [isLoggedIn, token]);

  const value = useMemo(
    () => ({
      orders,
      setOrders,
      loading,
      setLoading,
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

    }),
    [orders, loading, draftOrder]
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
