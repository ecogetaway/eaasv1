import { useState } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ── Mock Data ────────────────────────────────────────────────────────────────
const STATES = [
  { id: "up", name: "Uttar Pradesh", meters: 8_42_000, active: 7_98_000, eligible: 2_10_000, revenue: 0, color: "#10b981" },
  { id: "bihar", name: "Bihar", meters: 5_10_000, active: 4_87_000, eligible: 1_25_000, revenue: 0, color: "#3b82f6" },
  { id: "assam", name: "Assam", meters: 2_30_000, active: 2_11_000, eligible: 58_000, revenue: 0, color: "#f59e0b" },
  { id: "gujarat", name: "Gujarat", meters: 6_75_000, active: 6_52_000, eligible: 1_80_000, revenue: 0, color: "#8b5cf6" },
];

const demandData = [
  { time: "12am", up: 420, bihar: 310, assam: 180, gujarat: 390 },
  { time: "3am",  up: 310, bihar: 240, assam: 130, gujarat: 280 },
  { time: "6am",  up: 490, bihar: 380, assam: 210, gujarat: 450 },
  { time: "9am",  up: 820, bihar: 610, assam: 340, gujarat: 780 },
  { time: "12pm", up: 940, bihar: 720, assam: 410, gujarat: 890 },
  { time: "3pm",  up: 860, bihar: 680, assam: 390, gujarat: 820 },
  { time: "6pm",  up: 1020, bihar: 790, assam: 450, gujarat: 960 },
  { time: "9pm",  up: 780, bihar: 590, assam: 320, gujarat: 730 },
];

const theftAlerts = [
  { id: "MTR-UP-448821", state: "UP", zone: "Lucknow North", anomaly: "302% above baseline", risk: "High", est: "₹12,400/mo" },
  { id: "MTR-BR-221043", state: "Bihar", zone: "Patna East", anomaly: "245% above baseline", risk: "High", est: "₹9,800/mo" },
  { id: "MTR-GJ-880234", state: "Gujarat", zone: "Surat Zone 3", anomaly: "187% above baseline", risk: "Medium", est: "₹7,200/mo" },
  { id: "MTR-AS-110987", state: "Assam", zone: "Guwahati Sector 5", anomaly: "156% above baseline", risk: "Medium", est: "₹5,600/mo" },
  { id: "MTR-UP-229341", state: "UP", zone: "Kanpur Industrial", anomaly: "134% above baseline", risk: "Low", est: "₹4,100/mo" },
];

const adoptionForecast = [
  { month: "M1", subscribers: 1200, revenue: 24 },
  { month: "M3", subscribers: 4800, revenue: 96 },
  { month: "M6", subscribers: 14000, revenue: 280 },
  { month: "M9", subscribers: 28000, revenue: 560 },
  { month: "M12", subscribers: 48000, revenue: 960 },
  { month: "M18", subscribers: 95000, revenue: 1900 },
  { month: "M24", subscribers: 1_60_000, revenue: 3200 },
];

const deploymentReadiness = [
  { state: "Uttar Pradesh", infra: 92, dataQuality: 88, gridStability: 76, overall: 85 },
  { state: "Gujarat", infra: 95, dataQuality: 91, gridStability: 88, overall: 91 },
  { state: "Bihar", infra: 74, dataQuality: 79, gridStability: 68, overall: 74 },
  { state: "Assam", infra: 68, dataQuality: 72, gridStability: 61, overall: 67 },
];

const trafficData = [
  { time: "12am", critical: 12, high: 34, standard: 180 },
  { time: "3am",  critical: 8,  high: 22, standard: 120 },
  { time: "6am",  critical: 18, high: 48, standard: 240 },
  { time: "9am",  critical: 42, high: 98, standard: 520 },
  { time: "12pm", critical: 38, high: 112, standard: 680 },
  { time: "3pm",  critical: 29, high: 88, standard: 590 },
  { time: "6pm",  critical: 55, high: 134, standard: 720 },
  { time: "9pm",  critical: 31, high: 76, standard: 410 },
];

const atcLossData = [
  { state: "UP", supplied: 9420, billed: 7650, loss: 18.8 },
  { state: "Gujarat", supplied: 7280, billed: 6540, loss: 10.2 },
  { state: "Bihar", supplied: 5610, billed: 4120, loss: 26.6 },
  { state: "Assam", supplied: 2890, billed: 2010, loss: 30.4 },
];

