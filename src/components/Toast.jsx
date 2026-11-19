import React from "react";
import { useApp } from "../context/AppContext";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        let bg = "bg-white border-slate-200 text-slate-800";
        let icon = <Info className="w-5 h-5 text-teal-600 flex-shrink-0" />;

        if (toast.type === "success") {
          bg = "bg-white border-emerald-300 text-emerald-950 shadow-emerald-50";
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
        } else if (toast.type === "error") {
          bg = "bg-white border-red-300 text-red-950 shadow-red-50";
          icon = <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
        } else if (toast.type === "warning") {
          bg = "bg-white border-amber-300 text-amber-950 shadow-amber-50";
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl transition-all duration-300 animate-slide-in ${bg}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{toast.title}</div>
              <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
