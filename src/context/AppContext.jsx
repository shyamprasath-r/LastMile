import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  INITIAL_HOUSEHOLDS, 
  INITIAL_VEHICLES, 
  INITIAL_HAZARD_STATE, 
  DEMO_USERS 
} from "../data/initialDemoData";
import { TRANSLATIONS } from "../data/translations";
import { calculateDapeScore } from "../utils/dapeCalculator";

const AppContext = createContext();

const STORAGE_KEYS = {
  USER: "lastmile_user_v1",
  HOUSEHOLDS: "lastmile_households_v1",
  VEHICLES: "lastmile_vehicles_v1",
  HAZARD: "lastmile_hazard_v1",
  LANGUAGE: "lastmile_lang_v1",
  SMS: "lastmile_sms_v1",
  NOTIFICATIONS: "lastmile_notifs_v1"
};

export function AppProvider({ children }) {
  // Current user auth
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default logged in as Coordinator for easy hackathon demo exploration, or null
    return DEMO_USERS[2]; // Coordinator
  });

  // Households
  const [households, setHouseholds] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HOUSEHOLDS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_HOUSEHOLDS; }
    }
    return INITIAL_HOUSEHOLDS;
  });

  // Vehicles
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_VEHICLES; }
    }
    return INITIAL_VEHICLES;
  });

  // Hazard State
  const [hazardState, setHazardState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HAZARD);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_HAZARD_STATE; }
    }
    return INITIAL_HAZARD_STATE;
  });

  // Language: English | Tamil | Hindi
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || "English";
  });

  // Simulated SMS Log
  const [smsHistory, setSmsHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SMS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: "SMS-101",
        householdId: "HH-1008",
        recipient: "+91 94440 88712",
        recipientName: "Govindaraj (Elderly Shelter)",
        language: "Tamil",
        type: "OUTBOUND",
        content: "வணக்கம்! உங்கள் போக்குவரத்து உதவி ஏற்பாடு (Krishnagiri Community Cruiser) உறுதிப்படுத்துவதற்காக காத்திருக்கிறது. உறுதிப்படுத்த 1 என பதிலளிக்கவும்.",
        timestamp: "2026-11-19T14:10:00Z",
        status: "DELIVERED"
      },
      {
        id: "SMS-102",
        householdId: "HH-1004",
        recipient: "+91 99520 77123",
        recipientName: "Mohammad Ibrahim",
        language: "Hindi",
        type: "INBOUND",
        content: "1",
        timestamp: "2026-11-19T13:45:00Z",
        status: "CONFIRMED"
      }
    ];
  });

  // Notifications Feed
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: "NOTIF-1",
        title: "Flash Flood Scenario Active",
        message: "Ponnaiyar river basin flood stage alert triggered. DAPE recalculation completed.",
        level: "CRITICAL",
        time: "10 mins ago"
      },
      {
        id: "NOTIF-2",
        title: "Transportation Confirmed",
        message: "Household HH-1004 confirmed regular transit with vehicle VEH-03.",
        level: "SUCCESS",
        time: "25 mins ago"
      },
      {
        id: "NOTIF-3",
        title: "Proxy Registration Pending",
        message: "Community volunteer K. Ramesh submitted proxy registration for Dr. K. Senthil Kumar.",
        level: "INFO",
        time: "45 mins ago"
      }
    ];
  });

  // Active Toast notifications
  const [toasts, setToasts] = useState([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HOUSEHOLDS, JSON.stringify(households));
  }, [households]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HAZARD, JSON.stringify(hazardState));
  }, [hazardState]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SMS, JSON.stringify(smsHistory));
  }, [smsHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Toast helper
  const addToast = (title, message, type = "info") => {
    const id = Date.now() + Math.random().toString();
    const newToast = { id, title, message, type };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth
  const login = (email, password) => {
    const found = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );
    if (found) {
      setCurrentUser(found);
      addToast("Signed In Successfully", `Welcome, ${found.name} (${found.role})`, "success");
      return { success: true, user: found };
    }
    return { success: false, message: "Invalid credentials. Use demo accounts provided on the login page." };
  };

  const logout = () => {
    setCurrentUser(null);
    addToast("Logged Out", "You have safely ended your session.", "info");
  };

  const switchRole = (roleName) => {
    const user = DEMO_USERS.find(u => u.role.toLowerCase() === roleName.toLowerCase());
    if (user) {
      setCurrentUser(user);
      addToast("Role Switched", `Now viewing as ${user.name} (${user.role})`, "info");
    }
  };

  // Reset Demo Data
  const resetDemoData = () => {
    setHouseholds(INITIAL_HOUSEHOLDS);
    setVehicles(INITIAL_VEHICLES);
    setHazardState(INITIAL_HAZARD_STATE);
    localStorage.removeItem(STORAGE_KEYS.HOUSEHOLDS);
    localStorage.removeItem(STORAGE_KEYS.VEHICLES);
    localStorage.removeItem(STORAGE_KEYS.HAZARD);
    addToast("Demo Data Reset", "Initial 20 Krishnagiri households & 5 vehicles restored.", "success");
  };

  // Household Registration
  const registerHousehold = (data) => {
    const newId = `HH-${1000 + households.length + 1}`;
    const newHousehold = {
      id: newId,
      name: data.name,
      contact: data.contact,
      emergencyContact: data.emergencyContact || "",
      location: data.location,
      lat: Number(data.lat || 12.5270),
      lng: Number(data.lng || 78.2170),
      peopleCount: Number(data.peopleCount || 1),
      assistanceType: data.assistanceType,
      accessibilityReq: data.accessibilityReq || "None",
      medicalTransportReq: Boolean(data.medicalTransportReq),
      preferredLanguage: data.preferredLanguage || currentLanguage,
      status: "Submitted",
      assignedVehicleId: null,
      waitingDurationMinutes: 1,
      hazardZone: data.hazardZone || "Moderate",
      notes: data.notes || "",
      isProxy: false,
      registeredBy: "Self",
      createdAt: new Date().toISOString()
    };

    setHouseholds(prev => [newHousehold, ...prev]);

    // Add notification
    setNotifications(prev => [
      {
        id: `NOTIF-${Date.now()}`,
        title: "New Household Registration",
        message: `${newHousehold.name} (${newHousehold.id}) submitted an assistance request.`,
        level: "INFO",
        time: "Just now"
      },
      ...prev
    ]);

    addToast("Registration Submitted", `Household ID: ${newId}. Under queue review.`, "success");
    return newHousehold;
  };

  // Proxy Registration for Volunteers
  const proxyRegisterHousehold = (data) => {
    if (!data.consentGiven) {
      throw new Error("Consent confirmation is required for proxy registration.");
    }

    const newId = `HH-${1000 + households.length + 1}`;
    const newHousehold = {
      id: newId,
      name: data.name,
      contact: data.contact,
      emergencyContact: data.emergencyContact || "",
      location: data.location,
      lat: Number(data.lat || 12.5240),
      lng: Number(data.lng || 78.2150),
      peopleCount: Number(data.peopleCount || 1),
      assistanceType: data.assistanceType,
      accessibilityReq: data.accessibilityReq || "None",
      medicalTransportReq: Boolean(data.medicalTransportReq),
      preferredLanguage: data.preferredLanguage || "Tamil",
      status: "Under Verification",
      assignedVehicleId: null,
      waitingDurationMinutes: 5,
      hazardZone: data.hazardZone || "Moderate",
      notes: `${data.notes || ""} [Proxy consent verified by ${currentUser?.name || "Volunteer"}]`,
      isProxy: true,
      registeredBy: currentUser?.name || "Community Volunteer",
      createdAt: new Date().toISOString()
    };

    setHouseholds(prev => [newHousehold, ...prev]);

    setNotifications(prev => [
      {
        id: `NOTIF-${Date.now()}`,
        title: "Proxy Registration (Needs Verification)",
        message: `Volunteer submitted proxy record for ${newHousehold.name} (${newHousehold.id}).`,
        level: "INFO",
        time: "Just now"
      },
      ...prev
    ]);

    addToast("Proxy Record Created", `ID ${newId} saved under 'Under Verification' status.`, "success");
    return newHousehold;
  };

  // Coordinator Request Verification
  const verifyRequest = (householdId, action, reason = "") => {
    setHouseholds(prev => prev.map(hh => {
      if (hh.id !== householdId) return hh;
      if (action === "Approve") {
        return { ...hh, status: "Unassigned" };
      } else if (action === "Reject") {
        return { ...hh, status: "Rejected", rejectReason: reason };
      } else if (action === "Review") {
        return { ...hh, status: "Under Verification", notes: `${hh.notes} [Flagged for Review: ${reason}]` };
      }
      return hh;
    }));

    addToast(
      action === "Approve" ? "Request Approved" : action === "Reject" ? "Request Rejected" : "Flagged For Review",
      `Household ${householdId} status updated to ${action === "Approve" ? "Unassigned" : action}.`,
      action === "Approve" ? "success" : "warning"
    );
  };

  // Hazard Controls
  const toggleHazardScenario = (activate) => {
    setHazardState(prev => ({
      ...prev,
      isActive: activate,
      lastUpdated: new Date().toISOString()
    }));

    if (activate) {
      addToast(
        "Hazard Scenario Activated",
        "Ponnaiyar Flood Inundation active. DAPE dynamic priority scores recalculated.",
        "error"
      );
    } else {
      addToast(
        "Hazard Scenario Deactivated",
        "Normal baseline conditions restored. Scores updated.",
        "info"
      );
    }
  };

  const updateHazardParameters = (updates) => {
    setHazardState(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString()
    }));
    addToast("Hazard Conditions Updated", "Priority engine recalculated exposure and time-to-impact.", "info");
  };

  // Vehicle Assignment & SMS Generation
  const assignVehicleToHousehold = (householdId, vehicleId) => {
    const hh = households.find(h => h.id === householdId);
    const veh = vehicles.find(v => v.id === vehicleId);
    if (!hh || !veh) return;

    // Update household status
    setHouseholds(prev => prev.map(h => {
      if (h.id === householdId) {
        return {
          ...h,
          status: "Awaiting Confirmation",
          assignedVehicleId: vehicleId
        };
      }
      return h;
    }));

    // Update vehicle status
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        const assigned = Array.isArray(v.assignedHouseholdIds) ? [...v.assignedHouseholdIds] : [];
        if (!assigned.includes(householdId)) assigned.push(householdId);
        return {
          ...v,
          status: "Awaiting Confirmation",
          assignedHouseholdIds: assigned
        };
      }
      return v;
    }));

    // Generate simulated SMS in household's preferred language
    const lang = hh.preferredLanguage || "English";
    const t = TRANSLATIONS[lang] || TRANSLATIONS.English;
    let smsText = t.smsTemplates.assignmentProposed
      .replace("{vehicle}", veh.name)
      .replace("{id}", hh.id)
      .replace("{eta}", "25");

    const newSms = {
      id: `SMS-${Date.now()}`,
      householdId: hh.id,
      recipient: hh.contact,
      recipientName: hh.name,
      language: lang,
      type: "OUTBOUND",
      content: smsText,
      timestamp: new Date().toISOString(),
      status: "AWAITING_REPLY"
    };

    setSmsHistory(prev => [newSms, ...prev]);

    addToast(
      "Vehicle Assigned & SMS Dispatched",
      `Vehicle ${veh.name} assigned to ${hh.name}. Simulated SMS sent in ${lang}.`,
      "success"
    );
  };

  // Confirmation Flow (SMS or Manual in Household Dashboard)
  const confirmHouseholdArrangement = (householdId) => {
    const hh = households.find(h => h.id === householdId);
    if (!hh) return;

    setHouseholds(prev => prev.map(h => {
      if (h.id === householdId) {
        return { ...h, status: "Confirmed" };
      }
      return h;
    }));

    // Also update vehicle to confirmed/dispatched
    if (hh.assignedVehicleId) {
      setVehicles(prev => prev.map(v => {
        if (v.id === hh.assignedVehicleId) {
          return { ...v, status: "Confirmed" };
        }
        return v;
      }));
    }

    addToast("Evacuation Confirmed", `Arrangement for ${hh.name} (${householdId}) confirmed.`, "success");
  };

  // Simulated SMS Reply (e.g. entering "1")
  const simulateSmsReply = (householdId, replyText) => {
    const cleanReply = replyText.trim();
    const hh = households.find(h => h.id === householdId);

    // Record inbound SMS
    const inboundSms = {
      id: `SMS-${Date.now()}`,
      householdId,
      recipient: "LASTMILE Coordination Server",
      recipientName: hh ? hh.name : "Household",
      language: hh?.preferredLanguage || "Tamil",
      type: "INBOUND",
      content: cleanReply,
      timestamp: new Date().toISOString(),
      status: cleanReply === "1" ? "CONFIRMED" : "RECEIVED"
    };

    setSmsHistory(prev => [inboundSms, ...prev]);

    if (cleanReply === "1") {
      confirmHouseholdArrangement(householdId);
      addToast("SMS Reply '1' Received", `Household ${householdId} confirmed pickup arrangement via SMS.`, "success");
      return { success: true, message: "Confirmation verified successfully." };
    } else {
      addToast("SMS Received", `Inbound message from ${householdId}: "${cleanReply}"`, "info");
      return { success: false, message: "Reply unrecognized. Reply '1' to confirm." };
    }
  };

  // Complete Request
  const completeHouseholdRequest = (householdId) => {
    setHouseholds(prev => prev.map(h => {
      if (h.id === householdId) {
        return { ...h, status: "Completed" };
      }
      return h;
    }));
    addToast("Evacuation Completed", `Household ${householdId} marked as safely completed.`, "info");
  };

  // Withdraw Request
  const withdrawHouseholdRequest = (householdId) => {
    setHouseholds(prev => prev.map(h => {
      if (h.id === householdId) {
        return { ...h, status: "Withdrawn", assignedVehicleId: null };
      }
      return h;
    }));
    addToast("Request Withdrawn", `Household ${householdId} assistance request withdrawn.`, "warning");
  };

  // Vehicle No-Show & Re-Matching Fallback
  const markVehicleUnavailable = (vehicleId) => {
    const veh = vehicles.find(v => v.id === vehicleId);
    if (!veh) return;

    // Mark vehicle unavailable
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          isAvailable: false,
          status: "Unavailable (Breakdown / Hazard Obstruction)",
          assignedHouseholdIds: []
        };
      }
      return v;
    }));

    // Find households assigned to this vehicle
    const affectedHouseholds = households.filter(h => h.assignedVehicleId === vehicleId);

    // Reset affected households to Unassigned
    setHouseholds(prev => prev.map(h => {
      if (h.assignedVehicleId === vehicleId) {
        return {
          ...h,
          status: "Unassigned",
          assignedVehicleId: null,
          notes: `${h.notes} [ALERT: Assigned vehicle ${veh.name} became unavailable. Fallback re-matching triggered]`
        };
      }
      return h;
    }));

    // Send fallback notifications
    affectedHouseholds.forEach(hh => {
      const lang = hh.preferredLanguage || "English";
      const t = TRANSLATIONS[lang] || TRANSLATIONS.English;
      const alertMsg = t.smsTemplates.vehicleUnavailable.replace("{vehicle}", veh.name);

      setSmsHistory(prev => [
        {
          id: `SMS-${Date.now()}-${hh.id}`,
          householdId: hh.id,
          recipient: hh.contact,
          recipientName: hh.name,
          language: lang,
          type: "OUTBOUND",
          content: alertMsg,
          timestamp: new Date().toISOString(),
          status: "ALERT_SENT"
        },
        ...prev
      ]);
    });

    setNotifications(prev => [
      {
        id: `NOTIF-${Date.now()}`,
        title: "CRITICAL: Vehicle No-Show / Unavailable",
        message: `${veh.name} marked unavailable. ${affectedHouseholds.length} household(s) returned to unassigned queue for immediate re-matching.`,
        level: "CRITICAL",
        time: "Just now"
      },
      ...prev
    ]);

    addToast(
      "Vehicle Marked Unavailable",
      `${veh.name} disabled. ${affectedHouseholds.length} household(s) returned to Unassigned queue for fallback re-matching.`,
      "error"
    );

    return affectedHouseholds;
  };

  // Re-enable Vehicle
  const restoreVehicleAvailability = (vehicleId) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          isAvailable: true,
          status: "Available"
        };
      }
      return v;
    }));
    addToast("Vehicle Restored", `Vehicle ${vehicleId} marked available for coordination.`, "success");
  };

  // Apply Batch Optimiser Proposals
  const applyOptimisationResults = (proposedAssignments) => {
    if (!proposedAssignments || proposedAssignments.length === 0) return;

    setHouseholds(prev => {
      const map = new Map(prev.map(h => [h.id, { ...h }]));
      proposedAssignments.forEach(pa => {
        const hh = map.get(pa.household.id);
        if (hh) {
          hh.status = "Awaiting Confirmation";
          hh.assignedVehicleId = pa.vehicle.id;
        }
      });
      return Array.from(map.values());
    });

    setVehicles(prev => {
      const map = new Map(prev.map(v => [v.id, { ...v }]));
      proposedAssignments.forEach(pa => {
        const v = map.get(pa.vehicle.id);
        if (v) {
          const list = Array.isArray(v.assignedHouseholdIds) ? [...v.assignedHouseholdIds] : [];
          if (!list.includes(pa.household.id)) list.push(pa.household.id);
          v.assignedHouseholdIds = list;
          v.status = "Awaiting Confirmation";
        }
      });
      return Array.from(map.values());
    });

    addToast(
      "Optimization Approved",
      `Successfully allocated ${proposedAssignments.length} households across emergency fleet.`,
      "success"
    );
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      logout,
      switchRole,
      households,
      vehicles,
      hazardState,
      currentLanguage,
      setCurrentLanguage,
      smsHistory,
      notifications,
      toasts,
      addToast,
      removeToast,
      resetDemoData,
      registerHousehold,
      proxyRegisterHousehold,
      verifyRequest,
      toggleHazardScenario,
      updateHazardParameters,
      assignVehicleToHousehold,
      confirmHouseholdArrangement,
      simulateSmsReply,
      completeHouseholdRequest,
      withdrawHouseholdRequest,
      markVehicleUnavailable,
      restoreVehicleAvailability,
      applyOptimisationResults
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
