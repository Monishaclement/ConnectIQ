import API from "./axios";

export const reportUser = (data) => API.post("/report", data);
