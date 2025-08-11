import { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import CanvasJSReact from '@canvasjs/react-charts';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const API_URL = process.env.REACT_APP_API_URL;
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// --- Date helpers ---
function toLocalDate(dateLike) {
  const d = new Date(dateLike);
  return isNaN(d) ? null : d;
}
function startOfCurrentWeek() {
  const now = new Date();
  // getDay(): 0=Sun..6=Sat -> convert to ISO Monday=0..Sunday=6
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
function weekdayNameEn(date) {
  return date.toLocaleDateString("en-US", { weekday: "long" });
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

  // Only tasks in the current week (Mon–Sun)
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

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-24 px-4 p-8 min-h-screen bg-dark bento-section">

      {/* Today's tinqs */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-1">
        <h2 className="text-xl font-bold mb-2">Today's tinqs</h2>
        <p className="text-sm text-gray-400">Feature coming soon</p>
      </div>

      {/* This Week */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-2 md:row-span-2 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">This Week</h2>
          <Link
            to="/add-tinq"
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-full transition"
          >
            + Add tinq
          </Link>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          {weekStart.toLocaleDateString()} — {weekEnd.toLocaleDateString()}
        </p>

        <div className="grid grid-cols-7 gap-2 flex-1">
          {WEEK_DAYS.map((day) => (
            <div key={day} className="bg-[#2a2a2d] rounded-lg p-3 flex flex-col h-full overflow-hidden">
              <div className="font-semibold text-purple-300 mb-2">{day}</div>
              <ul className="text-xs space-y-1 overflow-y-auto flex-1">
                {tasksInWeek
                  .filter((t) => {
                    const d = toLocalDate(t.date);
                    return d && weekdayNameEn(d) === day;
                  })
                  .map((t) => (
                    <li key={t._id}>
                      <Link
                        to={`/tinq/${t._id}`}
                        className="block bg-purple-800/30 px-2 py-1 rounded-full text-white truncate hover:bg-purple-700 transition"
                        title={t.title}
                      >
                        {t.title}
                      </Link>
                    </li>
                  ))}

                {tasksInWeek.filter((t) => {
                  const d = toLocalDate(t.date);
                  return d && weekdayNameEn(d) === day;
                }).length === 0 && (
                    <li className="text-gray-500 italic">No tinqs</li>
                  )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* All my tinqs (opens modal) */}
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
<div className="relative rounded-xl bg-[#1c1c1e] p-6 pb-8 card--border-glow text-white md:col-span-1">
  <h2 className="text-xl font-bold mb-4">Monthly Progress</h2>

  {(() => {
    // helpers
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

    const purple = "#A855F7";
    const purpleDim = "#7C3AED";
    const teal = "#10B981";

    const monthlyOptions = {
      backgroundColor: "transparent",
      animationEnabled: true,
      axisX: {
        labelFontColor: "#E5E7EB",
        labelFontSize: 14,
        margin: 10,              
      },
      axisY: {
        labelFontColor: "#E5E7EB",
        labelFontSize: 12,
        interval: 1,
        gridColor: "rgba(255,255,255,0.06)",
        gridThickness: 1,
      },
      data: [{
        type: "column",
        indexLabelFontColor: "#E5E7EB",
        indexLabelFontSize: 12,
        dataPoints: [
          { label: "Pending",     y: m.pending,    color: purple     },
          { label: "In-Progress", y: m.inProgress, color: purpleDim  },
          { label: "Done",        y: m.done,       color: teal       },
        ].map(dp => ({ ...dp, y: Number.isFinite(dp.y) ? dp.y : 0 }))
      }]
    };

    return (
      <div className="w-full">
        <CanvasJSChart
          options={monthlyOptions}
          containerProps={{ width: "100%", height: "320px" }}
        />
      </div>
    );
  })()}
</div>

      {/* Weather */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-1">
        <h2 className="text-xl font-bold mb-2">Weather</h2>
        <p className="text-sm text-gray-400">Feature coming soon</p>
      </div>

      {/* Upcoming2 */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-2">
        <h2 className="text-xl font-bold mb-2">Upcoming2</h2>
        <p className="text-sm text-gray-400">Tasks scheduled next week2</p>
      </div>

      {/* Upcoming */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-2">
        <h2 className="text-xl font-bold mb-2">Upcoming</h2>
        <p className="text-sm text-gray-400">Tasks scheduled next week</p>
      </div>

      {/* Modal: All Tinqs */}
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
                        {(task.date && !isNaN(new Date(task.date))) ? new Date(task.date).toLocaleDateString() : "—"} | {task.status} | {task.category?.name || "No category"}
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
