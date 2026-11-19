import React from "react";

export default function StatCard({ title, value, subtitle, icon: Icon, color = "teal", trend }) {
  const colorMap = {
    teal: "bg-teal-50 text-teal-600 border-teal-200",
    red: "bg-red-50 text-red-600 border-red-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    green: "bg-emerald-50 text-emerald-600 border-emerald-200",
    navy: "bg-navy-50 text-navy-800 border-navy-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200"
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div className="text-2xl font-extrabold text-navy-950 mt-1 tracking-tight">
            {value}
          </div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colorMap[color] || colorMap.teal}`}>
            <Icon className="w-5 h-5 stroke-[2.2]" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 truncate">{subtitle}</span>
          {trend && (
            <span className={`font-semibold shrink-0 ${
              trend.positive ? "text-emerald-600" : "text-amber-600"
            }`}>
              {trend.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
