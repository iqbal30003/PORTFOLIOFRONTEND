import axios from "axios";

// Use env var if provided for easier local/CI configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5103";

export const getProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/product`);
  // Support both paginated wrapper { data: [...] } and plain array responses
  return response.data?.data ?? response.data ?? [];
};
