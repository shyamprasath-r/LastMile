import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { calculateDapeScore } from "../utils/dapeCalculator";
import StatCard from "../components/StatCard";
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Waves, 
  ChevronRight, 
  ShieldAlert, 
  ArrowUpRight,
  Filter,
  RefreshCw,
  Search,
  ExternalLink
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
  Legend 
} from "recharts";

export default function CoordinatorDashboard({ onNavigate }) {
  const { 
    households, 
    vehicles, 
    hazardState, 
    toggleHazardScenario, 
    resetDemoData, 
    confirmHouseholdArrangement,
    assignVehicleToHousehold 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Dynamic calculations from localStorage state
  const totalHouseholds = households.length;
  const activeRequests = households.filter(h => h.status !== "Completed" && h.status !== "Rejected").length;
  
  // Calculate DAPE scores dynamically
  const householdScores = households.map(h => ({
    ...h,
    dape: calculateDapeScore(h, hazardState, vehicles)
  }));

  const highPriorityRequests = householdScores.filter(
    h => h.dape && h.dape.totalScore >= 70 && !["Completed", "Confirmed"].includes(h.status)
  ).length;

  const unassignedRequests = households.filter(h => h.status === "Unassigned").length;
  const confirmedArrangements = households.filter(h => h.status === "Confirmed").length;
  const pendingConfirmations = households.filter(h => h.status === "Awaiting Confirmation").length;
  const underVerification = households.filter(h => h.status === "Under Verification").length;
  const availableVehiclesCount = vehicles.filter(v => v.isAvailable).length;

  // Chart 1: Priority Distribution
  const highCount = householdScores.filter(h => h.dape && h.dape.totalScore >= 70).length;
  const medCount = householdScores.filter(h => h.dape && h.dape.totalScore >= 40 && h.dape.totalScore < 70).length;
  const lowCount = householdScores.filter(h => h.dape && h.dape.totalScore < 40 && !h.dape.isReviewRequired).length;
  const reviewCount = householdScores.filter(h => h.dape && h.dape.isReviewRequired).length;

  const priorityChartData = [
    { name: "High (70-100)", count: highCount, fill: "#ef4444" },
    { name: "Medium (40-69)", count: medCount, fill: "#f59e0b" },
    { name: "Low (0-39)", count: lowCount, fill: "#10b981" },
    { name: "Review Req.", count: reviewCount, fill: "#64748b" }
  ];

  // Chart 2: Request Status Distribution
  const statusCounts = {
    Unassigned: households.filter(h => h.status === "Unassigned").length,
    "Awaiting Conf.": households.filter(h => h.status === "Awaiting Confirmation").length,
    Confirmed: households.filter(h => h.status === "Confirmed").length,
    Completed: households.filter(h => h.status === "Completed").length,
    "Under Verif.": households.filter(h => h.status === "Under Verification" || h.status === "Submitted").length
  };

  const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));

  const STATUS_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

  // Filtered recent requests
  const filteredRequests = householdScores.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      h.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "ALL") return matchesSearch;
    if (statusFilter === "HIGH") return matchesSearch && h.dape?.totalScore >= 70;
    return matchesSearch && h.status === statusFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Scenario Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900 text-white p-6 rounded-2xl shadow-xl border border-navy-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Krishnagiri Emergency Operations Centre (EOC)
            </span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            Disaster Evacuation Command Center
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time hazard monitoring, dynamic priority triage (DAPE), and constraint-based fleet allocation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => toggleHazardScenario(!hazardState.isActive)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-sm ${
              hazardState.isActive
                ? "bg-red-600 hover:bg-red-500 text-white animate-pulse"
                : "bg-teal-600 hover:bg-teal-500 text-white"
            }`}
          >
            <Waves className="w-4 h-4" />
            <span>{hazardState.isActive ? "Deactivate Flood Scenario" : "Activate Flood Scenario"}</span>
          </button>

          <button
            onClick={() => onNavigate("optimiser")}
            className="bg-accent-orange hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run Fleet Optimiser</span>
          </button>

          <button
            onClick={resetDemoData}
            title="Reset to default 20 Krishnagiri households & 5 vehicles"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-xl border border-slate-700 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Critical Coordination Alerts */}
      {hazardState.isActive && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-xs flex items-start justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-950">
                CRITICAL WARNING: {hazardState.hazardType} Active
              </h4>
              <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
                Affected Area: <strong>{hazardState.selectedArea}</strong> • Severity: <strong>{hazardState.severityLevel}</strong> • Simulated Time-to-Impact: <strong>~{hazardState.timeToImpactMinutes} mins</strong>. 
                DAPE scores have been elevated for {highPriorityRequests} households in the flood plain.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("simulation")}
            className="shrink-0 text-xs font-bold text-red-700 hover:text-red-900 bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition"
          >
            Adjust Hazard →
          </button>
        </div>
      )}

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Households"
          value={totalHouseholds}
          subtitle="Registered in system"
          icon={Users}
          color="navy"
        />
        <StatCard
          title="Active Requests"
          value={activeRequests}
          subtitle="Awaiting resolution"
          icon={Clock}
          color="teal"
        />
        <StatCard
          title="High-Priority"
          value={highPriorityRequests}
          subtitle="Score >= 70 / 100"
          icon={AlertTriangle}
          color="red"
          trend={{ text: "Needs immediate transit", positive: false }}
        />
        <StatCard
          title="Unassigned"
          value={unassignedRequests}
          subtitle="Pending vehicle match"
          icon={MapPin}
          color="amber"
        />
        <StatCard
          title="Confirmed"
          value={confirmedArrangements}
          subtitle="SMS/Direct verified"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Available Fleet"
          value={`${availableVehiclesCount} / ${vehicles.length}`}
          subtitle="Vehicles operational"
          icon={Truck}
          color="teal"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Distribution Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-navy-950">
                DAPE Priority Distribution
              </h3>
              <button 
                onClick={() => onNavigate("iere")}
                className="text-[11px] text-teal-600 hover:text-teal-700 font-semibold"
              >
                IERE Rules →
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Rule-based triage classification across 20 Krishnagiri requests.
            </p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", fontSize: "12px" }} 
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {priorityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Request Status Breakdown Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-navy-950">
                Evacuation Lifecycle Status
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Live sync</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Progression from submission to verified camp arrival.
            </p>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Readiness & Quick Actions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-navy-950">
                Emergency Fleet Status
              </h3>
              <button 
                onClick={() => onNavigate("resources")}
                className="text-[11px] text-teal-600 hover:text-teal-700 font-semibold"
              >
                Manage Fleet →
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              5 Dedicated emergency response units in Krishnagiri.
            </p>
            <div className="space-y-2.5">
              {vehicles.map(v => (
                <div key={v.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-slate-900 truncate">{v.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {v.type} • Cap: {v.capacity} seats
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    v.isAvailable ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                  }`}>
                    {v.isAvailable ? "Available" : "Assigned / Out"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => onNavigate("gapMap")}
              className="flex-1 py-2 px-3 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>Assistance Gap Map</span>
            </button>
            <button
              onClick={() => onNavigate("optimiser")}
              className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run Optimiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Assistance Requests Live Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-navy-950">
              Live Assistance Request Queue
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Prioritised using DAPE mathematical formula. Dynamically affected by flood scenario.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, name, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 w-44 sm:w-56"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-700"
            >
              <option value="ALL">All Statuses ({totalHouseholds})</option>
              <option value="HIGH">High Priority Only ({highCount})</option>
              <option value="Unassigned">Unassigned ({unassignedRequests})</option>
              <option value="Awaiting Confirmation">Awaiting Conf. ({pendingConfirmations})</option>
              <option value="Confirmed">Confirmed ({confirmedArrangements})</option>
              <option value="Under Verification">Under Verification ({underVerification})</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                <th className="py-3 px-4">ID & Household</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Needs & Accessibility</th>
                <th className="py-3 px-4 text-center">DAPE Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Vehicle Assigned</th>
                <th className="py-3 px-4 text-right">Coordination Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.slice(0, 10).map((h) => {
                const dape = h.dape;
                const assignedVehicle = vehicles.find(v => v.id === h.assignedVehicleId);

                return (
                  <tr key={h.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-navy-950 flex items-center gap-1.5">
                        <span>{h.name}</span>
                        {h.isProxy && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-semibold">
                            Proxy
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {h.id} • {h.contact}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 max-w-[180px] truncate" title={h.location}>
                      <div className="truncate">{h.location}</div>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        h.hazardZone === "High" ? "bg-red-100 text-red-700" :
                        h.hazardZone === "Moderate" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {h.hazardZone} Risk Zone
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{h.assistanceType}</div>
                      <div className="text-[11px] text-slate-500">
                        {h.peopleCount} pers. • {h.accessibilityReq}
                        {h.medicalTransportReq && (
                          <span className="ml-1 text-red-600 font-bold">• Med Transport</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {dape && !dape.isReviewRequired ? (
                        <div>
                          <span className={`inline-block font-black text-sm px-2.5 py-1 rounded-lg border ${dape.badgeColor}`}>
                            {dape.totalScore}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">/ 100 pts</div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-1 rounded-lg">
                          Review Req.
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        h.status === "Confirmed" ? "bg-emerald-100 text-emerald-800" :
                        h.status === "Awaiting Confirmation" ? "bg-amber-100 text-amber-800" :
                        h.status === "Unassigned" ? "bg-red-100 text-red-800" :
                        h.status === "Completed" ? "bg-blue-100 text-blue-800" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {h.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {assignedVehicle ? (
                        <div>
                          <div className="font-semibold text-slate-800 truncate max-w-[130px]">
                            {assignedVehicle.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {assignedVehicle.regNumber}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">None</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {h.status === "Unassigned" ? (
                        <button
                          onClick={() => onNavigate("resources")}
                          className="px-2.5 py-1 text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold rounded-lg border border-teal-200 transition"
                        >
                          Match Vehicle
                        </button>
                      ) : h.status === "Awaiting Confirmation" ? (
                        <button
                          onClick={() => confirmHouseholdArrangement(h.id)}
                          className="px-2.5 py-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg border border-emerald-200 transition"
                        >
                          Confirm (Direct)
                        </button>
                      ) : (
                        <button
                          onClick={() => onNavigate("requests")}
                          className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                        >
                          Inspect
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {Math.min(10, filteredRequests.length)} of {totalHouseholds} households</span>
          <button
            onClick={() => onNavigate("requests")}
            className="font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>Open Full Assistance Requests Manager</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
