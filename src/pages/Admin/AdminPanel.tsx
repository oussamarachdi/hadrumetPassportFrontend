import APPsTable from "@/components/Admin/APPsTable";
import ContactsTable from "@/components/Admin/ContactsTable";
import EPsTable from "@/components/Admin/EpsTable";
import EventsTable from "@/components/Admin/EventsTable";
import PlacesTable from "@/components/Admin/PlaceTable";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const sections = [
  { key: "contacts", label: "Contacts", icon: "👤" },
  { key: "apps", label: "Local Apps", icon: "📱" },
  { key: "events", label: "Events", icon: "🎉" },
  { key: "places", label: "Places", icon: "📍" },
  { key: "eps", label: "EPs", icon: "🌍" },
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("contacts");
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const renderSection = () => {
    switch (selected) {
      case "contacts": return <ContactsTable />;
      case "apps": return <APPsTable />;
      case "events": return <EventsTable />;
      case "places": return <PlacesTable />;
      case "eps": return <EPsTable />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold tracking-wide">Admin</div>
        <nav className="flex-1">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setSelected(section.key)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-lg font-medium hover:bg-indigo-700 transition ${selected === section.key ? "bg-indigo-700" : ""}`}
            >
              <span>{section.icon}</span> {section.label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="m-6 bg-red-500 hover:bg-red-600 rounded px-4 py-2"
        >
          Logout
        </button>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow flex items-center justify-between px-8 py-4">
          <h1 className="text-2xl font-bold text-indigo-900">Admin Dashboard</h1>
        </header>
        {/* Content Area */}
        <main className="p-8 overflow-y-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