const saidiData = [
  { month: "Sep", saidi: 8.2, saifi: 3.1 },
  { month: "Oct", saidi: 7.6, saifi: 2.8 },
  { month: "Nov", saidi: 9.1, saifi: 3.4 },
  { month: "Dec", saidi: 6.8, saifi: 2.5 },
  { month: "Jan", saidi: 5.9, saifi: 2.1 },
];

const networkNodes = [
  { state: "UP", total: 8420, nbiot: 5080, rfmesh: 2890, plc: 450, silent: 312 },
  { state: "Gujarat", total: 6750, nbiot: 4200, rfmesh: 2180, plc: 370, silent: 98 },
  { state: "Bihar", total: 5100, nbiot: 2800, rfmesh: 1900, plc: 400, silent: 487 },
  { state: "Assam", total: 2300, nbiot: 1200, rfmesh: 820, plc: 280, silent: 221 },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: "20px 24px",
      display: "flex", flexDirection: "column", gap: 6,
      position: "relative", overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: accent }} />
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", fontFamily: "'DM Mono', monospace", letterSpacing: -1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: accent, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 3, height: 20, background: "linear-gradient(#10b981,#3b82f6)", borderRadius: 2 }} />
      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#e2e8f0", letterSpacing: 0.3 }}>{children}</h2>
    </div>
  );
}

function RiskBadge({ level }) {
  const colors = { High: "#ef4444", Medium: "#f59e0b", Low: "#10b981" };
  return (
    <span style={{
      background: colors[level] + "22",
      color: colors[level],
      border: `1px solid ${colors[level]}44`,
      borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700
    }}>{level}</span>
  );
}

