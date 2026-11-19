import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { calculateDapeScore } from "../utils/dapeCalculator";
import { 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Eye, 
  Phone, 
  MapPin, 
  User, 
  HelpCircle,
  FileCheck
} from "lucide-react";

export default function AssistanceRequests({ onNavigate }) {
  const { households, verifyRequest, vehicles, hazardState } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Duplicate detection logic (matching phone or exact address/name)
  const duplicateMap = new Map();
  households.forEach(h => {
    const key = (h.contact || "").trim();
    if (key) {
      const list = duplicateMap.get(key) || [];
      list.push(h);
      duplicateMap.set(key, list);
    }
  });

  const filteredRequests = households.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      h.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.contact.includes(searchTerm) ||
      h.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "ALL") return matchesSearch;
    if (filter === "UNDER_VERIFICATION") return matchesSearch && (h.status === "Under Verification" || h.status === "Submitted");
    if (filter === "DUPLICATES") {
      const dups = duplicateMap.get(h.contact?.trim()) || [];
      return matchesSearch && dups.length > 1;
    }
    return matchesSearch && h.status === filter;
  });

  const handleOpenReject = (hh) => {
    setSelectedRequest(hh);
    setRejectReason("Duplicate registration or out of disaster service sector.");
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedRequest) return;
    verifyRequest(selectedRequest.id, "Reject", rejectReason);
    setIsRejectModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-navy-900 text-white p-6 rounded-2xl border border-navy-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Coordinator Queue Management
            </span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            Assistance Request Verification System
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Audit incoming self-registrations and volunteer proxy submissions. Detect possible duplicate calls and certify eligibility before fleet dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("proxyRegistration")}
            className="bg-accent-orange hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
          >
            + Register Proxy Household
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "ALL", label: "All Requests", count: households.length },
            { id: "UNDER_VERIFICATION", label: "Needs Verification", count: households.filter(h => h.status === "Under Verification" || h.status === "Submitted").length },
            { id: "DUPLICATES", label: "Possible Duplicates", count: households.filter(h => (duplicateMap.get(h.contact?.trim()) || []).length > 1).length },
            { id: "Unassigned", label: "Approved / Unassigned", count: households.filter(h => h.status === "Unassigned").length },
            { id: "Confirmed", label: "Confirmed", count: households.filter(h => h.status === "Confirmed").length },
            { id: "Rejected", label: "Rejected", count: households.filter(h => h.status === "Rejected").length }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition text-xs flex items-center gap-1.5 ${
                filter === f.id
                  ? "bg-navy-900 text-white font-bold shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <span>{f.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filter === f.id ? "bg-teal-500 text-navy-950 font-bold" : "bg-white text-slate-600"
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, phone, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                <th className="py-3 px-4">Request / Household</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Assistance Required</th>
                <th className="py-3 px-4">Verification Audit</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map(h => {
                const duplicates = duplicateMap.get(h.contact?.trim()) || [];
                const isPotentialDuplicate = duplicates.length > 1;
                const dape = calculateDapeScore(h, hazardState, vehicles);

                return (
                  <tr key={h.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-navy-950 flex items-center gap-1.5">
                        <span>{h.name}</span>
                        {h.isProxy && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold border border-amber-200">
                            Proxy (Volunteer)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {h.id} • Registered by: {h.registeredBy || "Self"}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 max-w-xs truncate" title={h.location}>
                        {h.location}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-800 font-medium">{h.contact}</div>
                      {h.emergencyContact && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Emerg: {h.emergencyContact}
                        </div>
                      )}
                      <div className="text-[10px] text-teal-700 font-semibold mt-0.5">
                        Lang: {h.preferredLanguage}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{h.assistanceType}</div>
                      <div className="text-[11px] text-slate-500">
                        {h.peopleCount} pax • {h.accessibilityReq}
                      </div>
                      {h.notes && (
                        <div className="text-[10px] text-slate-400 italic max-w-xs truncate mt-0.5">
                          "{h.notes}"
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {isPotentialDuplicate ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Possible Dup ({duplicates.length} records)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <FileCheck className="w-3 h-3 text-emerald-600" />
                          <span>Unique Record</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        h.status === "Confirmed" ? "bg-emerald-100 text-emerald-800" :
                        h.status === "Under Verification" || h.status === "Submitted" ? "bg-amber-100 text-amber-800 animate-pulse" :
                        h.status === "Unassigned" ? "bg-teal-100 text-teal-800" :
                        h.status === "Rejected" ? "bg-red-100 text-red-800" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {h.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Approve Button */}
                        {h.status !== "Unassigned" && h.status !== "Confirmed" && h.status !== "Completed" && (
                          <button
                            onClick={() => verifyRequest(h.id, "Approve")}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition"
                            title="Approve for Fleet Coordination"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Review Flag */}
                        <button
                          onClick={() => verifyRequest(h.id, "Review", "Incomplete field details")}
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg border border-amber-200 transition"
                          title="Mark Incomplete / Review Required"
                        >
                          <HelpCircle className="w-4 h-4" />
                        </button>

                        {/* Reject Button */}
                        {h.status !== "Rejected" && (
                          <button
                            onClick={() => handleOpenReject(h)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 transition"
                            title="Reject Request"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="font-bold text-base text-navy-950">
              Reject Assistance Request ({selectedRequest.id})
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Provide justification for marking {selectedRequest.name}'s request as rejected.
            </p>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Rejection Justification:
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
