import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080/api" });

export const fetchProducts = () => API.get("/products");
export const addProduct = (product) => API.post("/products", product);
export const updateProduct = (id, product) => API.put(`/products/${id}`, product);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const recordSale = (productId, quantity) => API.post(`/sales/${productId}`, null, { params: { quantity } });
export const fetchSalesReport = (startDate, endDate) =>
  API.get("/sales/report", { params: { startDate, endDate } });
