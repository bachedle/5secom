import axios from "axios";
import * as SecureStore from 'expo-secure-store';


const API_URL = "https://5secom.dientoan.vn/api";

// GET all orders
// GET all orders (fetch large size at once)
// GET all orders (fetch all pages until complete)
export const getOrders = async (token) => {
  try {
    let allOrders = [];
    let page = 0;
    const size = 100; // backend max size
    let total = 0;

    while (true) {
      const res = await axios.get(`${API_URL}/facility/find`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        params: { page, size },
      });

      const orders = res.data.content || [];
      total = res.data.totalElements ?? 0;

      allOrders = [...allOrders, ...orders];

      console.log(
        `📦 Page ${page} fetched: ${orders.length}, Total so far: ${allOrders.length}/${total}`
      );

      if (allOrders.length >= total || orders.length === 0) {
        break; // ✅ stop when all orders are fetched
      }

      page++;
    }

    return { content: allOrders, totalElements: total };
  } catch (error) {
    console.error('❌ Error fetching orders:', error.response?.data || error.message);
    throw error;
  }
};



// GET order by ID
export const getOrderByID = async (id) => {
    const token = await SecureStore.getItemAsync('authToken');
    const res = await axios.get(`${API_URL}/facility/${id}`, {
      headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    });
    
    return res.data;
};

// CREATE order
export const createOrder = async (order) => {
  const token = await SecureStore.getItemAsync('authToken');
  const res = await axios.post(`${API_URL}/facility`, order, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  return res.data;
};

// UPDATE order
export const updateOrder = async (id, order) => {
  const token = await SecureStore.getItemAsync('authToken');
  const res = await axios.patch(`${API_URL}/facility`, order, {  // Remove /${id}
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  return res.data;
};


export const getFacilities = async (token) => {
  try {
    const res = await axios.post(
      `${API_URL}/dashboard/facility-statistic/ltAKs4jLw8N7q7SHeUR2Kw==`,
      {}, // body (empty if API doesn’t need data)
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching facilities:", error.response?.data || error.message);
    throw error;
  }
};

