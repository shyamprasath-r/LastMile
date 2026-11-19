import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import IereCentre from "./pages/IereCentre";
import AssistanceRequests from "./pages/AssistanceRequests";
import HazardSimulation from "./pages/HazardSimulation";
import ResourceManagement from "./pages/ResourceManagement";
import VehicleAllocationOptimiser from "./pages/VehicleAllocationOptimiser";
import AssistanceGapMap from "./pages/AssistanceGapMap";
import MultilingualNotifications from "./pages/MultilingualNotifications";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import HouseholdDashboard from "./pages/HouseholdDashboard";
import HouseholdRegistration from "./pages/HouseholdRegistration";
import ProxyRegistration from "./pages/ProxyRegistration";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import SettingsPage from "./pages/SettingsPage";

function MainApp() {
  const { currentUser } = useApp();
  // Default page: landing if not logged in, or dashboard if coordinator
  const [currentPage, setCurrentPage] = useState("landing");

  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Determine if full-screen page without sidebar (Landing & Login)
  const isFullScreenPage = currentPage === "landing" || currentPage === "login";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Universal Navbar */}
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      {/* Main Layout */}
      {isFullScreenPage ? (
        <main className="flex-1">
          {currentPage === "landing" && <LandingPage onNavigate={handleNavigate} />}
          {currentPage === "login" && <LoginPage onNavigate={handleNavigate} />}
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Authenticated Dashboard Sidebar */}
          <div className="hidden md:block">
            <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
          </div>

          {/* Page View Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
            {currentPage === "dashboard" && <CoordinatorDashboard onNavigate={handleNavigate} />}
            {currentPage === "iere" && <IereCentre onNavigate={handleNavigate} />}
            {currentPage === "requests" && <AssistanceRequests onNavigate={handleNavigate} />}
            {currentPage === "simulation" && <HazardSimulation onNavigate={handleNavigate} />}
            {currentPage === "resources" && <ResourceManagement onNavigate={handleNavigate} />}
            {currentPage === "optimiser" && <VehicleAllocationOptimiser onNavigate={handleNavigate} />}
            {currentPage === "gapMap" && <AssistanceGapMap onNavigate={handleNavigate} />}
            {currentPage === "notifications" && <MultilingualNotifications onNavigate={handleNavigate} />}
            {currentPage === "analytics" && <AnalyticsDashboard onNavigate={handleNavigate} />}
            {currentPage === "household" && <HouseholdDashboard onNavigate={handleNavigate} />}
            {currentPage === "householdRegistration" && <HouseholdRegistration onNavigate={handleNavigate} />}
            {currentPage === "proxyRegistration" && <ProxyRegistration onNavigate={handleNavigate} />}
            {currentPage === "volunteer" && <VolunteerDashboard onNavigate={handleNavigate} />}
            {currentPage === "settings" && <SettingsPage onNavigate={handleNavigate} />}
          </main>
        </div>
      )}

      {/* Global Toast System */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
