import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { calculateDapeScore } from "../utils/dapeCalculator";
import { 
  Home, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertTriangle, 
  XCircle, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Send
} from "lucide-react";
import SmsSimulatorModal from "../components/SmsSimulatorModal";

export default function HouseholdDashboard({ onNavigate }) {
  const { 
    currentUser, 
    households, 
    vehicles, 
    hazardState, 
    confirmHouseholdArrangement, 
    withdrawHouseholdRequest,
    smsHistory,
    simulateSmsReply
  } = useApp();

  const [isSmsOpen, setIsSmsOpen] = useState(false);
  const [activeHouseholdId, setActiveHouseholdId] = useState(
    currentUser?.householdId || "HH-1001"
  );
  const [smsReplyInput, setSmsReplyInput] = useState("1");

  // Find current household
  const household = households.find(h => h.id === activeHouseholdId) || households[0];
  const assignedVehicle = vehicles.find(v => v.id === household?.assignedVehicleId);
  const dape = calculateDapeScore(household, hazardState, vehicles);

  // Filter SMS for this household
  const householdSms = smsHistory.filter(s => s.householdId === household?.id);

  // Status step progression helper
  const statusSteps = [
    { key: "Submitted", label: "Submitted" },
    { key: "Under Verification", label: "Verification" },
    { key: "Unassigned", label: "Queued" },
    { key: "Awaiting Confirmation", label: "Proposed" },
    { key: "Confirmed", label: "Confirmed" },
    { key: "Completed", label: "Completed" }
  ];

  const getCurrentStepIndex = () => {
    if (!household) return 0;
    const st = household.status;
    if (st === "Submitted") return 0;
    if (st === "Under Verification") return 1;
    if (st === "Approved" || st === "Unassigned") return 2;
    if (st === "Assigned" || st === "Awaiting Confirmation") return 3;
    if (st === "Confirmed") return 4;
    if (st === "Completed") return 5;
    return 0;
  };

  const currentStep = getCurrentStepIndex();

  const handleQuickSmsConfirm = (e) => {
    e?.preventDefault();
    if (!household) return;
    simulateSmsReply(household.id, smsReplyInput);
    setSmsReplyInput("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-navy-900 text-white p-6 rounded-2xl border border-navy-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Citizen Evacuation Tracking
            </span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            Household Assistance Portal
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Monitor emergency transportation status, confirm vehicle arrival details, or interact via simulated cellular SMS.
          </p>
        </div>

        {/* Household Switcher for Demo Convenience */}
        <div className="flex items-center gap-3">
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Demo Switch Household:</span>
            <select
              value={activeHouseholdId}
              onChange={(e) => setActiveHouseholdId(e.target.value)}
              className="bg-navy-950 border border-navy-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono"
            >
              {households.map(h => (
                <option key={h.id} value={h.id}>
                  {h.id} - {h.name} [{h.status}]
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onNavigate("householdRegistration")}
            className="bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm shrink-0"
          >
            + New Request
          </button>
        </div>
      </div>

      {household && (
        <>
          {/* Status Progression Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Evacuation Lifecycle Status
                </span>
                <h2 className="text-lg font-black text-navy-950 mt-0.5 flex items-center gap-2">
                  <span>Current: {household.status}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    household.status === "Confirmed" ? "bg-emerald-100 text-emerald-800" :
                    household.status === "Awaiting Confirmation" ? "bg-amber-100 text-amber-800" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    Step {currentStep + 1} of 6
                  </span>
                </h2>
              </div>

              {household.status === "Awaiting Confirmation" && (
                <button
                  onClick={() => confirmHouseholdArrangement(household.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm animate-bounce"
                >
                  ✓ Confirm Proposed Transit Now
                </button>
              )}
            </div>

            {/* Visual Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
              {statusSteps.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition ${
                      isCurrent 
                        ? "bg-teal-600 text-white ring-4 ring-teal-100" 
                        : isPassed 
                        ? "bg-emerald-500 text-white" 
                        : "bg-slate-100 text-slate-400"
                    }`}>
                      {isPassed && !isCurrent ? "✓" : idx + 1}
                    </div>
                    <span className={`text-[11px] font-semibold ${
                      isCurrent ? "text-teal-800 font-bold" : isPassed ? "text-slate-800" : "text-slate-400"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details & Assigned Vehicle Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Household Record Summary */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {household.id}
                  </span>
                  <h3 className="font-extrabold text-base text-navy-950 mt-1">
                    {household.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned DAPE Priority:</span>
                  <span className="font-black text-sm text-red-600">
                    {dape?.totalScore || 'N/A'} / 100 ({dape?.category})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Location Address:</span>
                  <span className="font-semibold text-slate-800">{household.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Number:</span>
                  <span className="font-mono font-semibold text-slate-800">{household.contact}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Assistance Type:</span>
                  <span className="font-semibold text-slate-800">{household.assistanceType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Accessibility Constraint:</span>
                  <span className="font-semibold text-slate-800">{household.accessibilityReq}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">People Requiring Transport:</span>
                  <span className="font-semibold text-slate-800">{household.peopleCount} Evacuees</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Preferred Language:</span>
                  <span className="font-semibold text-teal-700">{household.preferredLanguage}</span>
                </div>
              </div>

              {household.notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 italic">
                  "{household.notes}"
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 justify-between items-center">
                <span className="text-[11px] text-slate-400">
                  Registered: {new Date(household.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  {household.status !== "Withdrawn" && household.status !== "Completed" && (
                    <button
                      onClick={() => withdrawHouseholdRequest(household.id)}
                      className="px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition"
                    >
                      Withdraw Request
                    </button>
                  )}
                  <button
                    onClick={() => setIsSmsOpen(true)}
                    className="px-3.5 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open SMS Simulator</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Assigned Vehicle Details / Status Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Allocated Evacuation Vehicle
                </span>

                {assignedVehicle ? (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-teal-700">
                        {assignedVehicle.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        household.status === "Confirmed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {household.status === "Confirmed" ? "Confirmed Dispatch" : "Awaiting Confirmation"}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-navy-950">
                      {assignedVehicle.name}
                    </h4>

                    <div className="text-xs text-slate-600 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vehicle Type:</span>
                        <strong className="text-slate-800">{assignedVehicle.type}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Registration:</span>
                        <span className="font-mono text-slate-800">{assignedVehicle.regNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Driver:</span>
                        <span className="text-slate-800 font-semibold">{assignedVehicle.driverName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Driver Phone:</span>
                        <span className="font-mono text-slate-800">{assignedVehicle.driverPhone}</span>
                      </div>
                    </div>

                    {assignedVehicle.accessibilityFeatures && (
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                        {assignedVehicle.accessibilityFeatures.map((f, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                    <Truck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-slate-600">No Vehicle Assigned Yet</p>
                    <p className="text-[11px] mt-1 text-slate-400">
                      Krishnagiri coordination team is currently evaluating compatible fleet resources.
                    </p>
                  </div>
                )}
              </div>

              {/* Direct Simulated SMS Confirmation Widget */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 block mb-1">
                  Simulate SMS Confirmation (Reply "1"):
                </span>
                <form onSubmit={handleQuickSmsConfirm} className="flex gap-2">
                  <input
                    type="text"
                    value={smsReplyInput}
                    onChange={(e) => setSmsReplyInput(e.target.value)}
                    placeholder="Type 1 to confirm..."
                    className="flex-1 text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    Reply
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* SMS Notification Log for this Household */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <h3 className="font-bold text-base text-navy-950 mb-1">
              Cellular SMS Notification Feed (Simulated)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Real-time feed of SMS alerts sent to {household.contact} in {household.preferredLanguage}.
            </p>

            {householdSms.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No SMS notices logged yet. Assign a vehicle in Resource Management or Allocation Optimiser to generate alerts.
              </div>
            ) : (
              <div className="space-y-3">
                {householdSms.map(sms => (
                  <div
                    key={sms.id}
                    className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      sms.type === "INBOUND" 
                        ? "bg-teal-50/70 border-teal-200 text-teal-950" 
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                          sms.type === "INBOUND" ? "bg-teal-600 text-white" : "bg-navy-900 text-white"
                        }`}>
                          {sms.type === "INBOUND" ? "Citizen Reply" : "EOC Alert"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(sms.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed">{sms.content}</p>
                    </div>

                    <span className="text-[10px] font-bold text-slate-500 font-mono self-start sm:self-auto">
                      {sms.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Simulator Modal */}
      <SmsSimulatorModal isOpen={isSmsOpen} onClose={() => setIsSmsOpen(false)} />
    </div>
  );
}
