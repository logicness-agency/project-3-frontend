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
  const [showCatMgr, setShowCatMgr] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [renameId, setRenameId] = useState("");
  const [renameValue, setRenameValue] = useState("");

  const storedToken = localStorage.getItem("authToken");
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
  }, [taskId]);

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

  const handleDelete = () => {
    if (!window.confirm(`Delete "${tinq.title}"? This cannot be undone.`)) return;
    axios
      .delete(`${API_URL}/tasks/${taskId}`, authHeader)
      .then(() => navigate("/dashboard"))
      .catch((err) => console.error("Error deleting tinq:", err.response?.data || err.message));
  };

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
        setCategories((prev) => prev.filter((c) => c._id !== catId));
        setEditedTinq((prev) => (prev.category === catId ? { ...prev, category: "" } : prev));
      })
      .catch((err) => console.error("Error deleting category:", err.response?.data || err.message));
  };

  if (!tinq) return <p className="text-white p-4 text-sm">Loading…</p>;

  return (
    <div className="relative min-h-screen bg-dark flex items-center justify-center p-4 text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#A855F7", "#B685FF", "#9ABAE5"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <div className="relative z-10 max-w-md w-full bg-[#1c1c1e] p-6 rounded-2xl shadow-md border border-purple-600/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit tinq</h2>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition text-sm"
          >
            Delete
          </button>
        </div>

        {/* Edit form */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-xs text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              value={editedTinq.title || ""}
              onChange={handleInputChange}
              className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 text-sm px-4"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs text-gray-300">Description</label>
            <textarea
              name="description"
              value={editedTinq.description || ""}
              onChange={handleInputChange}
              className="w-full bg-[#2a2a2e] border border-gray-600 rounded-xl p-2 text-sm px-4"
              rows="3"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs text-gray-300">Date</label>
            <input
              type="date"
              name="date"
              value={editedTinq.date || ""}
              onChange={handleInputChange}
              className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 text-sm px-4"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs text-gray-300">Category</label>
            <select
              name="category"
              value={editedTinq.category || ""}
              onChange={handleInputChange}
              className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 text-sm px-4"
            >
              <option value="">— No category —</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-xs text-gray-300">Location</label>
              <select
                name="location"
                value={editedTinq.location || "indoor"}
                onChange={handleInputChange}
                className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 text-sm px-4"
              >
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs text-gray-300">Priority</label>
              <select
                name="priority"
                value={editedTinq.priority || "medium"}
                onChange={handleInputChange}
                className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 text-sm px-4"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs text-gray-300">Status</label>
            <select
              name="status"
              value={editedTinq.status || "pending"}
              onChange={handleInputChange}
              className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 text-sm px-4 mb-3"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-sm font-medium"
            >
              Save Changes
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Manage Categories */}
        <div className="border-t border-gray-700 pt-4 mt-4">
          <button
            onClick={() => setShowCatMgr((s) => !s)}
            className="text-xs bg-[#2a2a2e] border border-gray-600 px-4 py-2 rounded-full hover:bg-[#34343a] transition"
          >
            {showCatMgr ? "Hide" : "Manage"} categories
          </button>

          {showCatMgr && (
            <div className="mt-4 space-y-3">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 bg-[#2a2a2e] border border-gray-600 rounded-full p-2 text-sm px-4"
                />
                <button
                  onClick={handleCreateCategory}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm"
                >
                  Add
                </button>
              </div>

              <ul className="space-y-2">
                {categories.length === 0 && (
                  <li className="text-gray-400 text-xs italic">No categories yet.</li>
                )}
                {categories.map((cat) => (
                  <li
                    key={cat._id}
                    className="flex items-center justify-between bg-[#2a2a2e] border border-gray-700 rounded-xl p-3"
                  >
                    {renameId === cat._id ? (
                      <div className="flex-1 flex gap-2 items-center">
                        <input
                          className="flex-1 bg-[#1f1f22] border border-gray-700 rounded-full p-2 text-sm px-3"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                        />
                        <button
                          onClick={handleConfirmRename}
                          className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setRenameId("");
                            setRenameValue("");
                          }}
                          className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-full"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm truncate mr-2">{cat.name}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStartRename(cat)}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full"
                          >
                            Rename
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat._id)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full"
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