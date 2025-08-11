import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Aurora from "../components/Aurora/Aurora";

const API_URL = process.env.REACT_APP_API_URL;

export default function TinqDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [tinq, setTinq] = useState(null);
  const [editedTinq, setEditedTinq] = useState({});
  const [categories, setCategories] = useState([]);

  // Manage Categories panel state
  const [showCatMgr, setShowCatMgr] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [renameId, setRenameId] = useState("");
  const [renameValue, setRenameValue] = useState("");

  const storedToken = localStorage.getItem("authToken");

  // Helpers
  const authHeader = { headers: { Authorization: `Bearer ${storedToken}` } };

  const loadTinq = () =>
    axios
      .get(`${API_URL}/tasks/${taskId}`, authHeader)
      .then((res) => {
        setTinq(res.data);
        setEditedTinq({
          ...res.data,
          date: res.data.date ? res.data.date.split("T")[0] : "",
          category: res.data.category?._id || "",
        });
      });

  const loadCategories = () =>
    axios.get(`${API_URL}/categories`, authHeader).then((res) => setCategories(res.data));

  useEffect(() => {
    Promise.all([loadTinq(), loadCategories()])
      .catch((err) => {
        console.error("Error loading detail page:", err.response?.data || err.message);
        navigate("/dashboard");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  // ----- Tinq editing -----
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTinq((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    axios
      .put(`${API_URL}/tasks/${taskId}`, editedTinq, authHeader)
      .then((res) => {
        setTinq(res.data);
        navigate("/dashboard");
      })
      .catch((err) => console.error("Error saving changes:", err.response?.data || err.message));
  };

  // ----- Category management -----
  const handleCreateCategory = () => {
    const name = newCategory.trim();
    if (!name) return;
    axios
      .post(`${API_URL}/categories`, { name }, authHeader)
      .then((res) => {
        setCategories((prev) => [...prev, res.data]);
        setNewCategory("");
      })
      .catch((err) => console.error("Error creating category:", err.response?.data || err.message));
  };

  const handleStartRename = (cat) => {
    setRenameId(cat._id);
    setRenameValue(cat.name);
  };

  const handleConfirmRename = () => {
    const name = renameValue.trim();
    if (!renameId || !name) return;
    axios
      .put(`${API_URL}/categories/${renameId}`, { name }, authHeader)
      .then((res) => {
        setCategories((prev) => prev.map((c) => (c._id === res.data._id ? res.data : c)));
        // If the tinq uses this category, keep its id (unchanged)
        setRenameId("");
        setRenameValue("");
      })
      .catch((err) => console.error("Error renaming category:", err.response?.data || err.message));
  };

  const handleDeleteCategory = (catId) => {
    if (!window.confirm("Delete this category? Tasks will keep no category.")) return;

    axios
      .delete(`${API_URL}/categories/${catId}`, authHeader)
      .then(() => {
        // Remove locally
        setCategories((prev) => prev.filter((c) => c._id !== catId));
        // If current tinq used this category, clear it
        setEditedTinq((prev) =>
          prev.category === catId ? { ...prev, category: "" } : prev
        );
      })
      .catch((err) => console.error("Error deleting category:", err.response?.data || err.message));
  };

  if (!tinq) return <p className="text-white p-6">Loading…</p>;

  return (
    <div className="relative min-h-screen bg-dark flex items-center justify-center p-6 text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#A855F7", "#B685FF", "#9ABAE5"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full bg-[#1c1c1e] p-6 rounded-xl shadow-md border border-purple-600">
        <h2 className="text-2xl font-bold mb-4">Edit tinq</h2>

        {/* --- Edit form --- */}
        <label className="block mb-2 text-sm text-gray-300">Title</label>
        <input
          type="text"
          name="title"
          value={editedTinq.title || ""}
          onChange={handleInputChange}
          className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 mb-4"
        />

        <label className="block mb-2 text-sm text-gray-300">Description</label>
        <textarea
          name="description"
          value={editedTinq.description || ""}
          onChange={handleInputChange}
          className="w-full bg-[#2a2a2e] border border-gray-600 rounded-xl p-2 mb-4"
          rows="3"
        />

        <label className="block mb-2 text-sm text-gray-300">Date</label>
        <input
          type="date"
          name="date"
          value={editedTinq.date || ""}
          onChange={handleInputChange}
          className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 mb-4"
        />

        <label className="block mb-2 text-sm text-gray-300">Category</label>
        <select
          name="category"
          value={editedTinq.category || ""}
          onChange={handleInputChange}
          className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 mb-4"
        >
          <option value="">— No category —</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-sm text-gray-300">Location</label>
        <select
          name="location"
          value={editedTinq.location || "indoor"}
          onChange={handleInputChange}
          className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 mb-4"
        >
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
        </select>

        <label className="block mb-2 text-sm text-gray-300">Priority</label>
        <select
          name="priority"
          value={editedTinq.priority || "medium"}
          onChange={handleInputChange}
          className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 mb-4"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label className="block mb-2 text-sm text-gray-300">Status</label>
        <select
          name="status"
          value={editedTinq.status || "pending"}
          onChange={handleInputChange}
          className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 mb-6"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleSave}
            className="bg-purpleGlow hover:bg-purple-700 text-white px-6 py-2 rounded-full transition"
          >
            Save Changes
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-400 hover:text-white text-sm"
          >
            Cancel
          </button>
        </div>

        {/* --- Manage Categories --- */}
        <div className="border-t border-gray-700 pt-4">
          <button
            onClick={() => setShowCatMgr((s) => !s)}
            className="text-sm bg-[#2a2a2e] border border-gray-600 px-4 py-2 rounded-full hover:bg-[#34343a] transition"
          >
            {showCatMgr ? "Hide" : "Manage"} categories
          </button>

          {showCatMgr && (
            <div className="mt-4 space-y-4">
              {/* Create */}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 bg-[#2a2a2e] border border-gray-600 rounded-full p-2"
                />
                <button
                  onClick={handleCreateCategory}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full"
                >
                  Add
                </button>
              </div>

              {/* List + rename/delete */}
              <ul className="space-y-2">
                {categories.length === 0 && (
                  <li className="text-gray-400 text-sm italic">No categories yet.</li>
                )}
                {categories.map((cat) => (
                  <li
                    key={cat._id}
                    className="flex items-center justify-between bg-[#2a2a2e] border border-gray-700 rounded-lg p-2"
                  >
                    {renameId === cat._id ? (
                      <div className="flex-1 flex gap-2 items-center">
                        <input
                          className="flex-1 bg-[#1f1f22] border border-gray-700 rounded-full p-2"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                        />
                        <button
                          onClick={handleConfirmRename}
                          className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setRenameId("");
                            setRenameValue("");
                          }}
                          className="text-sm bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-full"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="truncate mr-3">{cat.name}</span>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleStartRename(cat)}
                            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full"
                          >
                            Rename
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat._id)}
                            className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
