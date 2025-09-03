// context/OrderContext.js
import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { getOrders, getOrderByID, createOrder, updateOrder } from "../api/order";
import { AuthContext } from "./authContext";
import * as SecureStore from 'expo-secure-store';

export const OrderContext = createContext();

const initialDraft = {
  version: 0,
  id: "",
  code: "",
  name: "",
  address: "",
  phone: "",
  email: "",
  area: "",
  areaAdmin: "",
  lat: "",
  lon: "",
  facilityType: { id: "" },
  stateOpt: { id: "" },
  orgUnit: { id: "" },
  skuOpt: { id: "" },
  ownerName: "",
  ownerPhoneNumber: "",
  storeType: "",
  country: "",
  store: "",
  sku: "",
  orderId: "",
  isPriority: false,
  note: "",
  attr1: "",
  attr2: "",
  attr3: "",
  attr4: "",
  attr5: "",
};

const buildOrderPayload = (draft) => {
  const today = new Date().toISOString().split('T')[0];
  const parseNum = (v) => (v === "" || v === null || v === undefined ? 0 : Number(v));

  // allow both object-with-id or raw id in draft
  const objId = (v) => (typeof v === "string" ? v : v?.id || "");

  return {
    code: draft.code || draft.sku || "",     // if you store a code elsewhere, map it here
    name: draft.name || "",
    address: draft.address || "",
    phone: draft.phone || "",
    email: draft.email || "",

    area: parseNum(draft.area),
    areaAdmin: parseNum(draft.areaAdmin),
    lat: draft.lat || "",
    lon: draft.lon || "",

    facilityType: { id: objId(draft.facilityType) },
    orgUnit:      { id: objId(draft.orgUnit) },   // typically the deepest "store" id
    idNumber: draft.orderId || "",                // map your "orderId" → backend "idNumber"

    issueDate: draft.issueDate || today,
    issuePlace: draft.issuePlace || "",
    note: draft.note || "",

    establishmentDate: draft.establishmentDate || today,
    idIssueDate: draft.idIssueDate || today,

    livestockCrops: draft.livestockCrops || "",
    sampleSource: draft.sampleSource || "",
    labelingStandard: draft.labelingStandard || "",

    ownerName: draft.ownerName || "",
    ownerPhoneNumber: draft.ownerPhoneNumber || "",

    attr1: draft.attr1 || "",
    attr2: draft.attr2 || "",
    attr3: draft.attr3 || "",
    attr4: draft.attr4 || "",
    attr5: draft.attr5 || "",

    skuOpt:  { id: objId(draft.skuOpt) },
    stateOpt:{ id: objId(draft.stateOpt) },

    isException: !!draft.isPriority,            // map your switch → backend field
  };
};


export const OrderProvider = ({ children }) => {
  // Support both old and new AuthContext structures
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext?.isLoggedIn ?? !!authContext?.authState?.token;
  const token = authContext?.token ?? authContext?.authState?.token;
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draftOrder, setDraftOrder] = useState(initialDraft);

  // Load draft from SecureStore (from previous version)
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const savedDraft = await SecureStore.getItemAsync("orderDraft");
        if (savedDraft) {
          setDraftOrder(JSON.parse(savedDraft));
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    };
    loadDraft();
  }, []);

  // Auto-save draft on change (from previous version)
  useEffect(() => {
    const saveDraft = async () => {
      try {
        await SecureStore.setItemAsync("orderDraft", JSON.stringify(draftOrder));
      } catch (error) {
        console.error("Error saving draft:", error);
      }
    };
    // Only save if draft is not the initial empty draft
    if (draftOrder.name || draftOrder.address || draftOrder.phone) {
      saveDraft();
    }
  }, [draftOrder]);

  // Debug logging (from current version)
  useEffect(() => {
    console.log("Orders updated:", orders);
  }, [orders]);

  // Top level field update (from current version)
  const updateDraft = (partial) => 
    setDraftOrder((prev) => ({ ...prev, ...partial }));

  // Update specific field (from current version)
  const updateDraftPath = (field, value) => {
    setDraftOrder((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Clear draft (enhanced from both versions)
  const resetDraft = async () => {
    setDraftOrder(initialDraft);
    try {
      await SecureStore.deleteItemAsync("orderDraft");
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  };

  // Fetch orders - handles both API styles and response formats
  const fetchOrders = async () => {
    if (!isLoggedIn || !token) {
      console.log("User not authenticated");
      return;
    }
    
    setLoading(true);
    try {
      // Try current API style first (with token parameter)
      let data;
      try {
        data = await getOrders(token);
      } catch (error) {
        // Fallback to previous API style (no token parameter)
        console.log("Trying fallback API call without token parameter");
        data = await getOrders();
      }
      
      console.log("Fetched orders:", data);

      // Handle both response formats
      if (data?.content) {
        // Paginated response (current version)
        setOrders(data.content || []);
      } else {
        // Direct array response (previous version)
        setOrders(data || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Create order - try both API styles
  const addOrder = async (newOrder) => {
    if (!isLoggedIn || !token) {
      console.error("No authentication found!");
      return;
    }

    try {
      let created;
      try {
        // Try current API style first (with token parameter)
        created = await createOrder(newOrder, token);
      } catch (error) {
        // Fallback to previous API style (no token parameter)
        console.log("Trying fallback API call for create");
        created = await createOrder(newOrder);
      }
      
      setOrders((prev) => [...prev, created]);
      await resetDraft(); // Clear draft after successful creation
      return created;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  // Submit draft (from current version)
  const submitDraft = async () => {
    const payload = buildOrderPayload(draftOrder);
    return addOrder(draftOrder);
  };

  // Update order - try both API styles
  const editOrder = async (id, updates) => {
    if (!isLoggedIn || !token) {
      console.error("No authentication found!");
      return;
    }

    try {
      let updated;
      try {
        // Try current API style first
        updated = await updateOrder(id, updates, token);
      } catch (error) {
        // Fallback to previous API style
        console.log("Trying fallback API call for update");
        updated = await updateOrder(id, updates);
      }

      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updated : order))
      );
      return updated;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  // Fetch orders when authentication changes
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchOrders();
    }
  }, [isLoggedIn, token]);

  // Memoized context value for performance (from current version)
  const value = useMemo(
    () => ({
      orders,
      setOrders,
      loading,
      setLoading,
      fetchOrders,
      addOrder,
      editOrder,

      // Draft management
      draftOrder,
      updateDraft,
      updateDraftPath,
      resetDraft,
      submitDraft,

      // Legacy support
      draft: draftOrder, // Alias for backward compatibility
      setDraft: setDraftOrder, // Alias for backward compatibility
    }),
    [orders, loading, draftOrder]
  );

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

// Hook
export const useOrder = () => useContext(OrderContext);