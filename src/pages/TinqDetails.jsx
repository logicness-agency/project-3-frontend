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
  const storedToken = localStorage.getItem("authToken");

  useEffect(() => {
    axios
      .get(`${API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => {
        setTinq(res.data);
        setEditedTinq({
          ...res.data,
          date: res.data.date?.split("T")[0] || "", // ISO format for <input type="date">
          category: res.data.category?._id || "",
        });
      })
      .catch((err) => {
        console.error("Error loading tinq:", err);
        navigate("/dashboard");
      });

    axios
      .get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error loading categories:", err));
  }, [taskId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTinq((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    axios
      .put(`${API_URL}/tasks/${taskId}`, editedTinq, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => {
        setTinq(res.data);
        navigate("/dashboard");
      })
      .catch((err) => console.error("Error saving changes:", err));
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

      <div className="relative z-10 max-w-xl w-full bg-[#1c1c1e] p-6 rounded-xl shadow-md border border-purple-600">
        <h2 className="text-2xl font-bold mb-4">Edit Tinq</h2>

        <label className="block mb-2 text-sm text-gray-300">Title</label>
        <input
          type="text"
          name="title"
          value={editedTinq.title}
          onChange={handleInputChange}
          className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 mb-4"
        />

        <label className="block mb-2 text-sm text-gray-300">Description</label>
        <textarea
          name="description"
          value={editedTinq.description}
          onChange={handleInputChange}
          className="w-full bg-[#2a2a2e] border border-gray-600 rounded-xl p-2 mb-4"
          rows="3"
        />

        <label className="block mb-2 text-sm text-gray-300">Date</label>
        <input
          type="date"
          name="date"
          value={editedTinq.date}
          onChange={handleInputChange}
          className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 mb-4"
        />

        <label className="block mb-2 text-sm text-gray-300">Category</label>
        <select
          name="category"
          value={editedTinq.category}
          onChange={handleInputChange}
          className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 mb-4"
        >
          <option value="">-- Select --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-sm text-gray-300">Location</label>
        <select
          name="location"
          value={editedTinq.location}
          onChange={handleInputChange}
          className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 mb-4"
        >
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
        </select>

        <label className="block mb-2 text-sm text-gray-300">Priority</label>
        <select
          name="priority"
          value={editedTinq.priority}
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
          value={editedTinq.status}
          onChange={handleInputChange}
          className="w-full bg-[#2a2a2e] border border-gray-600 rounded-full p-2 mb-6"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <div className="flex justify-between items-center">
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
      </div>
    </div>
  );
}
