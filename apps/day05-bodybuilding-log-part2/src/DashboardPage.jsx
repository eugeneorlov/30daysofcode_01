import { Link } from "react-router-dom";
import { useUser } from "./context/useUser";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  calcTotalVolume,
  calcAvgDuration,
  calcTotalCalories,
  calcMuscleGroupSets,
  calcTypeDistribution,
  getLastSessions,
  getSessionDuration,
  getSessionVolume,
  formatChartDate,
  formatNumber,
  formatDuration,
} from "./utils/stats";

/**
 * StatsOverview - Top row of summary cards showing key metrics
 */
function StatsOverview({ sessions }) {
  const totalSessions = sessions.length;
  const totalVolume = calcTotalVolume(sessions);
  const avgDuration = calcAvgDuration(sessions);
  const totalCalories = calcTotalCalories(sessions);

  const stats = [
    {
      label: "Total Sessions",
      value: totalSessions,
      format: (v) => v.toString(),
      color: "border-blue-500",
    },
    {
      label: "Total Volume",
      value: totalVolume,
      format: (v) => `${formatNumber(v)} kg`,
      color: "border-amber-500",
    },
    {
      label: "Avg Duration",
      value: avgDuration,
      format: (v) => formatDuration(v),
      color: "border-green-500",
    },
    {
      label: "Est. Calories",
      value: totalCalories,
      format: (v) => formatNumber(v),
      color: "border-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className={`bg-gray-900 rounded-xl p-6 border-t-4 ${stat.color}`}>
          <div className="text-3xl font-bold text-white mb-1">{stat.format(stat.value)}</div>
          <div className="text-sm text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * VolumeChart - Bar chart showing tonnage per session
 * Bars are colored by training type
 */
function VolumeChart({ sessions }) {
  const lastSessions = getLastSessions(sessions, 10).reverse(); // Reverse to show oldest first

  // Prepare data for Recharts
  const data = lastSessions.map((session) => ({
    date: formatChartDate(session.endedAt),
    volume: getSessionVolume(session),
    type: session.trainingType,
  }));

  // Color map for training types
  const colorMap = {
    powerlifting: "#ef4444", // red
    bodybuilding: "#3b82f6", // blue
    crossfit: "#10b981", // green
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Volume by Session</h3>
      {data.length === 0 ? (
        <div className="text-gray-400 text-center py-12">No session data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value) => [`${formatNumber(value)} kg`, "Volume"]}
            />
            <Bar dataKey="volume" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorMap[entry.type]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

/**
 * DurationChart - Line chart showing session duration over time
 */
function DurationChart({ sessions }) {
  const lastSessions = getLastSessions(sessions, 10).reverse();

  const data = lastSessions.map((session) => ({
    date: formatChartDate(session.endedAt),
    duration: getSessionDuration(session),
  }));

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Duration Trend</h3>
      {data.length === 0 ? (
        <div className="text-gray-400 text-center py-12">No session data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value) => [`${value} min`, "Duration"]}
            />
            <Line
              type="monotone"
              dataKey="duration"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: "#f59e0b", r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

/**
 * TypeDistributionChart - Pie/donut chart showing session count by training type
 */
function TypeDistributionChart({ sessions }) {
  const distribution = calcTypeDistribution(sessions);

  // Convert to array format for Recharts
  const data = Object.entries(distribution)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
    }));

  const COLORS = {
    Powerlifting: "#ef4444",
    Bodybuilding: "#3b82f6",
    Crossfit: "#10b981",
  };

  const totalSessions = sessions.length;

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Training Type Distribution</h3>
      {data.length === 0 ? (
        <div className="text-gray-400 text-center py-12">No session data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            {/* Center label showing total */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-2xl font-bold"
              fill="#fff"
            >
              {totalSessions}
            </text>
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

/**
 * MuscleGroupChart - Horizontal bar chart showing sets per muscle group
 * Helps identify training imbalances
 */
function MuscleGroupChart({ sessions }) {
  const muscleSets = calcMuscleGroupSets(sessions);

  // Convert to array and sort by count (most trained to least)
  const data = Object.entries(muscleSets)
    .map(([group, count]) => ({
      name: group.charAt(0).toUpperCase() + group.slice(1),
      sets: count,
    }))
    .sort((a, b) => b.sets - a.sets);

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Muscle Group Focus</h3>
      {data.every((item) => item.sets === 0) ? (
        <div className="text-gray-400 text-center py-12">No exercise data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <XAxis type="number" stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <YAxis type="category" dataKey="name" stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value) => [`${value} sets`, "Total"]}
            />
            <Bar dataKey="sets" fill="#f59e0b" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

/**
 * DashboardPage - Main stats dashboard showing all workout analytics
 * Replaces the placeholder StatsPage from Part 1
 */
export function DashboardPage() {
  const { sessions } = useUser();

  // Empty state - no sessions logged yet
  if (!sessions || sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-white mb-2">No workouts logged yet</h2>
        <p className="text-gray-400 mb-6">Start your first session to see your stats!</p>
        <Link
          to="/app/session"
          className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
        >
          Start Session
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Your training analytics and insights</p>
      </div>

      {/* Stats overview cards */}
      <StatsOverview sessions={sessions} />

      {/* Charts - 2 per row on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VolumeChart sessions={sessions} />
        <DurationChart sessions={sessions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TypeDistributionChart sessions={sessions} />
        <MuscleGroupChart sessions={sessions} />
      </div>
    </div>
  );
}
