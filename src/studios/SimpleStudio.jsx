import { SECS } from "../tokens";
import { SecHead, Disc } from "../components/primitives";
import { T } from "../tokens";

function SimpleView({ sid, items }) { const s = SECS.find(function (x) { return x.id === sid; }); if (!s) return null; return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}><SecHead s={s} />{items.map(function (p, i) { return <Disc key={i} tag={p.tag} tagColor={p.color} title={p.title} summary={p.items.length + " items"}>{p.items.map(function (it, j) { return <div key={j} style={{ padding: "5px 0", fontFamily: T.f, fontSize: 12, color: T.ts, borderBottom: j < p.items.length - 1 ? "1px solid " + T.border : "none" }}>{it}</div>; })}</Disc>; })}</div>); }

export default SimpleView;
