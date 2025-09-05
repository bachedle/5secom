import axios from "axios";
import * as SecureStore from "expo-secure-store";   

const API_URL = "https://5secom.dientoan.vn/api";

export const uploadFile = async (file) => {
  try {
    const token = await SecureStore.getItemAsync("authToken");

    // ✅ Build FormData with raw file blob
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name || "upload.jpg",
      type: file.type || "image/jpeg",
    });

    const res = await axios.post(`${API_URL}/file/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    return res.data; // { url: "...", id: "..." }
  } catch (err) {
    console.error("Upload failed:", err?.response?.data || err.message);
    throw err;
  }
};
