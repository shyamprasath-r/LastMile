import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { MessageSquare, Send, CheckCircle2, ShieldAlert, X, Smartphone, RefreshCw } from "lucide-react";

export default function SmsSimulatorModal({ isOpen, onClose }) {
  const { smsHistory, simulateSmsReply, households, currentLanguage } = useApp();
  const [selectedHhId, setSelectedHhId] = useState("");
  const [replyInput, setReplyInput] = useState("1");
  const [lastStatus, setLastStatus] = useState(null);

  if (!isOpen) return null;

  // Filter households awaiting confirmation or assigned
  const awaitingHouseholds = households.filter(h => 
    h.status === "Awaiting Confirmation" || h.status === "Assigned" || h.status === "Unassigned"
  );

  const activeHh = selectedHhId 
    ? households.find(h => h.id === selectedHhId) 
    : (awaitingHouseholds[0] || households[0]);

  const activeHhId = activeHh ? activeHh.id : "";

  // Messages for this household
  const householdMessages = smsHistory.filter(s => s.householdId === activeHhId);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!replyInput.trim() || !activeHhId) return;

    const res = simulateSmsReply(activeHhId, replyInput);
    setLastStatus(res);
    setReplyInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base flex items-center gap-2">
                Simulated SMS Coordination Terminal
                <span className="text-[10px] font-mono uppercase bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                  Interactive Demo
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Simulates real-world cellular 2-way SMS verification for evacuees
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Household selector */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
            Select Household to Simulate Device:
          </label>
          <select
            value={activeHhId}
            onChange={(e) => {
              setSelectedHhId(e.target.value);
              setLastStatus(null);
            }}
            className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {households.map(h => (
              <option key={h.id} value={h.id}>
                {h.id} - {h.name} [{h.status}] ({h.preferredLanguage || "Tamil"})
              </option>
            ))}
          </select>
          {activeHh && (
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Mobile: <strong className="text-slate-700">{activeHh.contact}</strong></span>
              <span>Status: <strong className="text-teal-700">{activeHh.status}</strong></span>
              <span>Lang: <strong className="text-slate-700">{activeHh.preferredLanguage}</strong></span>
            </div>
          )}
        </div>

        {/* Phone UI Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100 min-h-[220px]">
          {householdMessages.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No SMS messages logged yet for this household.</p>
              <p className="text-xs text-slate-400 mt-1">Assign a vehicle or click "Send Simulated Confirmation SMS" below.</p>
            </div>
          ) : (
            householdMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.type === "INBOUND" ? "items-end" : "items-start"}`}
              >
                <div className="text-[10px] text-slate-400 mb-1 px-1">
                  {msg.type === "INBOUND" ? "Evacuee Reply" : "EOC Alert Gateway"} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-sm leading-relaxed ${
                    msg.type === "INBOUND"
                      ? "bg-teal-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
              </div>
            ))
          )}

          {lastStatus && (
            <div className={`text-xs p-2.5 rounded-lg border flex items-center gap-2 ${
              lastStatus.success ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"
            }`}>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{lastStatus.message}</span>
            </div>
          )}
        </div>

        {/* Simulation Controls & Reply Form */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Quick Demo Actions:</span>
            <button
              type="button"
              onClick={() => {
                setReplyInput("1");
                simulateSmsReply(activeHhId, "1");
              }}
              className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded font-semibold transition"
            >
              Simulate Reply "1" (Confirm Evacuation)
            </button>
            <button
              type="button"
              onClick={() => {
                setReplyInput("9");
                simulateSmsReply(activeHhId, "9");
              }}
              className="px-2.5 py-1 text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 rounded border border-slate-200 transition"
            >
              Reply "9" (Cancel)
            </button>
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              placeholder="Type simulated SMS reply (e.g. 1)..."
              className="flex-1 text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send SMS</span>
            </button>
          </form>

          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Simulated cellular SMS. No external telecom gateway required. Persists to localStorage.
          </p>
        </div>
      </div>
    </div>
  );
}
