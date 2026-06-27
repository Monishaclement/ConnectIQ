import API from "./axios";

export const getMessageHistory = (userId) => API.get(`/messages/${userId}`);
