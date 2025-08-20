// context/OrderContext.js
import { createContext, useState, useEffect, useContext } from "react";
import { getOrders, getOrderByID, createOrder, updateOrder } from "../api/order";
import { AuthContext } from "./authContext";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { isLoggedIn, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

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
  };

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

  return (
    <OrderContext.Provider
      value={{ orders, loading, fetchOrders, addOrder, editOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
};
