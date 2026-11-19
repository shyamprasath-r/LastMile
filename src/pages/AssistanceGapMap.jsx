import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { calculateDapeScore } from "../utils/dapeCalculator";
import L from "leaflet";
import { 
  MapPin, 
  Filter, 
  Info, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle,
  X
} from "lucide-react";

export default function AssistanceGapMap({ onNavigate }) {
  const { households, vehicles, hazardState } = useApp();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [filterType, setFilterType] = useState("ALL");
  const [selectedHousehold, setSelectedHousehold] = useState(null);

  // Krishnagiri Centre Coordinates
  const KRISHNAGIRI_CENTER = [12.5280, 78.2180];

  // Helper to create custom colored circle markers with SVG / Leaflet divIcon
  const createColorIcon = (status, dapeScore) => {
    let color = "#ef4444"; // Red for Unassigned
    let stroke = "#991b1b";

    if (status === "Confirmed") {
      color = "#10b981"; // Green
      stroke = "#065f46";
    } else if (status === "Awaiting Confirmation" || status === "Assigned") {
      color = "#f59e0b"; // Orange
      stroke = "#b45309";
    } else if (status === "Completed") {
      color = "#3b82f6"; // Blue
      stroke = "#1d4ed8";
    }

    const isHighPri = dapeScore >= 70;

    return L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div style="
          position: relative;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          ${isHighPri ? `
            <div style="
              position: absolute;
              width: 38px;
              height: 38px;
              border-radius: 50%;
              background-color: ${color};
              opacity: 0.35;
              animation: pulse-ring 2s infinite ease-in-out;
            "></div>
          ` : ''}
          <div style="
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background-color: ${color};
            border: 2.5px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
            font-weight: bold;
            font-family: sans-serif;
          ">
            ${dapeScore ? Math.min(99, dapeScore) : '!'}
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14]
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: KRISHNAGIRI_CENTER,
        zoom: 14,
        zoomControl: true
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      // Create a layer group for markers
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map alive during tabs or cleanup
    };
  }, []);

  // Update Markers when filter, households, or hazardState change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const filtered = households.filter(h => {
      const dape = calculateDapeScore(h, hazardState, vehicles);
      const isHighPri = dape && dape.totalScore >= 70;

      if (filterType === "ALL") return true;
      if (filterType === "HIGH") return isHighPri;
      if (filterType === "UNASSIGNED") return h.status === "Unassigned";
      if (filterType === "AWAITING") return h.status === "Awaiting Confirmation";
      if (filterType === "CONFIRMED") return h.status === "Confirmed";
      if (filterType === "COMPLETED") return h.status === "Completed";
      return true;
    });

    filtered.forEach(h => {
      const dape = calculateDapeScore(h, hazardState, vehicles);
      const assignedVeh = vehicles.find(v => v.id === h.assignedVehicleId);

      const marker = L.marker([h.lat, h.lng], {
        icon: createColorIcon(h.status, dape?.totalScore)
      });

      marker.on("click", () => {
        setSelectedHousehold({
          ...h,
          dape,
          assignedVehicle: assignedVeh
        });
      });

      markersLayerRef.current.addLayer(marker);
    });
  }, [households, vehicles, hazardState, filterType]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-navy-900 text-white p-6 rounded-2xl border border-navy-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Module C: Spatial Gap GIS
            </span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            Assistance Gap Map (Krishnagiri, Tamil Nadu)
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Interactive geographical visualization of vulnerable households, pinpointing unserved clusters and urgent flood plain evacuees.
          </p>
        </div>

        {/* Legend */}
        <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 flex flex-wrap items-center gap-3 text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-slate-300">Unassigned (Urgent)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-slate-300">Awaiting Conf.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Confirmed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-slate-300">Completed</span>
          </div>
        </div>
      </div>

      {/* Map Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="font-bold text-navy-950 uppercase tracking-wider text-[11px]">
            Map View Filter:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "ALL", label: "All Households", count: households.length },
            { id: "HIGH", label: "High Priority (>=70)", count: households.filter(h => calculateDapeScore(h, hazardState, vehicles)?.totalScore >= 70).length },
            { id: "UNASSIGNED", label: "Unassigned Gaps", count: households.filter(h => h.status === "Unassigned").length },
            { id: "AWAITING", label: "Awaiting Confirmation", count: households.filter(h => h.status === "Awaiting Confirmation").length },
            { id: "CONFIRMED", label: "Confirmed", count: households.filter(h => h.status === "Confirmed").length },
            { id: "COMPLETED", label: "Completed", count: households.filter(h => h.status === "Completed").length }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition text-xs flex items-center gap-1.5 ${
                filterType === f.id
                  ? "bg-navy-900 text-white font-bold shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <span>{f.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterType === f.id ? "bg-teal-500 text-navy-950 font-bold" : "bg-white text-slate-600"
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Box & Floating Inspector Drawer */}
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Leaflet Map Target Div */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-[580px] z-10"
          style={{ minHeight: "500px" }}
        />

        {/* Floating Household Inspector Drawer when marker clicked */}
        {selectedHousehold && (
          <div className="absolute top-4 right-4 z-20 w-84 max-w-[90%] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-5 animate-slide-in">
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {selectedHousehold.id}
                </span>
                <h3 className="font-extrabold text-base text-navy-950 mt-1">
                  {selectedHousehold.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedHousehold(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-slate-900 font-medium truncate max-w-[140px]" title={selectedHousehold.location}>
                  {selectedHousehold.location}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Assistance Type:</span>
                <strong className="text-slate-800">{selectedHousehold.assistanceType}</strong>
              </div>
              <div className="flex justify-between">
                <span>Accessibility Needs:</span>
                <strong className="text-slate-800">{selectedHousehold.accessibilityReq}</strong>
              </div>
              <div className="flex justify-between">
                <span>DAPE Priority:</span>
                <span className="font-black text-red-600">
                  {selectedHousehold.dape?.totalScore} / 100 ({selectedHousehold.dape?.category})
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current Status:</span>
                <span className="font-bold text-teal-700">{selectedHousehold.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Assigned Vehicle:</span>
                <span className="text-slate-800 font-medium truncate max-w-[140px]">
                  {selectedHousehold.assignedVehicle ? selectedHousehold.assignedVehicle.name : "None (Unassigned)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Preferred Language:</span>
                <strong className="text-slate-800">{selectedHousehold.preferredLanguage}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => onNavigate("resources")}
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Match Vehicle Fleet
              </button>
            </div>
          </div>
        )}

        {/* Fictional Coordinates Disclaimer Banner */}
        <div className="absolute bottom-3 left-3 z-20 bg-navy-950/85 backdrop-blur-xs text-white text-[11px] px-3.5 py-1.5 rounded-lg border border-navy-800 shadow-md">
          <span>Krishnagiri Simulated Coordinates • Numbers inside markers show DAPE Score</span>
        </div>
      </div>
    </div>
  );
}
