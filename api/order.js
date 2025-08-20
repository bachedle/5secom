import axios from "axios";
import * as SecureStore from 'expo-secure-store';


const API_URL = "https://5secom.dientoan.vn/api";

// GET all orders
export const getOrders = async () => {
  try {
    const token = await SecureStore.getItemAsync('authToken')  
    const res = await axios.get(`${API_URL}/facility/find`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });
  return res.data;
    
  } catch (error) { ("error fetching order: ", error.response?.data || error.message);
    throw error;
  }
};

// GET order by ID
export const getOrderByID = async (id) => {
    const res = await axios.get(`${API_URL}/facility/${id}`);
    return res.data;
};
// CREATE order
export const createOrder = async (order) => {
  const res = await axios.post(`${API_URL}/facility`, order);
  return res.data;
};

// UPDATE order
export const updateOrder = async (id, order) => {
  const res = await axios.patch(`${API_URL}/${id}`, order);
  return res.data;
};

// // DELETE order
// export const deleteOrder = async (id) => {
//   const res = await axios.delete(`${API_URL}/facility`);
//   return res.data;
// };
