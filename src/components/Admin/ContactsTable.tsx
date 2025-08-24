import { useEffect, useState } from "react";
import { Contact } from "lucide-react";
import { FiEdit, FiTrash2, FiSave, FiX } from "react-icons/fi";

const API_URL = "http://localhost:3000/api/contacts";

interface Contact {
  id: string;
  picture: string;
  name: string;
  position: string;
  phone: string;
  fb: string;
}

const ContactsTable = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Contact>({
    id: "",
    picture: "",
    name: "",
    position: "",
    phone: "",
    fb: "",
  });

  // Helper to map frontend contact to backend contact
  const toBackend = (contact: Contact) => ({
    fullName: contact.name,
    role: contact.position,
    phone: contact.phone,
    picture: contact.picture,
    facebookLink: contact.fb,
  });

  // Helper to map backend contact to frontend contact
  const toFrontend = (item: any): Contact => ({
    id: item.id,
    picture: item.picture || "https://static.vecteezy.com/system/resources/previews/006/390/348/non_2x/simple-flat-isolated-people-icon-free-vector.jpg",
    name: item.fullName,
    position: item.role,
    phone: item.phone ? String(item.phone) : "",
    fb: item.facebookLink || "",
  });

  // Fetch contacts from backend
  const fetchContacts = () => {
    const token = localStorage.getItem("adminToken");
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setContacts(data.map(toFrontend));
      })
      .catch((err) => {
        console.error("Failed to fetch contacts:", err);
      });
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAdd = async () => {
    setEditIndex(contacts.length);
    setEditData({ id: "", picture: "", name: "", position: "", phone: "", fb: "" });
    setContacts([...contacts, { id: "", picture: "", name: "", position: "", phone: "", fb: "" }]);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditData({ ...contacts[index] });
  };

  const handleSave = async () => {
    if (editIndex === null) return;
    const token = localStorage.getItem("adminToken");
    const isNew = !editData.id;
    const backendData = toBackend(editData);
    try {
      let updatedContact: Contact | null = null;
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
        if (!res.ok) throw new Error("Failed to create contact");
        const data = await res.json();
        updatedContact = toFrontend(data);
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
        if (!res.ok) throw new Error("Failed to update contact");
        const data = await res.json();
        updatedContact = toFrontend(data);
      }
      // Update state
      const updated = [...contacts];
      updated[editIndex] = updatedContact!;
      setContacts(updated.filter((c) => c));
      setEditIndex(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save contact");
    }
  };

  const handleDelete = async (index: number) => {
    const contact = contacts[index];
    if (!contact.id) {
      // Just remove from state if not saved yet
      setContacts(contacts.filter((_, i) => i !== index));
      if (editIndex === index) setEditIndex(null);
      return;
    }
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/${contact.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete contact");
      setContacts(contacts.filter((_, i) => i !== index));
      if (editIndex === index) setEditIndex(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete contact");
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-indigo-800 mb-4">Contacts</h2>
      <button
        onClick={handleAdd}
        className="bg-green-500 text-black px-4 py-2 rounded mb-4"
      >
        Add a Contact
      </button>
      <div className="overflow-auto bg-white rounded-xl shadow">
        <table className="w-full text-left">
          <thead className="bg-indigo-300 text-indigo-900">
            <tr>
              <th className="p-3 text-black">Picture</th>
              <th className="p-3 text-black">Name</th>
              <th className="p-3 text-black">Position</th>
              <th className="p-3 text-black">Phone</th>
              <th className="p-3 text-black">Facebook</th>
              <th className="p-3 text-black text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-indigo-50 transition"
              >
                {editIndex === index ? (
                  <>
                    <td className="p-3 text-black">
                      <input
                        value={editData.picture}
                        onChange={(e) =>
                          setEditData({ ...editData, picture: e.target.value })
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-3 text-black">
                      <input
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-3 text-black">
                      <input
                        value={editData.position}
                        onChange={(e) =>
                          setEditData({ ...editData, position: e.target.value })
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-3 text-black">
                      <input
                        value={editData.phone}
                        onChange={(e) =>
                          setEditData({ ...editData, phone: e.target.value })
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-3 text-black">
                      <input
                        value={editData.fb}
                        onChange={(e) =>
                          setEditData({ ...editData, fb: e.target.value })
                        }
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
                      <img
                        src={contact.picture}
                        alt="pic"
                        className="w-12 h-12 rounded-full"
                      />
                    </td>
                    <td className="p-3 text-black">{contact.name}</td>
                    <td className="p-3 text-black">{contact.position}</td>
                    <td className="p-3 text-black">
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-blue-600 underline"
                      >
                        {contact.phone}
                      </a>
                    </td>
                    <td className="p-3 text-black">
                      <a
                        href={contact.fb}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Facebook
                      </a>
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

export default ContactsTable;
