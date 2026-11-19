# LASTMILE: Hazard-Aware Intelligent Evacuation Readiness & Assistance Coordination Platform

> **Project Tagline:** *"A warning can reach everyone. But can everyone reach safety?"*  
> **Hackathon:** KHacks 4.0 | **Track:** Disaster Management

---

## 🌊 Overview & Core Problem

Traditional early warning systems broadcast uniform alerts via sirens and cellular cell-broadcasts. However, evacuation capability is asymmetric:
- **15–25% of vulnerable households** (bedbound patients, wheelchair users, elderly citizens living alone, single parents without private vehicles) are stranded when roads flood.
- Emergency dispatch queues frequently operate on **uncalibrated first-come, first-served logic**, neglecting imminent surge impact times and specialized equipment constraints.
- Dispatching a standard SUV to a wheelchair user wastes critical hours when the vehicle lacks hydraulic lifts or floor locking anchors.

**LASTMILE** solves this last-mile evacuation dilemma through an **Intelligent Evacuation Readiness Engine (IERE)**, constraint-aware fleet matching, dynamic flood-exposure triage, and accessible multilingual 2-way cellular SMS validation.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 18 with Vite
- **Styling & Design System:** Tailwind CSS (Navy blue `#0b1d3a`, Teal `#0d9488`, Amber `#f59e0b`, Crimson Red `#ef4444`)
- **Icons:** Lucide React
- **Data Visualizations:** Recharts (Dynamic BarCharts, PieCharts, Utilization Meters)
- **GIS Mapping:** Leaflet & OpenStreetMap (Fictional coordinates around Krishnagiri, Tamil Nadu)
- **Storage & State:** `localStorage` persistence with real-time reactivity and instant state resets
- **Internationalization:** English, Tamil (தமிழ்), and Hindi (हिंदी)

---

## 📁 Project Folder Structure

```
s:\LastMile\
├── index.html                           # HTML shell with Google Fonts & Leaflet stylesheets
├── package.json                         # Dependencies & scripts
├── tailwind.config.js                   # Custom emergency ops color palette
├── vite.config.js                       # Vite bundler configuration
├── src/
│   ├── main.jsx                         # React root entry point
│   ├── App.jsx                          # Layout orchestrator, sidebar, routing & toasts
│   ├── index.css                        # Tailwind directives & animation pulse styles
│   ├── data/
│   │   ├── initialDemoData.js           # 20 Krishnagiri households, 5 vehicles, hazard state
│   │   └── translations.js              # Multilingual SMS templates (Tamil, Hindi, English)
│   ├── utils/
│   │   ├── dapeCalculator.js            # 100-Point Dynamic Assistance Priority Engine (DAPE)
│   │   ├── resourceMatcher.js           # Physical accessibility & medical constraint checks
│   │   └── allocationOptimizer.js       # Greedy vehicle capacity optimizer & Before/After stats
│   ├── context/
│   │   └── AppContext.jsx               # Global state, auth, SMS simulator, and storage sync
│   ├── components/
│   │   ├── Navbar.jsx                   # Live status pill, SMS simulator launcher, role switch
│   │   ├── Sidebar.jsx                  # Operations Center navigation & live badge counters
│   │   ├── StatCard.jsx                 # Reusable KPI statistic card
│   │   ├── Toast.jsx                    # Non-blocking event alert toasts
│   │   └── SmsSimulatorModal.jsx        # Interactive feature-phone SMS response simulator
│   └── pages/
│       ├── LandingPage.jsx              # Public landing page with problem statement & CTAs
│       ├── LoginPage.jsx                # One-click demo role authentication
│       ├── CoordinatorDashboard.jsx     # Emergency operations center command dashboard
│       ├── IereCentre.jsx               # Central 6-module IERE innovation center
│       ├── HazardSimulation.jsx         # Flash flood activator & exposure propagator
│       ├── ResourceManagement.jsx       # Vehicle fleet manager & Smart Resource Matcher
│       ├── VehicleAllocationOptimiser.jsx# 20 requests vs 5 vehicles solver with Before/After
│       ├── AssistanceGapMap.jsx         # Leaflet OpenStreetMap of Krishnagiri households
│       ├── AssistanceRequests.jsx       # Request verification queue & duplicate detector
│       ├── MultilingualNotifications.jsx# Regional templates & SMS message log
│       ├── AnalyticsDashboard.jsx       # Recharts status & vehicle utilization metrics
│       ├── HouseholdDashboard.jsx       # Citizen tracking, transit confirmation, withdraw
│       ├── HouseholdRegistration.jsx    # Self-registration with auto-generated ID
│       ├── ProxyRegistration.jsx        # Volunteer proxy registration with mandatory consent
│       ├── VolunteerDashboard.jsx       # Field worker outreach & proxy audit status
│       └── SettingsPage.jsx             # Profile, privacy governance, Reset Demo Data
```

---

## 🔑 Predefined Demo Login Credentials

For live presentation convenience, one-click login buttons are provided on the login page:

| Role | Demo Email | Password | Primary Interface |
| :--- | :--- | :--- | :--- |
| **Emergency Coordinator** | `coordinator@lastmile.demo` | `demo` | Operations Center Command Dashboard |
| **Community Volunteer** | `volunteer@lastmile.demo` | `demo` | Volunteer Proxy Outreach & Verification |
| **Vulnerable Household** | `household@lastmile.demo` | `demo` | Citizen Self-Tracking & SMS Confirmation |

