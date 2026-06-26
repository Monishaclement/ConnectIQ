import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { SocketProvider } from "./context/SocketContext";
import { NotificationProvider } from "./context/NotificationContext";
import ToastContainer from "./components/common/ToastContainer";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Intents from "./pages/Intents";
import IntentDetails from "./pages/IntentDetails";
import Recommendations from "./pages/Recommendations";
import Connections from "./pages/Connections";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        element={
          <ProtectedRoute>
            <SocketProvider>
              <NotificationProvider>
                <DashboardLayout showSearch />
              </NotificationProvider>
            </SocketProvider>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/intents" element={<Intents />} />
        <Route path="/intents/:id" element={<IntentDetails />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<Search />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
        <ToastContainer />
      </ToastProvider>
    </AuthProvider>
  );
}
