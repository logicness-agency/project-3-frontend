import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Aurora from "../components/Aurora/Aurora";
import CategoryManager from "../components/CategoryManager";

const API_URL = process.env.REACT_APP_API_URL;

export default function CreateTinq() {
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showCatManager, setShowCatManager] = useState(false);

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    date: "",
    location: "indoor",
    priority: "medium",
    category: "",
  });

  useEffect(() => {
    if (!storedToken) return;
    axios
      .get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error("Error loading categories:", err.response?.data || err.message);
      });
  }, [storedToken, showCatManager]);

  const handleCategoryCreate = () => {
    if (!newCategory.trim()) return;

    axios
      .post(
        `${API_URL}/categories`,
        { name: newCategory },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )
      .then((res) => {
        setCategories((prev) => [...prev, res.data]);
        setNewCategory("");
      })
      .catch((err) => {
        console.error("Error creating category:", err.response?.data || err.message);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formState.date || isNaN(Date.parse(formState.date))) {
      console.error("Invalid date input");
      return;
    }

    axios
      .post(`${API_URL}/tasks`, formState, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(() => navigate("/dashboard"))
      .catch((err) => {
        console.error("Error creating tinq:", err.response?.data || err.message);
      });
  };

  return (
    <div className="relative min-h-screen bg-dark flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#A855F7", "#B685FF", "#9ABAE5"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <div className="relative z-10 bg-[#1c1c1e] p-8 rounded-xl shadow-md w-full max-w-2xl card--border-glow text-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Create New tinq</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="title"
            value={formState.title}
            onChange={handleChange}
            placeholder="Title"
            className="rounded-full p-2 bg-[#2a2a2e] border border-gray-600 text-white"
          />

          <textarea
            name="description"
            value={formState.description}
            onChange={handleChange}
            placeholder="Description"
            className="rounded-xl p-2 bg-[#2a2a2e] border border-gray-600 text-white"
            rows="4"
          />

          <input
            type="date"
            name="date"
            value={formState.date}
            onChange={handleChange}
            className="rounded-full p-2 bg-[#2a2a2e] border border-gray-600 text-white"
          />

          <select
            name="priority"
            value={formState.priority}
            onChange={handleChange}
            className="rounded-full p-2 bg-[#2a2a2e] border border-gray-600 text-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <div className="flex gap-2">
            <select
              name="category"
              value={formState.category}
              onChange={handleChange}
              className="flex-1 rounded-full p-2 bg-[#2a2a2e] border border-gray-600 text-white"
            >
              <option value="">-- No category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowCatManager(true)}
              className="px-3 py-2 rounded-full bg-[#2a2a2e] border border-gray-600 hover:bg-[#343438]"
              title="Open category manager"
            >
              ⚙️
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Quick add category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="rounded-full p-2 bg-[#2a2a2e] border border-gray-600 text-white flex-1"
            />
            <button
              type="button"
              onClick={handleCategoryCreate}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full"
            >
              +
            </button>
          </div>

          <button
            type="submit"
            className="bg-purpleGlow rounded-full hover:bg-purple-700 text-white font-bold py-2 px-4 mt-4 transition"
          >
            Create tinq
          </button>
        </form>
      </div>


      {/* shared manager */}
      <CategoryManager open={showCatManager} onClose={() => setShowCatManager(false)} />
      
    </div>
  );
}
