import axios from "axios";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";

const API_URL = "https://5secom.dientoan.vn/api";

// // ✅ Convert local URI to Base64
// export const localUriToBase64 = async (uri, mimeType = "image/jpeg") => {
//   try {
//     const base64 = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });
//     return `data:${mimeType};base64,${base64}`;
//   } catch (err) {
//     console.error("Error converting local URI to Base64:", err);
//     throw err;
//   }
// };

// Upload file to backend
export const uploadFile = async (file) => {
  try {
    const token = await SecureStore.getItemAsync("authToken");

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

    console.log("Upload response:", res.data);
    return res.data; // { url: "...", id: "..." }
  } catch (err) {
    console.error("Upload failed:", err?.response?.data || err.message);
    throw err;
  }
};
