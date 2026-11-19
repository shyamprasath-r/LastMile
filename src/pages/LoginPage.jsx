import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { DEMO_USERS } from "../data/initialDemoData";
import { Waves, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Home, Compass } from "lucide-react";

export default function LoginPage({ onNavigate }) {
  const { login } = useApp();
  const [email, setEmail] = useState("coordinator@lastmile.demo");
  const [password, setPassword] = useState("demo");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e?.preventDefault();
    setErrorMessage("");
    const result = login(email, password);
    if (result.success) {
      if (result.user.role === "Household") {
        onNavigate("household");
      } else if (result.user.role === "Community Volunteer") {
        onNavigate("volunteer");
      } else {
        onNavigate("dashboard");
      }
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleQuickLogin = (demoUser) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    const result = login(demoUser.email, demoUser.password);
    if (result.success) {
      if (demoUser.role === "Household") {
        onNavigate("household");
      } else if (demoUser.role === "Community Volunteer") {
        onNavigate("volunteer");
      } else {
        onNavigate("dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-teal-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div 
          onClick={() => onNavigate("landing")} 
          className="cursor-pointer mx-auto w-14 h-14 rounded-2xl bg-navy-950 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-xl"
        >
          <Waves className="w-8 h-8 stroke-[2.2]" />
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">
          LASTMILE
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Emergency Operations Command & Assistance Access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-10">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <span className="font-semibold">{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Demo Account Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="name@lastmile.demo"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="demo"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400 text-right">
                Default demo password: <strong className="text-slate-600 font-mono">demo</strong>
              </p>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition"
            >
              <span>Authenticate Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">
              One-Click Role Demonstration:
            </div>
            <div className="space-y-2">
              {DEMO_USERS.map((user) => {
                let badge = "bg-teal-50 text-teal-700 border-teal-200";
                let Icon = Compass;

                if (user.role === "Community Volunteer") {
                  badge = "bg-amber-50 text-amber-700 border-amber-200";
                  Icon = UserCheck;
                } else if (user.role === "Household") {
                  badge = "bg-slate-100 text-slate-700 border-slate-200";
                  Icon = Home;
                }

                return (
                  <button
                    key={user.role}
                    type="button"
                    onClick={() => handleQuickLogin(user)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition text-left text-xs group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg border ${badge}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 group-hover:text-teal-700">
                          {user.role}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-teal-600 group-hover:translate-x-0.5 transition">
                      Sign in →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
