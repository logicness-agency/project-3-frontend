import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

const API_URL = process.env.REACT_APP_API_URL;

export default function Dashboard() {
  const { isLoading } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [showAllTinqs, setShowAllTinqs] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [categories, setCategories] = useState([]);

  const storedToken = localStorage.getItem("authToken");

  useEffect(() => {
    axios
      .get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error loading tasks:", err));
  }, [storedToken]);

  useEffect(() => {
    axios
      .get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error loading categories:", err));
  }, [storedToken]);

  const filteredTasks = tasks.filter((task) => {
    const categoryMatch = filterCategory === "all" || task.category?._id === filterCategory;
    const statusMatch = filterStatus === "all" || task.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-24 px-4 p-8 min-h-screen bg-dark bento-section">

      {/* Today's Tasks */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-1">
        <h2 className="text-xl font-bold mb-2">Today's tinqs</h2>
        <p className="text-sm text-gray-400">Feature coming soon</p>
      </div>

      {/* This Week */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-2 md:row-span-2 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">This Week</h2>
          <Link
            to="/add-tinq"
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-full transition"
          >
            + Add tinq
          </Link>
        </div>

        <div className="grid grid-cols-7 gap-2 flex-1">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
            (day, index) => (
              <div
                key={index}
                className="bg-[#2a2a2d] rounded-lg p-3 flex flex-col h-full overflow-hidden"
              >
                <div className="font-semibold text-purple-300 mb-2">{day}</div>
                <ul className="text-xs space-y-1 overflow-y-auto flex-1">
                  {tasks
                    .filter((t) => {
                      const taskDate = new Date(t.date);
                      const taskDay = taskDate.toLocaleDateString("en-US", {
                        weekday: "long",
                      });
                      return taskDay === day;
                    })
                    .map((t) => (
                      <li key={t._id}>
                        <Link
                          to={`/tinq/${t._id}`}
                          className="block bg-purple-800/30 px-2 py-1 rounded-full text-white truncate hover:bg-purple-700 transition"
                        >
                          {t.title}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>

      {/* All my Tinqs */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold mb-2">All my tinqs</h2>
        <button
          onClick={() => setShowAllTinqs(true)}
          className="text-5xl font-bold text-purple-400 hover:text-purple-300 transition"
        >
          {tasks.length}
        </button>
        <p className="text-sm text-gray-400 mt-2">Click to view all</p>
      </div>

      {/* Progress */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-1">
        <h2 className="text-xl font-bold mb-2">Progress</h2>
        <p className="text-sm text-gray-400">
          {tasks.filter((t) => t.status === "done").length} / {tasks.length} completed
        </p>
      </div>

      {/* Weather */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-1">
        <h2 className="text-xl font-bold mb-2">Weather</h2>
        <p className="text-sm text-gray-400">Feature coming soon</p>
      </div>

      {/* Summary */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-2">
        <h2 className="text-xl font-bold mb-2">tinqs Summary</h2>
        <p className="text-sm text-gray-400">Overview of tasks</p>
      </div>

      {/* Upcoming */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-2">
        <h2 className="text-xl font-bold mb-2">Upcoming</h2>
        <p className="text-sm text-gray-400">Tasks scheduled next week</p>
      </div>

      {/* Modal for All Tinqs */}
      {showAllTinqs && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1c1c1e] p-6 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto text-white border border-purple-600 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">All tinqs</h2>
              <button
                onClick={() => setShowAllTinqs(false)}
                className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full"
              >
                Close
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-[#2a2a2e] text-white px-4 py-2 rounded-full border border-gray-600"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#2a2a2e] text-white px-4 py-2 rounded-full border border-gray-600"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Task List */}
            <ul className="space-y-2">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <li
                    key={task._id}
                    className="bg-[#2a2a2e] px-4 py-2 rounded-lg border border-gray-700 hover:bg-[#38383d] transition"
                  >
                    <Link to={`/tinq/${task._id}`}>
                      <p className="font-semibold">{task.title}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(task.date).toLocaleDateString()} | {task.status}
                      </p>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 italic">No tinqs match your filters.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
