/* ═══════════════════════════════════════
   Initial Workshop Data
   Single source of truth for all domains
   ═══════════════════════════════════════ */

export const INIT_SITES = [
  { id: 1, region: 'Northeast', type: 'Branch', count: 34, states: 'CT, MA, NY, NJ, PA', circuit: 'MPLS', bandwidth: '100 Mbps', provider: 'AT&T', notes: 'SD-WAN pilot — 8 live' },
  { id: 2, region: 'Southeast', type: 'Branch', count: 28, states: 'FL, GA, NC, SC, VA', circuit: 'MPLS', bandwidth: '100 Mbps', provider: 'AT&T', notes: '3 sites packet loss' },
  { id: 3, region: 'Midwest', type: 'Branch', count: 22, states: 'IL, OH, MI, IN, WI', circuit: 'MPLS', bandwidth: '50 Mbps', provider: 'AT&T', notes: '6 rural frame relay' },
  { id: 4, region: 'West', type: 'Branch', count: 19, states: 'CA, WA, OR, CO, AZ', circuit: 'MPLS+DIA', bandwidth: '100 Mbps', provider: 'AT&T/Comcast', notes: '' },
  { id: 5, region: 'Canada', type: 'Branch', count: 22, states: 'ON, BC, AB', circuit: 'MPLS', bandwidth: '50 Mbps', provider: 'AT&T/Bell', notes: 'Cross-border latency' },
  { id: 6, region: 'Pinnacle Insurance', type: 'Acquired', count: 38, states: 'Multi-state', circuit: 'MPLS', bandwidth: '50 Mbps', provider: 'CenturyLink', notes: 'Separate Cisco ASA' },
  { id: 7, region: 'NorthStar Wealth', type: 'Acquired', count: 12, states: 'NE US', circuit: 'Broadband', bandwidth: '200 Mbps', provider: 'Comcast', notes: 'Greenfield, not on WAN' },
  { id: 8, region: 'Dallas DC', type: 'Data Center', count: 1, states: 'TX', circuit: 'DIA', bandwidth: '10 Gbps', provider: 'Zayo', notes: 'Primary DC' },
  { id: 9, region: 'Ashburn DC', type: 'Data Center', count: 1, states: 'VA', circuit: 'DIA', bandwidth: '10 Gbps', provider: 'Zayo', notes: 'Cloud on-ramp' },
  { id: 10, region: 'Phoenix DR', type: 'DR Site', count: 1, states: 'AZ', circuit: 'DIA', bandwidth: '1 Gbps', provider: 'CenturyLink', notes: 'DR only' },
];

export const INIT_PROVIDERS = [
  { id: 1, name: 'AT&T', type: 'MPLS', sites: 87, cost: '$2.1M/yr', expiry: 'Dec 2026', action: 'Non-Renew' },
  { id: 2, name: 'Comcast', type: 'DIA/Broadband', sites: 42, cost: '$680K/yr', expiry: 'M2M', action: 'Retain & Expand' },
  { id: 3, name: 'CenturyLink', type: 'MPLS (Pinnacle)', sites: 38, cost: '$280K/yr', expiry: 'Active', action: 'Early Terminate' },
  { id: 4, name: 'Zayo', type: 'Backbone', sites: 2, cost: '$340K/yr', expiry: '2027', action: 'Retain' },
  { id: 5, name: 'Verizon', type: 'LTE Backup', sites: 35, cost: '$95K/yr', expiry: 'Annual', action: 'Expand' },
  { id: 6, name: 'T-Mobile', type: 'LTE Backup', sites: 22, cost: '$68K/yr', expiry: 'Annual', action: 'Evaluate' },
];

export const INIT_NET_ELEMENTS = [
  { id: 1, device: 'Router', model: 'Cisco ISR 4331', qty: 87, location: 'US Branches', circuit: 'MPLS', provider: 'AT&T', status: 'Active' },
  { id: 2, device: 'SD-WAN', model: 'FortiGate 60F', qty: 8, location: 'NE Pilot', circuit: 'BB+LTE', provider: 'Comcast', status: 'Pilot' },
  { id: 3, device: 'Firewall', model: 'Cisco ASA 5506', qty: 38, location: 'Pinnacle', circuit: 'MPLS', provider: 'CenturyLink', status: 'EOL' },
  { id: 4, device: 'Switch', model: 'Cisco 2960X', qty: 125, location: 'All Sites', circuit: '-', provider: '-', status: 'Active' },
  { id: 5, device: 'Wireless AP', model: 'Cisco Aironet', qty: 340, location: 'All Sites', circuit: '-', provider: '-', status: 'Aging' },
];

