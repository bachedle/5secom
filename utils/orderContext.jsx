// context/OrderContext.js
import { createContext, useState, useEffect, useContext, useMemo} from "react";
import { getOrders, getOrderByID, createOrder, updateOrder } from "../api/order";
import { AuthContext } from "./authContext";

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
  facilityType: { id: "" },
  orgUnit: { id: "" },
  ownerName: "",
  ownerPhoneNumber: "",
  // add other required fields your API needs
};

export const OrderProvider = ({ children }) => {
  const { isLoggedIn, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);


  //draft state
  const [draftOrder, setDraftOrder] = useState(initialDraft);
  
 //top level field update
  const updateDraft = (partial) => 
    setDraftOrder((prev) => ({ ...prev, ...partial }));


  //update field luu vao draft
  const updateDraftPath = (field, value) => {
    setDraftOrder((prev) => ({
      ...prev,      // spread existing keys
      [field]: value, // overwrite just this field
    }));
  };

  const resetDraft = () => setDraftOrder(initialDraft);

  useEffect(() => {
    console.log("Orders updated:", orders);
  }, [orders]);

  const fetchOrders = async () => {
    if (!isLoggedIn || !token) {
      console.log("user not authenticated");
      return;
    }
    setLoading(true);
    try {
      const data = await getOrders(token);
      console.log("Fetched orders:", data);

      // ✅ always use .content array
      setOrders(data.content || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (newOrder) => {
    const created = await createOrder(newOrder);
    setOrders((prev) => [...prev, created]);
    return created;
  };

  const submitDraft = async () => {
    return addOrder(draftOrder);
  }

  const editOrder = async (id, updates) => {
    const updated = await updateOrder({ id, ...updates });
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? updated : order))
    );
  };

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchOrders(); // 👈 will now run after login
    }
  }, [isLoggedIn, token]);

  
  const value = useMemo(
    () => ({
      orders,
      setOrders,
      loading,
      setLoading,
      addOrder,

      draftOrder,
      updateDraft,
      updateDraftPath,
      resetDraft,
      submitDraft,
    }),
    [orders, loading, draftOrder]
  );

  return (
    <OrderContext.Provider
      value={ value }
    >
      {children}
    </OrderContext.Provider>
  );
};

//hook
export const useOrder = () => useContext(OrderContext);
