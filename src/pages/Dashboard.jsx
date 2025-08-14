import { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import CanvasJSReact from "@canvasjs/react-charts";
import Footer from "../components/Footer";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const API_URL = process.env.REACT_APP_API_URL;
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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

  return (
    <div className="flex flex-col min-h-screen bg-dark">
      <div className="flex-1 pt-20 px-4 p-6">
        <div className="block lg:hidden space-y-4">
          <div className="relative rounded-xl bg-[#1c1c1e] p-4 card--border-glow text-white h-48">
            <h2 className="text-lg font-bold mb-2">Today's tinqs</h2>
            <div className="overflow-y-auto h-36">
              {todayTasks.length === 0 ? (
                <p className="text-sm text-gray-400">No tinqs today.</p>
              ) : (
                <ul className="space-y-2">
                  {todayTasks.map((t) => (
                    <li key={t._id}>
                      <Link
                        to={`/tinq/${t._id}`}
                        className="block bg-[#2a2a2e] border border-gray-700 rounded-lg px-3 py-2 hover:bg-[#34343a] transition"
                        title={t.title}
                      >
                        <p className="font-semibold text-purple-300 truncate text-sm">{t.title}</p>
                        <p className="text-xs text-gray-400">
                          {t.category?.name || "No category"} • {t.status}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="relative rounded-xl bg-[#1c1c1e] p-4 card--border-glow text-white h-32 flex flex-col items-center justify-center text-center">
            <h2 className="text-lg font-bold mb-2">All my tinqs</h2>
            <button
              onClick={() => setShowAllTinqs(true)}
              className="text-3xl font-bold text-purple-400 hover:text-purple-300 transition"
            >
              {tasks.length}
            </button>
            <p className="text-xs text-gray-400 mt-1">Click to view all</p>
          </div>

          <div className="relative rounded-xl bg-[#1c1c1e] p-4 card--border-glow text-white">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">This Week</h2>
              <Link
                to="/add-tinq"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-3 py-1 rounded-full transition"
              >
                + Add
              </Link>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              {weekStart.toLocaleDateString()} — {weekEnd.toLocaleDateString()}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {WEEK_DAYS.map((day) => (
                <div key={day} className="bg-[#2a2a2d] rounded-lg p-2 flex flex-col min-h-[120px]">
                  <div className="font-semibold text-purple-300 mb-1 text-xs truncate" title={day}>
                    {day.slice(0, 3)}
                  </div>
                  <div className="overflow-y-auto flex-1 min-h-0">
                    <ul className="text-xs space-y-1">
                      {tasksInWeek
                        .filter((t) => {
                          const d = toLocalDate(t.date);
                          return d && weekdayNameEn(d) === day;
                        })
                        .map((t) => (
                          <li key={t._id}>
                            <Link
                              to={`/tinq/${t._id}`}
                              className="block bg-purple-800/30 px-1 py-1 rounded-full text-white truncate hover:bg-purple-700 transition text-xs"
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
                        <li className="text-gray-500 italic text-xs">No tinqs</li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-xl bg-[#1c1c1e] p-4 card--border-glow text-white h-24 flex flex-col items-center justify-center text-center">
            <h2 className="text-lg font-bold mb-2">Mood</h2>
            <span className="text-3xl font-bold text-purple-400">:)</span>
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-4 gap-4 bento-section">
          <div className="relative rounded-xl bg-[#1c1c1e] p-4 card--border-glow text-white md:col-span-1 h-72">
            <h2 className="text-xl font-bold mb-2">Today's tinqs</h2>
            <div className="overflow-y-auto h-56">
              {todayTasks.length === 0 ? (
                <p className="text-sm text-gray-400">No tinqs today.</p>
              ) : (
                <ul className="space-y-2">
                  {todayTasks.map((t) => (
                    <li key={t._id}>
                      <Link
                        to={`/tinq/${t._id}`}
                        className="block bg-[#2a2a2e] border border-gray-700 rounded-lg px-3 py-2 hover:bg-[#34343a] transition"
                        title={t.title}
                      >
                        <p className="font-semibold text-purple-300 truncate text-sm">{t.title}</p>
                        <p className="text-xs text-gray-400">
                          {t.category?.name || "No category"} • {t.status}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="relative rounded-xl bg-[#1c1c1e] p-4 card--border-glow text-white md:col-span-2 md:row-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">This Week</h2>
              <Link
                to="/add-tinq"
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-full transition"
              >
                + Add tinq
              </Link>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              {weekStart.toLocaleDateString()} — {weekEnd.toLocaleDateString()}
            </p>
            <div className="grid grid-cols-7 gap-2 flex-1 min-h-0">
              {WEEK_DAYS.map((day) => (
                <div key={day} className="bg-[#2a2a2d] rounded-lg p-3 flex flex-col min-h-0">
                  <div className="font-semibold text-purple-300 mb-2 text-sm truncate" title={day}>
                    {day}
                  </div>
                  <div className="overflow-y-auto flex-1 min-h-0">
                    <ul className="text-xs space-y-1">
                      {tasksInWeek
                        .filter((t) => {
                          const d = toLocalDate(t.date);
                          return d && weekdayNameEn(d) === day;
                        })
                        .map((t) => (
                          <li key={t._id}>
                            <Link
                              to={`/tinq/${t._id}`}
                              className="block bg-purple-800/30 px-2 py-1 rounded-full text-white truncate hover:bg-purple-700 transition text-xs"
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
                        <li className="text-gray-500 italic text-xs">No tinqs</li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-xl bg-[#1c1c1e] p-4 card--border-glow text-white md:col-span-1 h-72 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold mb-2">All my tinqs</h2>
            <button
              onClick={() => setShowAllTinqs(true)}
              className="text-4xl font-bold text-purple-400 hover:text-purple-300 transition"
            >
              {tasks.length}
            </button>
            <p className="text-sm text-gray-400 mt-2">Click to view all</p>
          </div>

          <div className="relative rounded-xl bg-[#1c1c1e] p-4 pb-6 card--border-glow text-white md:col-span-1 h-72">
            <h2 className="text-xl font-bold mb-3">Monthly Progress</h2>
            {(() => {
              const sameMonth = (d1, d2) =>
                d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
              const now = new Date();
              const monthly = tasks.filter((t) => t.date && sameMonth(new Date(t.date), now));
              const countByStatus = (list) => ({
                pending: list.filter((t) => t.status === "pending").length,
                inProgress: list.filter((t) => t.status === "in-progress").length,
                done: list.filter((t) => t.status === "done").length,
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
                  labelFontSize: 12,
                  margin: 8,
                },
                axisY: {
                  labelFontColor: "#E5E7EB",
                  labelFontSize: 10,
                  interval: 1,
                  gridColor: "rgba(255,255,255,0.06)",
                  gridThickness: 1,
                },
                data: [
                  {
                    type: "column",
                    indexLabelFontColor: "#E5E7EB",
                    indexLabelFontSize: 9,
                    dataPoints: [
                      { label: "Pending", y: m.pending, color: purple },
                      { label: "Progress", y: m.inProgress, color: purpleDim },
                      { label: "Done", y: m.done, color: teal },
                    ].map((dp) => ({ ...dp, y: Number.isFinite(dp.y) ? dp.y : 0 })),
                  },
                ],
              };
              return (
                <div className="w-full h-52">
                  <CanvasJSChart options={monthlyOptions} containerProps={{ width: "100%", height: "208px" }} />
                </div>
              );
            })()}
          </div>

          <div className="relative rounded-xl bg-[#1c1c1e] p-4 card--border-glow text-white md:col-span-1 h-72 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold mb-2">Mood</h2>
            <span className="text-5xl font-bold text-purple-400">:)</span>
          </div>
        </div>

        {showAllTinqs && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#1c1c1e] p-6 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto text-white border border-purple-600 shadow-lg mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">All tinqs</h2>
                <button
                  onClick={() => setShowAllTinqs(false)}
                  className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full"
                >
                  Close
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
              <ul className="space-y-2">
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
                        className="bg-[#2a2a2e] px-4 py-2 rounded-lg border border-gray-700 hover:bg-[#38383d] transition"
                      >
                        <Link to={`/tinq/${task._id}`}>
                          <p className="font-semibold">{task.title}</p>
                          <p className="text-sm text-gray-400">
                            {(task.date && !isNaN(new Date(task.date)))
                              ? new Date(task.date).toLocaleDateString()
                              : "—"}{" "}
                            | {task.status} | {task.category?.name || "No category"}
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

      <Footer />
    </div>
  );
}
