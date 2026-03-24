import { T } from "../tokens";

const CUST_ROLES = ["CTO", "CIO", "CISO", "VP of Infrastructure", "VP of Network Engineering", "VP of IT Operations", "VP of Cloud & Platform", "Director of Network Services", "Director of IT Security", "Director of Cloud Operations", "Director of Enterprise Architecture", "Sr. Network Architect", "Sr. Security Architect", "Sr. Cloud Architect", "Network Engineering Manager", "Security Operations Manager", "Cloud Engineering Manager", "IT Operations Manager", "Principal Network Engineer", "Sr. Network Engineer", "Network Engineer", "Security Engineer", "Cloud Engineer", "Systems Engineer", "Infrastructure Engineer", "NOC Manager", "NOC Engineer", "Compliance / Risk Manager", "IT Procurement", "IT Finance / FinOps", "Project Manager", "Program Manager", "Other"];
const GTT_ROLES = ["CEO", "President", "COO", "CTO", "CRO", "SVP of Sales", "SVP of Engineering", "SVP of Product", "VP of Sales", "VP of Solutions Engineering", "VP of Product Management", "VP of Service Delivery", "Regional VP", "Account Director", "Account Manager", "Sr. Account Manager", "Solutions Architect", "Sr. Solutions Architect", "Principal Solutions Architect", "Network Solutions Engineer", "Security Solutions Engineer", "Cloud Solutions Engineer", "Pre-Sales Engineer", "Sr. Pre-Sales Engineer", "Technical Consultant", "Engagement Manager", "Program Manager", "Product Specialist — SD-WAN", "Product Specialist — SASE", "Product Specialist — Cloud", "Service Delivery Manager", "Customer Success Manager", "Other"];

const DOMAIN_DEFS = [
  { id: "executive", label: "Executive Studio", color: T.green, goal: "Align on business drivers, transformation triggers, risk posture, and ambition level",
    scope: "Capture the strategic why behind the transformation — CTO mandate, M&A integration needs, compliance pressure, cost targets. Establish shared understanding of urgency and scope before technical deep-dives.",
    outputs: "Active business drivers, risk register, ambition score, transformation narrative" },
  { id: "estate", label: "Network Estate Studio", color: T.blue, goal: "Unified network estate discovery, current-state assessment, and transformation strategy development",
    scope: "Comprehensive estate analysis merging infrastructure and network domains — site inventory, provider landscape, SD-WAN readiness, CPE lifecycle, managed coverage gaps, opportunity signals, and solution mapping. Single surface for all network transformation planning.",
    outputs: "Estate snapshot, opportunity signals, strategy decisions, solution mapping, lifecycle risk register, session notes & findings" },
  { id: "security", label: "Security Studio", color: T.red, goal: "Evaluate SASE/SSE readiness, map vendor consolidation, advance Zero Trust program",
    scope: "Score 8 SASE components. Build vendor consolidation matrix with retain/replace decisions. Track Zero Trust checklist against board mandate. Identify compliance gaps and audit findings.",
    outputs: "SASE maturity scores, vendor consolidation plan, ZT readiness checklist, security findings" },
  { id: "cloud", label: "Cloud Studio", color: T.violet, goal: "Assess cloud connectivity, track app migration, define on-ramp architecture decisions",
    scope: "Evaluate cloud readiness across 8 dimensions. Map connectivity status for each cloud provider. Track application migration priorities and status. Make decisions on hub topology and edge compute strategy.",
    outputs: "Cloud readiness scores, connectivity assessment, app migration tracker, architecture decisions" },
  { id: "future", label: "Architecture Studio", color: T.teal, goal: "Define target architecture, branch model, operating state, and convergence vision",
    scope: "Translate workshop findings into a coherent target-state vision — converged fabric, standardized branch, unified operations. Bridge between current-state reality and transformation ambition.",
    outputs: "Architecture vision, branch blueprint, operating model, convergence strategy" },
  { id: "value", label: "Value Studio", color: T.slate, goal: "Frame the business case with TCO analysis, value drivers, and key tradeoff decisions",
    scope: "Quantify hard and soft savings. Map implementation tradeoffs (single vendor vs. best-of-breed, phased vs. big-bang). Build executive-ready financial justification.",
    outputs: "TCO/ROI model, tradeoff matrix, business case narrative" },
  { id: "roadmap", label: "Roadmap Studio", color: T.slate, goal: "Sequence the transformation into phased waves with dependencies and risk gates",
    scope: "Organize the work into executable phases. Map critical dependencies (contract dates, staffing, board milestones). Identify sequencing risks and gate criteria.",
    outputs: "Phased rollout plan, dependency map, risk register, milestone timeline" },
  { id: "deliver", label: "Deliverables Studio", color: T.violet, goal: "Track and generate all workshop output artifacts for customer delivery",
    scope: "Monitor deliverable status across the engagement — what's generated, what's in progress, what's pending. Ensure nothing falls through the cracks between workshop and proposal.",
    outputs: "Executive summary, architecture diagrams, BOM, TCO model, proposal deck" },
];

