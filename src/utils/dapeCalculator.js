// Dynamic Assistance Priority Engine (DAPE) - Rule-Based 100-Point Formula
// P = U + M + A + W + R + H + T

export function calculateDapeScore(household, hazardState = null, vehicles = []) {
  if (!household) return null;

  // Check if incomplete or unverified
  if (!household.name || !household.location || household.status === "Under Verification" || !household.assistanceType) {
    return {
      householdId: household.id,
      householdName: household.name,
      totalScore: null,
      category: "Review Required",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      isReviewRequired: true,
      explanation: "Request requires verification or is missing vital field data before priority scoring can be approved.",
      factors: {
        urgency: { score: 0, max: 20, label: "Assistance Urgency" },
        medical: { score: 0, max: 20, label: "Medical Requirement" },
        accessibility: { score: 0, max: 15, label: "Accessibility Requirement" },
        waiting: { score: 0, max: 10, label: "Waiting Duration" },
        resourceGap: { score: 0, max: 10, label: "Resource Availability Gap" },
        hazardExposure: { score: 0, max: 15, label: "Hazard Exposure" },
        timeToImpact: { score: 0, max: 10, label: "Time-to-Impact" }
      }
    };
  }

  // 1. Assistance Urgency (U: Max 20)
  let uScore = 0;
  const assistType = (household.assistanceType || "").toLowerCase();
  const peopleCount = Number(household.peopleCount || 1);

  if (assistType.includes("wheelchair")) {
    uScore = 16;
  } else if (assistType.includes("medical")) {
    uScore = 18;
  } else if (assistType.includes("elderly")) {
    uScore = 15;
  } else if (assistType.includes("physical")) {
    uScore = 14;
  } else {
    uScore = 8;
  }
  // People needing evacuation adjustment (up to +4 capped at 20)
  if (peopleCount >= 3) {
    uScore += 3;
  } else if (peopleCount === 2) {
    uScore += 1;
  }
  uScore = Math.min(20, uScore);

  // 2. Medical Requirement (M: Max 20)
  let mScore = 0;
  if (household.medicalTransportReq) {
    mScore = 20; // Critical ambulance/stretcher/dialysis/oxygen dependency
  } else if (assistType.includes("medical")) {
    mScore = 16;
  } else if (household.accessibilityReq === "Bedbound/Stretcher") {
    mScore = 18;
  } else if (household.accessibilityReq === "Limited Mobility") {
    mScore = 6;
  } else {
    mScore = 0;
  }
  mScore = Math.min(20, mScore);

  // 3. Accessibility Requirement (A: Max 15)
  let aScore = 0;
  const accessReq = household.accessibilityReq || "";
  if (accessReq === "Wheelchair Accessible") {
    aScore = 15;
  } else if (accessReq === "Bedbound/Stretcher") {
    aScore = 15;
  } else if (accessReq === "Limited Mobility") {
    aScore = 10;
  } else if (assistType.includes("physical")) {
    aScore = 8;
  } else {
    aScore = 0;
  }
  aScore = Math.min(15, aScore);

  // 4. Waiting Duration (W: Max 10)
  let wScore = 0;
  const waitMins = Number(household.waitingDurationMinutes || 0);
  if (waitMins >= 180) {
    wScore = 10;
  } else if (waitMins >= 120) {
    wScore = 8;
  } else if (waitMins >= 60) {
    wScore = 5;
  } else if (waitMins >= 30) {
    wScore = 3;
  } else {
    wScore = 1;
  }
  wScore = Math.min(10, wScore);

  // 5. Resource Availability Gap (R: Max 10)
  // Evaluates scarcity of matching fleet vehicles
  let rScore = 4; // Baseline
  if (vehicles && vehicles.length > 0) {
    if (household.accessibilityReq === "Wheelchair Accessible") {
      const availWc = vehicles.filter(v => v.isAvailable && v.hasWheelchairLift).length;
      rScore = availWc === 0 ? 10 : availWc === 1 ? 8 : 4;
    } else if (household.medicalTransportReq || household.accessibilityReq === "Bedbound/Stretcher") {
      const availMed = vehicles.filter(v => v.isAvailable && v.hasStretcher).length;
      rScore = availMed === 0 ? 10 : availMed === 1 ? 8 : 4;
    } else {
      const availReg = vehicles.filter(v => v.isAvailable && !v.hasWheelchairLift && !v.hasStretcher).length;
      rScore = availReg === 0 ? 8 : availReg <= 2 ? 5 : 2;
    }
  } else {
    // Default based on type
    if (household.accessibilityReq === "Wheelchair Accessible" || household.medicalTransportReq) {
      rScore = 9;
    } else {
      rScore = 3;
    }
  }
  rScore = Math.min(10, rScore);

  // 6. Hazard Exposure (H: Max 15)
  let hScore = 3; // Baseline dry / low risk
  const isFloodActive = hazardState ? hazardState.isActive : true;
  const zone = household.hazardZone || "Moderate";

  if (isFloodActive) {
    if (zone === "High") {
      hScore = 15; // Directly in flood inundation path
    } else if (zone === "Moderate") {
      hScore = 10; // Rapid runoff / rising perimeter
    } else {
      hScore = 5; // Elevated ground / secondary impact
    }
  } else {
    // Normal / inactive condition
    hScore = zone === "High" ? 6 : zone === "Moderate" ? 3 : 1;
  }
  hScore = Math.min(15, hScore);

  // 7. Time-to-Impact (T: Max 10)
  let tScore = 0;
  if (isFloodActive && hazardState) {
    const tti = Number(hazardState.timeToImpactMinutes || 60);
    if (tti <= 30) {
      tScore = 10; // Immediate danger (<30 mins)
    } else if (tti <= 60) {
      tScore = 8;  // Imminent danger (30-60 mins)
    } else if (tti <= 120) {
      tScore = 5;  // Developing hazard (1-2 hours)
    } else {
      tScore = 2;
    }
    // High zone gets full weight
    if (zone !== "High" && tScore > 2) {
      tScore = Math.max(2, tScore - 2);
    }
  } else {
    tScore = 1;
  }
  tScore = Math.min(10, tScore);

  // Total Score: P = U + M + A + W + R + H + T
  const totalScore = Math.min(100, uScore + mScore + aScore + wScore + rScore + hScore + tScore);

  // Categories:
  // 70–100: High Priority
  // 40–69: Medium Priority
  // 0–39: Lower Priority
  let category = "Lower Priority";
  let badgeColor = "bg-slate-100 text-slate-800 border-slate-300";

  if (totalScore >= 70) {
    category = "High Priority";
    badgeColor = "bg-red-50 text-red-700 border-red-200";
  } else if (totalScore >= 40) {
    category = "Medium Priority";
    badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
  } else {
    category = "Lower Priority";
    badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  // Explanation generator
  const reasons = [];
  if (mScore >= 16) reasons.push("Urgent medical/stretcher care required");
  if (aScore >= 12) reasons.push("Wheelchair accessible vehicle required");
  if (hScore >= 12) reasons.push("Directly in high-risk inundation zone");
  if (wScore >= 8) reasons.push(`Extended wait time (${waitMins} min)`);
  if (tScore >= 8) reasons.push("Hazard impact imminent (<60 mins)");
  if (rScore >= 8) reasons.push("Acute local scarcity of suitable vehicle type");

  const explanation = reasons.length > 0 
    ? reasons.join("; ") + "."
    : "Standard priority baseline based on general transportation requirements.";

  return {
    householdId: household.id,
    householdName: household.name,
    totalScore,
    category,
    badgeColor,
    isReviewRequired: false,
    explanation,
    factors: {
      urgency: { score: uScore, max: 20, label: "Assistance Urgency" },
      medical: { score: mScore, max: 20, label: "Medical Requirement" },
      accessibility: { score: aScore, max: 15, label: "Accessibility Requirement" },
      waiting: { score: wScore, max: 10, label: "Waiting Duration" },
      resourceGap: { score: rScore, max: 10, label: "Resource Availability Gap" },
      hazardExposure: { score: hScore, max: 15, label: "Hazard Exposure" },
      timeToImpact: { score: tScore, max: 10, label: "Time-to-Impact" }
    }
  };
}
