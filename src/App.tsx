import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, ArrowUpRight, Database, Gauge, Layers, LineChart,
  Play, Sparkles, Timer, Users, GitBranch, Code2, Globe, Mail,
} from "lucide-react";

function useCountUp(target: number, duration = 1600, started = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, started]);
  return val;
}

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const kpis = [
  { icon: Gauge, label: "Dashboards shipped", value: 40, suffix: "+", note: "Power BI, org-wide" },
  { icon: Database, label: "Rows processed daily", value: 20, suffix: "M+", note: "PySpark on Databricks" },
  { icon: Timer, label: "Reporting time saved", value: 80, suffix: "%", note: "via pipeline automation" },
  { icon: Users, label: "Teams supported", value: 6, suffix: "", note: "sales, finance, ops" },
];

const stages = [
  { name: "Sources", desc: "Company data", detail: "SQL DB · files · APIs", color: "#ff5c30", bg: "rgba(255,92,48,.09)" },
  { name: "Bronze", desc: "Raw ingestion", detail: "Landing zone · schema-on-read", color: "var(--bronze)", bg: "rgba(169,113,66,.10)" },
  { name: "Silver", desc: "Cleaned & conformed", detail: "Dedup · quality checks · joins", color: "var(--silver)", bg: "rgba(143,152,163,.12)" },
  { name: "Gold", desc: "Business aggregates", detail: "Star schema · KPI marts", color: "var(--gold)", bg: "rgba(217,154,27,.10)" },
  { name: "Power BI", desc: "Decisions delivered", detail: "Semantic model · DAX · RLS", color: "var(--pbi)", bg: "rgba(233,176,14,.10)", live: true },
];

const segments = [
  { x1: 110, x2: 330, color: "#ff5c30", label: "Ingesting" },
  { x1: 330, x2: 550, color: "#2f6fed", label: "Transforming" },
  { x1: 550, x2: 770, color: "#2f6fed", label: "Validating" },
  { x1: 770, x2: 990, color: "#d99a1b", label: "Modeling" },
];

const projects = [
  {
    icon: Layers,
    tag: "Data engineering",
    title: "Medallion lakehouse pipeline",
    desc: "End-to-end ETL for 5M+ trip records on Databricks — incremental Delta loads, expectations-based quality gates, and full lineage.",
    stack: ["PySpark", "Delta Lake", "Databricks"],
    metric: "12M rows / day",
  },
  {
    icon: LineChart,
    tag: "Business intelligence",
    title: "Executive revenue command center",
    desc: "A live Power BI experience for leadership — drill-through from company KPIs to transaction grain, refreshed hourly.",
    stack: ["Power BI", "DAX", "SQL"],
    metric: "80% faster reporting",
  },
  {
    icon: GitBranch,
    tag: "Analytics",
    title: "Customer retention deep-dive",
    desc: "Cohort and funnel analysis in analytical SQL and Python, translated into three retention plays adopted by product.",
    stack: ["SQL", "Python", "Cohorts"],
    metric: "+9pt retention insight",
  },
];

function Kpi({ icon: Icon, label, value, suffix, note, started, delay }: any) {
  const n = useCountUp(value, 1500, started);
  return (
    <div
      className="lift soft-shadow fade-up"
      style={{
        background: "#fff", borderRadius: 20, padding: "26px 26px 22px",
        border: "1px solid var(--line)", animationDelay: `${delay}ms`,
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center",
        justifyContent: "center", background: "linear-gradient(135deg, rgba(255,54,33,.10), rgba(255,138,61,.16))",
      }}>
        <Icon size={19} style={{ color: "var(--orange)" }} />
      </div>
      <div className="display" style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", marginTop: 18 }}>
        {Math.round(n)}{suffix}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{label}</div>
      <div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 4 }}>{note}</div>
    </div>
  );
}

const SEG_DUR = 6.5;

