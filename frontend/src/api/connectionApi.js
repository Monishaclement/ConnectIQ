import API from "./axios";

export const getConnections = () => API.get("/connections");
export const sendConnectionRequest = (toUserId) => API.post("/connections", { toUserId });
export const acceptConnectionRequest = (requestId) => API.patch(`/connections/${requestId}/accept`);
export const rejectConnectionRequest = (requestId) => API.patch(`/connections/${requestId}/reject`);
export const cancelConnectionRequest = (requestId) => API.delete(`/connections/${requestId}/cancel`);
export const removeConnectionRequest = (userId) => API.delete(`/connections/users/${userId}`);