---

## 🧮 Dynamic Assistance Priority Engine (DAPE) Logic

The DAPE scoring algorithm uses a deterministic, rule-based 100-point formula:

$$\mathbf{P = U + M + A + W + R + H + T}$$

| Factor | Factor Code | Maximum Points | Determination Criteria |
| :--- | :---: | :---: | :--- |
| **Assistance Urgency** | $U$ | 20 | Vulnerable cohort type (Wheelchair, Elderly, Medical) scaled by number of evacuees |
| **Medical Requirement** | $M$ | 20 | Stretcher requirement, continuous oxygen, or critical dialysis scheduling |
| **Accessibility Requirement** | $A$ | 15 | Wheelchair lift, heavy-duty floor tie-downs, or bedbound transport |
| **Waiting Duration** | $W$ | 10 | Minutes waiting without vehicle: $\ge180\text{m} \to 10\text{pts}$, $\ge120\text{m} \to 8\text{pts}$, etc. |
| **Resource Availability Gap** | $R$ | 10 | Scarcity of required vehicle types currently free in the Krishnagiri fleet |
| **Hazard Exposure** | $H$ | 15 | Active flood inundation sector proximity ($15\text{pts}$ for High Risk floodplain) |
| **Time-to-Impact** | $T$ | 10 | Simulated flood surge ETA ($<30\text{m} \to 10\text{pts}$, $30-60\text{m} \to 8\text{pts}$) |

### Triage Classification:
- **70 – 100 points:** `High Priority` (Immediate dispatch queue)
- **40 – 69 points:** `Medium Priority` (Scheduled for next fleet cycle)
- **0 – 39 points:** `Lower Priority` (Standard transit / ambulatory)
- **Missing or Unverified:** `Review Required` (Flags for human audit before scoring)

---

## 🔄 End-to-End Live Demonstration Walkthrough

You can perform the complete 22-step live hackathon demonstration in under 5 minutes without manual code changes:

1. **Landing Page:** Open `http://localhost:5173/`, review the problem statement and the tagline.
2. **Citizen Registration:** Click **Household Registration**, submit a request for an elderly resident with mobility needs; note the auto-generated ID (e.g. `HH-1021`).
3. **Volunteer Consent Gateway:** Log in as Volunteer (`volunteer@lastmile.demo`), open **Proxy Registration**, demonstrate that submission is **strictly blocked** until the consent confirmation box is checked.
4. **Coordinator Verification:** Log in as Coordinator (`coordinator@lastmile.demo`), open **Assistance Requests**, detect duplicate records and approve the pending proxy request.
5. **Simulate Flood Scenario:** Navigate to **Hazard Simulation**, activate the flood scenario, adjust severity to *Severe* and time-to-impact to *45 mins*.
6. **IERE Intelligence Center:** Open **IERE Centre**, watch DAPE automatically recalculate scores and elevate flood-plain households into `High Priority`.
7. **Spatial Gap Detection:** Open **Assistance Gap Map**, filter by *Unassigned Gaps* to inspect cluster locations in Krishnagiri.
8. **Smart Resource Matching:** Open **Resource Management**, pick a wheelchair user and run matching; verify ordinary sedans are marked *Incompatible* while wheelchair lift vans receive *Optimal Match*.
9. **Fleet Optimization:** Open **Allocation Optimiser**, click **Run Allocation Optimisation** to see the side-by-side **Before vs After** metrics, then click **Approve Proposed Assignments**.
10. **Simulated Cellular SMS Confirmation:** Click **SMS Simulator** in the top bar, pick household `HH-1008` (Tamil), enter `1` and press send; verify the household status instantly updates to `Confirmed`.
11. **Vehicle No-Show Contingency:** In Resource Management, click **Mark Vehicle Unavailable** on vehicle `VEH-01`; observe immediate fallback re-matching triggers and unassigned re-queueing.
12. **Analytics Audit:** Open **Analytics Dashboard** to see updated Recharts charts, vehicle seat utilization rates, and equipment bottleneck metrics.

---

## ⚡ How to Run the Application Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in any browser.

### 3. Production Build
```bash
npm run build
```
Creates an optimized, production-ready bundle in `./dist`.

---

## 🧪 Real vs. Simulated Capabilities

- **Real & Functional in Prototype:**
  - Full client-side React 18 state management and `localStorage` persistence.
  - Interactive Leaflet OpenStreetMap rendering and marker popups.
  - 100-Point DAPE mathematical triage recalculation upon any state change.
  - Constraint-based greedy vehicle allocation optimizer (Before vs After comparison).
  - Strict mandatory consent gateway for proxy registrations.
  - Vehicle no-show breakdown contingency and fallback re-matching.
  - Interactive feature-phone SMS simulator with Tamil, Hindi, and English templates.
  - Live Recharts data visualizations.
- **Simulated for Hackathon Scope:**
  - River water level gauges and meteorological flood warnings (no expensive telemetry hardware needed).
  - Cellular SMS transmission (simulated internally without paid Twilio/carrier gateways).
  - Vehicle GPS telematics (simulated fixed depots and routes in Krishnagiri).
