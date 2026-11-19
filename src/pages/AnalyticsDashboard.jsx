import React from "react";
import { useApp } from "../context/AppContext";
import { calculateDapeScore } from "../utils/dapeCalculator";
import StatCard from "../components/StatCard";
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Truck, 
  Sparkles, 
  ShieldAlert,
  Percent,
  TrendingUp
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  CartesianGrid
} from "recharts";

export default function AnalyticsDashboard({ onNavigate }) {
  const { households, vehicles, hazardState } = useApp();

  // Dynamic calculations from localStorage state
  const totalHouseholds = households.length;
  const verifiedRequests = households.filter(h => h.status !== "Under Verification" && h.status !== "Submitted").length;
  
  const householdScores = households.map(h => ({
    ...h,
    dape: calculateDapeScore(h, hazardState, vehicles)
  }));

  const highPriority = householdScores.filter(h => h.dape?.totalScore >= 70).length;
  const unassigned = households.filter(h => h.status === "Unassigned").length;
  const confirmed = households.filter(h => h.status === "Confirmed").length;
  const completed = households.filter(h => h.status === "Completed").length;
  const pendingConfirmations = households.filter(h => h.status === "Awaiting Confirmation").length;
  const availableVehicles = vehicles.filter(v => v.isAvailable).length;

  // Vehicle utilization rate
  const totalFleetCapacity = vehicles.reduce((sum, v) => sum + v.capacity, 0);
  const totalAssignedPassengers = vehicles.reduce((sum, v) => {
    const list = Array.isArray(v.assignedHouseholdIds) ? v.assignedHouseholdIds : [];
    const paxCount = list.reduce((sub, hid) => {
      const hh = households.find(h => h.id === hid);
      return sub + (hh ? Number(hh.peopleCount || 1) : 0);
    }, 0);
    return sum + paxCount;
  }, 0);

  const vehicleUtilisation = totalFleetCapacity > 0 
    ? Math.round((totalAssignedPassengers / totalFleetCapacity) * 100) 
    : 0;

  // Accessibility mismatches calculation
  const wheelchairNeed = households.filter(h => h.accessibilityReq === "Wheelchair Accessible").length;
  const medicalNeed = households.filter(h => h.medicalTransportReq || h.accessibilityReq === "Bedbound/Stretcher").length;
  const wheelchairSupply = vehicles.filter(v => v.hasWheelchairLift && v.isAvailable).length;
  const medicalSupply = vehicles.filter(v => v.hasStretcher && v.isAvailable).length;
  const accessibilityMismatches = Math.max(0, wheelchairNeed - wheelchairSupply) + Math.max(0, medicalNeed - medicalSupply);

  // Chart 1: Request Status Distribution
  const statusData = [
    { name: "Unassigned", value: unassigned, color: "#ef4444" },
    { name: "Awaiting Conf.", value: pendingConfirmations, color: "#f59e0b" },
    { name: "Confirmed", value: confirmed, color: "#10b981" },
    { name: "Completed", value: completed, color: "#3b82f6" },
    { name: "In Verification", value: households.filter(h => h.status === "Under Verification" || h.status === "Submitted").length, color: "#8b5cf6" }
  ];

  // Chart 2: Priority Curve Breakdown
  const priorityData = [
    { range: "70-100 (High)", count: householdScores.filter(h => h.dape?.totalScore >= 70).length, fill: "#ef4444" },
    { range: "40-69 (Medium)", count: householdScores.filter(h => h.dape?.totalScore >= 40 && h.dape?.totalScore < 70).length, fill: "#f59e0b" },
    { range: "0-39 (Lower)", count: householdScores.filter(h => h.dape?.totalScore < 40 && !h.dape?.isReviewRequired).length, fill: "#10b981" },
    { range: "Review Req.", count: householdScores.filter(h => h.dape?.isReviewRequired).length, fill: "#94a3b8" }
  ];

  // Chart 3: Vehicle Utilisation Bars
  const vehicleChartData = vehicles.map(v => {
    const assignedIds = Array.isArray(v.assignedHouseholdIds) ? v.assignedHouseholdIds : [];
    const used = assignedIds.reduce((sum, id) => {
      const hh = households.find(h => h.id === id);
      return sum + (hh ? Number(hh.peopleCount || 1) : 0);
    }, 0);
    return {
      name: v.name.split(" ")[0],
      capacity: v.capacity,
      used: Math.min(v.capacity, used),
      type: v.type
    };
  });

  // Chart 4: Assistance Requirements Distribution
  const assistanceCounts = {};
  households.forEach(h => {
    const t = h.assistanceType || "Regular transportation";
    assistanceCounts[t] = (assistanceCounts[t] || 0) + 1;
  });
  const assistanceChartData = Object.entries(assistanceCounts).map(([type, count]) => ({
    type: type.replace(" assistance", "").replace(" transportation", ""),
    count
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-navy-900 text-white p-6 rounded-2xl border border-navy-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Operations Analytics & Audit
            </span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            Evacuation Analytics & Resource Dashboard
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time analytics aggregating household vulnerability, triage throughput, vehicle loading rates, and equipment bottlenecks.
          </p>
        </div>

        <button
          onClick={() => onNavigate("optimiser")}
          className="bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-sm shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Optimiser</span>
        </button>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Households"
          value={totalHouseholds}
          subtitle={`${verifiedRequests} Verified`}
          icon={Users}
          color="navy"
        />
        <StatCard
          title="High Priority"
          value={highPriority}
          subtitle="Score >= 70"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Unassigned Gaps"
          value={unassigned}
          subtitle="Pending vehicle"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Confirmed"
          value={confirmed}
          subtitle="Ready for pickup"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Fleet Utilisation"
          value={`${vehicleUtilisation}%`}
          subtitle={`${totalAssignedPassengers} of ${totalFleetCapacity} seats`}
          icon={Percent}
          color="teal"
        />
        <StatCard
          title="Equip. Deficits"
          value={accessibilityMismatches}
          subtitle="Specialized shortages"
          icon={ShieldAlert}
          color="red"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Evacuation Lifecycle Status Pie */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-sm text-navy-950">
              Request Status Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status counts across the 20 Krishnagiri household requests.
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={50}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Priority Distribution Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-sm text-navy-950">
              DAPE Mathematical Priority Tiers
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of households into High, Medium, and Low clinical/hazard urgency.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Vehicle Passenger Utilisation Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-sm text-navy-950">
              Vehicle Passenger Loading (Capacity vs Allocated)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Available seat occupancy across Krishnagiri emergency response vehicles.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="capacity" name="Max Capacity" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="used" name="Current Load" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Assistance Requirements Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-sm text-navy-950">
              Assistance Type Demand Profile
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Proportion of wheelchair, medical, elderly, and physical transit requests.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assistanceChartData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                />
                <Bar dataKey="count" name="Households" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