export const INIT_SEC_TOOLS = [
  { id: 1, category: 'Firewall', vendor: 'Fortinet', product: 'FortiGate 100F', coverage: '48%', lifecycle: 'Current', priority: 'High' },
  { id: 2, category: 'Firewall', vendor: 'Cisco', product: 'ASA 5506-X', coverage: '30%', lifecycle: 'End of Support', priority: 'Critical' },
  { id: 3, category: 'SWG', vendor: 'Zscaler', product: 'ZIA', coverage: '12%', lifecycle: 'Current', priority: 'High' },
  { id: 4, category: 'EDR', vendor: 'CrowdStrike', product: 'Falcon', coverage: '85%', lifecycle: 'Current', priority: 'Medium' },
  { id: 5, category: 'SIEM', vendor: 'Splunk', product: 'Enterprise', coverage: '60%', lifecycle: 'Current', priority: 'Medium' },
];

export const INIT_CLOUD_RESOURCES = [
  { id: 1, provider: 'AWS', service: 'EC2/EKS', region: 'us-east-1', connect: 'Direct Connect', workloads: 72, cost: '$86K/mo', tier: 'Production' },
  { id: 2, provider: 'AWS', service: 'S3/EBS', region: 'us-west-2', connect: 'Direct Connect', workloads: 48, cost: '$34K/mo', tier: 'Production' },
  { id: 3, provider: 'Azure', service: 'VMs', region: 'East US', connect: 'ExpressRoute', workloads: 28, cost: '$42K/mo', tier: 'Production' },
  { id: 4, provider: 'Azure', service: 'M365', region: 'Global', connect: 'Internet', workloads: 17, cost: '$28K/mo', tier: 'Production' },
  { id: 5, provider: 'GCP', service: 'Vertex AI', region: 'us-central1', connect: 'VPN', workloads: 4, cost: '$18K/mo', tier: 'Dev/Test' },
];

export const CUSTOMER_ROLES = [
  'CTO', 'CIO', 'CISO', 'VP of Infrastructure', 'VP of Network Engineering',
  'VP of IT Operations', 'VP of Cloud & Platform', 'Director of Network Services',
  'Director of IT Security', 'Director of Cloud Operations', 'Director of Enterprise Architecture',
  'Sr. Network Architect', 'Sr. Security Architect', 'Sr. Cloud Architect',
  'Network Engineering Manager', 'Security Operations Manager', 'Cloud Engineering Manager',
  'IT Operations Manager', 'Principal Network Engineer', 'Sr. Network Engineer',
  'Network Engineer', 'Security Engineer', 'Cloud Engineer', 'Systems Engineer',
  'Infrastructure Engineer', 'NOC Manager', 'NOC Engineer', 'Compliance / Risk Manager',
  'IT Procurement', 'IT Finance / FinOps', 'Project Manager', 'Program Manager', 'Other',
];

export const GTT_ROLES = [
  'CEO', 'President', 'COO', 'CTO', 'CRO', 'SVP of Sales', 'SVP of Engineering',
  'SVP of Product', 'VP of Sales', 'VP of Solutions Engineering', 'VP of Product Management',
  'VP of Service Delivery', 'Regional VP', 'Account Director', 'Account Manager',
  'Sr. Account Manager', 'Solutions Architect', 'Sr. Solutions Architect',
  'Principal Solutions Architect', 'Network Solutions Engineer', 'Security Solutions Engineer',
  'Cloud Solutions Engineer', 'Pre-Sales Engineer', 'Sr. Pre-Sales Engineer',
  'Technical Consultant', 'Engagement Manager', 'Program Manager',
  'Product Specialist — SD-WAN', 'Product Specialist — SASE', 'Product Specialist — Cloud',
  'Service Delivery Manager', 'Customer Success Manager', 'Other',
];

export const INIT_CUSTOMER_ATTENDEES = [
  { id: 1, name: 'Sarah Chen', role: 'CTO', email: 's.chen@meridianfg.com', focus: 'Executive sponsor, cloud-first mandate', present: true },
  { id: 2, name: 'Marcus Williams', role: 'VP of Network Engineering', email: 'm.williams@meridianfg.com', focus: 'WAN strategy, SD-WAN pilot lead', present: true },
  { id: 3, name: 'Jennifer Park', role: 'Director of IT Security', email: 'j.park@meridianfg.com', focus: 'Zero Trust program, SASE evaluation', present: true },
  { id: 4, name: 'David Rodriguez', role: 'Sr. Network Architect', email: 'd.rodriguez@meridianfg.com', focus: 'Branch design, CPE standards', present: true },
  { id: 5, name: 'Lisa Thompson', role: 'Network Engineering Manager', email: 'l.thompson@meridianfg.com', focus: 'Pinnacle integration, site migrations', present: true },
  { id: 6, name: 'James Kim', role: 'Sr. Cloud Architect', email: 'j.kim@meridianfg.com', focus: 'AWS/Azure connectivity, app migration', present: false },
  { id: 7, name: 'Amanda Foster', role: 'Network Engineer', email: 'a.foster@meridianfg.com', focus: 'SD-WAN pilot operations, monitoring', present: true },
  { id: 8, name: 'Robert Chen', role: 'IT Procurement', email: 'r.chen@meridianfg.com', focus: 'Contract negotiations, vendor management', present: false },
];

