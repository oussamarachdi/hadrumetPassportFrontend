import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiSave, FiX } from "react-icons/fi";

const API_URL = "http://localhost:3000/api/events";

interface Event {
  id: string;
  picture: string;
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  description: string;
  location: string;
}

const EventsTable = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Event>({
    id: "",
    picture: "",
    name: "",
    startDate: "",
    endDate: "",
    startTime: "",
    description: "",
    location: "",
  });

  // Helper to map frontend event to backend event
  const toBackend = (event: Event) => ({
    title: event.name,
    description: event.description,
    location: event.location || "",
    dayTime: event.startTime,
    startDate: event.startDate,
    endDate: event.endDate,
    picture: event.picture,
  });

  // Helper to map backend event to frontend event
  const toFrontend = (item: any): Event => ({
    id: item.id,
    picture: item.picture || "",
    name: item.title,
    startDate: item.startDate,
    endDate: item.endDate || "",
    startTime: item.dayTime || "",
    description: item.description || "",
    location: item.location || "",
  });

  // Fetch events from backend
  const fetchEvents = () => {
    const token = localStorage.getItem("adminToken");
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.map(toFrontend));
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAdd = async () => {
    setEditIndex(events.length);
    setEditData({ id: "", picture: "", name: "", startDate: "", endDate: "", startTime: "", description: "", location: "" });
    setEvents([...events, { id: "", picture: "", name: "", startDate: "", endDate: "", startTime: "", description: "", location: "" }]);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditData({ ...events[index] });
  };

  const handleSave = async () => {
    if (editIndex === null) return;
    const token = localStorage.getItem("adminToken");
    const isNew = !editData.id;
    const backendData = toBackend(editData);
    try {
      let updatedEvent: Event | null = null;
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
        if (!res.ok) throw new Error("Failed to create event");
        const data = await res.json();
        updatedEvent = toFrontend(data);
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
        if (!res.ok) throw new Error("Failed to update event");
        const data = await res.json();
        updatedEvent = toFrontend(data);
      }
      // Update state
      const updated = [...events];
      updated[editIndex] = updatedEvent!;
      setEvents(updated.filter((e) => e));
      setEditIndex(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save event");
    }
  };

  const handleDelete = async (index: number) => {
    const event = events[index];
    if (!event.id) {
      // Just remove from state if not saved yet
      setEvents(events.filter((_, i) => i !== index));
      if (editIndex === index) setEditIndex(null);
      return;
    }
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/${event.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents(events.filter((_, i) => i !== index));
      if (editIndex === index) setEditIndex(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-indigo-800 mb-4">Events</h2>
      <button
        onClick={handleAdd}
        className="bg-green-400 text-black px-4 py-2 rounded mb-4"
      >
        Add Event
      </button>
      <div className="overflow-auto bg-white rounded-xl shadow">
        <table className="w-full text-left">
          <thead className="bg-indigo-300 text-indigo-900">
            <tr>
              <th className="p-3 text-black">Picture</th>
              <th className="p-3 text-black">Name</th>
              <th className="p-3 text-black">Location</th>
              <th className="p-3 text-black">Start Date</th>
              <th className="p-3 text-black">End Date</th>
              <th className="p-3 text-black">Start Time</th>
              <th className="p-3 text-black">Description</th>
              <th className="p-3 text-black text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={event.id} className="border-t border-gray-200">
                {editIndex === index ? (
                  <>
                    <td className="p-3 text-black">
                      <input
                        type="text"
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
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-3 text-black">
                      <input
                        type="date"
                        value={editData.startDate}
                        onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-3 text-black">
                      <input
                        type="date"
                        value={editData.endDate}
                        onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-3 text-black">
                      <input
                        type="time"
                        value={editData.startTime}
                        onChange={(e) => setEditData({ ...editData, startTime: e.target.value })}
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
                      {event.picture && (
                        <img src={event.picture} alt={event.name} className="w-12 h-12 rounded" />
                      )}
                    </td>
                    <td className="p-3 text-black">{event.name}</td>
                    <td className="p-3 text-black">{event.location}</td>
                    <td className="p-3 text-black">{event.startDate}</td>
                    <td className="p-3 text-black">{event.endDate}</td>
                    <td className="p-3 text-black">{event.startTime}</td>
                    <td className="p-3 text-black">{event.description}</td>
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

export default EventsTable;