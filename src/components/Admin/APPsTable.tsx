/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiSave, FiX } from "react-icons/fi";

const API_URL = "http://localhost:3000/api/localApps";

interface App {
  id: string;
  label: string;
  icon: string;
  android: string;
  ios: string;
}

const APPsTable = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<App>({
    id: "",
    label: "",
    android: "",
    ios: "",
    icon: ""
  });

  // Helper to map frontend app to backend app
  const toBackend = (app: App) => ({
    name: app.label,
    androidLink: app.android,
    iosLink: app.ios,
    picture: app.icon,
  });

  // Helper to map backend app to frontend app
  const toFrontend = (item: any): App => ({
    id: item.id,
    label: item.name,
    android: item.androidLink,
    ios: item.iosLink,
    icon: item.picture || "",
  });

  // Fetch apps from backend
  const fetchApps = () => {
    const token = localStorage.getItem("adminToken");
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setApps(data.map(toFrontend));
      })
      .catch((err) => {
        console.error("Failed to fetch local apps:", err);
      });
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditData({ ...apps[index] });
  };

  const handleSave = async () => {
    if (editIndex === null) return;
    const token = localStorage.getItem("adminToken");
    const isNew = !editData.id;
    const backendData = toBackend(editData);
    try {
      let updatedApp: App | null = null;
      if (isNew) {
        // Create
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(backendData),
        });
        if (!res.ok) throw new Error("Failed to create app");
        const data = await res.json();
        updatedApp = toFrontend(data);
      } else {
        // Update
        const res = await fetch(`${API_URL}/${editData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(backendData),
        });
        if (!res.ok) throw new Error("Failed to update app");
        const data = await res.json();
        updatedApp = toFrontend(data);
      }
      // Update state
      const updated = [...apps];
      updated[editIndex] = updatedApp!;
      setApps(updated.filter((a) => a));
      setEditIndex(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save app");
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  const handleAdd = async () => {
    setApps([
      ...apps,
      { id: "", label: "", icon: "", android: "", ios: "" },
    ]);
    setEditIndex(apps.length);
    setEditData({ id: "", label: "", icon: "", android: "", ios: "" });
  };

  const handleDelete = async (index: number) => {
    const app = apps[index];
    if (!app.id) {
      // Just remove from state if not saved yet
      setApps(apps.filter((_, i) => i !== index));
      if (editIndex === index) setEditIndex(null);
      return;
    }
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/${app.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete app");
      setApps(apps.filter((_, i) => i !== index));
      if (editIndex === index) setEditIndex(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete app");
    }
  };

  const buttonClass =
    "bg-purple-400 hover:bg-purple-500 text-black px-4 py-1 rounded-lg shadow";

  return (
    <div className="mb-12">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">Local Apps</h2>
        <button
          onClick={handleAdd}
          className="bg-green-500 text-black px-4 py-2 rounded mb-4"
        >
          Add an App
        </button>
      </div>
      <div className="overflow-auto bg-white rounded-xl shadow">
        <table className="w-full text-left">
          <thead className="bg-indigo-300 text-indigo-900">
            <tr>
              <th className="p-4 text-black">App</th>
              <th className="p-4 text-black">Image</th>
              <th className="p-4 text-black">Link Android</th>
              <th className="p-4 text-black">Link iOS</th>
              <th className="p-4 text-black text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-indigo-50 transition"
              >
                {editIndex === index ? (
                  <>
                    <td className="p-4 text-black">
                      <input
                        value={editData.label}
                        onChange={(e) =>
                          setEditData({ ...editData, label: e.target.value })
                        }
                        className="border border-indigo-300 rounded px-2 py-1 w-full focus:outline-none focus:ring"
                      />
                    </td>
                    <td className="p-4 text-black">
                      {editData.icon && (
                        <img
                          src={editData.icon}
                          alt="icon"
                          className="w-16 h-16 object-contain mb-2 rounded"
                        />
                      )}
                      <input
                        value={editData.icon}
                        onChange={(e) =>
                          setEditData({ ...editData, icon: e.target.value })
                        }
                        className="border border-indigo-300 rounded px-2 py-1 w-full"
                        placeholder="URL de l'image ou chemin importé"
                      />
                    </td>
                    <td className="p-4 text-black">
                      <input
                        value={editData.android}
                        onChange={(e) =>
                          setEditData({ ...editData, android: e.target.value })
                        }
                        className="border border-indigo-300 rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="p-4 text-black">
                      <input
                        value={editData.ios}
                        onChange={(e) =>
                          setEditData({ ...editData, ios: e.target.value })
                        }
                        className="border border-indigo-300 rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="p-4 text-black text-center space-x-2">
                      <button
                        onClick={handleSave}
                        className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                        title="Save"
                      >
                        <FiSave size={18} />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-2 rounded-full hover:bg-gray-200 text-gray-600"
                        title="Cancel"
                      >
                        <FiX size={18} />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 text-black font-semibold text-gray-800">
                      {app.label}
                    </td>
                    <td className="p-4 text-black">
                      <img
                        src={app.icon}
                        alt={app.label}
                        className="w-16 h-16 object-contain rounded shadow"
                      />
                    </td>
                    <td className="p-4 text-black">
                      <a
                        href={app.android}
                        className="text-blue-600 underline hover:text-blue-800"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Android
                      </a>
                    </td>
                    <td className="p-4 text-black">
                      {app.ios ? (
                        <a
                          href={app.ios}
                          className="text-blue-600 underline hover:text-blue-800"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          iOS
                        </a>
                      ) : (
                        <span className="italic text-gray-400">No Link</span>
                      )}
                    </td>
                    <td className="p-4 text-black text-center space-x-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-2 rounded-full hover:bg-red-100 text-red-600"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default APPsTable;