function Segment({ x1, x2, color, label, index, active }: any) {
  const path = `M ${x1 + 14} 30 L ${x2 - 14} 30`;
  return (
    <g>
      <line x1={x1 + 14} y1="30" x2={x2 - 14} y2="30" stroke={color} strokeOpacity="0.16" strokeWidth="2" strokeLinecap="round" />
      <line x1={x1 + 14} y1="30" x2={x2 - 14} y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.16">
        <animate
          attributeName="stroke-opacity"
          values="0.16;0.16;0.65;0.65;0.16;0.16"
          keyTimes="0;0.05;0.25;0.75;0.95;1"
          dur={`${SEG_DUR}s`}
          begin={`${index * 1.6}s`}
          repeatCount="indefinite"
        />
      </line>
      {[0, 1].map((p) => (
        <circle key={p} r="4" fill={color} opacity={active ? 0.85 : 0}>
          <animateMotion dur={`${SEG_DUR}s`} begin={`${index * 1.6 + p * (SEG_DUR / 2)}s`} repeatCount="indefinite" path={path} calcMode="spline" keySplines="0.4 0 0.6 1" keyTimes="0;1" />
          <animate attributeName="opacity" values="0;0.85;0.85;0" keyTimes="0;0.12;0.88;1" dur={`${SEG_DUR}s`} begin={`${index * 1.6 + p * (SEG_DUR / 2)}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x={(x1 + x2) / 2} y="56" textAnchor="middle" fill="var(--muted)" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: ".07em", textTransform: "uppercase" }}>
        {label}
      </text>
    </g>
  );
}

function Pipeline() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <svg viewBox="0 0 1100 68" preserveAspectRatio="none" style={{ width: "100%", height: 68, display: "block", marginBottom: 6 }} aria-hidden="true">
        {segments.map((s, i) => (
          <Segment key={s.label} {...s} index={i} active={inView} />
        ))}
        {[110, 330, 550, 770, 990].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy="30" r="6" fill="#fff" stroke={stages[i].color} strokeWidth="2" />
            <circle cx={x} cy="30" r="3" fill={stages[i].color} />
          </g>
        ))}
      </svg>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18, position: "relative" }}>
        {stages.map((s, i) => (
          <div key={s.name} className="glass lift soft-shadow fade-up" style={{ borderRadius: 18, padding: "20px 18px", animationDelay: `${i * 120}ms`, animationPlayState: inView ? "running" : "paused" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ position: "relative", width: 11, height: 11 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: s.color }} />
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: s.color, animation: inView ? "pulseRing 3.2s ease-out infinite" : "none", animationDelay: `${i * 0.5}s` }} />
              </span>
              {s.live ? (
                <span className="mono" style={{ fontSize: 10.5, letterSpacing: ".07em", textTransform: "uppercase", color: "#0f8a4d", background: "rgba(15,138,77,.08)", padding: "4px 9px", borderRadius: 999 }}>
                  Visualizing
                </span>
              ) : (
                <span className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>{String(i + 1).padStart(2, "0")}</span>
              )}
            </div>
            <div className="display" style={{ fontSize: 18.5, fontWeight: 600, marginTop: 13, letterSpacing: "-0.01em" }}>{s.name}</div>
            <div style={{ fontSize: 13.5, fontWeight: 500, marginTop: 2 }}>{s.desc}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 9, padding: "6px 9px", borderRadius: 9, background: s.bg, display: "inline-block" }}>
              {s.detail}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 22, marginTop: 26, flexWrap: "wrap" }}>
        {[
          { c: "#ff5c30", t: "Source ingestion" },
          { c: "#2f6fed", t: "PySpark transformations" },
          { c: "#d99a1b", t: "Gold → Power BI delivery" },
        ].map((l) => (
          <span key={l.t} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted)" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: l.c }} /> {l.t}
          </span>
        ))}
      </div>
    </div>
  );
}

function HeroDiagram() {
  const seg = (d: string, color: string, dur: number, begin: number) => (
    <>
      <path d={d} stroke={color} strokeOpacity="0.18" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={d} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeOpacity="0.18">
        <animate attributeName="stroke-opacity" values="0.18;0.18;0.6;0.6;0.18;0.18" keyTimes="0;0.05;0.3;0.7;0.95;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
      </path>
      <circle r="4" fill={color}>
        <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={d} calcMode="spline" keySplines="0.4 0 0.6 1" keyTimes="0;1" />
        <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.12;0.88;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
      </circle>
    </>
  );
  const nodeBox = (x: number, y: number, w: number, label: string, color: string, sub?: string) => (
    <g>
      <rect x={x - w / 2} y={y - 21} width={w} height={42} rx="12" fill="#fff" stroke="rgba(23,23,26,.09)" style={{ filter: "drop-shadow(0 6px 14px rgba(23,23,26,.07))" }} />
      <circle cx={x - w / 2 + 18} cy={y} r="4" fill={color} />
      <text x={x - w / 2 + 30} y={y + (sub ? -2 : 4.5)} fill="#17171a" style={{ fontFamily: "'Sora', sans-serif", fontSize: 13.5, fontWeight: 600 }}>{label}</text>
      {sub && <text x={x - w / 2 + 30} y={y + 13} fill="#67676f" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5 }}>{sub}</text>}
    </g>
  );
  const srcPill = (x: number, y: number, label: string) => (
    <g>
      <rect x={x - 52} y={y - 17} width={104} height={34} rx="17" fill="rgba(255,92,48,.07)" stroke="rgba(255,92,48,.25)" />
      <text x={x} y={y + 4} textAnchor="middle" fill="#b23a1c" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>{label}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 400 430" style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Data flows from API, SQL Server, and files into Databricks, through PySpark and Delta Lake, into Power BI">
      {seg("M 128 62 C 190 62, 210 90, 236 104", "#ff5c30", 6.5, 0)}
      {seg("M 128 130 C 170 130, 190 122, 232 118", "#ff5c30", 6.5, 2.2)}
      {seg("M 128 198 C 190 198, 210 152, 236 132", "#ff5c30", 6.5, 4.3)}
      {seg("M 282 141 L 282 172", "#2f6fed", 4.5, 1.2)}
      {seg("M 282 214 L 282 245", "#2f6fed", 4.5, 3.4)}
      {seg("M 282 287 L 282 318", "#d99a1b", 4.5, 2.3)}
      {srcPill(76, 62, "API")}
      {srcPill(76, 130, "SQL Server")}
      {srcPill(76, 198, "Files")}
      {nodeBox(282, 118, 156, "Databricks", "#ff5c30", "lakehouse")}
      {nodeBox(282, 193, 156, "PySpark", "#2f6fed", "transform")}
      {nodeBox(282, 266, 156, "Delta Lake", "#8f98a3", "ACID storage")}
      {nodeBox(282, 339, 156, "Power BI", "#d99a1b", "decisions")}
      <text x="282" y="392" textAnchor="middle" fill="#67676f" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: ".08em" }}>LIVE PIPELINE</text>
      <circle cx="216" cy="388" r="3.5" fill="#0f8a4d">
        <animate attributeName="opacity" values="1;0.25;1" dur="2.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export default function App() {
  const { ref: kpiRef, inView: kpiIn } = useInView<HTMLDivElement>(0.3);
  return (
    <div style={{ overflowX: "hidden" }}>
      <div aria-hidden="true" style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background:
          "radial-gradient(52rem 32rem at 88% -8%, rgba(255,54,33,.10), transparent 60%)," +
          "radial-gradient(44rem 30rem at -12% 30%, rgba(255,138,61,.09), transparent 60%)," +
          "radial-gradient(50rem 34rem at 60% 118%, rgba(255,54,33,.06), transparent 62%)",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>

        <nav className="glass soft-shadow" style={{
          position: "sticky", top: 18, zIndex: 40, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "12px 22px", borderRadius: 999, marginTop: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: "linear-gradient(135deg, var(--orange), var(--amber))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={15} color="#fff" />
            </div>
            <span className="display" style={{ fontWeight: 600, fontSize: 15.5, letterSpacing: "-0.01em" }}>Aarav Mehta</span>
          </div>
          <div style={{ display: "flex", gap: 28, fontSize: 14.5, color: "var(--muted)", fontWeight: 500 }}>
            <a href="#pipeline" style={{ color: "inherit", textDecoration: "none" }}>Pipeline</a>
            <a href="#work" style={{ color: "inherit", textDecoration: "none" }}>Work</a>
            <a href="#metrics" style={{ color: "inherit", textDecoration: "none" }}>Impact</a>
          </div>
          <a href="#contact" style={{
            display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 600,
            color: "#fff", background: "var(--ink)", padding: "9px 18px", borderRadius: 999, textDecoration: "none",
          }}>
            Let's talk <ArrowRight size={15} />
          </a>
        </nav>

        <header style={{ padding: "84px 0 72px", display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 48, alignItems: "center" }}>
          <div>
            <h1 className="display fade-up" style={{
              fontSize: 58, lineHeight: 1.07, letterSpacing: "-0.035em", fontWeight: 700, margin: 0,
            }}>
              Building Data Platforms{" "}
              <span style={{
                background: "linear-gradient(100deg, var(--orange), var(--amber))",
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
              }}>
                That Drive Decisions
              </span>
            </h1>
            <div className="fade-up" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 26, animationDelay: "120ms" }}>
              {["Databricks", "PySpark", "SQL", "Python", "Power BI"].map((t) => (
                <span key={t} className="mono" style={{
                  fontSize: 12.5, padding: "7px 14px", borderRadius: 999,
                  background: "rgba(23,23,26,.045)", color: "#3b3b41", border: "1px solid var(--line)",
                }}>{t}</span>
              ))}
            </div>
            <div className="fade-up" style={{ display: "flex", gap: 44, marginTop: 34, animationDelay: "200ms" }}>
              <div>
                <div className="display" style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.03em" }}>20M+</div>
                <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 2 }}>Records processed / day</div>
              </div>
              <div style={{ width: 1, background: "var(--line)" }} />
              <div>
                <div className="display" style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.03em" }}>99.9%</div>
                <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 2 }}>Data quality score</div>
              </div>
            </div>
            <div className="fade-up" style={{ display: "flex", gap: 14, marginTop: 36, animationDelay: "280ms" }}>
              <a href="#work" style={{
                display: "inline-flex", alignItems: "center", gap: 9, background: "linear-gradient(120deg, var(--orange), #ff5c30)",
                color: "#fff", fontWeight: 600, fontSize: 15.5, padding: "14px 26px", borderRadius: 14,
                textDecoration: "none", boxShadow: "0 12px 28px rgba(255,54,33,.28)",
              }}>
                <Play size={16} /> View the work
              </a>
              <a href="#pipeline" style={{
                display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--line)",
                color: "var(--ink)", fontWeight: 600, fontSize: 15.5, padding: "14px 24px", borderRadius: 14, textDecoration: "none",
              }} className="soft-shadow">
                How I build <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

          <div className="glass soft-shadow-lg fade-up" style={{ borderRadius: 24, padding: "26px 20px 14px", animationDelay: "180ms" }}>
            <HeroDiagram />
          </div>
        </header>

        <section id="metrics" ref={kpiRef} style={{ padding: "8px 0 84px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
            {kpis.map((k, i) => <Kpi key={k.label} {...k} started={kpiIn} delay={i * 110} />)}
          </div>
        </section>

        <section id="pipeline" style={{ padding: "26px 0 96px" }}>
          <div style={{ maxWidth: 640, marginBottom: 46 }}>
            <div className="mono" style={{ fontSize: 12.5, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--orange)" }}>The pipeline</div>
            <h2 className="display" style={{ fontSize: 38, letterSpacing: "-0.025em", fontWeight: 600, margin: "12px 0 0" }}>
              From raw data to the boardroom
            </h2>
            <p style={{ fontSize: 16.5, color: "var(--muted)", lineHeight: 1.65, margin: "14px 0 0" }}>
              Every project follows the medallion architecture — each layer adds trust, until the data is ready to drive a decision.
            </p>
          </div>
          <Pipeline />
        </section>

        <section id="work" style={{ padding: "10px 0 96px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 42 }}>
            <div>
              <div className="mono" style={{ fontSize: 12.5, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--orange)" }}>Selected work</div>
              <h2 className="display" style={{ fontSize: 38, letterSpacing: "-0.025em", fontWeight: 600, margin: "12px 0 0" }}>
                Projects with a P&amp;L attached
              </h2>
            </div>
            <a href="#" className="mono" style={{ fontSize: 13.5, color: "var(--ink)", textDecoration: "none", display: "inline-flex", gap: 6, alignItems: "center" }}>
              github.com/aarav <ArrowUpRight size={15} />
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
            {projects.map((p) => (
              <article key={p.title} className="lift soft-shadow" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 22, padding: 26, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg, rgba(255,54,33,.10), rgba(255,138,61,.18))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p.icon size={19} style={{ color: "var(--orange)" }} />
                  </div>
                  <span className="mono" style={{ fontSize: 11.5, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)" }}>{p.tag}</span>
                </div>
                <h3 className="display" style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em", margin: "18px 0 0" }}>{p.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--muted)", margin: "10px 0 18px", flex: 1 }}>{p.desc}</p>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {p.stack.map((s) => (
                    <span key={s} className="mono" style={{ fontSize: 11.5, padding: "5px 11px", borderRadius: 999, background: "rgba(23,23,26,.045)", color: "#3b3b41" }}>{s}</span>
                  ))}
                </div>
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--orange)" }}>{p.metric}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 5 }}>Case study <ArrowRight size={14} /></span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" style={{ paddingBottom: 60 }}>
          <div className="soft-shadow-lg" style={{
            borderRadius: 28, padding: "60px 56px", position: "relative", overflow: "hidden",
            background: "linear-gradient(115deg, #1b1b1e 30%, #3a1712 78%, #7c2415)",
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 40,
          }}>
            <div aria-hidden="true" style={{ position: "absolute", right: -80, top: -90, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,90,45,.35), transparent 65%)" }} />
            <div style={{ position: "relative" }}>
              <h2 className="display" style={{ color: "#fff", fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
                Have a data problem worth solving?
              </h2>
              <p style={{ color: "rgba(255,255,255,.72)", fontSize: 16.5, margin: "12px 0 0", maxWidth: 520 }}>
                I'm open to analytics and data engineering opportunities — let's talk about what your data could be doing.
              </p>
            </div>
            <a href="mailto:hello@example.com" style={{
              position: "relative", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 9,
              background: "#fff", color: "var(--ink)", fontWeight: 600, fontSize: 15.5, padding: "15px 28px",
              borderRadius: 14, textDecoration: "none",
            }}>
              <Mail size={17} /> Get in touch
            </a>
          </div>
          <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "30px 6px 36px", color: "var(--muted)", fontSize: 14 }}>
            <span>© 2026 Aarav Mehta · Built with PySpark-fueled coffee</span>
            <span style={{ display: "flex", gap: 18 }}>
              <Code2 size={18} /> <Globe size={18} /> <Mail size={18} />
            </span>
          </footer>
        </section>
      </div>
    </div>
  );
}
