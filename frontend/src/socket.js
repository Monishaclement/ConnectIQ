import { io } from "socket.io-client";
import { STORAGE_KEYS } from "./utils/constants";

const socket = io("http://localhost:5000", {
  autoConnect: false,
  auth: (cb) => {
    cb({ token: localStorage.getItem(STORAGE_KEYS.TOKEN) });
  },
});

export default socket;
