import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ElementDetailPage from "./pages/ElementDetailPage";
import Eps from "./pages/Eps";
import Contacts from "./pages/Contacts";
import MyProfile from "./pages/MyProfile";
import EmergencyContacts from "./pages/EmergencyContacts";
import LocalApps from "./pages/LocalApps";
import Login from "./pages/Login";
import AdminPanel from "./pages/Admin/AdminPanel";
import Events from "./pages/Events";
import AdminLogin from "./pages/AdminLogin";
import RequireAdminAuth from "./components/RequireAdminAuth";
import EventDetail from "./pages/EventDetail";
import { AuthProvider } from "./context/AuthContext";
import { useEffect, useState } from "react";
import splashImg from "@/assets/images/Sousse/splash.png";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  if (showSplash) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white">
        <img src={splashImg} alt="Splash" className="w-64 h-64 object-contain" />
      </div>
    );
  }
  return (
    <div>
      <AuthProvider>
        {/* WRAP YOUR APP WITH THE PROVIDER */}
        <BrowserRouter>
          <Routes>
            {/* --- 1. MOST SPECIFIC STATIC ROUTES --- */}
            {/* List all your well-defined pages first. */}
            <Route path="/" element={<Home />} />
            <Route path="/eps" element={<Eps />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/emergency" element={<EmergencyContacts />} />
            <Route path="/local-apps" element={<LocalApps />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/dep/im/admin"
              element={
                <RequireAdminAuth>
                  <AdminPanel />
                </RequireAdminAuth>
              }
            />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventSlug" element={<EventDetail />} />
            <Route path="/:categorySlug" element={<CategoryPage />} />
            <Route
              path="/:categorySlug/:elementSlug"
              element={<ElementDetailPage />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
