import React from "react";
import { useApp } from "../context/AppContext";
import { calculateDapeScore } from "../utils/dapeCalculator";
import { 
  Waves, 
  ShieldAlert, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Sliders,
  RefreshCw,
  Compass,
  AlertCircle
} from "lucide-react";

export default function HazardSimulation({ onNavigate }) {
  const { 
    hazardState, 
    toggleHazardScenario, 
    updateHazardParameters, 
    households, 
    vehicles 
  } = useApp();

  const handleSeverityChange = (severity) => {
    let score = 15;
    if (severity === "Moderate") score = 10;
    if (severity === "Watch") score = 5;

    updateHazardParameters({
      severityLevel: severity,
      severityScore: score
    });
  };

  const handleAreaChange = (area) => {
    updateHazardParameters({
      selectedArea: area
    });
  };

  const handleTimeToImpactChange = (mins) => {
    updateHazardParameters({
      timeToImpactMinutes: Number(mins)
    });
  };

  // Households affected by high or moderate hazard zone
  const affectedHouseholds = households.filter(h => {
    if (!hazardState.isActive) return false;
    return h.hazardZone === "High" || h.hazardZone === "Moderate";
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Simulation Banner & Disclaimer */}
      <div className="bg-navy-900 text-white p-6 rounded-2xl border border-navy-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-orange animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent-orange">
              Simulated Disaster Scenario Engine
            </span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            Hazard Simulation & Dynamic Propagation
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Simulate flash flood inundation conditions across Krishnagiri to demonstrate instant priority score adjustments and evacuation re-ranking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleHazardScenario(!hazardState.isActive)}
            className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition ${
              hazardState.isActive
                ? "bg-red-600 hover:bg-red-500 text-white animate-pulse"
                : "bg-teal-600 hover:bg-teal-500 text-white"
            }`}
          >
            <Waves className="w-4 h-4" />
            <span>{hazardState.isActive ? "Deactivate Flood Scenario" : "Activate Flood Scenario"}</span>
          </button>
        </div>
      </div>

      {/* Prominent Simulation Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3 shadow-xs">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Prototype Demonstration Disclaimer:</span>
          <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
            All flood inundation vectors, water stages, and time-to-impact numbers are <strong>fully simulated</strong> for demonstration in Krishnagiri, Tamil Nadu. LASTMILE coordinates evacuation logistics and readiness; it does not claim real-time hydrological forecasting or emergency automated dispatch.
          </p>
        </div>
      </div>

      {/* Main Interactive Controls & State */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Simulation Parameter Sliders & Selectors */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h3 className="font-bold text-base text-navy-950 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>Simulated Flood Controls</span>
            </h3>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              hazardState.isActive ? "bg-red-100 text-red-800 border-red-300" : "bg-slate-100 text-slate-600 border-slate-300"
            }`}>
              Status: {hazardState.isActive ? "FLOOD ACTIVE" : "DEACTIVATED"}
            </span>
          </div>

          {/* Area Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
              1. Simulated Hazard Inundation Sector:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                "Ponnaiyar Basin & Kaveripattinam Lowlands",
                "Rayakottai Lowlands & Old Town Krishnagiri",
                "Housing Board Floodplain & Riverside Colony"
              ].map(area => (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleAreaChange(area)}
                  disabled={!hazardState.isActive}
                  className={`p-3 text-left rounded-xl border text-xs font-semibold transition ${
                    hazardState.selectedArea === area
                      ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  } ${!hazardState.isActive ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <MapPin className="w-3.5 h-3.5 mb-1.5 opacity-70" />
                  <span>{area}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Severity Level Toggle */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
              2. Hazard Severity Intensity:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { level: "Severe", desc: "Rapid breach, +15 Hazard pts", color: "border-red-400 bg-red-50 text-red-700" },
                { level: "Moderate", desc: "Rising bank, +10 Hazard pts", color: "border-amber-400 bg-amber-50 text-amber-700" },
                { level: "Watch", desc: "Precautionary, +5 Hazard pts", color: "border-teal-400 bg-teal-50 text-teal-700" }
              ].map(item => (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => handleSeverityChange(item.level)}
                  disabled={!hazardState.isActive}
                  className={`p-3 rounded-xl border text-left transition ${
                    hazardState.severityLevel === item.level
                      ? `${item.color} font-bold ring-2 ring-navy-900 shadow-sm`
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  } ${!hazardState.isActive ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="text-xs font-bold">{item.level}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time to Impact Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Simulated Time-to-Impact:
              </label>
              <span className="font-mono text-xs font-extrabold text-navy-950 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                ~{hazardState.timeToImpactMinutes} Minutes
              </span>
            </div>

            <input
              type="range"
              min="15"
              max="240"
              step="15"
              value={hazardState.timeToImpactMinutes}
              onChange={(e) => handleTimeToImpactChange(e.target.value)}
              disabled={!hazardState.isActive}
              className="w-full accent-teal-600 cursor-pointer disabled:opacity-50"
            />

            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>15 min (Immediate Evacuation)</span>
              <span>60 min (Urgent Surge)</span>
              <span>120 min</span>
              <span>240 min (Early Warning)</span>
            </div>
          </div>

          {/* Live Engine Response Summary */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">
              When parameters change, DAPE automatically elevates High Priority requests and alters the Assistance Gap Map.
            </span>
            <button
              onClick={() => onNavigate("iere")}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>Inspect IERE Scores</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Col: Live Impact Stats */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-navy-950 mb-4">
              Simulated Scenario Metrics
            </h3>

            <div className="space-y-3.5">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400">Flood Inundation Stage</div>
                <div className="text-xl font-black text-navy-950 mt-0.5">
                  {hazardState.isActive ? `${hazardState.waterLevelMeters}m Over Bank` : "Normal Flow"}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Ponnaiyar Gauge Station 4B
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400">Affected Households in Path</div>
                <div className="text-xl font-black text-red-600 mt-0.5">
                  {affectedHouseholds.length} Households
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Identified inside vulnerable floodplain
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400">Simulation Status</div>
                <div className="text-xs font-bold text-slate-800 mt-1">
                  Active Area: <span className="text-teal-700">{hazardState.selectedArea}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Last updated: {new Date(hazardState.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 space-y-2">
            <button
              onClick={() => onNavigate("gapMap")}
              className="w-full py-2.5 px-3 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>View On Krishnagiri Gap Map</span>
            </button>
            <button
              onClick={() => onNavigate("optimiser")}
              className="w-full py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimize Evacuation Fleet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Affected Households List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <h3 className="font-bold text-base text-navy-950 mb-1">
          Affected Households in Simulated Hazard Path
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Households dynamically flagged based on physical proximity to the active Krishnagiri flood sector.
        </p>

        {affectedHouseholds.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No households flagged when flood scenario is deactivated. Click "Activate Flood Scenario" above.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {affectedHouseholds.map(h => {
              const dape = calculateDapeScore(h, hazardState, vehicles);
              return (
                <div key={h.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-slate-700">{h.id}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${dape?.badgeColor}`}>
                      {dape?.totalScore} pts
                    </span>
                  </div>
                  <div className="font-bold text-navy-950 truncate">{h.name}</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{h.location}</div>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                    <span className="text-red-600 font-bold">{h.hazardZone} Risk</span>
                    <span className="text-slate-600">{h.assistanceType}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
