import { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import CanvasJSReact from '@canvasjs/react-charts';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const API_URL = process.env.REACT_APP_API_URL;
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // 3-letter abbreviations

// --- Date helpers ---
function toLocalDate(dateLike) {
  const d = new Date(dateLike);
  return isNaN(d) ? null : d;
}
function startOfCurrentWeek() {
  const now = new Date();
  const isoDay = (now.getDay() + 6) % 7;
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - isoDay);
  start.setHours(0, 0, 0, 0);
  return start;
}
function endOfCurrentWeek() {
  const start = startOfCurrentWeek();
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export default function Dashboard() {
  const { isLoading } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [showAllTinqs, setShowAllTinqs] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [categories, setCategories] = useState([]);

  const storedToken = localStorage.getItem("authToken");
  const authHeader = useMemo(
    () => ({ headers: { Authorization: `Bearer ${storedToken}` } }),
    [storedToken]
  );

  useEffect(() => {
    axios
      .get(`${API_URL}/tasks`, authHeader)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error loading tasks:", err.response?.data || err.message));
  }, [authHeader]);

  useEffect(() => {
    axios
      .get(`${API_URL}/categories`, authHeader)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error loading categories:", err.response?.data || err.message));
  }, [authHeader]);

  // Current week tasks
  const weekStart = startOfCurrentWeek();
  const weekEnd = endOfCurrentWeek();

  const tasksInWeek = useMemo(() => {
    return tasks.filter((t) => {
      const d = toLocalDate(t.date);
      return d && d >= weekStart && d <= weekEnd;
    });
  }, [tasks, weekStart, weekEnd]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const categoryMatch = filterCategory === "all" || task.category?._id === filterCategory;
      const statusMatch = filterStatus === "all" || task.status === filterStatus;
      return categoryMatch && statusMatch;
    });
  }, [tasks, filterCategory, filterStatus]);

  const todayTasks = useMemo(() => {
    const now = new Date();
    return tasks
      .filter((t) => {
        const d = toLocalDate(t.date);
        return (
          d &&
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth() &&
          d.getDate() === now.getDate()
        );
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [tasks]);

  if (isLoading) return <p>Loading...</p>;

  // Chart data
  const sameMonth = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();

  const now = new Date();
  const monthly = tasks.filter(t => t.date && sameMonth(new Date(t.date), now));

  const countByStatus = list => ({
    pending: list.filter(t => t.status === "pending").length,
    inProgress: list.filter(t => t.status === "in-progress").length,
    done: list.filter(t => t.status === "done").length,
  });

  const m = countByStatus(monthly);

  const monthlyOptions = {
    backgroundColor: "transparent",
    animationEnabled: true,
    axisX: {
      labelFontColor: "#E5E7EB",
      labelFontSize: 10,
      margin: 6,
    },
    axisY: {
      labelFontColor: "#E5E7EB",
      labelFontSize: 8,
      interval: 1,
      gridColor: "rgba(255,255,255,0.06)",
      gridThickness: 1,
    },
    data: [{
      type: "column",
      indexLabelFontColor: "#E5E7EB",
      indexLabelFontSize: 8,
      dataPoints: [
        { label: "Pending", y: m.pending, color: "#A855F7" },
        { label: "Progress", y: m.inProgress, color: "#7C3AED" },
        { label: "Done", y: m.done, color: "#10B981" },
      ].map(dp => ({ ...dp, y: Number.isFinite(dp.y) ? dp.y : 0 }))
    }]
  };

  return (
    <div className="pt-16 px-3 min-h-screen bg-dark">
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-7 gap-2">
        {/* Today's tinqs */}
        <div className="relative rounded-lg bg-[#1c1c1e] p-3 border border-gray-800 text-white md:col-span-2 h-60">
          <h2 className="text-md font-bold mb-2">Today's tinqs</h2>
          <div className="overflow-y-auto h-48">
            {todayTasks.length === 0 ? (
              <p className="text-xs text-gray-400">No tinqs today.</p>
            ) : (
              <ul className="space-y-1">
                {todayTasks.map((t) => (
                  <li key={t._id}>
                    <Link
                      to={`/tinq/${t._id}`}
                      className="block bg-[#2a2a2e] border border-gray-700 rounded px-2 py-1 hover:bg-[#34343a] transition text-xs"
                    >
                      <p className="font-medium text-purple-300 truncate">{t.title}</p>
                      <p className="text-xxs text-gray-400">
                        {t.category?.name || "No category"} • {t.status}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Week View */}
        <div className="relative rounded-lg bg-[#1c1c1e] p-3 border border-gray-800 text-white md:col-span-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-bold">This Week</h2>
            <div className="flex items-center gap-2">
              <p className="text-xxs text-gray-400">
                {weekStart.toLocaleDateString()} — {weekEnd.toLocaleDateString()}
              </p>
              <Link
                to="/add-tinq"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xxs font-medium px-2 py-1 rounded-full transition"
              >
                + Add
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {WEEK_DAYS.map((day) => (
              <div key={day} className="bg-[#2a2a2d] rounded p-1 flex flex-col h-32">
                <div className="font-medium text-purple-300 text-xxs text-center mb-1">
                  {day}
                </div>
                <div className="overflow-y-auto flex-1">
                  <ul className="space-y-0.5 text-xxs">
                    {tasksInWeek
                      .filter((t) => {
                        const d = toLocalDate(t.date);
                        return d && WEEK_DAYS[d.getDay()] === day;
                      })
                      .map((t) => (
                        <li key={t._id}>
                          <Link
                            to={`/tinq/${t._id}`}
                            className="block bg-purple-800/20 px-1 py-0.5 rounded text-white truncate hover:bg-purple-700 transition"
                          >
                            {t.title}
                          </Link>
                        </li>
                      ))}
                    {tasksInWeek.filter((t) => {
                      const d = toLocalDate(t.date);
                      return d && WEEK_DAYS[d.getDay()] === day;
                    }).length === 0 && (
                      <li className="text-gray-500 italic text-center text-xxs">-</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All tinqs counter */}
        <div className="relative rounded-lg bg-[#1c1c1e] p-3 border border-gray-800 text-white md:col-span-1 h-60 flex flex-col items-center justify-center">
          <h2 className="text-md font-bold mb-1">All tinqs</h2>
          <button
            onClick={() => setShowAllTinqs(true)}
            className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition"
          >
            {tasks.length}
          </button>
          <p className="text-xxs text-gray-400 mt-1">Click to view</p>
        </div>

        {/* Progress chart */}
        <div className="relative rounded-lg bg-[#1c1c1e] p-3 border border-gray-800 text-white md:col-span-3 h-60">
          <h2 className="text-md font-bold mb-1">Progress</h2>
          <div className="w-full h-48">
            <CanvasJSChart
              options={monthlyOptions}
              containerProps={{ width: "100%", height: "160px" }}
            />
          </div>
        </div>

        {/* Upcoming tasks */}
        <div className="relative rounded-lg bg-[#1c1c1e] p-3 border border-gray-800 text-white md:col-span-4 h-28">
          <h2 className="text-md font-bold mb-0.5">Upcoming</h2>
          <p className="text-xxs text-gray-400">Next week's tasks</p>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden space-y-3">
        {/* Today's tinqs - Mobile */}
        <div className="relative rounded-lg bg-[#1c1c1e] p-3 border border-gray-800 text-white">
          <h2 className="text-md font-bold mb-2">Today's tinqs</h2>
          <div className="overflow-y-auto max-h-40">
            {todayTasks.length === 0 ? (
              <p className="text-xs text-gray-400">No tinqs today.</p>
            ) : (
              <ul className="space-y-1">
                {todayTasks.map((t) => (
                  <li key={t._id}>
                    <Link
                      to={`/tinq/${t._id}`}
                      className="block bg-[#2a2a2e] border border-gray-700 rounded px-2 py-1 hover:bg-[#34343a] transition text-xs"
                    >
                      <p className="font-medium text-purple-300 truncate">{t.title}</p>
                      <p className="text-xxs text-gray-400">
                        {t.category?.name || "No category"} • {t.status}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* All my tinqs - Mobile */}
        <div className="relative rounded-lg bg-[#1c1c1e] p-3 border border-gray-800 text-white flex flex-col items-center justify-center text-center">
          <h2 className="text-md font-bold mb-1">All my tinqs</h2>
          <button
            onClick={() => setShowAllTinqs(true)}
            className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition"
          >
            {tasks.length}
          </button>
          <p className="text-xxs text-gray-400 mt-1">Click to view all</p>
        </div>

        {/* This Week - Mobile */}
        <div className="relative rounded-lg bg-[#1c1c1e] p-3 border border-gray-800 text-white">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-bold">This Week</h2>
            <Link
              to="/add-tinq"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xxs font-medium px-2 py-1 rounded-full transition"
            >
              + Add
            </Link>
          </div>
          <p className="text-xxs text-gray-400 mb-2">
            {weekStart.toLocaleDateString()} — {weekEnd.toLocaleDateString()}
          </p>

          <div className="grid grid-cols-2 gap-1">
            {WEEK_DAYS.map((day) => (
              <div key={day} className="bg-[#2a2a2d] rounded p-1 flex flex-col h-24">
                <div className="font-medium text-purple-300 text-xxs mb-0.5">{day}</div>
                <div className="overflow-y-auto flex-1">
                  <ul className="space-y-0.5 text-xxs">
                    {tasksInWeek
                      .filter((t) => {
                        const d = toLocalDate(t.date);
                        return d && WEEK_DAYS[d.getDay()] === day;
                      })
                      .map((t) => (
                        <li key={t._id}>
                          <Link
                            to={`/tinq/${t._id}`}
                            className="block bg-purple-800/20 px-1 py-0.5 rounded text-white truncate hover:bg-purple-700 transition"
                          >
                            {t.title}
                          </Link>
                        </li>
                      ))}
                    {tasksInWeek.filter((t) => {
                      const d = toLocalDate(t.date);
                      return d && WEEK_DAYS[d.getDay()] === day;
                    }).length === 0 && (
                      <li className="text-gray-500 italic text-xxs">-</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress - Mobile */}
        <div className="relative rounded-lg bg-[#1c1c1e] p-3 border border-gray-800 text-white">
          <h2 className="text-md font-bold mb-1">Progress</h2>
          <div className="w-full h-48">
            <CanvasJSChart
              options={monthlyOptions}
              containerProps={{ width: "100%", height: "180px" }}
            />
          </div>
        </div>
      </div>

      {/* Modal: All Tinqs */}
      {showAllTinqs && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-3">
          <div className="bg-[#1c1c1e] p-4 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto text-white border border-purple-600">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-md font-bold">All tinqs</h2>
              <button
                onClick={() => setShowAllTinqs(false)}
                className="text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded-full text-xs"
              >
                Close
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-[#2a2a2e] text-white px-3 py-1 rounded-full border border-gray-600 text-xs"
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
                className="bg-[#2a2a2e] text-white px-3 py-1 rounded-full border border-gray-600 text-xs"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Task List */}
            <ul className="space-y-1">
              {filteredTasks.length > 0 ? (
                [...filteredTasks]
                  .sort((a, b) => {
                    const dateA = a.date ? new Date(a.date) : new Date(0);
                    const dateB = b.date ? new Date(b.date) : new Date(0);
                    return dateB - dateA;
                  })
                  .map((task) => (
                    <li
                      key={task._id}
                      className="bg-[#2a2a2e] px-3 py-2 rounded border border-gray-700 hover:bg-[#38383d] transition text-xs"
                    >
                      <Link to={`/tinq/${task._id}`}>
                        <p className="font-medium truncate">{task.title}</p>
                        <p className="text-xxs text-gray-400">
                          {(task.date && !isNaN(new Date(task.date)))
                            ? new Date(task.date).toLocaleDateString()
                            : "—"}{" "}
                          | {task.status} | {task.category?.name || "No category"}
                        </p>
                      </Link>
                    </li>
                  ))
              ) : (
                <li className="text-gray-400 italic text-xs">No tinqs match your filters.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}