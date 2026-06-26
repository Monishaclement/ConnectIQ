import API from "./axios";

export const updateProfile = (data) => API.put("/users/profile", data);
export const getRecommendations = () => API.get("/recommendations");
