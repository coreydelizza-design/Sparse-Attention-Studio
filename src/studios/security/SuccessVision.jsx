import { T, smI } from "../../tokens";
import { Disc } from "../../components/primitives";

function SuccessVision({ vision, setVision, met1, setMet1, met2, setMet2, met3, setMet3 }) {
  return (
    <Disc tag="SUCCESS VISION" tagColor={T.green} title="1-year outcomes" summary="What does success look like?">
      <span style={{ fontFamily: T.f, fontSize: 12, color: T.td, marginBottom: 6, display: "block" }}>Fast-forward 1 year after successful implementation — what&apos;s different?</span>
      <textarea value={vision} onChange={function (e) { setVision(e.target.value); }} style={Object.assign({}, smI, { width: "100%", minHeight: 70, resize: "vertical", lineHeight: 1.5, boxSizing: "border-box" })} placeholder="How does it affect the business? The department? What's the board saying?" />
      <div style={{ marginTop: 12 }}><span style={{ fontFamily: T.f, fontSize: 11, fontWeight: 500, color: T.td, display: "block", marginBottom: 6 }}>Key success metrics:</span><div style={{ display: "flex", gap: 8 }}><input value={met1} onChange={function (e) { setMet1(e.target.value); }} placeholder="Metric 1 (e.g., incidents/month)" style={Object.assign({}, smI, { flex: 1, boxSizing: "border-box" })} /><input value={met2} onChange={function (e) { setMet2(e.target.value); }} placeholder="Metric 2 (e.g., response time)" style={Object.assign({}, smI, { flex: 1, boxSizing: "border-box" })} /><input value={met3} onChange={function (e) { setMet3(e.target.value); }} placeholder="Metric 3 (e.g., compliance score)" style={Object.assign({}, smI, { flex: 1, boxSizing: "border-box" })} /></div></div>
    </Disc>
  );
}

export default SuccessVision;
