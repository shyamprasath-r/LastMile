// LASTMILE Smart Resource Matching Engine
// Strict enforcement of accessibility, medical, and capacity constraints

export function matchResourcesForHousehold(household, vehicles = []) {
  if (!household || !vehicles) return [];

  const requiredPeople = Number(household.peopleCount || 1);
  const requiresWheelchair = household.accessibilityReq === "Wheelchair Accessible" || 
    (household.assistanceType && household.assistanceType.toLowerCase().includes("wheelchair"));
  const requiresMedical = household.medicalTransportReq || 
    household.accessibilityReq === "Bedbound/Stretcher" ||
    (household.assistanceType && household.assistanceType.toLowerCase().includes("medical"));

  return vehicles.map(vehicle => {
    const issues = [];
    let isCompatible = true;
    let matchScore = 100;

    // 1. Availability Check
    if (!vehicle.isAvailable) {
      issues.push("Vehicle is currently marked Unavailable or Dispatched");
      isCompatible = false;
      matchScore -= 50;
    }

    // 2. Wheelchair Accessibility Constraint
    if (requiresWheelchair) {
      if (!vehicle.hasWheelchairLift) {
        issues.push("CRITICAL MISMATCH: Vehicle lacks wheelchair hydraulic lift or tie-down anchors");
        isCompatible = false;
        matchScore = 0;
      } else {
        matchScore += 20;
      }
    } else if (vehicle.hasWheelchairLift && !requiresWheelchair && !requiresMedical) {
      // Don't waste specialized wheelchair van if not needed
      issues.push("Resource Inefficiency: Specialized wheelchair lift van not recommended for standard ambulant evacuee");
      matchScore -= 25;
    }

    // 3. Medical / Stretcher Constraint
    if (requiresMedical) {
      if (!vehicle.hasStretcher) {
        issues.push("CRITICAL MISMATCH: Vehicle lacks certified stretcher mount and emergency oxygen apparatus");
        isCompatible = false;
        matchScore = 0;
      } else {
        matchScore += 25;
      }
    } else if (vehicle.hasStretcher && !requiresMedical) {
      issues.push("Resource Inefficiency: Medical emergency ambulance reserved for acute clinical evacuees");
      matchScore -= 30;
    }

    // 4. Passenger Capacity Constraint
    if (vehicle.capacity < requiredPeople) {
      issues.push(`Capacity Shortage: Vehicle fits ${vehicle.capacity} passenger(s), household has ${requiredPeople}`);
      isCompatible = false;
      matchScore = 0;
    }

    // Match rating
    let matchQuality = "Incompatible";
    if (isCompatible) {
      if (matchScore >= 90) matchQuality = "Optimal Match";
      else if (matchScore >= 60) matchQuality = "Compatible";
      else matchQuality = "Suboptimal Fit";
    }

    return {
      vehicle,
      isCompatible,
      matchQuality,
      matchScore: Math.max(0, matchScore),
      issues,
      explanation: isCompatible 
        ? `Compliant: Capacity (${vehicle.capacity} seats), equipment matches requirements.`
        : issues.join(" | ")
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
