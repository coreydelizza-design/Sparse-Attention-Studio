/* ──────────────────────────────────────────────────────────────
   TCO / Value-Studio pricing data
   TypeScript conversion of the original JSX reference file.
   ────────────────────────────────────────────────────────────── */

// ── Types ────────────────────────────────────────────────────

export type RateCard = {
  mpls: number[];
  sdwan: number[];
  security: number[];
  circuit: number[];
  cpe: number[];
};

export type AccessType = {
  value: string;
  label: string;
  speeds: number[];
};

export type CpeTier = {
  label: string;
  desc: string;
  mult: number;
};

export type EnvisionTier = {
  label: string;
  desc: string;
  price: number;
};

// ── Incumbent providers (46 entries, grouped by region) ──────

export const INCUMBENT_PROVIDERS: string[] = [
  // North America
  "AT&T", "Verizon", "Lumen", "Comcast", "Spectrum (Charter)", "Cox",
  "Windstream", "Frontier", "Zayo", "Cogent", "Crown Castle (Lightpath)",
  // Europe
  "BT (British Telecom)", "Orange", "Colt", "Telia", "Vodafone",
  "Deutsche Telekom", "Swisscom", "KPN", "Telefónica", "TIM (Telecom Italia)",
  "Proximus", "Arelion (formerly Telia Carrier)", "euNetworks",
  // Asia-Pacific
  "NTT", "Singtel", "Telstra", "PCCW", "Tata Communications",
  "Bharti Airtel", "China Telecom Global", "Korea Telecom", "PLDT", "StarHub",
  // Global SI / Overlay
  "Aryaka", "Masergy (now Comcast Business)", "Rackspace", "Wipro", "HCL Technologies",
  "TCS", "Accenture", "DXC Technology", "Kyndryl", "Infosys",
  // Catch-all
  "Regional ISP", "Generic / Other",
];

// ── Per-provider rate cards  [low, mid, high] per line ──────

