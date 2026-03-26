/* ──────────────────────────────────────────────────────────────
   useTco – TCO / Value-Studio calculator hook
   TypeScript conversion of the original JSX hook.
   ────────────────────────────────────────────────────────────── */

import { useState, useMemo } from "react";
import {
  getProviderRates,
  GTT_RATES,
  CPE_COMPLEXITY,
  ENVISION_TIERS,
  speedMultiplier,
} from "../data/tco";

// ── Types ────────────────────────────────────────────────────

export interface MixItem {
  id: string;
  accessType: string;
  speed: number;
  qty: number;
}

export interface StackLine {
  label: string;
  monthly: number;
}

export interface Stack {
  lines: StackLine[];
  mrr: number;
}

// ── Internal helpers ─────────────────────────────────────────

let _mixId = 0;
const nextId = (): string => `mix_${++_mixId}`;

// ── Default mix items ────────────────────────────────────────

const DEFAULT_INC_MIX: MixItem[] = [
  { id: nextId(), accessType: "mpls", speed: 100, qty: 10 },
  { id: nextId(), accessType: "dia", speed: 100, qty: 5 },
];
const DEFAULT_GTT_MIX: MixItem[] = [
  { id: nextId(), accessType: "sdwan", speed: 200, qty: 10 },
  { id: nextId(), accessType: "dia", speed: 100, qty: 5 },
];

// ── Hook ─────────────────────────────────────────────────────

