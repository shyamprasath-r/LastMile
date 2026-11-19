import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Settings, 
  User, 
  ShieldCheck, 
  Languages, 
  Bell, 
  RefreshCw, 
  LogOut, 
  Lock, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";

export default function SettingsPage({ onNavigate }) {
  const { 
    currentUser, 
    logout, 
    currentLanguage, 
    setCurrentLanguage, 
    resetDemoData 
  } = useApp();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [smsSimulationEnabled, setSmsSimulationEnabled] = useState(true);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-navy-900 text-white p-6 rounded-2xl border border-navy-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Platform Administration
            </span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            Settings, Profile & Privacy Governance
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Manage active demonstration session, data privacy protocols, consent safeguards, and reset prototype states.
          </p>
        </div>

        <button
          onClick={() => {
            logout();
            onNavigate("login");
          }}
          className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Session</span>
        </button>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <h3 className="font-bold text-base text-navy-950 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-teal-600" />
          <span>Current Active Profile Information</span>
        </h3>

        {currentUser ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Display Name:</span>
              <span className="font-extrabold text-navy-950 text-sm">{currentUser.name}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Account Email:</span>
              <span className="font-mono text-slate-800">{currentUser.email}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">System Role:</span>
              <span className="inline-block mt-0.5 font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                {currentUser.role}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Identification:</span>
              <span className="font-mono text-slate-700 font-semibold">
                {currentUser.officerId || currentUser.volunteerBadge || currentUser.householdId || "N/A"}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">No user logged in. Using guest demonstration mode.</p>
        )}
      </div>

      {/* Language & Interface Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <h3 className="font-bold text-base text-navy-950 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Languages className="w-4 h-4 text-teal-600" />
          <span>Multilingual & Accessibility Preferences</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Platform & SMS Template Language:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { code: "English", label: "English", desc: "Default regional emergency terminology" },
                { code: "Tamil", label: "தமிழ் (Tamil)", desc: "Krishnagiri primary vernacular" },
                { code: "Hindi", label: "हिंदी (Hindi)", desc: "Inter-state migrant worker support" }
              ].map(item => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setCurrentLanguage(item.code)}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    currentLanguage === item.code
                      ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="font-bold text-xs">{item.label}</div>
                  <div className="text-[10px] opacity-75 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-800">Simulated Cellular SMS Engine</span>
              <p className="text-slate-500 text-[11px]">Enables interactive mock 2-way SMS verification for non-smartphone users.</p>
            </div>
            <input
              type="checkbox"
              checked={smsSimulationEnabled}
              onChange={(e) => setSmsSimulationEnabled(e.target.checked)}
              className="w-4 h-4 text-teal-600 accent-teal-600"
            />
          </div>
        </div>
      </div>

      {/* Privacy Notices & Data Governance Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-base text-navy-950 pb-3 border-b border-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Disaster Data Privacy & Ethical AI Governance</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-navy-950 flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Affirmative Proxy Consent Safeguard</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Volunteers are structurally blocked from registering households without affirmatively checking the legal consent gateway. This prevents unauthorized surveillance or misrepresentation during crisis events.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-navy-950 flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Role-Based Data Segregation</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Evacuees only see their personal request status and driver phone numbers. Field volunteers cannot alter coordinator fleet routes, and sensitive medical notes are restricted to verified rescue teams.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-navy-950 flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Minimal Vulnerability Collection</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              LASTMILE collects only the minimal parameters needed for physical evacuation safety (ambulatory status, wheelchair ramp need, medical transit requirement). No financial or biometric data is requested.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-navy-950 flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Zero Black-Box Scoring Rule</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              DAPE priority scores are calculated strictly through transparent 100-point rules (U+M+A+W+R+H+T). No unexplainable ML models make life-critical rescue allocation decisions without human coordinator review.
            </p>
          </div>
        </div>
      </div>

      {/* Reset Demo Data Card */}
      <div className="bg-red-50/50 rounded-2xl border border-red-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-red-950 flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-red-600" />
            <span>Reset Demo Data to Initial Scenario</span>
          </h3>
          <p className="text-xs text-red-800 mt-0.5 max-w-lg leading-relaxed">
            Restores the initial 20 Krishnagiri household requests, 5 vehicles, and default flood simulation conditions. Useful for rehearsing the hackathon presentation.
          </p>
        </div>

        <button
          onClick={() => setConfirmResetOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-xs shrink-0"
        >
          Reset Demo Data
        </button>
      </div>

      {/* Confirmation Modal */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-navy-950">
              Reset All Demo State?
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              This will overwrite any newly created households and restore the initial 20 fictional Krishnagiri records and 5 fleet vehicles in localStorage.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setConfirmResetOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition shadow-xs"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
