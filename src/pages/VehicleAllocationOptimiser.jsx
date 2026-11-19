import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { runVehicleAllocationOptimisation } from "../utils/allocationOptimizer";
import { 
  Sparkles, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  BarChart2, 
  Users, 
  RefreshCw,
  HelpCircle,
  Clock
} from "lucide-react";

export default function VehicleAllocationOptimiser({ onNavigate }) {
  const { households, vehicles, hazardState, applyOptimisationResults } = useApp();

  const [optimisationResult, setOptimisationResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasApproved, setHasApproved] = useState(false);

  const handleRunOptimisation = () => {
    setIsProcessing(true);
    setHasApproved(false);

    setTimeout(() => {
      const result = runVehicleAllocationOptimisation(households, vehicles, hazardState);
      setOptimisationResult(result);
      setIsProcessing(false);
    }, 400);
  };

  const handleApproveAssignments = () => {
    if (!optimisationResult || !optimisationResult.proposedAssignments) return;
    applyOptimisationResults(optimisationResult.proposedAssignments);
    setHasApproved(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-navy-900 text-white p-6 rounded-2xl border border-navy-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Module E: Constraint-Based Solvers
            </span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            Vehicle Allocation Optimiser
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Solves the last-mile bottleneck: matches 20 household requests against 5 vehicles strictly enforcing wheelchair lifts, medical stretchers, and seat capacity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunOptimisation}
            disabled={isProcessing}
            className="bg-teal-500 hover:bg-teal-400 text-navy-950 font-black px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? "Calculating Optimal Schedule..." : "Run Allocation Optimisation"}</span>
          </button>
        </div>
      </div>

      {/* Before vs After Side-by-Side Comparison */}
      {optimisationResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <div>
              <h2 className="text-lg font-black text-navy-950">
                Evacuation Fleet Performance: Before vs After
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Deterministic comparison derived from the active Krishnagiri dataset.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Heuristic Greed Optimization Complete
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before Box */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Before Optimisation (Manual Queue)
                </span>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                  Baseline
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Assigned / Dispatched</div>
                  <div className="text-xl font-bold text-slate-800 mt-0.5">
                    {optimisationResult.beforeStats.assignedOrConfirmed} Households
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Unassigned Queue</div>
                  <div className="text-xl font-bold text-red-600 mt-0.5">
                    {optimisationResult.beforeStats.unassigned} Households
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">High Priority Pending</div>
                  <div className="text-xl font-bold text-red-600 mt-0.5">
                    {optimisationResult.beforeStats.highPriorityPending} Critical
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Fleet Utilisation</div>
                  <div className="text-xl font-bold text-slate-700 mt-0.5">
                    {optimisationResult.beforeStats.utilizationRate}%
                  </div>
                </div>
              </div>
            </div>

            {/* After Box */}
            <div className="bg-teal-50/40 rounded-2xl p-5 border border-teal-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  After Optimisation (Constraint Solver)
                </span>
                <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded">
                  Optimized
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-teal-100">
                  <div className="text-teal-700 text-[10px] uppercase font-bold">Proposed Allocations</div>
                  <div className="text-xl font-black text-teal-800 mt-0.5">
                    {optimisationResult.afterStats.assignedOrProposed} Households
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-teal-100">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Remaining Unassigned</div>
                  <div className="text-xl font-bold text-slate-800 mt-0.5">
                    {optimisationResult.afterStats.unassigned} (Fleet Limit)
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-teal-100">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Critical Requests Saved</div>
                  <div className="text-xl font-bold text-emerald-600 mt-0.5">
                    {optimisationResult.beforeStats.highPriorityPending - optimisationResult.afterStats.highPriorityPending} Resolved
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-teal-100">
                  <div className="text-teal-700 text-[10px] uppercase font-bold">Fleet Utilisation Rate</div>
                  <div className="text-xl font-black text-teal-800 mt-0.5">
                    {optimisationResult.afterStats.utilizationRate}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coordinator Approval Callout */}
          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-navy-950">
                  Human-in-the-Loop Supervision Required
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Vehicles are never automatically dispatched. Review the proposed allocations below and click approve to update household queues and dispatch simulated SMS alerts.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {hasApproved ? (
                <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 font-bold px-4 py-2.5 rounded-xl text-xs border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Assignments Approved & Synced</span>
                </div>
              ) : (
                <button
                  onClick={handleApproveAssignments}
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-sm"
                >
                  Approve Proposed Assignments
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Capacity Utilisation Bars */}
      {optimisationResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <h3 className="font-bold text-base text-navy-950 mb-1">
            Fleet Passenger Utilisation Breakdown
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Seat loading per vehicle adhering strictly to accessibility equipment requirements.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {optimisationResult.vehicleUtilisation.map(vu => (
              <div key={vu.vehicleId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-navy-950 truncate">{vu.name}</span>
                  <span className="font-mono font-bold text-teal-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {vu.percentage}%
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 mb-2">
                  Loaded: {vu.usedCapacity} of {vu.capacity} passenger seats ({vu.allocatedCount} households)
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      vu.percentage === 100 ? "bg-emerald-500" : "bg-teal-500"
                    }`}
                    style={{ width: `${vu.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proposed Assignments Table */}
      {optimisationResult ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-navy-950">
                Proposed Vehicle Assignments ({optimisationResult.proposedAssignments.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Matched according to highest DAPE score and verified equipment constraints.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                  <th className="py-3 px-4">Household</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">DAPE Score</th>
                  <th className="py-3 px-4">Requirements</th>
                  <th className="py-3 px-4">Proposed Vehicle</th>
                  <th className="py-3 px-4">Est. Pickup ETA</th>
                  <th className="py-3 px-4">Constraint Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {optimisationResult.proposedAssignments.map(pa => (
                  <tr key={pa.household.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-navy-950">{pa.household.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{pa.household.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 truncate max-w-[150px]">
                      {pa.household.location}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-sm text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg">
                        {pa.household.dapeScore} pts
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{pa.household.assistanceType}</div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {pa.household.accessibilityReq}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-teal-800">{pa.vehicle.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{pa.vehicle.type}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      ~{pa.etaMinutes} mins
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Fit</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4 border border-teal-200">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-navy-950">Ready to Optimize Krishnagiri Fleet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Click <strong>"Run Allocation Optimisation"</strong> to match 20 household requests across 5 vehicles with full accessibility compliance and Before vs After evaluation.
          </p>
          <button
            onClick={handleRunOptimisation}
            className="mt-5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            Run Allocation Optimisation Now
          </button>
        </div>
      )}

      {/* Unassigned Due to Fleet Shortage */}
      {optimisationResult && optimisationResult.unassignedRequests.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base text-navy-950">
              Unassigned Requests (Fleet Capacity / Equipment Deficit: {optimisationResult.unassignedRequests.length})
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            These households could not be assigned due to specialized equipment shortages (e.g. only 1 wheelchair van available) or total seats filled.
          </p>

          <div className="space-y-2">
            {optimisationResult.unassignedRequests.map((u, idx) => (
              <div key={idx} className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-navy-950">{u.household.name}</span>
                  <span className="font-mono text-slate-500 ml-1.5">({u.household.id})</span>
                  <span className="text-slate-600 ml-2">• {u.household.assistanceType} ({u.household.accessibilityReq})</span>
                </div>
                <div className="text-[11px] font-semibold text-amber-800 italic">
                  {u.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