const NET_COLS = [{ key: "device", label: "Device" }, { key: "model", label: "Model" }, { key: "qty", label: "Qty" }, { key: "location", label: "Loc" }, { key: "circuit", label: "Circuit" }, { key: "status", label: "Status" }];
const SEC_COLS = [{ key: "category", label: "Category" }, { key: "vendor", label: "Vendor" }, { key: "product", label: "Product" }, { key: "coverage", label: "Coverage" }, { key: "lifecycle", label: "Lifecycle" }, { key: "priority", label: "Priority" }];
const CLD_COLS = [{ key: "provider", label: "CSP" }, { key: "service", label: "Service" }, { key: "region", label: "Region" }, { key: "connect", label: "Connect" }, { key: "workloads", label: "Wkld" }, { key: "cost", label: "Cost" }, { key: "tier", label: "Tier" }];

const FP = [{ tag: "ARCHITECTURE", title: "Vision", color: T.teal, items: ["Converged fabric", "SD-WAN+SASE overlay", "Zero Trust everywhere", "AIOps-driven operations"] }, { tag: "BRANCH", title: "Target Branch", color: T.blue, items: ["FortiGate+SD-WAN+ZTNA", "Local SaaS breakout", "Wi-Fi 6E + IoT segmentation"] }];
const VP = [{ tag: "TCO", title: "Cost Analysis", color: T.green, items: ["Current $6M/yr", "Year 2: $4.1M", "3yr savings: $4.2M"] }, { tag: "VALUE", title: "Business Drivers", color: T.blue, items: ["$1.4M MPLS savings", "$2.5M breach avoidance", "Site deploy: 90d→5d"] }];
const RoP = [{ tag: "PHASE 1", title: "Q1-Q2 2026 — Foundation", color: T.green, items: ["SD-WAN 8→30 sites", "FortiSASE 2100 users", "FW rule consolidation"] }, { tag: "PHASE 2", title: "Q3-Q4 2026 — Transform", color: T.blue, items: ["SD-WAN 30→85", "MPLS decom 40 sites", "ZT Phase 1"] }, { tag: "PHASE 3", title: "2027 — Complete", color: T.violet, items: ["Full 125 SD-WAN", "MPLS eliminate", "ZT Phase 2 + AIOps"] }];
const DeP = [{ tag: "COMPLETE", title: "Generated", color: T.green, items: ["Executive Summary v1.2", "Current-State Topology", "Vendor & Contract Inventory"] }, { tag: "IN PROGRESS", title: "Building", color: T.amber, items: ["Target Architecture Diagram", "Bill of Materials", "TCO/ROI Model"] }, { tag: "PENDING", title: "Not Started", color: T.td, items: ["ZT Architecture Blueprint", "Cloud Connectivity Design", "Transformation Proposal Deck"] }];

var SCOPE_OPTS = ["Focus Now", "Park", "Out of Scope"];
var FOLLOWUP_OPTS = ["No Follow-Up", "Owner Not Present", "Needs GTT Follow-Up", "Customer Validation Needed", "Schedule Session", "Executive Alignment Needed", "Future Phase"];
function scopeColor(s) { return s === "Focus Now" ? T.green : s === "Park" ? T.amber : T.td; }
function followColor(f) { return f === "No Follow-Up" ? T.td : f === "Owner Not Present" ? T.amber : f === "Schedule Session" ? T.violet : f === "Executive Alignment Needed" ? T.red : T.cyan; }

/* Helper: update item in array by id */
function updArr(arr, id, field, value) {
  return arr.map(function (x) { return x.id === id ? Object.assign({}, x, (function () { var o = {}; o[field] = value; return o; })()) : x; });
}

export { CUST_ROLES, GTT_ROLES, DOMAIN_DEFS, NET_COLS, SEC_COLS, CLD_COLS, FP, VP, RoP, DeP, SCOPE_OPTS, FOLLOWUP_OPTS, scopeColor, followColor, updArr };
