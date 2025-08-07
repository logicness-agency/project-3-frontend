import { Link } from "react-router-dom";

export default function Dashboard() {
  const dummyTinqs = {
    Monday: ["Finish UI mockups", "Email client", "Email client", "Email client", "Email client"],
    Tuesday: ["Team meeting 10:00", "Push repo"],
    Wednesday: ["Bugfix login", "Review PR"],
    Thursday: ["Design feedback"],
    Friday: ["Deploy v1", "Plan sprint"],
    Saturday: ["Chill"],
    Sunday: []
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-24 px-4 p-8 min-h-screen bg-dark bento-section">

      {/* Today's Tasks */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-1">
        <h2 className="text-xl font-bold mb-2">Today's tinqs</h2>
        <p className="text-sm text-gray-400">Check what’s due today.</p>
      </div>

      {/* This Week */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-2 md:row-span-2 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">This Week</h2>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-full transition"
          >
            add tinq
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 flex-1">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => (
            <div
              key={index}
              className="bg-[#2a2a2d] rounded-lg p-3 flex flex-col h-full overflow-hidden"
            >
              <div className="font-semibold text-purple-300 mb-2">{day}</div>
              <ul className="text-xs space-y-1 overflow-y-auto flex-1">
                {dummyTinqs[day]?.length > 0 ? (
                  dummyTinqs[day].map((tinq, i) => (
                    <li
                      key={i}
                      className="bg-purple-800/30 px-2 py-1 rounded-full text-white truncate"
                    >
                      {tinq}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No tinqs</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-1">
        <h2 className="text-xl font-bold mb-2">All my tinqs</h2>
        <p className="text-sm text-gray-400">I DONT KNOW </p>
      </div>

      {/* Progress */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-1">
        <h2 className="text-xl font-bold mb-2">Weather</h2>
        <p className="text-sm text-gray-400">weather of the week</p>
      </div>

      {/* Weather */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-1">
        <h2 className="text-xl font-bold mb-2">Progress</h2>
        <p className="text-sm text-gray-400">8 / 12 tinqs completed maybe week month year</p>
      </div>

      {/* My Tinqs */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-2">
        <h2 className="text-xl font-bold mb-2">maybe weather alarmed tinqs</h2>
        <p className="text-sm text-gray-400">or all tinqs.</p>
      </div>

      {/* Upcoming */}
      <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-2">
        <h2 className="text-xl font-bold mb-2">Upcoming</h2>
        <p className="text-sm text-gray-400">Tasks scheduled next week.</p>
      </div>
    </div>
  );
}
