import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  ShieldAlert, 
  Waves, 
  Smartphone, 
  Globe, 
  User, 
  LogOut, 
  RefreshCw,
  Bell,
  ChevronDown
} from "lucide-react";
import SmsSimulatorModal from "./SmsSimulatorModal";

export default function Navbar({ onNavigate, currentPage }) {
  const { 
    currentUser, 
    logout, 
    switchRole, 
    hazardState, 
    currentLanguage, 
    setCurrentLanguage,
    resetDemoData,
    smsHistory,
    notifications
  } = useApp();

  const [isSmsOpen, setIsSmsOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-navy-900 border-b border-navy-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("landing")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/20 text-navy-950 font-black">
              <Waves className="w-6 h-6 text-navy-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-teal-200">
                  LASTMILE
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden md:block">
                Hazard-Aware Intelligent Evacuation Coordination
              </p>
            </div>
          </div>

          {/* Center Hazard Alert Pill */}
          <div className="hidden lg:flex items-center gap-2">
            {hazardState.isActive ? (
              <div 
                onClick={() => onNavigate("simulation")} 
                className="cursor-pointer flex items-center gap-2 bg-red-950/80 border border-red-500/40 text-red-200 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-red-900/80 transition"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>Simulated Flood Active: Krishnagiri Basin ({hazardState.severityLevel})</span>
              </div>
            ) : (
              <div 
                onClick={() => onNavigate("simulation")} 
                className="cursor-pointer flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-emerald-900/60 transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Normal Hazard Baseline • Krishnagiri</span>
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* SMS Simulator Trigger */}
            <button
              onClick={() => setIsSmsOpen(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium transition relative"
              title="Open Interactive SMS Simulator"
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">SMS Simulator</span>
              {smsHistory.length > 0 && (
                <span className="bg-teal-500 text-navy-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {smsHistory.length}
                </span>
              )}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-0.5 text-xs">
                {["English", "Tamil", "Hindi"].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setCurrentLanguage(lang)}
                    className={`px-2 py-1 rounded-md transition font-medium ${
                      currentLanguage === lang
                        ? "bg-teal-600 text-white shadow-sm"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {lang === "English" ? "EN" : lang === "Tamil" ? "தமிழ்" : "हिंदी"}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition relative"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent-orange rounded-full"></span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                      Live Coordination Feed
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {notifications.length} events
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.slice(0, 5).map(n => (
                      <div key={n.id} className="p-3 text-xs hover:bg-slate-50">
                        <div className="flex items-center justify-between font-semibold text-slate-800">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-slate-500 mt-0.5">{n.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowNotifMenu(false);
                        onNavigate("notifications");
                      }}
                      className="w-full text-center text-xs text-teal-600 hover:text-teal-700 font-medium py-1"
                    >
                      View All Notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User / Demo Role Picker */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 px-3 py-1.5 rounded-lg border border-navy-700 text-xs transition"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                    {currentUser.role.charAt(0)}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="font-semibold text-white leading-tight">
                      {currentUser.role}
                    </div>
                    <div className="text-[10px] text-teal-300">
                      {currentUser.role === "Household" ? currentUser.householdId : "Active"}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="text-[11px] text-slate-400">Signed in as</div>
                      <div className="font-semibold text-xs text-navy-950 truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-teal-600 font-medium">{currentUser.email}</div>
                    </div>

                    <div className="px-2 py-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                        Switch Demo Role:
                      </div>
                      <button
                        onClick={() => {
                          switchRole("Coordinator");
                          setShowRoleMenu(false);
                          onNavigate("dashboard");
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          currentUser.role === "Coordinator" ? "bg-teal-50 text-teal-700" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        Coordinator (EOC Admin)
                      </button>
                      <button
                        onClick={() => {
                          switchRole("Community Volunteer");
                          setShowRoleMenu(false);
                          onNavigate("volunteer");
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          currentUser.role === "Community Volunteer" ? "bg-teal-50 text-teal-700" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        Community Volunteer (Proxy)
                      </button>
                      <button
                        onClick={() => {
                          switchRole("Household");
                          setShowRoleMenu(false);
                          onNavigate("household");
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          currentUser.role === "Household" ? "bg-teal-50 text-teal-700" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        Household (Self Portal)
                      </button>
                    </div>

                    <div className="border-t border-slate-100 px-2 pt-1 mt-1">
                      <button
                        onClick={() => {
                          resetDemoData();
                          setShowRoleMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 rounded-lg transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Reset Demo Data</span>
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setShowRoleMenu(false);
                          onNavigate("login");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate("login")}
                className="bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition shadow-sm"
              >
                Demo Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Embedded SMS Simulator Modal */}
      <SmsSimulatorModal isOpen={isSmsOpen} onClose={() => setIsSmsOpen(false)} />
    </>
  );
}
