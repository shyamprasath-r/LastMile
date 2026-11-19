import React from "react";
import { useApp } from "../context/AppContext";
import { 
  LayoutDashboard, 
  Cpu, 
  ClipboardList, 
  Map, 
  Waves, 
  Truck, 
  Sparkles, 
  Bell, 
  BarChart3, 
  UserCheck, 
  Home, 
  Settings, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { calculateDapeScore } from "../utils/dapeCalculator";

export default function Sidebar({ currentPage, onNavigate }) {
  const { currentUser, households, hazardState, vehicles } = useApp();

  // Calculate live badge counts
  const unassignedCount = households.filter(h => h.status === "Unassigned").length;
  const underVerificationCount = households.filter(h => h.status === "Under Verification").length;
  const highPriorityCount = households.filter(h => {
    const d = calculateDapeScore(h, hazardState, vehicles);
    return d && d.totalScore >= 70 && !["Completed", "Confirmed"].includes(h.status);
  }).length;

  const navItems = [
    {
      category: "Operations Center",
      items: [
        {
          id: "dashboard",
          label: "Coordinator Dashboard",
          icon: LayoutDashboard,
          roles: ["Coordinator"]
        },
        {
          id: "iere",
          label: "IERE Intelligence Centre",
          icon: Cpu,
          badge: `${highPriorityCount} High`,
          badgeColor: "bg-red-100 text-red-700",
          roles: ["Coordinator"]
        },
        {
          id: "requests",
          label: "Assistance Requests",
          icon: ClipboardList,
          badge: underVerificationCount > 0 ? `${underVerificationCount} New` : null,
          badgeColor: "bg-amber-100 text-amber-700",
          roles: ["Coordinator", "Community Volunteer"]
        },
        {
          id: "gapMap",
          label: "Assistance Gap Map",
          icon: Map,
          roles: ["Coordinator", "Community Volunteer"]
        }
      ]
    },
    {
      category: "Intelligence & Logistics",
      items: [
        {
          id: "simulation",
          label: "Hazard Simulation",
          icon: Waves,
          badge: hazardState.isActive ? "Active" : "Normal",
          badgeColor: hazardState.isActive ? "bg-red-500 text-white animate-pulse" : "bg-slate-200 text-slate-700",
          roles: ["Coordinator"]
        },
        {
          id: "resources",
          label: "Resource Management",
          icon: Truck,
          roles: ["Coordinator"]
        },
        {
          id: "optimiser",
          label: "Allocation Optimiser",
          icon: Sparkles,
          roles: ["Coordinator"]
        },
        {
          id: "notifications",
          label: "Notifications & SMS",
          icon: Bell,
          roles: ["Coordinator", "Community Volunteer", "Household"]
        },
        {
          id: "analytics",
          label: "Analytics Dashboard",
          icon: BarChart3,
          roles: ["Coordinator"]
        }
      ]
    },
    {
      category: "Portals & Public",
      items: [
        {
          id: "volunteer",
          label: "Volunteer Dashboard",
          icon: UserCheck,
          roles: ["Community Volunteer", "Coordinator"]
        },
        {
          id: "household",
          label: "Household Dashboard",
          icon: Home,
          roles: ["Household", "Coordinator"]
        },
        {
          id: "settings",
          label: "Settings & Privacy",
          icon: Settings,
          roles: ["Coordinator", "Community Volunteer", "Household"]
        }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Role Banner */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-navy-900">
            {currentUser ? currentUser.role : "Guest Mode"}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1 truncate">
          Krishnagiri EOC Regional Command
        </p>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navItems.map(group => {
          // Filter items based on current role
          const visibleItems = group.items.filter(item => 
            !currentUser || item.roles.includes(currentUser.role) || currentUser.role === "Coordinator"
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.category}>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                {group.category}
              </div>
              <div className="space-y-1">
                {visibleItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-navy-900 text-white shadow-sm font-semibold"
                          : "text-slate-600 hover:text-navy-950 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          isActive ? "bg-teal-500 text-navy-950" : item.badgeColor
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer System Status Info */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs shadow-xs">
          <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
            <span className="flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Engine Status
            </span>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
              ONLINE
            </span>
          </div>
          <div className="text-[10px] text-slate-500 space-y-0.5">
            <div className="flex justify-between">
              <span>Unassigned Queue:</span>
              <strong className="text-slate-700">{unassignedCount}</strong>
            </div>
            <div className="flex justify-between">
              <span>High Risk Focus:</span>
              <strong className="text-red-600">{highPriorityCount}</strong>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate("landing")}
          className="mt-3 w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-500 hover:text-navy-900 transition py-1"
        >
          <ExternalLink className="w-3 h-3" />
          <span>View Public Landing Page</span>
        </button>
      </div>
    </aside>
  );
}
