import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useTheme } from "../ThemeContext";

function Layout() {
  const { darkMode } = useTheme();

  return (
    <div className={`app-layout ${darkMode ? "dark" : ""}`}>
      <Sidebar />
      <div className="main-section">
        <Navbar />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;