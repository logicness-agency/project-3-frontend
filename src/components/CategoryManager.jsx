import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; 

export default function CategoryManager({ open, onClose }) {
  const storedToken = localStorage.getItem("authToken");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setErrorMsg("");
    axios
      .get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => setCategories(res.data || []))
      .catch((err) =>
        setErrorMsg(err.response?.data?.message || "Failed to load categories.")
      )
      .finally(() => setLoading(false));
  }, [open]); 

  const createCategory = () => {
    if (!newName.trim()) return;
    setErrorMsg("");
    axios
      .post(
        `${API_URL}/categories`,
        { name: newName.trim() },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )
      .then((res) => {
        setCategories((prev) => [...prev, res.data]);
        setNewName("");
      })
      .catch((err) => {
        setErrorMsg(
          err.response?.status === 409
            ? "You already have a category with this name."
            : err.response?.data?.message || "Failed to create category."
        );
      });
  };

  const startEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
  };

  const saveEdit = () => {
    if (!editId) return;
    const name = editName.trim();
    if (!name) return;
    setErrorMsg("");
    axios
      .put(
        `${API_URL}/categories/${editId}`,
        { name },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )
      .then((res) => {
        setCategories((prev) =>
          prev.map((c) => (c._id === editId ? res.data : c))
        );
        setEditId(null);
        setEditName("");
      })
      .catch((err) => {
        setErrorMsg(
          err.response?.status === 409
            ? "You already have a category with this name."
            : err.response?.data?.message || "Failed to rename category."
        );
      });
  };

  const deleteCategory = (id) => {
    if (!window.confirm("Delete this category? Related tinqs will be set to 'No category'.")) {
      return;
    }
    setErrorMsg("");
    axios
      .delete(`${API_URL}/categories/${id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(() => {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      })
      .catch((err) => {
        setErrorMsg(err.response?.data?.message || "Failed to delete category.");
      });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal */}
      <div className="relative z-[61] w-full max-w-xl bg-[#1c1c1e] text-white rounded-2xl p-6 border border-purple-600 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Manage Categories</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700"
          >
            Close
          </button>
        </div>

        {loading ? (
          <p className="text-gray-300">Loading…</p>
        ) : (
          <>
            {errorMsg && (
              <p className="mb-3 text-sm text-red-400">{errorMsg}</p>
            )}

            {/* Add */}
            <div className="flex gap-2 mb-5">
              <input
                type="text"
                placeholder="New category"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 rounded-full p-2 bg-[#2a2a2e] border border-gray-600 text-white"
              />
              <button
                onClick={createCategory}
                className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700"
              >
                Add
              </button>
            </div>

            {/* List */}
            <ul className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
              {categories.length === 0 && (
                <li className="text-gray-400 italic">No categories yet.</li>
              )}
              {categories.map((cat) => (
                <li
                  key={cat._id}
                  className="bg-[#2a2a2e] border border-gray-700 rounded-xl p-3 flex items-center gap-2"
                >
                  {editId === cat._id ? (
                    <>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 rounded-full p-2 bg-[#1f1f22] border border-gray-600 text-white"
                      />
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 rounded-full bg-green-600 hover:bg-green-700 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditId(null);
                          setEditName("");
                        }}
                        className="px-3 py-1 rounded-full bg-gray-600 hover:bg-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1">{cat.name}</span>
                      <button
                        onClick={() => startEdit(cat)}
                        className="px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-700 text-sm"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => deleteCategory(cat._id)}
                        className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <p className="text-xs text-gray-400 mt-4">
              Deleting a category will NOT delete your tinqs. They will show as “No
              category”.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
