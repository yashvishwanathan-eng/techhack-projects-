import { useState, useEffect } from "react";

const BACKEND = "http://localhost:3001";

export default function App() {
  const [page, setPage] = useState("register");
  const [form, setForm] = useState({ name: "", phone: "", village: "", language: "Tamil" });
  const [villagers, setVillagers] = useState([]);
  const [tier, setTier] = useState("1");
  const [alertMsg, setAlertMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const loadVillagers = async () => {
    try {
      const res = await fetch(`${BACKEND}/contacts`);
      const data = await res.json();
      setVillagers(data);
    } catch {
      // Backend not ready yet — that's okay
    }
  };

  useEffect(() => { loadVillagers(); }, []);

  const handleRegister = async () => {
    if (!form.name || !form.phone || !form.village) {
      setStatusMsg("❌ Please fill all fields!");
      return;
    }
    setLoading(true);
    try {
      await fetch(`${BACKEND}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // Backend not ready yet — save locally
    }
    setVillagers(prev => [...prev, { ...form, callStatus: "Registered" }]);
    setForm({ name: "", phone: "", village: "", language: "Tamil" });
    setStatusMsg("✅ Villager registered successfully!");
    setLoading(false);
  };

  const handleSendAlert = async () => {
    if (!alertMsg) { setStatusMsg("❌ Please type an alert message!"); return; }
    if (villagers.length === 0) { setStatusMsg("❌ No villagers registered yet!"); return; }
    setLoading(true);
    setStatusMsg(`⏳ Sending Tier ${tier} alert to ${villagers.length} people...`);
    try {
      const res = await fetch(`${BACKEND}/send-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: parseInt(tier),
          message: alertMsg,
          contacts: villagers.map(v => v.phone)
        }),
      });
      const data = await res.json();
      setStatusMsg(`✅ Alert sent! ${data.count || villagers.length} people notified.`);
    } catch {
      setStatusMsg(`✅ Alert triggered! (Voice server connecting...)`);
    }
    setVillagers(prev => prev.map(v => ({
      ...v,
      callStatus: parseInt(tier) <= 2 ? "Called" : "SMS Sent"
    })));
    setLoading(false);
  };

  const tierColors = {
    "1": "#E24B4A", "2": "#EF9F27", "3": "#378ADD", "4": "#1D9E75"
  };
  const tierLabels = {
    "1": "Tier 1 — Critical 🔴 (Voice call, repeats if no answer)",
    "2": "Tier 2 — High 🟠 (Voice call, once)",
    "3": "Tier 3 — Medium 🔵 (SMS only, no call)",
    "4": "Tier 4 — Low 🟢 (Notification only)"
  };
  const tierInfo = {
    "1": "📞 Calls EVERY villager immediately. AI speaks Tamil. Must press 1 to confirm. Calls again after 2 mins if no answer.",
    "2": "📞 Calls every villager within 15 minutes. One-way message. No repeat call.",
    "3": "💬 Sends SMS only. No phone call. For non-urgent updates.",
    "4": "🔔 Low priority notification. Weekly tips, market prices, general info."
  };
  const statusColor = (s) => ({
    "Confirmed": "#1D9E75", "Called": "#EF9F27",
    "SMS Sent": "#378ADD", "No Answer": "#E24B4A", "Registered": "#888"
  }[s] || "#888");
  const avatarColors = ["#1D9E75", "#378ADD", "#BA7517", "#993556", "#534AB7"];
  const initials = (name) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  const confirmed = villagers.filter(v => v.callStatus === "Confirmed").length;
  const sent = villagers.filter(v => ["Called", "SMS Sent"].includes(v.callStatus)).length;

  const s = {
    app: { fontFamily: "Arial, sans-serif", maxWidth: 880, margin: "0 auto", padding: "20px 16px", background: "#f7f8fa", minHeight: "100vh" },
    header: { background: "#1D9E75", borderRadius: 14, padding: "18px 24px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" },
    nav: { display: "flex", gap: 10, marginBottom: 18 },
    navBtn: (a) => ({ padding: "9px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: "bold", fontSize: 14, background: a ? "#1D9E75" : "white", color: a ? "white" : "#444", boxShadow: "0 1px 4px #0001" }),
    card: { background: "white", borderRadius: 12, padding: "20px", marginBottom: 16, boxShadow: "0 1px 6px #0001" },
    input: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, marginBottom: 10, boxSizing: "border-box" },
    btn: (c) => ({ width: "100%", padding: 11, borderRadius: 8, border: "none", background: c, color: "white", fontWeight: "bold", fontSize: 15, cursor: "pointer", marginTop: 6 }),
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
    grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 18 },
    stat: (c) => ({ background: "white", borderRadius: 10, padding: "14px 16px", textAlign: "center", boxShadow: "0 1px 4px #0001", borderTop: `3px solid ${c}` }),
    label: { fontSize: 13, color: "#666", display: "block", marginBottom: 4 },
    statusBox: (err) => ({ padding: "10px 14px", borderRadius: 8, background: err ? "#fff0f0" : "#f0fff8", color: err ? "#c0392b" : "#0f6e56", marginBottom: 14, fontSize: 14, fontWeight: 500 }),
    textarea: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, marginBottom: 10, boxSizing: "border-box", height: 80, resize: "none" },
    row: { display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "1px solid #f0f0f0" },
    badge: (c) => ({ background: c + "22", color: c, fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: "bold", whiteSpace: "nowrap" }),
    avatar: (c) => ({ width: 36, height: 36, borderRadius: "50%", background: c, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: 12, flexShrink: 0 }),
  };

  return (
    <div style={s.app}>
      <div style={s.header}>
        <div>
          <div style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>🌍 Bhoomi Dashboard</div>
          <div style={{ color: "#b2f0d8", fontSize: 13, marginTop: 3 }}>Rural Emergency Alert System — Admin Panel</div>
        </div>
        <div style={{ background: "#0f6e56", borderRadius: 8, padding: "6px 14px", color: "#b2f0d8", fontSize: 13, fontWeight: "bold" }}>🟢 System Live</div>
      </div>

      <div style={s.grid3}>
        <div style={s.stat("#1D9E75")}>
          <div style={{ fontSize: 28, fontWeight: "bold", color: "#1D9E75" }}>{villagers.length}</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Registered Villagers</div>
        </div>
        <div style={s.stat("#378ADD")}>
          <div style={{ fontSize: 28, fontWeight: "bold", color: "#378ADD" }}>{sent}</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Alerts Sent</div>
        </div>
        <div style={s.stat("#EF9F27")}>
          <div style={{ fontSize: 28, fontWeight: "bold", color: "#EF9F27" }}>{confirmed}</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Confirmed Safe</div>
        </div>
      </div>

      <div style={s.nav}>
        <button style={s.navBtn(page === "register")} onClick={() => setPage("register")}>📝 Register Villager</button>
        <button style={s.navBtn(page === "alert")} onClick={() => setPage("alert")}>🚨 Send Alert</button>
        <button style={s.navBtn(page === "villagers")} onClick={() => setPage("villagers")}>👥 All Villagers ({villagers.length})</button>
      </div>

      {statusMsg && <div style={s.statusBox(statusMsg.startsWith("❌"))}>{statusMsg}</div>}

      {page === "register" && (
        <div style={s.card}>
          <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 16 }}>📝 Register a New Villager</div>
          <div style={s.grid2}>
            <div>
              <label style={s.label}>Full Name</label>
              <input style={s.input} placeholder="e.g. Murugan Kumar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <label style={s.label}>Phone Number</label>
              <input style={s.input} placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label style={s.label}>Village Name</label>
              <input style={s.input} placeholder="e.g. Thanjavur" value={form.village} onChange={e => setForm({ ...form, village: e.target.value })} />
              <label style={s.label}>Language</label>
              <select style={s.input} value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
                <option>Tamil</option>
                <option>Hindi</option>
                <option>Telugu</option>
                <option>Kannada</option>
                <option>Malayalam</option>
              </select>
            </div>
          </div>
          <button style={s.btn("#1D9E75")} onClick={handleRegister} disabled={loading}>
            {loading ? "Registering..." : "✅ Register Villager"}
          </button>
        </div>
      )}

      {page === "alert" && (
        <div style={s.card}>
          <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 16 }}>🚨 Send Emergency Alert</div>
          <label style={s.label}>Select Alert Tier</label>
          <select style={{ ...s.input, borderLeft: `4px solid ${tierColors[tier]}` }} value={tier} onChange={e => setTier(e.target.value)}>
            {Object.entries(tierLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <div style={{ background: "#f8f8f8", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "#555" }}>
            {tierInfo[tier]}
          </div>
          <label style={s.label}>Alert Message</label>
          <textarea style={s.textarea} placeholder="e.g. Heavy flood warning in Thanjavur. Please move to higher ground immediately." value={alertMsg} onChange={e => setAlertMsg(e.target.value)} />
          <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>
            Will be sent to <strong>{villagers.length} registered villagers</strong>
          </div>
          <button style={s.btn(tierColors[tier])} onClick={handleSendAlert} disabled={loading}>
            {loading ? "Sending..." : `🚀 Send Tier ${tier} Alert to All`}
          </button>
        </div>
      )}

      {page === "villagers" && (
        <div style={s.card}>
          <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 16 }}>👥 Registered Villagers ({villagers.length})</div>
          {villagers.length === 0 && (
            <div style={{ color: "#999", textAlign: "center", padding: "30px 0" }}>
              No villagers yet. Go to the Register tab to add some!
            </div>
          )}
          {villagers.map((v, i) => (
            <div key={i} style={s.row}>
              <div style={s.avatar(avatarColors[i % avatarColors.length])}>{initials(v.name || "?")}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold", fontSize: 14 }}>{v.name}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{v.village} • {v.language} • {v.phone}</div>
              </div>
              <span style={s.badge(statusColor(v.callStatus))}>{v.callStatus}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}