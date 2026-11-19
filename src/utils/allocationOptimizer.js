// LASTMILE Vehicle Allocation Optimiser
// Constraint-based greedy algorithm with accessibility & medical priority weighting

import { calculateDapeScore } from "./dapeCalculator";
import { matchResourcesForHousehold } from "./resourceMatcher";

export function runVehicleAllocationOptimisation(households, vehicles, hazardState) {
  // Deep clone to avoid mutating input state
  const availableVehicles = vehicles
    .filter(v => v.isAvailable)
    .map(v => ({
      ...v,
      remainingCapacity: v.capacity,
      allocatedHouseholdIds: [],
      allocatedHouseholds: []
    }));

  // Filter households that actually need evacuation and are verified/active
  // Only evaluate households not already 'Completed'
  const targetHouseholds = households
    .filter(h => h.status !== "Completed")
    .map(h => {
      const dape = calculateDapeScore(h, hazardState, vehicles);
      return {
        ...h,
        dapeScore: dape ? (dape.totalScore || 0) : 0,
        dapeCategory: dape ? dape.category : "Lower Priority",
        isReviewRequired: dape ? dape.isReviewRequired : false
      };
    })
    // Prioritize: High DAPE priority score first, then longer waiting time
    .sort((a, b) => {
      if (b.dapeScore !== a.dapeScore) {
        return b.dapeScore - a.dapeScore;
      }
      return (b.waitingDurationMinutes || 0) - (a.waitingDurationMinutes || 0);
    });

  const proposedAssignments = [];
  const unassignedRequests = [];
  const accessibilityMismatches = [];

  for (const hh of targetHouseholds) {
    if (hh.isReviewRequired) {
      unassignedRequests.push({
        household: hh,
        reason: "Review Required: Request unverified or missing required fields."
      });
      continue;
    }

    const people = Number(hh.peopleCount || 1);
    const requiresWheelchair = hh.accessibilityReq === "Wheelchair Accessible" || 
      (hh.assistanceType && hh.assistanceType.toLowerCase().includes("wheelchair"));
    const requiresMedical = hh.medicalTransportReq || 
      hh.accessibilityReq === "Bedbound/Stretcher" ||
      (hh.assistanceType && hh.assistanceType.toLowerCase().includes("medical"));

    // Find best compatible vehicle among available vehicles that have enough remaining capacity
    let bestVehicle = null;

    for (const veh of availableVehicles) {
      // Accessibility strict checks
      if (requiresWheelchair && !veh.hasWheelchairLift) continue;
      if (requiresMedical && !veh.hasStretcher) continue;

      // Avoid wasting specialized vehicles on general ambulant requests if specialized requests exist
      if (!requiresWheelchair && veh.hasWheelchairLift) {
        // If there are unassigned wheelchair requests left in the queue, do not steal the wheelchair van
        const remainingWcCount = targetHouseholds.filter(
          other => (other.accessibilityReq === "Wheelchair Accessible") && 
          !proposedAssignments.some(p => p.household.id === other.id) &&
          other.id !== hh.id
        ).length;
        if (remainingWcCount > 0) continue;
      }

      if (!requiresMedical && veh.hasStretcher) {
        // If there are unassigned medical requests left, don't waste medical ambulance
        const remainingMedCount = targetHouseholds.filter(
          other => (other.medicalTransportReq || other.accessibilityReq === "Bedbound/Stretcher") && 
          !proposedAssignments.some(p => p.household.id === other.id) &&
          other.id !== hh.id
        ).length;
        if (remainingMedCount > 0) continue;
      }

      // Capacity check
      if (veh.remainingCapacity >= people) {
        bestVehicle = veh;
        break;
      }
    }

    if (bestVehicle) {
      bestVehicle.remainingCapacity -= people;
      bestVehicle.allocatedHouseholdIds.push(hh.id);
      bestVehicle.allocatedHouseholds.push(hh);

      proposedAssignments.push({
        household: hh,
        vehicle: bestVehicle,
        peopleCount: people,
        assignedAt: new Date().toISOString(),
        etaMinutes: Math.floor(15 + Math.random() * 20),
        status: "Proposed"
      });
    } else {
      // Determine why it could not be allocated
      let reason = "Fleet Capacity Exceeded: All compatible vehicles at maximum capacity.";
      if (requiresWheelchair) {
        const anyWc = vehicles.some(v => v.hasWheelchairLift && v.isAvailable);
        if (!anyWc) {
          reason = "Accessibility Bottleneck: No Wheelchair Accessible Vans currently available in Krishnagiri fleet.";
          accessibilityMismatches.push({
            household: hh,
            issue: "No wheelchair lift van available"
          });
        }
      } else if (requiresMedical) {
        const anyMed = vehicles.some(v => v.hasStretcher && v.isAvailable);
        if (!anyMed) {
          reason = "Medical Resource Bottleneck: No Stretcher / Paramedic Transit available in Krishnagiri fleet.";
          accessibilityMismatches.push({
            household: hh,
            issue: "No stretcher/ambulance unit available"
          });
        }
      }

      unassignedRequests.push({
        household: hh,
        reason
      });
    }
  }

  // Calculate vehicle utilization metrics
  const vehicleUtilisation = availableVehicles.map(veh => {
    const usedCapacity = veh.capacity - veh.remainingCapacity;
    const percentage = Math.round((usedCapacity / veh.capacity) * 100);
    return {
      vehicleId: veh.id,
      name: veh.name,
      type: veh.type,
      capacity: veh.capacity,
      usedCapacity,
      percentage,
      allocatedCount: veh.allocatedHouseholdIds.length
    };
  });

  const totalSeats = availableVehicles.reduce((sum, v) => sum + v.capacity, 0);
  const totalAllocatedSeats = availableVehicles.reduce((sum, v) => sum + (v.capacity - v.remainingCapacity), 0);
  const overallUtilisationRate = totalSeats > 0 ? Math.round((totalAllocatedSeats / totalSeats) * 100) : 0;

  // Calculate Before vs After Stats
  const beforeStats = {
    totalRequests: targetHouseholds.length,
    assignedOrConfirmed: households.filter(h => ["Assigned", "Awaiting Confirmation", "Confirmed"].includes(h.status)).length,
    unassigned: households.filter(h => ["Unassigned", "Submitted", "Under Verification"].includes(h.status)).length,
    highPriorityPending: households.filter(h => {
      const d = calculateDapeScore(h, hazardState, vehicles);
      return d && d.totalScore >= 70 && !["Assigned", "Awaiting Confirmation", "Confirmed", "Completed"].includes(h.status);
    }).length,
    utilizationRate: 25 // Baseline
  };

  const afterStats = {
    totalRequests: targetHouseholds.length,
    assignedOrProposed: proposedAssignments.length,
    unassigned: unassignedRequests.length,
    highPriorityPending: unassignedRequests.filter(u => u.household.dapeScore >= 70).length,
    utilizationRate: overallUtilisationRate,
    accessibilityMismatches: accessibilityMismatches.length
  };

  return {
    proposedAssignments,
    unassignedRequests,
    accessibilityMismatches,
    vehicleUtilisation,
    overallUtilisationRate,
    beforeStats,
    afterStats
  };
}