export const PROVIDER_RATES: Record<string, RateCard> = {
  "AT&T":            { mpls: [800, 1000, 1200], sdwan: [400, 500, 600],  security: [300, 400, 500],  circuit: [600, 750, 900],  cpe: [250, 325, 400] },
  "Verizon":         { mpls: [900, 1100, 1300], sdwan: [450, 550, 650],  security: [350, 450, 550],  circuit: [650, 800, 950],  cpe: [300, 375, 450] },
  "Lumen":           { mpls: [700, 850, 1000],  sdwan: [350, 425, 500],  security: [250, 325, 400],  circuit: [500, 650, 800],  cpe: [200, 275, 350] },
  "Comcast":         { mpls: [600, 750, 900],   sdwan: [300, 375, 450],  security: [200, 275, 350],  circuit: [400, 550, 700],  cpe: [175, 238, 300] },
  "Spectrum (Charter)": { mpls: [600, 750, 900], sdwan: [300, 375, 450], security: [200, 275, 350],  circuit: [400, 550, 700],  cpe: [175, 238, 300] },
  "Cox":             { mpls: [600, 750, 900],   sdwan: [300, 375, 450],  security: [200, 275, 350],  circuit: [400, 550, 700],  cpe: [175, 238, 300] },
  "Windstream":      { mpls: [650, 800, 950],   sdwan: [325, 400, 475],  security: [225, 300, 375],  circuit: [450, 600, 750],  cpe: [190, 260, 330] },
  "Frontier":        { mpls: [650, 800, 950],   sdwan: [325, 400, 475],  security: [225, 300, 375],  circuit: [450, 600, 750],  cpe: [190, 260, 330] },
  "Zayo":            { mpls: [750, 900, 1050],  sdwan: [375, 450, 525],  security: [275, 350, 425],  circuit: [550, 700, 850],  cpe: [225, 300, 375] },
  "Cogent":          { mpls: [550, 700, 850],   sdwan: [275, 350, 425],  security: [175, 250, 325],  circuit: [350, 500, 650],  cpe: [150, 215, 280] },
  "Crown Castle (Lightpath)": { mpls: [700, 850, 1000], sdwan: [350, 425, 500], security: [250, 325, 400], circuit: [500, 650, 800], cpe: [200, 275, 350] },

  "BT (British Telecom)": { mpls: [1000, 1200, 1400], sdwan: [500, 600, 700], security: [400, 500, 600], circuit: [700, 850, 1000], cpe: [325, 400, 475] },
  "Orange":          { mpls: [950, 1150, 1350], sdwan: [475, 575, 675],  security: [375, 475, 575],  circuit: [680, 830, 980],  cpe: [300, 375, 450] },
  "Colt":            { mpls: [750, 900, 1050],  sdwan: [375, 450, 525],  security: [275, 350, 425],  circuit: [550, 700, 850],  cpe: [225, 300, 375] },
  "Telia":           { mpls: [800, 950, 1100],  sdwan: [400, 475, 550],  security: [300, 375, 450],  circuit: [580, 730, 880],  cpe: [250, 313, 375] },
  "Vodafone":        { mpls: [950, 1150, 1350], sdwan: [475, 575, 675],  security: [375, 475, 575],  circuit: [680, 830, 980],  cpe: [300, 375, 450] },
  "Deutsche Telekom": { mpls: [900, 1100, 1300], sdwan: [450, 550, 650], security: [350, 450, 550],  circuit: [650, 800, 950],  cpe: [275, 350, 425] },
  "Swisscom":        { mpls: [1050, 1250, 1450], sdwan: [525, 625, 725], security: [425, 525, 625],  circuit: [750, 900, 1050], cpe: [350, 425, 500] },
  "KPN":             { mpls: [800, 950, 1100],  sdwan: [400, 475, 550],  security: [300, 375, 450],  circuit: [580, 730, 880],  cpe: [250, 313, 375] },
  "Telefónica":      { mpls: [850, 1025, 1200], sdwan: [425, 513, 600],  security: [325, 413, 500],  circuit: [620, 770, 920],  cpe: [275, 344, 413] },
  "TIM (Telecom Italia)": { mpls: [800, 975, 1150], sdwan: [400, 488, 575], security: [300, 388, 475], circuit: [580, 730, 880], cpe: [250, 319, 388] },
  "Proximus":        { mpls: [800, 950, 1100],  sdwan: [400, 475, 550],  security: [300, 375, 450],  circuit: [580, 730, 880],  cpe: [250, 313, 375] },
  "Arelion (formerly Telia Carrier)": { mpls: [750, 900, 1050], sdwan: [375, 450, 525], security: [275, 350, 425], circuit: [550, 700, 850], cpe: [225, 300, 375] },
  "euNetworks":      { mpls: [700, 850, 1000],  sdwan: [350, 425, 500],  security: [250, 325, 400],  circuit: [500, 650, 800],  cpe: [200, 275, 350] },

  "NTT":             { mpls: [850, 1025, 1200], sdwan: [425, 525, 625],  security: [325, 413, 500],  circuit: [620, 770, 920],  cpe: [275, 350, 425] },
  "Singtel":         { mpls: [900, 1075, 1250], sdwan: [450, 538, 625],  security: [350, 438, 525],  circuit: [650, 800, 950],  cpe: [300, 369, 438] },
  "Telstra":         { mpls: [950, 1125, 1300], sdwan: [475, 563, 650],  security: [375, 463, 550],  circuit: [680, 830, 980],  cpe: [325, 394, 463] },
  "PCCW":            { mpls: [800, 975, 1150],  sdwan: [400, 488, 575],  security: [300, 388, 475],  circuit: [580, 730, 880],  cpe: [250, 319, 388] },
  "Tata Communications": { mpls: [750, 913, 1075], sdwan: [375, 456, 538], security: [275, 350, 425], circuit: [550, 700, 850], cpe: [225, 294, 363] },
  "Bharti Airtel":   { mpls: [650, 800, 950],   sdwan: [325, 400, 475],  security: [225, 300, 375],  circuit: [450, 600, 750],  cpe: [190, 260, 330] },
  "China Telecom Global": { mpls: [700, 863, 1025], sdwan: [350, 431, 513], security: [250, 325, 400], circuit: [500, 650, 800], cpe: [200, 275, 350] },
  "Korea Telecom":   { mpls: [800, 975, 1150],  sdwan: [400, 488, 575],  security: [300, 388, 475],  circuit: [580, 730, 880],  cpe: [250, 319, 388] },
  "PLDT":            { mpls: [600, 750, 900],   sdwan: [300, 375, 450],  security: [200, 275, 350],  circuit: [400, 550, 700],  cpe: [175, 238, 300] },
  "StarHub":         { mpls: [750, 913, 1075],  sdwan: [375, 456, 538],  security: [275, 350, 425],  circuit: [550, 700, 850],  cpe: [225, 294, 363] },

  "Aryaka":          { mpls: [700, 850, 1000],  sdwan: [350, 425, 500],  security: [250, 325, 400],  circuit: [500, 650, 800],  cpe: [200, 275, 350] },
  "Masergy (now Comcast Business)": { mpls: [700, 850, 1000], sdwan: [350, 425, 500], security: [250, 325, 400], circuit: [500, 650, 800], cpe: [200, 275, 350] },
  "Rackspace":       { mpls: [750, 900, 1050],  sdwan: [375, 450, 525],  security: [275, 350, 425],  circuit: [550, 700, 850],  cpe: [225, 300, 375] },
  "Wipro":           { mpls: [700, 850, 1000],  sdwan: [350, 425, 500],  security: [250, 325, 400],  circuit: [500, 650, 800],  cpe: [200, 275, 350] },
  "HCL Technologies": { mpls: [700, 850, 1000], sdwan: [350, 425, 500],  security: [250, 325, 400],  circuit: [500, 650, 800],  cpe: [200, 275, 350] },
  "TCS":             { mpls: [700, 850, 1000],  sdwan: [350, 425, 500],  security: [250, 325, 400],  circuit: [500, 650, 800],  cpe: [200, 275, 350] },
  "Accenture":       { mpls: [800, 975, 1150],  sdwan: [400, 488, 575],  security: [300, 388, 475],  circuit: [580, 730, 880],  cpe: [250, 319, 388] },
  "DXC Technology":  { mpls: [750, 900, 1050],  sdwan: [375, 450, 525],  security: [275, 350, 425],  circuit: [550, 700, 850],  cpe: [225, 300, 375] },
  "Kyndryl":         { mpls: [800, 975, 1150],  sdwan: [400, 488, 575],  security: [300, 388, 475],  circuit: [580, 730, 880],  cpe: [250, 319, 388] },
  "Infosys":         { mpls: [700, 850, 1000],  sdwan: [350, 425, 500],  security: [250, 325, 400],  circuit: [500, 650, 800],  cpe: [200, 275, 350] },
};

