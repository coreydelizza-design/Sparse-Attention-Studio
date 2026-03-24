import { useState } from "react";
import { T } from "../../tokens";

function AIBtn({ label, data, color }) {
  const _s = useState("idle"); const st = _s[0]; const setSt = _s[1];
  const _r = useState(""); const result = _r[0]; const setResult = _r[1];
  function run() {
    setSt("loading"); setResult("");
    fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: "You are a network transformation consultant. Analyze this data. Give 3-5 specific insights, risks, and next steps. Under 200 words.\n\n" + JSON.stringify(data, null, 2) }] }) }).then(function (r) { return r.json(); }).then(function (d) { setResult(d.content && d.content[0] ? d.content[0].text : "Analysis complete."); setSt("done"); }).catch(function () { setResult("Unable to reach AI. Try again."); setSt("done"); });
  }
  return (<div style={{ background: color + "04", borderRadius: 10, border: "1px solid " + color + "22", padding: "14px 16px" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14 }}>✦</span><span style={{ fontFamily: T.f, fontSize: 13, fontWeight: 600, color: T.tp }}>AI Analysis</span><span style={{ fontFamily: T.f, fontSize: 11, color: T.td }}>— {label}</span></div>
      <button onClick={run} disabled={st === "loading"} style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: "#fff", background: st === "loading" ? T.td : color, border: "none", borderRadius: 5, padding: "6px 14px", cursor: st === "loading" ? "wait" : "pointer" }}>{st === "loading" ? "..." : st === "done" ? "Re-run" : "Analyze"}</button>
    </div>
    {result && <div style={{ fontFamily: T.f, fontSize: 12, color: T.ts, lineHeight: 1.65, whiteSpace: "pre-wrap", marginTop: 10, padding: "12px 14px", background: "#fff", borderRadius: 6, borderLeft: "3px solid " + color }}>{result}</div>}
  </div>);
}

export default AIBtn;
