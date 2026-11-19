import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  HeartHandshake, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  FileCheck,
  MapPin,
  Lock
} from "lucide-react";

export default function ProxyRegistration({ onNavigate }) {
  const { proxyRegisterHousehold, currentUser } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    emergencyContact: "",
    location: "",
    peopleCount: 1,
    assistanceType: "Elderly assistance",
    accessibilityReq: "Limited Mobility",
    medicalTransportReq: false,
    preferredLanguage: "Tamil",
    hazardZone: "High",
    notes: "",
    consentGiven: false
  });

  const [submittedProxy, setSubmittedProxy] = useState(null);
  const [consentError, setConsentError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setConsentError(false);

    // Strict consent enforcement
    if (!formData.consentGiven) {
      setConsentError(true);
      return;
    }

    if (!formData.name || !formData.contact || !formData.location) {
      alert("Please fill in the household details.");
      return;
    }

    try {
      const created = proxyRegisterHousehold(formData);
      setSubmittedProxy(created);
    } catch (err) {
      alert(err.message);
    }
  };

  if (submittedProxy) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 animate-fade-in">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-accent-orange flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <HeartHandshake className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Proxy Household ID: {submittedProxy.id}
          </span>

          <h2 className="text-2xl font-black text-navy-950 mt-3">
            Proxy Registration Completed
          </h2>
          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Record created under <strong>Under Verification</strong> status. Coordinator will review volunteer proxy consent and confirm evacuation triage.
          </p>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Registered Household:</span>
              <strong className="text-navy-950">{submittedProxy.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Volunteer Proxy:</span>
              <strong className="text-teal-700">{currentUser?.name || "Community Volunteer"}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Consent Verified:</span>
              <strong className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Explicit Verbal / Written Consent Logged</span>
              </strong>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate("volunteer")}
              className="bg-accent-orange hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-sm"
            >
              Back to Volunteer Portal
            </button>
            <button
              onClick={() => {
                setSubmittedProxy(null);
                setFormData({
                  name: "",
                  contact: "",
                  emergencyContact: "",
                  location: "",
                  peopleCount: 1,
                  assistanceType: "Elderly assistance",
                  accessibilityReq: "Limited Mobility",
                  medicalTransportReq: false,
                  preferredLanguage: "Tamil",
                  hazardZone: "High",
                  notes: "",
                  consentGiven: false
                });
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs transition"
            >
              Submit Another Proxy
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
          <HeartHandshake className="w-5 h-5 text-accent-orange" />
          <span className="text-xs font-bold uppercase tracking-wider text-accent-orange">
            Community Volunteer Proxy Registration
          </span>
        </div>
        <h1 className="text-2xl font-black mt-1 tracking-tight">
          Register Vulnerable Citizen on Behalf
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          For elderly residents, persons with disabilities, or families without smartphone access. Requires affirmative consent before submission.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Volunteer Badge Info */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-center justify-between">
            <span className="font-semibold">
              Authenticated Volunteer: <strong>{currentUser?.name || "K. Ramesh (Community Volunteer)"}</strong>
            </span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-amber-300 font-mono">
              Badge: VOL-TN-401
            </span>
          </div>

          {/* Household Info */}
          <div>
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
              1. Vulnerable Household Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Household / Senior Citizen Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Govindaraj & Chinnammal"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Citizen Mobile Number (or Neighbor Contact) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94440 88712"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Specific Street Location in Krishnagiri *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gandhi Nagar 4th Cross, Near Panchayat Water Tank"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Number of Evacuees
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
                  Preferred Language
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

          {/* Assistance Requirements */}
          <div>
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
              2. Assistance & Accessibility Evaluation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Assistance Type
                </label>
                <select
                  value={formData.assistanceType}
                  onChange={(e) => setFormData({ ...formData, assistanceType: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 font-semibold"
                >
                  <option value="Elderly assistance">Elderly assistance</option>
                  <option value="Wheelchair assistance">Wheelchair assistance</option>
                  <option value="Medical transportation">Medical transportation</option>
                  <option value="Physical assistance">Physical assistance</option>
                  <option value="Regular transportation">Regular transportation</option>
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
                  <option value="Limited Mobility">Limited Mobility (Walker / Cane)</option>
                  <option value="Wheelchair Accessible">Wheelchair Accessible</option>
                  <option value="Bedbound/Stretcher">Bedbound / Stretcher required</option>
                  <option value="None">None</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Field Volunteer Observation Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Confirmed bedbound patient. Neighbor informed that family is isolated..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* CRITICAL CONSENT GATEWAY */}
          <div className={`p-4 rounded-xl border transition ${
            consentError 
              ? "bg-red-50 border-red-400 ring-2 ring-red-400" 
              : formData.consentGiven
              ? "bg-emerald-50 border-emerald-300"
              : "bg-slate-50 border-slate-300"
          }`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.consentGiven}
                onChange={(e) => {
                  setFormData({ ...formData, consentGiven: e.target.checked });
                  if (e.target.checked) setConsentError(false);
                }}
                className="w-5 h-5 text-accent-orange rounded mt-0.5 accent-accent-orange"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-navy-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Mandatory Proxy Consent Acknowledgment *</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  I confirm that I have informed the household and obtained their explicit verbal or written consent to register their personal details and accessibility requirements on LASTMILE for disaster evacuation assistance.
                </p>
                {consentError && (
                  <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Submission is blocked: You must check the consent confirmation box.</span>
                  </p>
                )}
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={!formData.consentGiven}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition shadow-md flex items-center justify-center gap-2 ${
              formData.consentGiven
                ? "bg-accent-orange hover:bg-orange-600 text-white cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <span>Submit Proxy Registration (Under Verification)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