// ── Generic fallback rates ───────────────────────────────────

export const GENERIC_RATES: RateCard = {
  mpls: [750, 925, 1100],
  sdwan: [400, 488, 575],
  security: [300, 388, 475],
  circuit: [575, 725, 875],
  cpe: [250, 325, 400],
};

// ── Lookup helper ────────────────────────────────────────────

export function getProviderRates(provider: string): RateCard {
  return PROVIDER_RATES[provider] ?? GENERIC_RATES;
}

// ── GTT proposed rates ───────────────────────────────────────

export const GTT_RATES: Record<string, number[]> = {
  sdwan:        [300, 375, 450],
  security:     [200, 275, 350],
  network:      [400, 525, 650],
  envisionEdge: [150, 200, 250],
};

// ── CPE complexity tiers ─────────────────────────────────────

export const CPE_COMPLEXITY: Record<string, CpeTier> = {
  basic:    { label: "Basic (1\u20132 devices/site)",    desc: "Minimal edge hardware \u2014 single router + firewall",                         mult: 0 },
  standard: { label: "Standard (3\u20134 devices/site)", desc: "Typical enterprise \u2014 router, firewall, WAN opt, switch",                   mult: 0.5 },
  complex:  { label: "Complex (5+ devices/site)",        desc: "Heavy sprawl \u2014 multi-vendor stacks, 5+ appliances per site",               mult: 1.25 },
};

// ── Envision Edge tiers ──────────────────────────────────────

export const ENVISION_TIERS: Record<string, EnvisionTier> = {
  essentials:   { label: "Essentials \u2014 $150/site/mo",    desc: "SD-WAN + routing",                                                             price: 150 },
  professional: { label: "Professional \u2014 $200/site/mo",  desc: "SD-WAN + routing + managed firewall + WAN optimization",                        price: 200 },
  enterprise:   { label: "Enterprise \u2014 $250/site/mo",    desc: "Full stack: SD-WAN + SSE/SASE + routing + firewall + WAN opt + compute + obs",  price: 250 },
};

// ── Access types ─────────────────────────────────────────────

export const INCUMBENT_ACCESS_TYPES: AccessType[] = [
  { value: "mpls",      label: "MPLS",            speeds: [10, 20, 50, 100, 200, 500, 1000] },
  { value: "dia",       label: "DIA",             speeds: [10, 20, 50, 100, 200, 500, 1000, 10000] },
  { value: "broadband", label: "Broadband",       speeds: [50, 100, 200, 500, 1000] },
  { value: "sdwan",     label: "SD-WAN Overlay",  speeds: [50, 100, 200, 500, 1000] },
  { value: "p2p",       label: "Point-to-Point",  speeds: [10, 100, 1000, 10000] },
];

export const GTT_ACCESS_TYPES: AccessType[] = [
  { value: "sdwan",      label: "Managed SD-WAN",            speeds: [50, 100, 200, 500, 1000] },
  { value: "dia",        label: "DIA",                       speeds: [10, 20, 50, 100, 200, 500, 1000, 10000] },
  { value: "mpls",       label: "IP Transit / MPLS",         speeds: [10, 20, 50, 100, 200, 500, 1000, 10000] },
  { value: "wavelength", label: "Wavelength / Dark Fiber",   speeds: [1000, 10000, 100000] },
];

// ── Speed-based cost multiplier ──────────────────────────────

export function speedMultiplier(speed: number): number {
  if (speed <= 10)    return 0.3;
  if (speed <= 20)    return 0.4;
  if (speed <= 50)    return 0.55;
  if (speed <= 100)   return 0.7;
  if (speed <= 200)   return 0.85;
  if (speed <= 500)   return 1.0;
  if (speed <= 1000)  return 1.3;
  if (speed <= 10000) return 3.5;
  return 6.0;
}
