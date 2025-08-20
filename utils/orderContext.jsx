// context/OrderContext.js
import { createContext, useState, useEffect, useContext } from "react";
import { getOrders, getOrderByID, createOrder, updateOrder } from "../api/order";
import { AuthContext } from "./authContext";
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const {isLoggedIn, token} = useContext(AuthContext)
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchOrders = async () => {

    if(!isLoggedIn || !token) {
        console.log('user not authenticated');
        return;
    }
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
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

//   const removeOrder = async (id) => {
//     await deleteFacility(id);
//     setOrders((prev) => prev.filter((o) => o.id !== id));
//   };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider value={{ orders, loading, fetchOrders, addOrder, editOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
