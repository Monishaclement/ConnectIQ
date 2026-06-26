import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../../styles/layout/DashboardLayout.css";

export default function DashboardLayout({ showSearch = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = (value) => {
    setSearchValue(value);
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-main">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          searchValue={showSearch ? searchValue : undefined}
          onSearchChange={showSearch ? handleSearch : undefined}
        />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
