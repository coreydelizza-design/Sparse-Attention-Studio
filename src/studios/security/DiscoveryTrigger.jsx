import { T, smI } from "../../tokens";
import { Disc, Decision } from "../../components/primitives";

function DiscoveryTrigger({ trigger, setTrigger, trigNote, setTrigNote }) {
  return (
    <Disc tag="TRIGGER" tagColor={T.red} title="Compelling event" summary="Why are we here?" defaultOpen={true}>
      <Decision question="What's driving this conversation?" options={["PANW Renewal Cost", "Key Personnel Loss", "Board Mandate", "Compliance Gap", "M&A Integration", "Cost Reduction"]} selected={trigger} onSelect={setTrigger} color={T.red} />
      <textarea value={trigNote} onChange={function (e) { setTrigNote(e.target.value); }} style={Object.assign({}, smI, { width: "100%", minHeight: 60, resize: "vertical", marginTop: 10, lineHeight: 1.5, boxSizing: "border-box" })} placeholder="Why now? What's prompting this evaluation? (e.g., subscription renewal is expensive, lost key security personnel, new direction to reduce costs)" />
    </Disc>
  );
}

export default DiscoveryTrigger;
