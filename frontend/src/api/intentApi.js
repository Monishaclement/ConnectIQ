import API from "./axios";

export const getIntents = (params = {}) => API.get("/intents", { params });
export const getIntent = (id) => API.get(`/intents/${id}`);
export const createIntent = (data) => API.post("/intents", data);
export const updateIntent = (id, data) => API.put(`/intents/${id}`, data);
export const deleteIntent = (id) => API.delete(`/intents/${id}`);