export const INIT_GTT_ATTENDEES = [
  { id: 1, name: 'Michael Barrett', role: 'Account Director', email: 'm.barrett@gtt.net', focus: 'Engagement lead, executive relationship', present: true },
  { id: 2, name: 'Karen Nguyen', role: 'Sr. Solutions Architect', email: 'k.nguyen@gtt.net', focus: 'Network design, SD-WAN architecture', present: true },
  { id: 3, name: 'Tom Bradley', role: 'Security Solutions Engineer', email: 't.bradley@gtt.net', focus: 'SASE/SSE design, ZT advisory', present: true },
  { id: 4, name: 'Rachel Patel', role: 'Cloud Solutions Engineer', email: 'r.patel@gtt.net', focus: 'Cloud connectivity, multi-cloud design', present: true },
  { id: 5, name: 'Steve Morrison', role: 'Engagement Manager', email: 's.morrison@gtt.net', focus: 'Workshop facilitation, deliverables', present: true },
];

/* Domain definitions for Command Center */
export const DOMAIN_DEFINITIONS = [
  { id: 'executive', label: 'Executive Context', color: '#16a34a', goal: 'Align on business drivers, transformation triggers, risk posture, and ambition level',
    scope: 'Capture the strategic why behind the transformation — CTO mandate, M&A integration needs, compliance pressure, cost targets.',
    outputs: 'Active business drivers, risk register, ambition score, transformation narrative' },
  { id: 'current', label: 'Current - Estate / Infrastructure', color: '#2563eb', goal: 'Document the complete current-state network, site inventory, provider contracts, and constraints',
    scope: 'Build an accurate picture of what exists today — every site cluster, circuit type, provider relationship, and cost line.',
    outputs: 'Site inventory, provider matrix, constraint register, spend baseline' },
  { id: 'network', label: 'Network Transformation', color: '#2563eb', goal: 'Assess SD-WAN readiness, define branch standards, make key transport and operations decisions',
    scope: 'Evaluate current WAN maturity across 8 capability areas. Track site-by-site migration readiness. Capture decisions on MPLS strategy, backup connectivity, and managed vs. self-operated models.',
    outputs: 'SD-WAN readiness scores, migration tracker, key decisions, branch checklist, network element inventory' },
  { id: 'security', label: 'Security Transformation', color: '#dc2626', goal: 'Evaluate SASE/SSE readiness, map vendor consolidation, advance Zero Trust program',
    scope: 'Score 8 SASE components. Build vendor consolidation matrix with retain/replace decisions. Track Zero Trust checklist against board mandate.',
    outputs: 'SASE maturity scores, vendor consolidation plan, ZT readiness checklist, security findings' },
  { id: 'cloud', label: 'Cloud Transformation', color: '#7c3aed', goal: 'Assess cloud connectivity, track app migration, define on-ramp architecture decisions',
    scope: 'Evaluate cloud readiness across 8 dimensions. Map connectivity status for each cloud provider. Track application migration priorities and status.',
    outputs: 'Cloud readiness scores, connectivity assessment, app migration tracker, architecture decisions' },
  { id: 'future', label: 'Future-State Blueprint', color: '#0d9488', goal: 'Define target architecture, branch model, operating state, and convergence vision',
    scope: 'Translate workshop findings into a coherent target-state vision — converged fabric, standardized branch, unified operations.',
    outputs: 'Architecture vision, branch blueprint, operating model, convergence strategy' },
  { id: 'value', label: 'Value & Tradeoffs', color: '#64748b', goal: 'Frame the business case with TCO analysis, value drivers, and key tradeoff decisions',
    scope: 'Quantify hard and soft savings. Map implementation tradeoffs. Build executive-ready financial justification.',
    outputs: 'TCO/ROI model, tradeoff matrix, business case narrative' },
  { id: 'roadmap', label: 'Transformation Roadmap', color: '#64748b', goal: 'Sequence the transformation into phased waves with dependencies and risk gates',
    scope: 'Organize the work into executable phases. Map critical dependencies and gate criteria.',
    outputs: 'Phased rollout plan, dependency map, risk register, milestone timeline' },
  { id: 'deliver', label: 'Workshop Deliverables', color: '#7c3aed', goal: 'Track and generate all workshop output artifacts for customer delivery',
    scope: 'Monitor deliverable status — generated, in progress, pending.',
    outputs: 'Executive summary, architecture diagrams, BOM, TCO model, proposal deck' },
];