export default function useTco() {
  // ── State ────────────────────────────────────────────────

  const [tcoSiteCount, setTcoSiteCount] = useState<number>(25);
  const [tcoTermMonths, setTcoTermMonths] = useState<number>(36);
  const [tcoBenchmark, setTcoBenchmark] = useState<string>("avg");
  const [tcoManagedPerSite, setTcoManagedPerSite] = useState<number>(100);
  const [tcoOneTimeInc, setTcoOneTimeInc] = useState<number>(50000);
  const [tcoOneTimeGtt, setTcoOneTimeGtt] = useState<number>(25000);
  const [tcoRedundancy, setTcoRedundancy] = useState<number>(10);
  const [cpeComplexity, setCpeComplexity] = useState<string>("standard");
  const [envisionTier, setEnvisionTier] = useState<string>("professional");
  const [incumbentMix, setIncumbentMix] = useState<MixItem[]>(DEFAULT_INC_MIX);
  const [incumbentProvider, setIncumbentProvider] = useState<string>("AT&T");
  const [proposedMix, setProposedMix] = useState<MixItem[]>(DEFAULT_GTT_MIX);

  // ── Format helper ────────────────────────────────────────

  const fmtK = (n: number | null): string => {
    if (n === null) return "$0";
    const abs = Math.abs(n);
    const sign = n < 0 ? "-" : "";
    if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}K`;
    return `${sign}$${abs.toLocaleString()}`;
  };

  // ── Mix-item helpers ─────────────────────────────────────

  const addMixItem = (
    mix: MixItem[],
    setMix: React.Dispatch<React.SetStateAction<MixItem[]>>,
    accessType: string,
    speed: number,
    qty: number,
  ): void => {
    setMix([...mix, { id: nextId(), accessType, speed, qty }]);
  };

  const removeMixItem = (
    mix: MixItem[],
    setMix: React.Dispatch<React.SetStateAction<MixItem[]>>,
    index: number,
  ): void => {
    setMix(mix.filter((_, i) => i !== index));
  };

  const updateMixItem = (
    mix: MixItem[],
    setMix: React.Dispatch<React.SetStateAction<MixItem[]>>,
    index: number,
    field: string,
    value: unknown,
  ): void => {
    setMix(mix.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  // ── Unit-price calculators ───────────────────────────────

  const getIncumbentUnitPrice = (
    accessType: string,
    speed: number,
    _benchmark: string,
  ): number => {
    const rates = getProviderRates(incumbentProvider);
    const baseMap: Record<string, number[]> = {
      mpls: rates.mpls,
      dia: rates.circuit,
      broadband: rates.circuit,
      sdwan: rates.sdwan,
      p2p: rates.circuit,
    };
    const base = (baseMap[accessType] || rates.circuit)[2];
    return Math.round(base * speedMultiplier(speed));
  };

  const getGttUnitPrice = (
    accessType: string,
    speed: number,
    benchmark: string,
  ): number => {
    const bIdx = benchmark === "low" ? 0 : benchmark === "high" ? 2 : 1;
    const baseMap: Record<string, number[]> = {
      sdwan: GTT_RATES.sdwan,
      dia: GTT_RATES.network,
      mpls: GTT_RATES.network,
      wavelength: GTT_RATES.network,
    };
    const base = (baseMap[accessType] || GTT_RATES.network)[bIdx];
    return Math.round(base * speedMultiplier(speed));
  };

  // ── CPE pricing ──────────────────────────────────────────

  const incCpePerSite = useMemo<number>(() => {
    const rates = getProviderRates(incumbentProvider);
    const cpe = rates.cpe;
    if (cpeComplexity === "basic") return cpe[0];
    if (cpeComplexity === "complex") return Math.round(cpe[2] * 1.25);
    return cpe[1]; // standard
  }, [incumbentProvider, cpeComplexity]);

  const gttCpePerSite = ENVISION_TIERS[envisionTier].price;

  const cpeSavingsPerSite = incCpePerSite - gttCpePerSite;
  const cpeSavingsMonthly = cpeSavingsPerSite * tcoSiteCount;
  const cpeSavingsAnnual = cpeSavingsMonthly * 12;

  // ── Incumbent stack ──────────────────────────────────────

  const incStack = useMemo<Stack>(() => {
    const lines: StackLine[] = [];

    for (const item of incumbentMix) {
      const unit = getIncumbentUnitPrice(item.accessType, item.speed, "high");
      const monthly = unit * item.qty;
      lines.push({
        label: `${item.accessType.toUpperCase()} ${item.speed}M × ${item.qty} @ $${unit}/mo`,
        monthly,
      });
    }

    if (tcoManagedPerSite > 0) {
      lines.push({
        label: `Managed services ($${tcoManagedPerSite}/site × ${tcoSiteCount})`,
        monthly: tcoManagedPerSite * tcoSiteCount,
      });
    }

    lines.push({
      label: `CPE / edge ($${incCpePerSite}/site × ${tcoSiteCount})`,
      monthly: incCpePerSite * tcoSiteCount,
    });

    const baseMrr = lines.reduce((s, l) => s + l.monthly, 0);

    if (tcoRedundancy > 0) {
      const redundancyCost = Math.round(baseMrr * (tcoRedundancy / 100));
      lines.push({
        label: `Redundancy / HA (+${tcoRedundancy}%)`,
        monthly: redundancyCost,
      });
    }

    const mrr = lines.reduce((s, l) => s + l.monthly, 0);
    return { lines, mrr };
  }, [incumbentMix, tcoSiteCount, tcoManagedPerSite, tcoRedundancy, incCpePerSite, incumbentProvider, cpeComplexity]);

  // ── GTT stack ────────────────────────────────────────────

  const gttStack = useMemo<Stack>(() => {
    const bIdx = tcoBenchmark === "low" ? 0 : tcoBenchmark === "high" ? 2 : 1;
    const lines: StackLine[] = [];

    const labelMap: Record<string, string> = {
      sdwan: "Managed SD-WAN",
      dia: "DIA",
      mpls: "IP Transit",
      wavelength: "Wavelength",
    };

    for (const item of proposedMix) {
      const unit = getGttUnitPrice(item.accessType, item.speed, tcoBenchmark);
      const monthly = unit * item.qty;
      const accessLabel = labelMap[item.accessType] || item.accessType.toUpperCase();
      lines.push({
        label: `${accessLabel} ${item.speed}M × ${item.qty} @ $${unit}/mo`,
        monthly,
      });
    }

    if (tcoManagedPerSite > 0) {
      lines.push({
        label: `Managed services ($${tcoManagedPerSite}/site × ${tcoSiteCount})`,
        monthly: tcoManagedPerSite * tcoSiteCount,
      });
    }

    const securityCost = GTT_RATES.security[bIdx] * tcoSiteCount;
    lines.push({
      label: `Managed security ($${GTT_RATES.security[bIdx]}/site × ${tcoSiteCount})`,
      monthly: securityCost,
    });

    lines.push({
      label: `EnvisionEDGE ($${gttCpePerSite}/site × ${tcoSiteCount})`,
      monthly: gttCpePerSite * tcoSiteCount,
    });

    const baseMrr = lines.reduce((s, l) => s + l.monthly, 0);

    if (tcoRedundancy > 0) {
      const redundancyCost = Math.round(baseMrr * (tcoRedundancy / 100));
      lines.push({
        label: `Redundancy / HA (+${tcoRedundancy}%)`,
        monthly: redundancyCost,
      });
    }

    const mrr = lines.reduce((s, l) => s + l.monthly, 0);
    return { lines, mrr };
  }, [proposedMix, tcoSiteCount, tcoManagedPerSite, tcoRedundancy, gttCpePerSite, tcoBenchmark, envisionTier]);

  // ── TCO totals ───────────────────────────────────────────

  const incTco = incStack.mrr * tcoTermMonths + tcoOneTimeInc;
  const gttTco = gttStack.mrr * tcoTermMonths + tcoOneTimeGtt;
  const mrrSavings = incStack.mrr - gttStack.mrr;
  const tcoSavingsVal = incTco - gttTco;
  const mrrSavingsPct = incStack.mrr > 0 ? Math.round((mrrSavings / incStack.mrr) * 100) : 0;
  const tcoSavingsPct = incTco > 0 ? Math.round((tcoSavingsVal / incTco) * 100) : 0;

  // ── Bandwidth ────────────────────────────────────────────

  const incMaxSpeed = incumbentMix.reduce((m, i) => Math.max(m, i.speed), 0);
  const gttMaxSpeed = proposedMix.reduce((m, i) => Math.max(m, i.speed), 0);
  const bwUplift = incMaxSpeed > 0 ? Math.round(((gttMaxSpeed - incMaxSpeed) / incMaxSpeed) * 100) : 0;

  // ── Payback ──────────────────────────────────────────────

  const paybackMonths = useMemo<number | null>(() => {
    if (tcoOneTimeGtt <= 0 || mrrSavings <= 0) return null;
    const netOneTime = tcoOneTimeGtt - tcoOneTimeInc;
    if (netOneTime <= 0) return 0;
    return Math.ceil(netOneTime / mrrSavings);
  }, [tcoOneTimeGtt, tcoOneTimeInc, mrrSavings]);

  // ── Confidence ───────────────────────────────────────────

  const confidence = useMemo<string>(() => {
    const hasItems = incumbentMix.length >= 2 && proposedMix.length >= 2;
    const hasSites = tcoSiteCount >= 5;
    const hasReasonableTerm = tcoTermMonths >= 12;
    return hasItems && hasSites && hasReasonableTerm ? "high" : "medium";
  }, [incumbentMix, proposedMix, tcoSiteCount, tcoTermMonths]);

  // ── Return ───────────────────────────────────────────────

  return {
    // State
    tcoSiteCount,
    setTcoSiteCount,
    tcoTermMonths,
    setTcoTermMonths,
    tcoBenchmark,
    setTcoBenchmark,
    tcoManagedPerSite,
    setTcoManagedPerSite,
    tcoOneTimeInc,
    setTcoOneTimeInc,
    tcoOneTimeGtt,
    setTcoOneTimeGtt,
    tcoRedundancy,
    setTcoRedundancy,
    cpeComplexity,
    setCpeComplexity,
    envisionTier,
    setEnvisionTier,
    incumbentMix,
    setIncumbentMix,
    incumbentProvider,
    setIncumbentProvider,
    proposedMix,
    setProposedMix,

    // Helpers
    fmtK,
    addMixItem,
    removeMixItem,
    updateMixItem,
    getIncumbentUnitPrice,
    getGttUnitPrice,

    // CPE
    incCpePerSite,
    gttCpePerSite,
    cpeSavingsPerSite,
    cpeSavingsMonthly,
    cpeSavingsAnnual,

    // Stacks
    incStack,
    gttStack,

    // TCO totals
    incTco,
    gttTco,
    mrrSavings,
    tcoSavingsVal,
    mrrSavingsPct,
    tcoSavingsPct,

    // Bandwidth
    incMaxSpeed,
    gttMaxSpeed,
    bwUplift,

    // Payback & confidence
    paybackMonths,
    confidence,
  };
}