function ReadinessBar({ value, color = "#10b981" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3,
          transition: "width 1s ease" }} />
      </div>
      <span style={{ fontSize: 12, color: "#94a3b8", width: 28, textAlign: "right" }}>{value}%</span>
    </div>
  );
}

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("admin@intellismart.in");
  const [pass, setPass] = useState("admin123");
  const [err, setErr] = useState("");

  const handle = () => {
    if (email === "admin@intellismart.in" && pass === "admin123") onLogin();
    else setErr("Invalid credentials. Use admin@intellismart.in / admin123");
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#060d1a",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Syne', sans-serif",
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.08) 0%, transparent 60%)"
    }}>
      <div style={{
        width: 420, background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 48
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, #10b981, #3b82f6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20
            }}>⚡</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", letterSpacing: -0.5 }}>IntelliSmart</div>
              <div style={{ fontSize: 11, color: "#10b981", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>EaaS Admin Portal</div>
            </div>
          </div>
          <p style={{ color: "#64748b", fontSize: 13, margin: "12px 0 0" }}>
            Manage EaaS rollout across your smart meter network
          </p>
        </div>

        {/* Form */}
        {[
          { label: "Email", val: email, set: setEmail, type: "email" },
          { label: "Password", val: pass, set: setPass, type: "password" }
        ].map(f => (
          <div key={f.label} style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: "#94a3b8", marginBottom: 6, fontWeight: 600, letterSpacing: 0.5 }}>{f.label}</label>
            <input
              type={f.type} value={f.val}
              onChange={e => f.set(e.target.value)}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 10,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box",
                fontFamily: "inherit"
              }}
            />
          </div>
        ))}

        {err && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{err}</div>}

        <button onClick={handle} style={{
          width: "100%", padding: "13px", borderRadius: 10, border: "none",
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
          fontFamily: "inherit", letterSpacing: 0.3
        }}>
          Sign In to Admin Portal
        </button>

        <div style={{
          marginTop: 20, padding: "12px 16px", borderRadius: 10,
          background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)"
        }}>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 4 }}>DEMO CREDENTIALS</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>admin@intellismart.in / admin123</div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function IntelliSmartAdmin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [conversionRate, setConversionRate] = useState(5);

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  const totalMeters = STATES.reduce((s, x) => s + x.meters, 0);
  const totalActive = STATES.reduce((s, x) => s + x.active, 0);
  const totalEligible = STATES.reduce((s, x) => s + x.eligible, 0);
  const projectedSubscribers = Math.round(totalEligible * conversionRate / 100);
  const projectedRevenue = (projectedSubscribers * 2000 / 100000).toFixed(1);

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "demand", label: "⚡ Demand & Grid" },
    { id: "theft", label: "🚨 Anomaly Alerts" },
    { id: "opportunity", label: "💰 Revenue Opportunity" },
    { id: "readiness", label: "🚀 Deployment Readiness" },
    { id: "cbqos", label: "🌐 CBQoS & AMI 2.0" },
  ];

  const styles = {
    root: {
      minHeight: "100vh", background: "#060d1a",
      fontFamily: "'Syne', sans-serif", color: "#e2e8f0",
      backgroundImage: "radial-gradient(ellipse at 0% 0%, rgba(16,185,129,0.05) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(59,130,246,0.05) 0%, transparent 50%)"
    },
    nav: {
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "0 32px",
      background: "rgba(6,13,26,0.95)",
      backdropFilter: "blur(12px)",
      position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center", gap: 0
    },
    logo: {
      display: "flex", alignItems: "center", gap: 10,
      padding: "16px 0", marginRight: 32, borderRight: "1px solid rgba(255,255,255,0.06)", paddingRight: 32
    },
    tabBtn: (active) => ({
      padding: "18px 16px", fontSize: 13, fontWeight: active ? 700 : 500,
      color: active ? "#10b981" : "#64748b", background: "none", border: "none",
      borderBottom: active ? "2px solid #10b981" : "2px solid transparent",
      cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
      transition: "all 0.2s"
    }),
    content: { padding: "32px", maxWidth: 1400, margin: "0 auto" },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 },
    grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 },
    card: {
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, padding: 24
    },
  };

  return (
    <div style={styles.root}>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
      * { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #060d1a; } ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
      `}</style>

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#10b981,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#f1f5f9", lineHeight: 1 }}>IntelliSmart</div>
            <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>EaaS Admin</div>
          </div>
        </div>
        {tabs.map(t => (
          <button key={t.id} style={styles.tabBtn(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
          <span style={{ fontSize: 12, color: "#64748b" }}>Live · admin@intellismart.in</span>
          <button onClick={() => setLoggedIn(false)} style={{ marginLeft: 8, padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "none", color: "#94a3b8", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#f1f5f9" }}>Smart Meter Network Overview</h1>
              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13 }}>
                IntelliSmart's existing infrastructure — the foundation for EaaS rollout
              </p>
            </div>

            <div style={styles.grid4}>
              <StatCard icon="🔌" label="Total Meters Deployed" value={totalMeters.toLocaleString("en-IN")} sub="Across 4 states" accent="#10b981" />
              <StatCard icon="✅" label="Active Meters" value={totalActive.toLocaleString("en-IN")} sub={`${((totalActive/totalMeters)*100).toFixed(1)}% uptime`} accent="#3b82f6" />
              <StatCard icon="⭐" label="EaaS-Eligible Consumers" value={totalEligible.toLocaleString("en-IN")} sub="Based on consumption profile" accent="#f59e0b" />
              <StatCard icon="🚨" label="Anomaly Alerts Today" value="47" sub="₹2.3L potential recovery" accent="#ef4444" />
            </div>

            <SectionTitle>State-wise Meter Distribution</SectionTitle>
            <div style={styles.grid2}>
              {STATES.map(s => (
                <div key={s.id} style={{ ...styles.card, borderTop: `2px solid ${s.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>DISCOM Smart Meter Network</div>
                    </div>
                    <span style={{ background: s.color + "22", color: s.color, border: `1px solid ${s.color}44`, borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>
                      Active
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    {[
                      { l: "Total Meters", v: s.meters.toLocaleString("en-IN") },
                      { l: "Active", v: s.active.toLocaleString("en-IN") },
                      { l: "EaaS Eligible", v: s.eligible.toLocaleString("en-IN") },
                    ].map(m => (
                      <div key={m.l} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", fontFamily: "'DM Mono', monospace" }}>{m.v}</div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{m.l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: "#64748b" }}>Network Uptime</span>
                      <span style={{ fontSize: 11, color: s.color, fontWeight: 700 }}>{((s.active/s.meters)*100).toFixed(1)}%</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                      <div style={{ width: `${(s.active/s.meters)*100}%`, height: "100%", background: s.color, borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── DEMAND & GRID TAB ── */}
        {activeTab === "demand" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#f1f5f9" }}>Demand Forecasting & Grid Health</h1>
              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13 }}>Real-time demand patterns from smart meter data — identifying zones for EaaS prioritization</p>
            </div>

            <div style={styles.grid4}>
              <StatCard icon="📈" label="Peak Demand Today" value="1,020 MW" sub="Uttar Pradesh · 6PM" accent="#f59e0b" />
              <StatCard icon="🔮" label="Tomorrow's Forecast" value="1,148 MW" sub="+12.5% above avg" accent="#ef4444" />
              <StatCard icon="☀️" label="Solar Offset Potential" value="23%" sub="If EaaS adopted at 5%" accent="#10b981" />
              <StatCard icon="⚡" label="Grid Stress Zones" value="7 Zones" sub="Critical load areas" accent="#8b5cf6" />
            </div>

            <SectionTitle>24-Hour Demand Pattern by State (MW)</SectionTitle>
            <div style={{ ...styles.card, marginBottom: 24 }}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={demandData}>
                  <defs>
                    {STATES.map(s => (
                      <linearGradient key={s.id} id={`g-${s.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0f1929", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
                  {STATES.map(s => (
                    <Area key={s.id} type="monotone" dataKey={s.id} name={s.name.split(" ")[0]}
                      stroke={s.color} fill={`url(#g-${s.id})`} strokeWidth={2} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <SectionTitle>High-Demand Zones — Priority for EaaS Solar Rollout</SectionTitle>
            <div style={styles.grid2}>
              {[
                { zone: "Lucknow Metro", state: "UP", load: 94, priority: "Critical", potential: "₹4.2Cr/yr" },
                { zone: "Surat Industrial", state: "Gujarat", load: 89, priority: "Critical", potential: "₹3.8Cr/yr" },
                { zone: "Patna East", state: "Bihar", load: 78, priority: "High", potential: "₹2.1Cr/yr" },
                { zone: "Guwahati Central", state: "Assam", load: 72, priority: "High", potential: "₹1.6Cr/yr" },
              ].map(z => (
                <div key={z.zone} style={styles.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{z.zone}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{z.state}</div>
                    </div>
                    <RiskBadge level={z.priority === "Critical" ? "High" : "Medium"} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>Grid Load</span>
                    <span style={{ fontSize: 12, color: z.load > 85 ? "#ef4444" : "#f59e0b", fontWeight: 700 }}>{z.load}%</span>
                  </div>
                  <ReadinessBar value={z.load} color={z.load > 85 ? "#ef4444" : "#f59e0b"} />
                  <div style={{ marginTop: 12, fontSize: 13, color: "#10b981", fontWeight: 700 }}>
                    EaaS Revenue Potential: {z.potential}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── THEFT ALERTS TAB ── */}
        {activeTab === "theft" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#f1f5f9" }}>Anomaly & Theft Detection</h1>
              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13 }}>ML-powered anomaly detection on smart meter data — directly recovering DISCOM revenue</p>
            </div>

            <div style={styles.grid4}>
              <StatCard icon="🚨" label="Active Alerts" value="47" sub="Across 4 states" accent="#ef4444" />
              <StatCard icon="💸" label="Est. Monthly Loss" value="₹38.4L" sub="From flagged meters" accent="#ef4444" />
              <StatCard icon="✅" label="Resolved This Month" value="128" sub="₹22.1L recovered" accent="#10b981" />
              <StatCard icon="📊" label="Detection Accuracy" value="94.2%" sub="ML model confidence" accent="#3b82f6" />
            </div>

            <SectionTitle>Active Anomaly Alerts</SectionTitle>
            <div style={{ ...styles.card, marginBottom: 24 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Meter ID", "State", "Zone", "Anomaly", "Risk Level", "Est. Revenue Loss", "Action"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {theftAlerts.map((a) => (
                    <tr key={a.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "14px", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#f1f5f9" }}>{a.id}</td>
                      <td style={{ padding: "14px", fontSize: 13, color: "#94a3b8" }}>{a.state}</td>
                      <td style={{ padding: "14px", fontSize: 13, color: "#94a3b8" }}>{a.zone}</td>
                      <td style={{ padding: "14px", fontSize: 12, color: "#f59e0b" }}>{a.anomaly}</td>
                      <td style={{ padding: "14px" }}><RiskBadge level={a.risk} /></td>
                      <td style={{ padding: "14px", fontSize: 13, color: "#ef4444", fontWeight: 700 }}>{a.est}</td>
                      <td style={{ padding: "14px" }}>
                        <button style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)", color: "#10b981", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                          Investigate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SectionTitle>Monthly Recovery Trend</SectionTitle>
            <div style={styles.card}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[
                  { m: "Sep", alerts: 38, recovered: 18 },
                  { m: "Oct", alerts: 52, recovered: 29 },
                  { m: "Nov", alerts: 61, recovered: 38 },
                  { m: "Dec", alerts: 44, recovered: 31 },
                  { m: "Jan", alerts: 47, recovered: 128 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="m" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0f1929", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
                  <Bar dataKey="alerts" name="New Alerts" fill="#ef444466" radius={[4,4,0,0]} />
                  <Bar dataKey="recovered" name="Resolved" fill="#10b981" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* ── REVENUE OPPORTUNITY TAB ── */}
        {activeTab === "opportunity" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#f1f5f9" }}>EaaS Revenue Opportunity</h1>
              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13 }}>Projected additional revenue for DISCOMs by converting meter holders to EaaS subscribers</p>
            </div>

            <div style={{ ...styles.card, marginBottom: 24, borderColor: "rgba(16,185,129,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>Revenue Calculator</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Adjust EaaS adoption rate across eligible meter holders</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#10b981", fontFamily: "'DM Mono', monospace" }}>₹{projectedRevenue}L</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>projected monthly revenue</div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>Adoption Rate</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#f59e0b", fontFamily: "'DM Mono', monospace" }}>{conversionRate}%</span>
                </div>
                <input type="range" min={1} max={30} value={conversionRate}
                  onChange={e => setConversionRate(+e.target.value)}
                  style={{ width: "100%", accentColor: "#10b981", cursor: "pointer" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: "#475569" }}>1% (Conservative)</span>
                  <span style={{ fontSize: 11, color: "#475569" }}>30% (Aggressive)</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[
                  { l: "EaaS Subscribers", v: projectedSubscribers.toLocaleString("en-IN"), c: "#3b82f6" },
                  { l: "Monthly Revenue", v: `₹${projectedRevenue}L`, c: "#10b981" },
                  { l: "Annual Revenue", v: `₹${(projectedRevenue * 12).toFixed(0)}L`, c: "#f59e0b" },
                ].map(m => (
                  <div key={m.l} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: m.c, fontFamily: "'DM Mono', monospace" }}>{m.v}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{m.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <SectionTitle>Adoption Growth Forecast (24 Months)</SectionTitle>
            <div style={styles.card}>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={adoptionForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis yAxisId="left" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0f1929", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
                  <Line yAxisId="left" type="monotone" dataKey="subscribers" name="Subscribers" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue (₹L)" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* ── DEPLOYMENT READINESS TAB ── */}
        {activeTab === "readiness" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#f1f5f9" }}>EaaS Deployment Readiness</h1>
              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13 }}>State-by-state readiness assessment for EaaS rollout based on existing infrastructure</p>
            </div>

            <div style={styles.grid4}>
              <StatCard icon="🥇" label="Most Ready State" value="Gujarat" sub="91% readiness score" accent="#10b981" />
              <StatCard icon="📅" label="Fastest Rollout" value="45 Days" sub="Gujarat pilot estimate" accent="#3b82f6" />
              <StatCard icon="🏗️" label="Infra Upgrades Needed" value="Bihar · Assam" sub="Grid stability work req." accent="#f59e0b" />
              <StatCard icon="🎯" label="Recommended Start" value="Gujarat → UP" sub="Phased rollout plan" accent="#8b5cf6" />
            </div>

            <SectionTitle>Readiness Scorecard by State</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
              {deploymentReadiness.map((s, i) => {
                const colors = ["#10b981", "#8b5cf6", "#3b82f6", "#f59e0b"];
                const c = colors[i];
                return (
                  <div key={s.state} style={{ ...styles.card, borderLeft: `3px solid ${c}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>{s.state}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: c, fontFamily: "'DM Mono', monospace" }}>{s.overall}%</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>Overall</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                      {[
                        { l: "Infrastructure", v: s.infra },
                        { l: "Data Quality", v: s.dataQuality },
                        { l: "Grid Stability", v: s.gridStability },
                      ].map(m => (
                        <div key={m.l}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 12, color: "#94a3b8" }}>{m.l}</span>
                          </div>
                          <ReadinessBar value={m.v} color={c} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <SectionTitle>Recommended Rollout Phases</SectionTitle>
            <div style={styles.grid2}>
              {[
                { phase: "Phase 1", timeline: "Month 1–3", state: "Gujarat", desc: "Highest readiness. Start with Surat industrial zones. Target 15,000 subscribers.", color: "#10b981" },
                { phase: "Phase 2", timeline: "Month 3–6", state: "Uttar Pradesh", desc: "Largest meter base. Focus on Lucknow, Kanpur metros. Target 40,000 subscribers.", color: "#3b82f6" },
                { phase: "Phase 3", timeline: "Month 6–12", state: "Bihar", desc: "Parallel infra upgrades. Patna East as pilot zone. Target 20,000 subscribers.", color: "#f59e0b" },
                { phase: "Phase 4", timeline: "Month 9–15", state: "Assam", desc: "Grid stability improvements required first. Guwahati pilot. Target 10,000 subscribers.", color: "#8b5cf6" },
              ].map(p => (
                <div key={p.phase} style={{ ...styles.card, borderTop: `2px solid ${p.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: p.color, letterSpacing: 1, textTransform: "uppercase" }}>{p.phase}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginTop: 2 }}>{p.state}</div>
                    </div>
                    <span style={{ background: p.color + "22", color: p.color, border: `1px solid ${p.color}44`, borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>
                      {p.timeline}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── CBQoS & AMI 2.0 TAB ── */}
        {activeTab === "cbqos" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#f1f5f9" }}>CBQoS & AMI 2.0 Network</h1>
              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13 }}>
                Class-Based Quality of Service managing AMI 2.0 meter data traffic — ensuring critical grid signals are always prioritized
              </p>
            </div>

            <div style={{
              ...styles.card, marginBottom: 24,
              background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.08))",
              borderColor: "rgba(16,185,129,0.2)"
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                {[
                  { icon: "📡", title: "Edge Intelligence", desc: "Meters act as edge computers, processing data locally in real-time" },
                  { icon: "↔️", title: "Bidirectional Flow", desc: "Two-way energy management for solar, EVs and home batteries" },
                  { icon: "🔗", title: "High-Freq Comms", desc: "NB-IoT / RF Mesh / 4G/5G near-instantaneous communication" },
                  { icon: "🧠", title: "NILM AI", desc: "Appliance-level disaggregation from a single meter reading" },
                ].map(f => (
                  <div key={f.title} style={{ textAlign: "center", padding: "8px" }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{f.title}</div>
                    <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.grid4}>
              <StatCard icon="🔴" label="Critical Traffic" value="55 req/s" sub="Last gasp · Grid alerts" accent="#ef4444" />
              <StatCard icon="🟡" label="High Priority" value="134 req/s" sub="Theft · Demand response" accent="#f59e0b" />
              <StatCard icon="🟢" label="Standard Traffic" value="720 req/s" sub="Billing · Firmware updates" accent="#10b981" />
              <StatCard icon="📵" label="Silent Meters" value="1,118" sub="Not communicating now" accent="#8b5cf6" />
            </div>

            <SectionTitle>CBQoS Traffic Priority Classification (req/s)</SectionTitle>
            <div style={{ ...styles.card, marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                {[
                  { color: "#ef4444", label: "Critical — Outage alerts, last-gasp, grid stability" },
                  { color: "#f59e0b", label: "High — Theft anomalies, demand response" },
                  { color: "#10b981", label: "Standard — Billing, usage reports, firmware" },
                ].map(t => (
                  <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{t.label}</span>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trafficData}>
                  <defs>
                    {[["critical","#ef4444"],["high","#f59e0b"],["standard","#10b981"]].map(([k,c]) => (
                      <linearGradient key={k} id={"cg-" + k} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={c} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={c} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0f1929", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0" }} />
                  <Area type="monotone" dataKey="critical" name="Critical" stroke="#ef4444" fill="url(#cg-critical)" strokeWidth={2} />
                  <Area type="monotone" dataKey="high" name="High Priority" stroke="#f59e0b" fill="url(#cg-high)" strokeWidth={2} />
                  <Area type="monotone" dataKey="standard" name="Standard" stroke="#10b981" fill="url(#cg-standard)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.grid2}>
              <div>
                <SectionTitle>AT&C Loss by State</SectionTitle>
                <div style={styles.card}>
                  <div style={{ marginBottom: 12, fontSize: 12, color: "#64748b" }}>
                    Aggregate Technical & Commercial loss = Energy supplied vs energy billed
                  </div>
                  {atcLossData.map((s, i) => {
                    const colors = ["#10b981","#8b5cf6","#f59e0b","#ef4444"];
                    const c = colors[i];
                    return (
                      <div key={s.state} style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 4 }}>
                          <span style={{ fontSize: 13, color: "#f1f5f9", fontWeight: 600 }}>{s.state}</span>
                          <div style={{ display: "flex", gap: 12 }}>
                            <span style={{ fontSize: 11, color: "#64748b" }}>Supplied: {s.supplied} MU</span>
                            <span style={{ fontSize: 11, color: "#64748b" }}>Billed: {s.billed} MU</span>
                            <span style={{ fontSize: 12, fontWeight: 800, color: s.loss > 20 ? "#ef4444" : "#f59e0b" }}>{s.loss}% loss</span>
                          </div>
                        </div>
                        <ReadinessBar value={100 - s.loss} color={s.loss > 20 ? "#ef4444" : c} />
                      </div>
                    );
                  })}
                  <div style={{ marginTop: 16, padding: "12px", background: "rgba(16,185,129,0.06)", borderRadius: 10, border: "1px solid rgba(16,185,129,0.15)" }}>
                    <div style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>EaaS Impact on AT&C</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Solar EaaS consumers reduce grid draw, directly lowering technical losses and improving AT&C metrics for DISCOMs</div>
                  </div>
                </div>
              </div>

              <div>
                <SectionTitle>Grid Reliability — SAIDI / SAIFI Trend</SectionTitle>
                <div style={styles.card}>
                  <div style={{ marginBottom: 12, fontSize: 12, color: "#64748b" }}>
                    SAIDI = Avg outage duration (hrs/customer) · SAIFI = Avg outage frequency
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={saidiData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} />
                      <YAxis stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: "#0f1929", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0" }} />
                      <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
                      <Line type="monotone" dataKey="saidi" name="SAIDI (hrs)" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
                      <Line type="monotone" dataKey="saifi" name="SAIFI (count)" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(59,130,246,0.06)", borderRadius: 10, border: "1px solid rgba(59,130,246,0.15)" }}>
                    <div style={{ fontSize: 12, color: "#3b82f6", fontWeight: 700 }}>📉 Improving trend</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>SAIDI reduced 28% over 5 months — faster outage detection via AMI 2.0 real-time alerts</div>
                  </div>
                </div>
              </div>
            </div>

            <SectionTitle>AMI 2.0 Communication Protocol Distribution</SectionTitle>
            <div style={styles.card}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["State", "Total Meters", "NB-IoT", "RF Mesh", "PLC", "Silent", "Network Health"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {networkNodes.map((n) => {
                    const health = (((n.total - n.silent) / n.total) * 100).toFixed(1);
                    const healthColor = health > 95 ? "#10b981" : health > 90 ? "#f59e0b" : "#ef4444";
                    return (
                      <tr key={n.state} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "14px", fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{n.state}</td>
                        <td style={{ padding: "14px", fontSize: 13, color: "#94a3b8", fontFamily: "'DM Mono', monospace" }}>{n.total.toLocaleString("en-IN")}</td>
                        <td style={{ padding: "14px" }}><span style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{n.nbiot.toLocaleString("en-IN")}</span></td>
                        <td style={{ padding: "14px" }}><span style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{n.rfmesh.toLocaleString("en-IN")}</span></td>
                        <td style={{ padding: "14px" }}><span style={{ background: "rgba(139,92,246,0.15)", color: "#8b5cf6", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{n.plc.toLocaleString("en-IN")}</span></td>
                        <td style={{ padding: "14px" }}><span style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{n.silent.toLocaleString("en-IN")}</span></td>
                        <td style={{ padding: "14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
                              <div style={{ width: health + "%", height: "100%", background: healthColor, borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 12, color: healthColor, fontWeight: 700, width: 42 }}>{health}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
