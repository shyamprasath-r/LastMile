import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { calculateDapeScore } from "../utils/dapeCalculator";
import { 
  Cpu, 
  Activity, 
  Waves, 
  MapPin, 
  Truck, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  ArrowRight,
  Info
} from "lucide-react";

export default function IereCentre({ onNavigate }) {
  const { households, vehicles, hazardState } = useApp();
  const [selectedHhId, setSelectedHhId] = useState(households[0]?.id || "HH-1001");

  // Derive metrics dynamically
  const householdScores = households.map(h => ({
    ...h,
    dape: calculateDapeScore(h, hazardState, vehicles)
  }));

  const totalRequests = households.length;
  const highPriority = householdScores.filter(h => h.dape?.totalScore >= 70).length;
  const unassigned = households.filter(h => h.status === "Unassigned").length;
  
  // Accessibility mismatches: Wheelchair or Medical requests with no suitable assigned vehicle or pending
  const wheelchairRequests = households.filter(h => 
    h.accessibilityReq === "Wheelchair Accessible" || (h.assistanceType && h.assistanceType.toLowerCase().includes("wheelchair"))
  );
  const medicalRequests = households.filter(h => 
    h.medicalTransportReq || h.accessibilityReq === "Bedbound/Stretcher"
  );
  const wheelchairVehicles = vehicles.filter(v => v.hasWheelchairLift && v.isAvailable).length;
  const medicalVehicles = vehicles.filter(v => v.hasStretcher && v.isAvailable).length;

  const accessibilityMismatches = Math.max(0, wheelchairRequests.length - wheelchairVehicles) + 
    Math.max(0, medicalRequests.length - medicalVehicles);

  const availableVehicles = vehicles.filter(v => v.isAvailable).length;

  // Selected household for deep inspection
  const selectedHh = householdScores.find(h => h.id === selectedHhId) || householdScores[0];
  const selectedDape = selectedHh?.dape;

  const modules = [
    {
      id: "dape",
      letter: "A",
      title: "Dynamic Assistance Priority Engine (DAPE)",
      status: "Active & Scoring",
      badge: "100-Point Rule Base",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
      description: "Applies multi-attribute utility formula P = U + M + A + W + R + H + T to balance clinical urgency with environmental exposure.",
      stats: `${highPriority} High / ${householdScores.filter(h => h.dape?.totalScore >= 40 && h.dape?.totalScore < 70).length} Medium`,
      action: "Inspect Breakdown Below",
      icon: Activity
    },
    {
      id: "hazard",
      letter: "B",
      title: "Hazard-Aware Readiness Analysis",
      status: hazardState.isActive ? "Flash Flood Active" : "Baseline Monitoring",
      badge: hazardState.severityLevel,
      badgeColor: hazardState.isActive ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "Calculates spatial hazard overlays for Ponnaiyar River. Directly adjusts Hazard Exposure (H) and Time-to-Impact (T) inputs.",
      stats: `Time-to-Impact: ~${hazardState.timeToImpactMinutes} mins`,
      action: "Open Simulation",
      route: "simulation",
      icon: Waves
    },
    {
      id: "gap",
      letter: "C",
      title: "Assistance Gap Detection",
      status: `${unassigned} Unassigned Requests`,
      badge: unassigned > 0 ? "Action Required" : "Cleared",
      badgeColor: unassigned > 0 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "Pinpoints geographical clusters where vulnerable evacuees remain stranded without vehicle assignments.",
      stats: `${unassigned} clusters detected`,
      action: "View Gap Map",
      route: "gapMap",
      icon: MapPin
    },
    {
      id: "matching",
      letter: "D",
      title: "Smart Resource Matching",
      status: "Constraint Enforced",
      badge: "Zero-Mismatch Rule",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      description: "Verifies wheelchair lift mechanics and stretcher compatibility before any assignment is proposed to the coordinator.",
      stats: `${availableVehicles} of ${vehicles.length} Vehicles Operational`,
      action: "Manage Resources",
      route: "resources",
      icon: Truck
    },
    {
      id: "allocation",
      letter: "E",
      title: "Vehicle Allocation Optimisation",
      status: "Ready for Execution",
      badge: "Constraint Solver",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      description: "Greedy heuristic algorithm maximizing high-priority evacuation throughput while respecting fleet passenger limits.",
      stats: "20 Requests vs 5 Fleet Units",
      action: "Run Optimiser",
      route: "optimiser",
      icon: Sparkles
    },
    {
      id: "accessibility",
      letter: "F",
      title: "Accessibility Mismatch Detection",
      status: accessibilityMismatches > 0 ? `${accessibilityMismatches} Severe Deficits` : "Sufficient Fleet",
      badge: accessibilityMismatches > 0 ? "Fleet Shortage" : "Optimal",
      badgeColor: accessibilityMismatches > 0 ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "Proactively alerts emergency coordinators when specialized equipment demand (e.g. wheelchair hydraulic lift) outstrips local vehicles.",
      stats: `Demanded: ${wheelchairRequests.length} WC / ${medicalRequests.length} Med`,
      action: "View Analytics",
      route: "analytics",
      icon: ShieldAlert
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-navy-900 text-white p-6 rounded-2xl border border-navy-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              The Brain of LASTMILE
            </span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            IERE Intelligence Centre
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Intelligent Evacuation Readiness Engine: Six autonomous modules synchronizing dynamic hazard exposure, clinical accessibility rules, and logistics optimization.
          </p>
        </div>

        {/* Readiness Summary Banner */}
        <div className="bg-navy-950/70 p-4 rounded-xl border border-navy-800 shrink-0">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Simulated Fleet Readiness Overview:
          </div>
          <div className="grid grid-cols-5 gap-3 text-center">
            <div>
              <div className="text-lg font-black text-white">{totalRequests}</div>
              <div className="text-[10px] text-slate-400">Total</div>
            </div>
            <div>
              <div className="text-lg font-black text-red-400">{highPriority}</div>
              <div className="text-[10px] text-slate-400">High Pri</div>
            </div>
            <div>
              <div className="text-lg font-black text-amber-400">{unassigned}</div>
              <div className="text-[10px] text-slate-400">Unassigned</div>
            </div>
            <div>
              <div className="text-lg font-black text-orange-400">{accessibilityMismatches}</div>
              <div className="text-[10px] text-slate-400">Deficits</div>
            </div>
            <div>
              <div className="text-lg font-black text-teal-400">{availableVehicles}</div>
              <div className="text-[10px] text-slate-400">Vehicles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Six Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <div 
              key={m.id} 
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-navy-900 text-teal-400 flex items-center justify-center font-bold text-xs">
                      {m.letter}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-navy-950 leading-tight">
                        {m.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {m.status}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {m.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700 truncate mr-2">
                  {m.stats}
                </span>
                {m.route ? (
                  <button
                    onClick={() => onNavigate(m.route)}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 shrink-0"
                  >
                    <span>{m.action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    Interactive Below ↓
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive DAPE Formula Breakdown Inspector */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-mono font-bold">
                P = U + M + A + W + R + H + T
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Module A Deep Dive
              </span>
            </div>
            <h2 className="text-lg font-black text-navy-950 mt-1">
              Dynamic Assistance Priority Engine (DAPE) Inspector
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any household to inspect how individual physiological, temporal, and flood factors combine into their 100-point score.
            </p>
          </div>

          {/* Household Selector */}
          <div className="w-full sm:w-72">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Select Household to Inspect:
            </label>
            <select
              value={selectedHhId}
              onChange={(e) => setSelectedHhId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            >
              {householdScores.map(h => (
                <option key={h.id} value={h.id}>
                  {h.id} - {h.name} [{h.dape?.totalScore || 'Review'} pts] ({h.assistanceType})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Household Detail View */}
        {selectedHh && selectedDape && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scorecard Summary */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {selectedHh.id}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${selectedDape.badgeColor}`}>
                    {selectedDape.category}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-navy-950">
                  {selectedHh.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedHh.location}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Assistance Type:</span>
                    <strong className="text-slate-800">{selectedHh.assistanceType}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Accessibility Req:</span>
                    <strong className="text-slate-800">{selectedHh.accessibilityReq}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Medical Transport:</span>
                    <strong className={selectedHh.medicalTransportReq ? "text-red-600 font-bold" : "text-slate-800"}>
                      {selectedHh.medicalTransportReq ? "YES (Compulsory)" : "No"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Waiting Duration:</span>
                    <strong className="text-slate-800">{selectedHh.waitingDurationMinutes} minutes</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Flood Risk Zone:</span>
                    <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                      selectedHh.hazardZone === "High" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {selectedHh.hazardZone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Score Display */}
              <div className="mt-6 pt-4 border-t border-slate-200 bg-white p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Calculated Score</div>
                <div className="text-4xl font-black text-navy-950 mt-1">
                  {selectedDape.totalScore !== null ? selectedDape.totalScore : "N/A"}
                  <span className="text-sm font-semibold text-slate-400"> / 100</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 italic leading-relaxed">
                  "{selectedDape.explanation}"
                </p>
              </div>
            </div>

            {/* Factor by Factor Visual Bars */}
            <div className="lg:col-span-2 space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Mathematical Factor Weight Breakdown (Max 100 Points)
              </h4>

              {Object.entries(selectedDape.factors).map(([key, f]) => {
                const percentage = Math.round((f.score / f.max) * 100);
                let barColor = "bg-teal-500";
                if (key === "urgency" || key === "medical") barColor = "bg-red-500";
                if (key === "hazardExposure" || key === "timeToImpact") barColor = "bg-amber-500";

                return (
                  <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-navy-950 flex items-center gap-1.5">
                        <span>{f.label}</span>
                        {key === "medical" && <span className="text-[10px] text-red-600 font-mono">(Max 20)</span>}
                        {key === "urgency" && <span className="text-[10px] text-red-600 font-mono">(Max 20)</span>}
                        {key === "accessibility" && <span className="text-[10px] text-slate-400 font-mono">(Max 15)</span>}
                        {key === "hazardExposure" && <span className="text-[10px] text-amber-600 font-mono">(Max 15)</span>}
                      </span>
                      <div className="font-mono font-bold text-xs text-slate-800">
                        {f.score} / {f.max} pts
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}

              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Dynamic Recalculation Note:</strong> If the flood scenario severity increases or time-to-impact drops below 30 minutes, 
                  both <em>Hazard Exposure</em> and <em>Time-to-Impact</em> factors re-evaluate immediately, shifting medium-priority requests into urgent dispatch candidates.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
