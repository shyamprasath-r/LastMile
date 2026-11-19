import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Users, 
  MapPin, 
  Phone, 
  HeartHandshake, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck,
  Languages
} from "lucide-react";

export default function HouseholdRegistration({ onNavigate }) {
  const { registerHousehold, currentLanguage } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    emergencyContact: "",
    location: "Ponnaiyar Flood Plain, Krishnagiri",
    peopleCount: 2,
    assistanceType: "Elderly assistance",
    accessibilityReq: "Limited Mobility",
    medicalTransportReq: false,
    preferredLanguage: currentLanguage || "Tamil",
    hazardZone: "High",
    notes: ""
  });

  const [submittedHousehold, setSubmittedHousehold] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.location) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    const created = registerHousehold(formData);
    setSubmittedHousehold(created);
  };

  if (submittedHousehold) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 animate-fade-in">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Household ID: {submittedHousehold.id}
          </span>

          <h2 className="text-2xl font-black text-navy-950 mt-3">
            Registration Submitted
          </h2>
          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Your emergency evacuation assistance request has been received by Krishnagiri Emergency Command. Status: <strong>{submittedHousehold.status}</strong>.
          </p>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Registered Name:</span>
              <strong className="text-navy-950">{submittedHousehold.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Contact Number:</span>
              <strong className="text-navy-950">{submittedHousehold.contact}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Assistance Type:</span>
              <strong className="text-navy-950">{submittedHousehold.assistanceType}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Accessibility:</span>
              <strong className="text-navy-950">{submittedHousehold.accessibilityReq}</strong>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate("household")}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-sm"
            >
              Go to Household Portal
            </button>
            <button
              onClick={() => {
                setSubmittedHousehold(null);
                setFormData({
                  name: "",
                  contact: "",
                  emergencyContact: "",
                  location: "",
                  peopleCount: 1,
                  assistanceType: "Regular transportation",
                  accessibilityReq: "None",
                  medicalTransportReq: false,
                  preferredLanguage: "Tamil",
                  hazardZone: "Moderate",
                  notes: ""
                });
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs transition"
            >
              Register Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      <div className="bg-navy-900 text-white p-6 rounded-2xl border border-navy-800 shadow-xl">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-teal-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
            Self-Registration
          </span>
        </div>
        <h1 className="text-2xl font-black mt-1 tracking-tight">
          Household Evacuation Assistance Request
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          Register elderly, mobility-impaired, or medical transportation needs so the Krishnagiri coordination fleet can prioritize your pickup.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Identity */}
          <div>
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
              1. Household Contact & Location
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Household / Primary Contact Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meenakshi Sundaram"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 94421 55670"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Residential Address / Landmarks in Krishnagiri *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Old Pet River Bend, near Mariamman Temple, Krishnagiri"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Emergency Secondary Contact (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98433 99011"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Preferred SMS & Notice Language
                </label>
                <select
                  value={formData.preferredLanguage}
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                >
                  <option value="Tamil">தமிழ் (Tamil)</option>
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Assistance Requirements */}
          <div>
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
              2. Evacuation Needs & Accessibility
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Number of People Requiring Assistance
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.peopleCount}
                  onChange={(e) => setFormData({ ...formData, peopleCount: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Assistance Type
                </label>
                <select
                  value={formData.assistanceType}
                  onChange={(e) => setFormData({ ...formData, assistanceType: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 font-semibold"
                >
                  <option value="Elderly assistance">Elderly assistance (Seniors living alone)</option>
                  <option value="Wheelchair assistance">Wheelchair assistance (Requires hydraulic lift)</option>
                  <option value="Medical transportation">Medical transportation (Stretcher / Critical condition)</option>
                  <option value="Regular transportation">Regular transportation (Standard evacuees)</option>
                  <option value="Physical assistance">Physical assistance (Visual / Mobility guidance)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Accessibility Constraint
                </label>
                <select
                  value={formData.accessibilityReq}
                  onChange={(e) => setFormData({ ...formData, accessibilityReq: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                >
                  <option value="None">None (Can walk independently)</option>
                  <option value="Limited Mobility">Limited Mobility (Walker / Cane / Slow)</option>
                  <option value="Wheelchair Accessible">Wheelchair Accessible (Cannot stand)</option>
                  <option value="Bedbound/Stretcher">Bedbound / Stretcher required</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Perceived Flood Exposure Zone
                </label>
                <select
                  value={formData.hazardZone}
                  onChange={(e) => setFormData({ ...formData, hazardZone: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                >
                  <option value="High">High Exposure (River basin / water entering compound)</option>
                  <option value="Moderate">Moderate Exposure (Nearby street inundated)</option>
                  <option value="Low">Low Exposure (Surrounding access cut off)</option>
                </select>
              </div>

              {/* Medical Toggle */}
              <div className="sm:col-span-2 p-3 bg-red-50/50 rounded-xl border border-red-200">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.medicalTransportReq}
                    onChange={(e) => setFormData({ ...formData, medicalTransportReq: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded accent-red-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-red-950">
                      Medical Transportation Requirement (Stretcher / Oxygen / Dialysis)
                    </span>
                    <p className="text-[11px] text-red-700 mt-0.5">
                      Check this only if an evacuee requires clinical support or cannot travel in a seated position.
                    </p>
                  </div>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Additional Details / Hazards (Staircases, Pets, Gate Water Level)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 2nd floor verandah stairs, electric wheelchair user alone..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
          >
            <span>Submit Evacuation Assistance Request</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
