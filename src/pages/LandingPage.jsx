import React from "react";
import { useApp } from "../context/AppContext";
import { 
  Waves, 
  ShieldAlert, 
  Cpu, 
  Truck, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  HeartHandshake, 
  MapPin, 
  Sparkles,
  Smartphone,
  AlertTriangle,
  Compass,
  FileCheck
} from "lucide-react";

export default function LandingPage({ onNavigate }) {
  const { switchRole } = useApp();

  const handleRoleQuickStart = (roleName, targetPage) => {
    switchRole(roleName);
    onNavigate(targetPage);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy-950 text-white pt-16 pb-24 border-b border-navy-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Platform Title */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              LASTMILE
            </h1>

            {/* Tagline */}
            <p className="mt-4 text-xl sm:text-2xl font-medium text-teal-300 max-w-2xl leading-relaxed">
              "A warning can reach everyone. <br className="hidden sm:inline" />
              <span className="text-white font-bold underline decoration-accent-orange decoration-4 underline-offset-4">
                But can everyone reach safety?
              </span>"
            </p>

            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Hazard-Aware Intelligent Evacuation Readiness and Assistance Coordination Platform. 
              Bridging the critical gap between early warnings and equitable, constraint-aware evacuation for vulnerable households.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full">
              <button
                onClick={() => handleRoleQuickStart("Coordinator", "dashboard")}
                className="bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-teal-500/25 flex items-center gap-2 transition transform hover:-translate-y-0.5"
              >
                <span>Launch Coordinator Command</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate("householdRegistration")}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 transition flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-teal-300" />
                <span>Household Registration</span>
              </button>

              <button
                onClick={() => onNavigate("proxyRegistration")}
                className="bg-accent-orange/90 hover:bg-accent-orange text-white font-semibold px-6 py-3.5 rounded-xl transition flex items-center gap-2 shadow-sm"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Volunteer Proxy Portal</span>
              </button>
            </div>

            {/* Live Prototype Indicator */}
            <div className="mt-8 flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>100% Client-Side Interactive</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>20 Simulated Households</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Tamil / Hindi / English SMS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Problem Statement */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-accent-orange uppercase tracking-wider">
              The Disaster Management Dilemma
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 mt-2">
              Why Existing Warning Systems Leave People Behind
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Modern meteorological satellites and sirens warn entire populations. However, evacuation isn't symmetric: bedbound patients, wheelchair users, elderly citizens living alone, and families without personal vehicles remain trapped in flood paths without tailored transportation.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-navy-900">The Evacuation Inequality Gap</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                General alerts assume households can drive away. 15-25% of vulnerable residents require physical assistance, wheelchair ramps, or medical transports that standard public vehicles cannot supply.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-navy-900">Uncalibrated Static Queues</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Emergency call centres use first-come first-served queues without dynamic hazard awareness or time-to-impact calculations. A lower-risk call made 2 hours ago blocks an imminent flood surge rescue.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-navy-900">Accessibility Mismatch & No-Shows</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Dispatching a regular SUV to a wheelchair user wastes critical hours when the driver cannot board the evacuee. LASTMILE eliminates this with constraint-based fleet matching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How LASTMILE Works & IERE Overview */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              The Engine of Resilience
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 mt-2">
              Intelligent Evacuation Readiness Engine (IERE)
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Six coordinated intelligence modules turn raw household assistance requests into safe, verified, conflict-free evacuations.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-navy-900 text-teal-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-navy-950">A. Dynamic Priority (DAPE)</h4>
                  <span className="text-[11px] text-teal-600 font-medium">100-Point Rule Engine</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mathematically prioritises each household based on Urgency, Medical need, Accessibility, Waiting time, Resource gap, Hazard exposure, and Time-to-impact.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-red-100 text-red-600">
                  <Waves className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-navy-950">B. Hazard-Aware Readiness</h4>
                  <span className="text-[11px] text-red-600 font-medium">Flash Flood Simulation</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dynamically ingests simulated Krishnagiri river inundation boundaries, recalculating exposure scores and re-ranking the rescue queue in real time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-navy-950">C. Assistance Gap Detection</h4>
                  <span className="text-[11px] text-amber-600 font-medium">GIS Leaflet Heatmap</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive OpenStreetMap highlighting unassigned pockets, awaiting confirmation nodes, and high-risk clusters across neighborhoods.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-teal-100 text-teal-700">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-navy-950">D. Smart Resource Matching</h4>
                  <span className="text-[11px] text-teal-700 font-medium">Capability Compatibility</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prevents fatal dispatch errors by ensuring wheelchair lift vans match paraplegic evacuees and stretcher units match critical patients.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-navy-950">E. Vehicle Allocation Optimiser</h4>
                  <span className="text-[11px] text-indigo-600 font-medium">Greedy Constraint Solver</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates 20 household requests across 5 emergency vehicles, generating human-supervised proposals before and after optimization.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-navy-950">F. Multilingual 2-Way SMS</h4>
                  <span className="text-[11px] text-emerald-600 font-medium">Tamil / Hindi / English</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Low-tech accessible confirmation: sends localized SMS notices with interactive "Reply 1 to confirm" validation for rural and elderly citizens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target User Roles */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">
              Built for Every Stakeholder
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 mt-1">
              Choose Your Portal Experience
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Household Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-navy-950">Vulnerable Households</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Register accessibility needs, monitor status in real-time, confirm proposed transit, or withdraw requests without complex paperwork.
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Self-registration with auto Household ID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Multilingual interface & SMS confirmation</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRoleQuickStart("Household", "household")}
                className="mt-6 w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-xl transition shadow-xs"
              >
                Enter Household Portal →
              </button>
            </div>

            {/* Volunteer Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-orange text-white flex items-center justify-center font-bold mb-4">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-navy-950">Community Volunteers</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Conduct field outreach to register vulnerable neighbors who lack smartphones. Strict consent verification ensures data protection.
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-orange" />
                    <span>Mandatory consent gatekeeper</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-orange" />
                    <span>Auto 'Under Verification' badge tagging</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRoleQuickStart("Community Volunteer", "volunteer")}
                className="mt-6 w-full py-2.5 px-4 bg-accent-orange hover:bg-orange-600 text-white font-medium text-xs rounded-xl transition shadow-xs"
              >
                Enter Volunteer Proxy Portal →
              </button>
            </div>

            {/* Coordinator Card */}
            <div className="bg-navy-900 text-white rounded-2xl p-6 border border-navy-800 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-500 text-navy-950 flex items-center justify-center font-bold mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white">Emergency Coordinators</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  EOC Command Center: verify incoming requests, trigger hazard scenarios, run resource matching, resolve vehicle no-shows, and dispatch fleets.
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>100-Point DAPE Priority recalculation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Interactive Leaflet Gap Map & Recharts</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRoleQuickStart("Coordinator", "dashboard")}
                className="mt-6 w-full py-2.5 px-4 bg-teal-400 hover:bg-teal-300 text-navy-950 font-bold text-xs rounded-xl transition shadow-sm"
              >
                Enter Coordinator Command Center →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials Section */}
      <section className="py-12 bg-slate-100 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-base font-bold text-navy-950">Predefined Demo Login Credentials</h3>
          <p className="text-xs text-slate-600 mt-1">
            Built for demonstration presentation. Password for all accounts is: <code className="bg-white px-2 py-0.5 rounded font-mono font-bold text-navy-950 border border-slate-200">demo</code>
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-teal-700 block">Coordinator Account</span>
              <code className="text-slate-700 font-mono text-[11px]">coordinator@lastmile.demo</code>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-accent-orange block">Volunteer Account</span>
              <code className="text-slate-700 font-mono text-[11px]">volunteer@lastmile.demo</code>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-navy-900 block">Household Account</span>
              <code className="text-slate-700 font-mono text-[11px]">household@lastmile.demo</code>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-navy-950 text-slate-400 py-8 border-t border-navy-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Waves className="w-4 h-4 text-teal-400" />
            <span>LASTMILE Platform</span>
          </div>
          <p className="text-slate-400 text-center sm:text-right">
            Disaster Evacuation Management • Fictional Krishnagiri Demo Dataset • Local Persistence via Browser Storage
          </p>
        </div>
      </footer>
    </div>
  );
}
