
export default function Dashboard() {
  return (
    <>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-24 px-4 p-8 min-h-screen bg-dark bento-section">

        <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-1">
          <h2 className="text-xl font-bold mb-2">Today's Tasks</h2>
          <p className="text-sm text-gray-400">Check what’s due today.</p>
        </div>

        <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-2 md:row-span-2">
          <h2 className="text-xl font-bold mb-2">This Week</h2>
          <p className="text-sm text-gray-400">Deadlines, meetings, milestones...</p>
        </div>

        <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-1">
          <h2 className="text-xl font-bold mb-2">Calendar</h2>
          <p className="text-sm text-gray-400">Plan your week ahead.</p>
        </div>

        <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-1">
          <h2 className="text-xl font-bold mb-2">Progress</h2>
          <p className="text-sm text-gray-400">8 / 12 tasks completed</p>
        </div>

        <div className="relative rounded-xl bg-[#1c1c1e] p-6 card--border-glow text-white md:col-span-2">
          <h2 className="text-xl font-bold mb-2">Upcoming</h2>
          <p className="text-sm text-gray-400">Tasks scheduled later this week.</p>
        </div>

      </div>
    </>
  );
}
