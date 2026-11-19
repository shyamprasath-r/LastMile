import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { matchResourcesForHousehold } from "../utils/resourceMatcher";
import { 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  Phone, 
  User, 
  MapPin, 
  ShieldAlert, 
  RefreshCw,
  Plus,
  ArrowRight,
  Info
} from "lucide-react";

export default function ResourceManagement({ onNavigate }) {
  const { 
    vehicles, 
    households, 
    assignVehicleToHousehold, 
    markVehicleUnavailable, 
    restoreVehicleAvailability 
  } = useApp();

  const [selectedHhId, setSelectedHhId] = useState(
    households.find(h => h.status === "Unassigned")?.id || households[0]?.id || "HH-1001"
  );
  const [matchResults, setMatchResults] = useState(null);
  const [noShowModalVehicle, setNoShowModalVehicle] = useState(null);

  const selectedHousehold = households.find(h => h.id === selectedHhId);

  // Trigger match
  const handleRunMatch = () => {
    if (!selectedHousehold) return;
    const results = matchResourcesForHousehold(selectedHousehold, vehicles);
    setMatchResults(results);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-navy-900 text-white p-6 rounded-2xl border border-navy-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Fleet Operations & Logistics
            </span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            Transportation Resource Management & Matching
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Enforces strict physical accessibility and medical constraints before dispatches. Handles breakdowns and vehicle no-show contingencies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("optimiser")}
            className="bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Batch Optimiser</span>
          </button>
        </div>
      </div>

      {/* Fleet Inventory Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base text-navy-950">
            Emergency Evacuation Fleet (Krishnagiri Depot)
          </h2>
          <span className="text-xs text-slate-500">
            {vehicles.filter(v => v.isAvailable).length} of {vehicles.length} Operational
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vehicles.map((v) => {
            const assignedHouseholds = households.filter(h => 
              Array.isArray(v.assignedHouseholdIds) ? v.assignedHouseholdIds.includes(h.id) : h.assignedVehicleId === v.id
            );

            return (
              <div 
                key={v.id} 
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition ${
                  v.isAvailable ? "border-slate-200" : "border-red-300 bg-red-50/20"
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {v.id} • {v.regNumber}
                      </span>
                      <h3 className="font-extrabold text-sm text-navy-950 mt-1">
                        {v.name}
                      </h3>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      v.isAvailable ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {v.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  {/* Vehicle Specs */}
                  <div className="text-xs text-slate-600 space-y-1.5 mt-3 pt-3 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type:</span>
                      <strong className="text-slate-800">{v.type}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Passenger Capacity:</span>
                      <strong className="text-slate-800">{v.capacity} persons</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Station Depot:</span>
                      <span className="text-slate-700 truncate max-w-[150px]">{v.location}</span>
                    </div>
                  </div>

                  {/* Accessibility Features Badges */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Accessibility Features:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {v.accessibilityFeatures.map((feat, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Driver Contact */}
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{v.driverName}</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-700">{v.driverPhone}</span>
                  </div>

                  {/* Assigned Requests */}
                  {assignedHouseholds.length > 0 && (
                    <div className="mt-3 p-2 bg-teal-50/60 rounded-xl border border-teal-100 text-[11px]">
                      <span className="font-bold text-teal-900 block mb-1">
                        Currently Assigned ({assignedHouseholds.length}):
                      </span>
                      <div className="space-y-0.5">
                        {assignedHouseholds.map(ah => (
                          <div key={ah.id} className="text-slate-700 flex justify-between">
                            <span>{ah.id} ({ah.name})</span>
                            <span className="font-semibold text-teal-700">{ah.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Contingency Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                  {v.isAvailable ? (
                    <button
                      onClick={() => markVehicleUnavailable(v.id)}
                      className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Mark Vehicle Unavailable (No-Show)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => restoreVehicleAvailability(v.id)}
                      className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Restore Vehicle Availability</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Resource Matching Interactive Tool */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Module D: Constraint Matcher
              </span>
            </div>
            <h2 className="text-lg font-black text-navy-950 mt-1">
              Smart Vehicle Matching Engine
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an unassigned household to test compatibility scoring across the entire emergency fleet.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedHhId}
              onChange={(e) => {
                setSelectedHhId(e.target.value);
                setMatchResults(null);
              }}
              className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            >
              {households.map(h => (
                <option key={h.id} value={h.id}>
                  {h.id} - {h.name} [{h.status}] ({h.assistanceType})
                </option>
              ))}
            </select>

            <button
              onClick={handleRunMatch}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Match Resources</span>
            </button>
          </div>
        </div>

        {/* Selected Household Requirements Banner */}
        {selectedHousehold && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-navy-950">{selectedHousehold.name} ({selectedHousehold.id})</span>
              <span className="text-slate-500 ml-2">• Location: {selectedHousehold.location}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-medium">
                People: <strong>{selectedHousehold.peopleCount}</strong>
              </span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-medium">
                Assist: <strong>{selectedHousehold.assistanceType}</strong>
              </span>
              <span className={`px-2 py-0.5 rounded border font-semibold ${
                selectedHousehold.accessibilityReq === "Wheelchair Accessible"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : selectedHousehold.medicalTransportReq
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-white text-slate-700 border-slate-200"
              }`}>
                Accessibility: {selectedHousehold.accessibilityReq}
              </span>
            </div>
          </div>
        )}

        {/* Matching Candidate Cards */}
        {matchResults && (
          <div className="mt-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Fleet Compatibility Evaluation:
            </h4>

            <div className="space-y-3">
              {matchResults.map(({ vehicle, isCompatible, matchQuality, matchScore, issues, explanation }) => (
                <div
                  key={vehicle.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    isCompatible
                      ? "bg-emerald-50/30 border-emerald-200 hover:bg-emerald-50/60"
                      : "bg-slate-50 border-slate-200 opacity-70"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-navy-950">{vehicle.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">({vehicle.id})</span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                        matchQuality === "Optimal Match" ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
                        matchQuality === "Compatible" ? "bg-teal-100 text-teal-800 border-teal-300" :
                        "bg-red-100 text-red-800 border-red-300"
                      }`}>
                        {matchQuality} ({matchScore}%)
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {explanation}
                    </div>

                    {issues.length > 0 && !isCompatible && (
                      <div className="text-[11px] text-red-600 mt-1 font-semibold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{issues.join(" • ")}</span>
                      </div>
                    )}
                  </div>

                  {/* Assign Button */}
                  {isCompatible && (
                    <button
                      onClick={() => assignVehicleToHousehold(selectedHousehold.id, vehicle.id)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
                    >
                      Assign & Send SMS
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
