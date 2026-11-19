import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/translations";
import { 
  Bell, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Languages, 
  Phone, 
  Smartphone, 
  ShieldAlert,
  ArrowRight,
  Info
} from "lucide-react";
import SmsSimulatorModal from "../components/SmsSimulatorModal";

export default function MultilingualNotifications() {
  const { 
    currentLanguage, 
    setCurrentLanguage, 
    smsHistory, 
    simulateSmsReply, 
    households,
    notifications 
  } = useApp();

  const [isSmsOpen, setIsSmsOpen] = useState(false);
  const [selectedHhId, setSelectedHhId] = useState(households[0]?.id || "HH-1001");
  const [customReply, setCustomReply] = useState("1");
  const [activeTab, setActiveTab] = useState("templates"); // 'templates' | 'feed' | 'smsLogs'

  const activeTranslation = TRANSLATIONS[currentLanguage] || TRANSLATIONS.English;
  const activeHh = households.find(h => h.id === selectedHhId) || households[0];

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!selectedHhId || !customReply.trim()) return;
    simulateSmsReply(selectedHhId, customReply);
    setCustomReply("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-navy-900 text-white p-6 rounded-2xl border border-navy-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Low-Tech Communications
            </span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            Multilingual Notification System & SMS Simulator
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Simulated 2-way cellular messaging supporting English, Tamil (தமிழ்), and Hindi (हिंदी). Allows rural citizens to confirm evacuation with a simple "1" reply.
          </p>
        </div>

        {/* Language Tabs & Launch Simulator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-navy-950 p-1 rounded-xl border border-navy-800">
            {["English", "Tamil", "Hindi"].map(lang => (
              <button
                key={lang}
                onClick={() => setCurrentLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  currentLanguage === lang
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {lang === "English" ? "English" : lang === "Tamil" ? "தமிழ் (Tamil)" : "हिंदी (Hindi)"}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsSmsOpen(true)}
            className="bg-accent-orange hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm shrink-0"
          >
            <Smartphone className="w-4 h-4" />
            <span>Interactive Phone UI</span>
          </button>
        </div>
      </div>

      {/* Interactive SMS Simulator Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-base text-navy-950 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span>Simulate Cellular 2-Way SMS Response</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a household and type "1" to simulate an evacuee confirming transport on basic feature phones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Household:</span>
            <select
              value={selectedHhId}
              onChange={(e) => setSelectedHhId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {households.map(h => (
                <option key={h.id} value={h.id}>
                  {h.id} - {h.name} [{h.status}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Simulation Playground */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Outbound Notice Display */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Simulated Dispatch Alert Sent to Evacuee ({activeHh?.contact}):
            </span>
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs text-slate-800 leading-relaxed font-mono">
              {activeTranslation.smsTemplates.assignmentProposed
                .replace("{vehicle}", "CareVan Accessible Express (TN-24-AX-5510)")
                .replace("{id}", activeHh?.id || "HH-1001")
                .replace("{eta}", "20")}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 italic">
              Template rendered in <strong>{currentLanguage}</strong> according to household preference.
            </p>
          </div>

          {/* Interactive Inbound Response Simulator */}
          <div className="bg-teal-50/50 rounded-xl p-4 border border-teal-200 text-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-teal-900 uppercase tracking-wider block mb-1">
                Citizen SMS Inbound Reply Simulator:
              </span>
              <p className="text-slate-600 mb-3">
                When the evacuee texts back <strong>1</strong>, the system marks the status as <strong>Confirmed</strong> in real time.
              </p>
            </div>

            <form onSubmit={handleSendReply} className="flex gap-2">
              <input
                type="text"
                value={customReply}
                onChange={(e) => setCustomReply(e.target.value)}
                placeholder="Type '1' to confirm or '9' to cancel..."
                className="flex-1 text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simulate Reply</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Multilingual Notification Templates Catalog */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
          <div>
            <h3 className="font-bold text-base text-navy-950">
              Emergency Broadcast & Notification Templates ({currentLanguage})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Standardized disaster coordination messages translated into regional languages.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(activeTranslation.smsTemplates).map(([key, template]) => (
            <div key={key} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block mb-1">
                  Trigger: {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <p className="text-slate-800 leading-relaxed font-mono bg-white p-3 rounded-lg border border-slate-100 shadow-2xs mt-2">
                  {template}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                <span>Audience: Evacuees</span>
                <span className="text-emerald-700 font-bold">Standard SMS</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Historical SMS Message Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-navy-950">
              Simulated Cellular Dispatch & Reply Logs ({smsHistory.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete audit trail of all automated outgoing notifications and simulated inbound citizen replies.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Recipient / Sender</th>
                <th className="py-3 px-4">Message Content</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4 text-right">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {smsHistory.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                      s.type === "INBOUND" 
                        ? "bg-teal-100 text-teal-800 border border-teal-200" 
                        : "bg-navy-900 text-white"
                    }`}>
                      {s.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-navy-950">{s.recipientName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{s.recipient}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-md font-mono text-[11px]">
                    {s.content}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-600">
                    {s.language}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-teal-700 text-[11px]">
                    {s.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SmsSimulatorModal isOpen={isSmsOpen} onClose={() => setIsSmsOpen(false)} />
    </div>
  );
}
