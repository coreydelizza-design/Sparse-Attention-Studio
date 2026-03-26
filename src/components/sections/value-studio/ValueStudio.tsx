/* ──────────────────────────────────────────────────────────────
   ValueStudio – Main orchestrator for the TCO Calculator
   ────────────────────────────────────────────────────────────── */

import React, { useState } from "react";
import { useTheme } from "../../../theme/useTheme";
import useTco from "../../../hooks/useTco";
import { GlassCard, PageHeader, SectionHeader, Chip, Mono } from "../../shared/Primitives";
import { MixBuilder } from "./MixBuilder";
import { TcoParameters } from "./TcoParameters";
import { TcoSavings } from "./TcoSavings";
import { TcoDetails } from "./TcoDetails";
import { AccuracyBar } from "./AccuracyBar";

const ValueStudio: React.FC = () => {
  const { t } = useTheme();
  const tco = useTco();

  // AI analysis state (stubbed for Phase 3)
  const [tcoLoading, setTcoLoading] = useState(false);
  const [tcoData, setTcoData] = useState<any>(null);
  const [tcoError, setTcoError] = useState<string | null>(null);
  const [accuracyRatings, setAccuracyRatings] = useState<Record<string, number>>({});

  const rateAccuracy = (tab: string, value: number) => {
    setAccuracyRatings((prev) => ({ ...prev, [tab]: value }));
  };

  // Placeholder for AI analysis — will connect to Gemini API in Phase 3
  const onRunAnalysis = () => {
    setTcoLoading(true);
    setTcoError(null);
    setTimeout(() => {
      setTcoLoading(false);
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Page Header */}
      <PageHeader
        title="Value Studio"
        subtitle="Total Cost of Ownership analysis \u2014 compare incumbent provider costs against the GTT proposed solution."
        phase="7"
        accent={t.emerald}
      />

      {/* 2. TCO Header bar */}
      <GlassCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: t.textDim,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontFamily: t.fontM,
                marginBottom: 4,
              }}
            >
              TCO Calculator
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
              <span style={{ color: t.rose }}>{tco.incumbentProvider}</span>
              <span style={{ color: t.textDim, fontWeight: 400, margin: "0 10px" }}> vs </span>
              <span style={{ color: t.emerald }}>GTT Proposed</span>
            </div>
          </div>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
              fontFamily: t.fontM,
              ...(tco.confidence === "high"
                ? {
                    background: `${t.emerald}15`,
                    color: t.emerald,
                    border: `1px solid ${t.emerald}30`,
                  }
                : {
                    background: `${t.amber}15`,
                    color: t.amber,
                    border: `1px solid ${t.amber}30`,
                  }),
            }}
          >
            Confidence: {tco.confidence.toUpperCase()}
          </div>
        </div>
      </GlassCard>

      {/* 3. AI Analysis bar */}
      <GlassCard style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, ${t.violet}, ${t.emerald}, ${t.cyan})`,
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>TCO AI Analysis</div>
            <div style={{ fontSize: 12, color: t.textDim, marginTop: 2 }}>
              Generate AI-powered TCO insights
            </div>
          </div>
          <button
            onClick={onRunAnalysis}
            disabled={tcoLoading}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: "none",
              fontWeight: 700,
              fontSize: 12,
              fontFamily: t.fontD,
              ...(tcoLoading
                ? { background: t.bgGlass, color: t.textDim, cursor: "not-allowed" }
                : {
                    background: `linear-gradient(135deg, ${t.violet}, ${t.cyan})`,
                    color: "white",
                    cursor: "pointer",
                  }),
            }}
          >
            {tcoLoading ? "Analyzing..." : "Run TCO Analysis"}
          </button>
        </div>
        {tcoError && (
          <div
            style={{
              marginTop: 14,
              padding: "10px 16px",
              borderRadius: 8,
              background: `${t.rose}12`,
              border: `1px solid ${t.rose}30`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              <span style={{ color: t.rose, fontWeight: 600 }}>API Error: </span>
              <span style={{ color: t.textMuted }}>{tcoError}</span>
            </span>
            <button
              onClick={() => setTcoError(null)}
              style={{
                background: "none",
                border: "none",
                color: t.textDim,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              &times;
            </button>
          </div>
        )}
      </GlassCard>

      {/* 4. Parameters */}
      <TcoParameters
        incumbentProvider={tco.incumbentProvider}
        setIncumbentProvider={tco.setIncumbentProvider}
        tcoSiteCount={tco.tcoSiteCount}
        setTcoSiteCount={tco.setTcoSiteCount}
        tcoTermMonths={tco.tcoTermMonths}
        setTcoTermMonths={tco.setTcoTermMonths}
        tcoManagedPerSite={tco.tcoManagedPerSite}
        setTcoManagedPerSite={tco.setTcoManagedPerSite}
        tcoOneTimeInc={tco.tcoOneTimeInc}
        setTcoOneTimeInc={tco.setTcoOneTimeInc}
        tcoOneTimeGtt={tco.tcoOneTimeGtt}
        setTcoOneTimeGtt={tco.setTcoOneTimeGtt}
        tcoRedundancy={tco.tcoRedundancy}
        setTcoRedundancy={tco.setTcoRedundancy}
        cpeComplexity={tco.cpeComplexity}
        setCpeComplexity={tco.setCpeComplexity}
        envisionTier={tco.envisionTier}
        setEnvisionTier={tco.setEnvisionTier}
        tcoBenchmark={tco.tcoBenchmark}
        setTcoBenchmark={tco.setTcoBenchmark}
        incCpePerSite={tco.incCpePerSite}
      />

      {/* 5. Mix Builders */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <MixBuilder
          title={`${tco.incumbentProvider} Stack`}
          subtitle="priced at: high"
          color={t.rose}
          mix={tco.incumbentMix}
          setMix={tco.setIncumbentMix}
          benchmark="high"
          tcoFns={{
            getUnitPrice: tco.getIncumbentUnitPrice,
            addMixItem: tco.addMixItem,
            removeMixItem: tco.removeMixItem,
            updateMixItem: tco.updateMixItem,
          }}
          mrr={tco.incStack.mrr}
        />
        <MixBuilder
          title="GTT Proposed Stack"
          subtitle={`benchmark: ${tco.tcoBenchmark}`}
          color={t.emerald}
          mix={tco.proposedMix}
          setMix={tco.setProposedMix}
          benchmark={tco.tcoBenchmark}
          tcoFns={{
            getUnitPrice: tco.getGttUnitPrice,
            addMixItem: tco.addMixItem,
            removeMixItem: tco.removeMixItem,
            updateMixItem: tco.updateMixItem,
          }}
          mrr={tco.gttStack.mrr}
        />
      </div>

      {/* 6. Savings */}
      <TcoSavings
        incumbentProvider={tco.incumbentProvider}
        tcoSiteCount={tco.tcoSiteCount}
        tcoTermMonths={tco.tcoTermMonths}
        cpeComplexity={tco.cpeComplexity}
        envisionTier={tco.envisionTier}
        incCpePerSite={tco.incCpePerSite}
        gttCpePerSite={tco.gttCpePerSite}
        cpeSavingsPerSite={tco.cpeSavingsPerSite}
        cpeSavingsMonthly={tco.cpeSavingsMonthly}
        cpeSavingsAnnual={tco.cpeSavingsAnnual}
        mrrSavings={tco.mrrSavings}
        mrrSavingsPct={tco.mrrSavingsPct}
        tcoSavingsVal={tco.tcoSavingsVal}
        tcoSavingsPct={tco.tcoSavingsPct}
        incTco={tco.incTco}
        gttTco={tco.gttTco}
        incMrr={tco.incStack.mrr}
        gttMrr={tco.gttStack.mrr}
        bwUplift={tco.bwUplift}
        incMaxSpeed={tco.incMaxSpeed}
        gttMaxSpeed={tco.gttMaxSpeed}
        paybackMo={tco.paybackMonths}
        tcoOneTimeGtt={tco.tcoOneTimeGtt}
        fmtK={tco.fmtK}
      />

      {/* 7. Details */}
      <TcoDetails
        incumbentProvider={tco.incumbentProvider}
        tcoBenchmark={tco.tcoBenchmark}
        tcoTermMonths={tco.tcoTermMonths}
        tcoSiteCount={tco.tcoSiteCount}
        tcoRedundancy={tco.tcoRedundancy}
        tcoManagedPerSite={tco.tcoManagedPerSite}
        cpeComplexity={tco.cpeComplexity}
        envisionTier={tco.envisionTier}
        incCpePerSite={tco.incCpePerSite}
        gttCpePerSite={tco.gttCpePerSite}
        incLines={tco.incStack.lines}
        gttLines={tco.gttStack.lines}
        incMrr={tco.incStack.mrr}
        gttMrr={tco.gttStack.mrr}
        mrrSavings={tco.mrrSavings}
        mrrSavingsPct={String(tco.mrrSavingsPct)}
        tcoSavingsVal={tco.tcoSavingsVal}
        cpeSavingsPerSite={tco.cpeSavingsPerSite}
        cpeSavingsAnnual={tco.cpeSavingsAnnual}
        bwUplift={tco.bwUplift}
        paybackMo={tco.paybackMonths}
        tcoConfidence={tco.confidence}
        tcoData={tcoData}
        tcoLoading={tcoLoading}
        fmtK={tco.fmtK}
      />

      {/* 8. Accuracy Bar */}
      <AccuracyBar tab="tco" accuracyRatings={accuracyRatings} rateAccuracy={rateAccuracy} />
    </div>
  );
};

export default ValueStudio;
