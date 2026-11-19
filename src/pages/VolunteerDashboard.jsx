import React from "react";
import { useApp } from "../context/AppContext";
import { 
  HeartHandshake, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  MapPin, 
  Phone,
  ShieldCheck,
  FileCheck
} from "lucide-react";

export default function VolunteerDashboard({ onNavigate }) {
  const { households, currentUser } = useApp();

  // Filter proxy registrations
  const proxyHouseholds = households.filter(h => h.isProxy);
  const pendingVerification = proxyHouseholds.filter(h => h.status === "Under Verification");
  const approvedProxies = proxyHouseholds.filter(h => h.status !== "Under Verification" && h.status !== "Rejected");

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-navy-900 text-white p-6 rounded-2xl border border-navy-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-accent-orange" />
            <span className="text-xs font-bold uppercase tracking-wider text-accent-orange">
              Field Operations Portal
            </span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            Community Volunteer Dashboard
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Welcome, <strong>{currentUser?.name || "K. Ramesh"}</strong> (Badge: VOL-TN-401). Register vulnerable households who lack smartphones or network access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("proxyRegistration")}
            className="bg-accent-orange hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Proxy Registration</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Proxy Submissions
          </span>
          <div className="text-3xl font-black text-navy-950 mt-1">
            {proxyHouseholds.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registered on behalf of vulnerable neighbors
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Pending EOC Verification
          </span>
          <div className="text-3xl font-black text-amber-600 mt-1">
            {pendingVerification.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Awaiting coordinator consent audit
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Approved & In Queue
          </span>
          <div className="text-3xl font-black text-emerald-600 mt-1">
            {approvedProxies.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Eligible for fleet evacuation matching
          </p>
        </div>
      </div>

      {/* Proxy Households Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-navy-950">
              Community Outreach Records
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Households registered with verified citizen consent.
            </p>
          </div>

          <button
            onClick={() => onNavigate("proxyRegistration")}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>+ Add Household</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                <th className="py-3 px-4">Household Name & ID</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Assistance Needs</th>
                <th className="py-3 px-4">Consent Status</th>
                <th className="py-3 px-4">Evacuation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {proxyHouseholds.map(h => (
                <tr key={h.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-navy-950">{h.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {h.id} • Registered by: {h.registeredBy}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-800">
                    {h.contact}
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 truncate max-w-xs" title={h.location}>
                    {h.location}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{h.assistanceType}</div>
                    <div className="text-[10px] text-slate-500">{h.accessibilityReq}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Consent Verified</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      h.status === "Confirmed" ? "bg-emerald-100 text-emerald-800" :
                      h.status === "Under Verification" ? "bg-amber-100 text-amber-800" :
                      h.status === "Unassigned" ? "bg-teal-100 text-teal-800" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
