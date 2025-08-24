import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiSave, FiX } from "react-icons/fi";

const API_URL = "http://localhost:3000/api/places";

interface Place {
  id: string;
  picture: string;
  name: string;
  category_id: string;
  location: string;
  description: string;
  phone: string;
  google_maps_url: string;
}

const PlacesTable = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Place>({
    id: "",
    picture: "",
    name: "",
    category_id: "",
    location: "",
    description: "",
    phone: "",
    google_maps_url: "",
  });

  // Helper to map frontend place to backend place
  const toBackend = (place: Place) => ({
    name: place.name,
    category_id: place.category_id,
    location: place.location,
    description: place.description,
    phone: place.phone,
    google_maps_url: place.google_maps_url,
    picture: place.picture,
  });

  // Helper to map backend place to frontend place
  const toFrontend = (item: any): Place => ({
    id: item.id,
    name: item.name,
    category_id: item.category_id || "",
    location: item.location || "",
    description: item.description || "",
    phone: item.phone || "",
    google_maps_url: item.google_maps_url || "",
    picture: item.picture || "",
  });

  // Fetch places from backend
  const fetchPlaces = () => {
    const token = localStorage.getItem("adminToken");
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPlaces(data.map(toFrontend));
      })
      .catch((err) => {
        console.error("Failed to fetch places:", err);
      });
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleAdd = async () => {
    setEditIndex(places.length);
    setEditData({ id: "", picture: "", name: "", category_id: "", location: "", description: "", phone: "", google_maps_url: "" });
    setPlaces([...places, { id: "", picture: "", name: "", category_id: "", location: "", description: "", phone: "", google_maps_url: "" }]);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditData({ ...places[index] });
  };

  const handleSave = async () => {
    if (editIndex === null) return;
    const token = localStorage.getItem("adminToken");
    const isNew = !editData.id;
    const backendData = toBackend(editData);
    try {
      let updatedPlace: Place | null = null;
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
        if (!res.ok) throw new Error("Failed to create place");
        const data = await res.json();
        updatedPlace = toFrontend(data);
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
        if (!res.ok) throw new Error("Failed to update place");
        const data = await res.json();
        updatedPlace = toFrontend(data);
      }
      // Update state
      const updated = [...places];
      updated[editIndex] = updatedPlace!;
      setPlaces(updated.filter((p) => p));
      setEditIndex(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save place");
    }
  };

  const handleDelete = async (index: number) => {
    const place = places[index];
    if (!place.id) {
      // Just remove from state if not saved yet
      setPlaces(places.filter((_, i) => i !== index));
      if (editIndex === index) setEditIndex(null);
      return;
    }
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/${place.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete place");
      setPlaces(places.filter((_, i) => i !== index));
      if (editIndex === index) setEditIndex(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete place");
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-indigo-800 mb-4">Places</h2>
      <button
        onClick={handleAdd}
        className="bg-green-400 text-black px-4 py-2 rounded mb-4"
      >
        Add Place
      </button>
      <div className="overflow-auto bg-white rounded-xl shadow">
        <table className="w-full text-left">
          <thead className="bg-indigo-300 text-indigo-900">
            <tr>
              <th className="p-3 text-black">Picture</th>
              <th className="p-3 text-black">Name</th>
              <th className="p-3 text-black">Category</th>
              <th className="p-3 text-black">Location</th>
              <th className="p-3 text-black">Description</th>
              <th className="p-3 text-black">Phone</th>
              <th className="p-3 text-black">Google Maps</th>
              <th className="p-3 text-black text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {places.map((place, index) => (
              <tr key={index} className="border-t border-gray-200">
                {editIndex === index ? (
                  <>
                    <td className="p-3 text-black">
                      <input
                        value={editData.picture}
                        onChange={(e) => setEditData({ ...editData, picture: e.target.value })}
                        className="w-full border rounded px-2 py-1"
                        placeholder="URL image"
                      />
                    </td>
                    <td className="p-3 text-black">
                      <input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-3 text-black">
                      <input
                        value={editData.category_id}
                        onChange={(e) => setEditData({ ...editData, category_id: e.target.value })}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-3 text-black">
                      <input
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-3 text-black">
                      <input
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-3 text-black">
                      <input
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-3 text-black">
                      <input
                        value={editData.google_maps_url}
                        onChange={(e) => setEditData({ ...editData, google_maps_url: e.target.value })}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-3 text-black space-x-2 text-center">
                      <button
                        onClick={handleSave}
                        className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                        title="Save"
                      >
                        <FiSave size={18} />
                      </button>
                      <button
                        onClick={() => setEditIndex(null)}
                        className="p-2 rounded-full hover:bg-gray-200 text-gray-600"
                        title="Cancel"
                      >
                        <FiX size={18} />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3 text-black">
                      {place.picture && (
                        <img src={place.picture} alt={place.name} className="w-12 h-12 rounded" />
                      )}
                    </td>
                    <td className="p-3 text-black">{place.name}</td>
                    <td className="p-3 text-black">{place.category_id}</td>
                    <td className="p-3 text-black">{place.location}</td>
                    <td className="p-3 text-black">{place.description}</td>
                    <td className="p-3 text-black">{place.phone}</td>
                    <td className="p-3 text-black">
                      {place.google_maps_url ? (
                        <a href={place.google_maps_url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Map</a>
                      ) : (
                        <span className="italic text-gray-400">No Link</span>
                      )}
                    </td>
                    <td className="p-3 text-black space-x-2 text-center">
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

export default PlacesTable;