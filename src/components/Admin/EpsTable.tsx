import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiSend } from "react-icons/fi";

const API_URL = "http://localhost:3000/api/users";

interface Ep {
  id?: string;
  picture: string;
  name: string;
  email: string;
  phone: string;
  lc: string;
  mc: string;
  status: string;
  realized: boolean;
}

// Helper to map frontend EP to backend EP
const toBackend = (ep: Ep) => ({
  fullName: ep.name,
  email: ep.email,
  phone: ep.phone,
  picture: ep.picture,
  lc: ep.lc,
  mc: ep.mc,
  status: ep.status,
  realized: ep.realized,
});

const EPsTable = () => {
  const [eps, setEps] = useState<Ep[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState<null | number>(null);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState<null | number>(null);
  const [deleteModal, setDeleteModal] = useState<null | number>(null);
  const [editData, setEditData] = useState<Ep | null>(null);
  const [addData, setAddData] = useState<Ep>({
    picture: "",
    name: "",
    email: "",
    phone: "",
    lc: "",
    mc: "",
    status: "",
    realized: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Map backend fields to frontend fields
        const mapped = (data || []).map((item: any) => ({
          id: item.applicationId, // use applicationId as id
          picture: item.picture || "https://static.vecteezy.com/system/resources/previews/006/390/348/non_2x/simple-flat-isolated-people-icon-free-vector.jpg",
          name: item.fullName,
          email: item.email,
          phone: item.phone || "",
          lc: item.lc || "",
          mc: item.mc || "",
          status: item.status || "",
          realized: !!item.realized,
        }));
        setEps(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
      });
  }, [feedback]);

  const handleRealizedChange = async (index: number, value: boolean) => {
    const user = eps[index];
    const token = localStorage.getItem("adminToken");
    const userId = user.id; // now applicationId
    try {
      const res = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ realized: value }),
      });
      if (!res.ok) throw new Error("Failed to update realized status");
      // Update state
      const updated = [...eps];
      updated[index].realized = value;
      setEps(updated);
    } catch (err) {
      alert("Failed to update realized status");
      console.error(err);
    }
  };

  const handleSendEmail = async (index: number) => {
    setSending(true);
    setFeedback("");
    const user = eps[index];
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch("http://localhost:3000/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ applicationId: user.id }),
      });
      if (!res.ok) throw new Error("Failed to send email");
      setFeedback("Email sent successfully!");
    } catch (err) {
      setFeedback("Failed to send email");
      console.error(err);
    } finally {
      setSending(false);
      setTimeout(() => setFeedback(""), 2000);
      setModalOpen(null);
    }
  };

  // CREATE
  const handleAdd = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(toBackend(addData)),
      });
      if (!res.ok) throw new Error("Failed to add EP");
      setFeedback("EP added successfully!");
      setAddModal(false);
      setAddData({ picture: "", name: "", email: "", phone: "", lc: "", mc: "", status: "", realized: false });
    } catch (err) {
      setFeedback("Failed to add EP");
      console.error(err);
    }
  };

  // UPDATE
  const handleEdit = async () => {
    if (!editData || !editData.id) return;
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(toBackend(editData)),
      });
      if (!res.ok) throw new Error("Failed to update EP");
      setFeedback("EP updated successfully!");
      setEditModal(null);
      setEditData(null);
    } catch (err) {
      setFeedback("Failed to update EP");
      console.error(err);
    }
  };

  // DELETE
  const handleDelete = async (index: number) => {
    const ep = eps[index];
    if (!ep.id) return;
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/${ep.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete EP");
      setFeedback("EP deleted successfully!");
      setDeleteModal(null);
    } catch (err) {
      setFeedback("Failed to delete EP");
      console.error(err);
    }
  };

  const filteredEps = eps.filter(
    (ep) =>
      ep.name.toLowerCase().includes(search.toLowerCase()) ||
      ep.email.toLowerCase().includes(search.toLowerCase()) ||
      ep.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-800">All Users</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setAddModal(true)}
        >
          Add EP
        </button>
      </div>
      <input
        type="text"
        placeholder="Search by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 border border-indigo-300 rounded px-3 py-2 w-full max-w-md"
      />
      {feedback && (
        <div className="mb-2 text-center text-green-600 font-semibold">{feedback}</div>
      )}
      <div className="overflow-auto bg-white rounded-xl shadow">
        <table className="w-full text-left">
          <thead className="bg-indigo-300 text-indigo-900">
            <tr>
              <th className="p-3 text-black">Picture</th>
              <th className="p-3 text-black">Name</th>
              <th className="p-3 text-black">Email</th>
              <th className="p-3 text-black">Phone</th>
              <th className="p-3 text-black">LC</th>
              <th className="p-3 text-black">MC</th>
              <th className="p-3 text-black">Status</th>
              <th className="p-3 text-black">Realized</th>
              <th className="p-3 text-black">Send Credentials</th>
              <th className="p-3 text-black text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEps.map((ep, index) => (
              <tr key={ep.id || ep.email} className="border-t border-gray-200">
                <td className="p-3 text-black">
                  <img
                    src={ep.picture}
                    alt="pic"
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="p-3 text-black">{ep.name}</td>
                <td className="p-3 text-black">{ep.email}</td>
                <td className="p-3 text-black">{ep.phone}</td>
                <td className="p-3 text-black">{ep.lc}</td>
                <td className="p-3 text-black">{ep.mc}</td>
                <td className="p-3 text-black">{ep.status}</td>
                <td className="p-3 text-black text-center">
                  <input
                    type="checkbox"
                    checked={ep.realized}
                    onChange={e => handleRealizedChange(index, e.target.checked)}
                  />
                </td>
                <td className="p-3 text-black text-center">
                  <button
                    className="p-2 rounded-full hover:bg-blue-100 text-blue-600 disabled:opacity-50"
                    disabled={sending}
                    onClick={() => setModalOpen(index)}
                    title="Send Credentials"
                  >
                    <FiSend size={18} />
                  </button>
                </td>
                <td className="p-3 text-black text-center">
                  <button
                    className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600 ml-1"
                    onClick={() => { setEditModal(index); setEditData({ ...ep }); }}
                    title="Edit"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-red-100 text-red-600 ml-1"
                    onClick={() => setDeleteModal(index)}
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                  {modalOpen === index && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                      <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full">
                        <h3 className="text-lg font-bold mb-4">Send Credentials Email</h3>
                        <p className="mb-4">Are you sure you want to send the credentials email to <span className="font-semibold">{ep.name}</span>?</p>
                        <div className="flex justify-end space-x-2">
                          <button
                            className="bg-gray-300 px-4 py-2 rounded"
                            onClick={() => setModalOpen(null)}
                            disabled={sending}
                          >
                            Cancel
                          </button>
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={() => handleSendEmail(index)}
                            disabled={sending}
                          >
                            {sending ? "Sending..." : "Send"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 text-black">Add New EP</h3>
            <div className="space-y-2 text-black">
              <input className="border rounded px-2 py-1 w-full text-black" placeholder="Name" value={addData.name} onChange={e => setAddData({ ...addData, name: e.target.value })} />
              <input className="border rounded px-2 py-1 w-full text-black" placeholder="Email" value={addData.email} onChange={e => setAddData({ ...addData, email: e.target.value })} />
              <input className="border rounded px-2 py-1 w-full text-black" placeholder="Phone" value={addData.phone} onChange={e => setAddData({ ...addData, phone: e.target.value })} />
              <input className="border rounded px-2 py-1 w-full text-black" placeholder="LC" value={addData.lc} onChange={e => setAddData({ ...addData, lc: e.target.value })} />
              <input className="border rounded px-2 py-1 w-full text-black" placeholder="MC" value={addData.mc} onChange={e => setAddData({ ...addData, mc: e.target.value })} />
              <input className="border rounded px-2 py-1 w-full text-black" placeholder="Status" value={addData.status} onChange={e => setAddData({ ...addData, status: e.target.value })} />
              <input className="border rounded px-2 py-1 w-full text-black" placeholder="Picture URL" value={addData.picture} onChange={e => setAddData({ ...addData, picture: e.target.value })} />
              <label className="flex items-center space-x-2 text-black">
                <input type="checkbox" checked={addData.realized} onChange={e => setAddData({ ...addData, realized: e.target.checked })} />
                <span>Realized</span>
              </label>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setAddModal(false)}>Cancel</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleAdd}>Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal !== null && editData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 text-black">Edit EP</h3>
            <div className="space-y-2 text-black">
              <input className="border rounded px-2 py-1 w-full text-black" placeholder="Name" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
              <input className="border rounded px-2 py-1 w-full text-black" placeholder="Email" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} />
              <input className="border rounded px-2 py-1 w-full text-black" placeholder="Phone" value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} />
              <input className="border rounded px-2 py-1 w-full text-black" placeholder="LC" value={editData.lc} onChange={e => setEditData({ ...editData, lc: e.target.value })} />
              <input className="border rounded px-2 py-1 w-full text-black" placeholder="MC" value={editData.mc} onChange={e => setEditData({ ...editData, mc: e.target.value })} />
              <input className="border rounded px-2 py-1 w-full text-black" placeholder="Status" value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })} />
              <input className="border rounded px-2 py-1 w-full text-black" placeholder="Picture URL" value={editData.picture} onChange={e => setEditData({ ...editData, picture: e.target.value })} />
              <label className="flex items-center space-x-2 text-black">
                <input type="checkbox" checked={editData.realized} onChange={e => setEditData({ ...editData, realized: e.target.checked })} />
                <span>Realized</span>
              </label>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setEditModal(null); setEditData(null); }}>Cancel</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Delete EP</h3>
            <p className="mb-4">Are you sure you want to delete <span className="font-semibold">{eps[deleteModal].name}</span>?</p>
            <div className="flex justify-end space-x-2">
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => handleDelete(deleteModal)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EPsTable;
