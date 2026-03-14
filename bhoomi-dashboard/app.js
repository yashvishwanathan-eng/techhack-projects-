import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QRPage from './pages/QRPage';

function App() {
  return (
    <Router>
      {/* Top green navigation bar */}
      <nav style={{
        backgroundColor: '#1a6b3c',
        padding: '14px 28px',
        display: 'flex',
        gap: '28px',
        alignItems: 'center'
      }}>
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '22px' }}>
          🌱 Bhoomi
        </span>
        <Link to="/"          style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>Register</Link>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>Dashboard</Link>
        <Link to="/qr"        style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>QR Code</Link>
      </nav>

      <Routes>
        <Route path="/"          element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/qr"        element={<QRPage />} />
      </Routes>
    </Router>
  );
}

export default App;
import { useState } from 'react';
import axios from 'axios';

// This is Member 2's backend address. Change it when they share their URL.
const BACKEND = 'http://localhost:3001';

function Register() {
  // "form" holds what the user types
  const [form, setForm]       = useState({ name: '', phone: '', village: '', language: 'tamil' });
  const [message, setMessage] = useState('');   // success or error text
  const [loading, setLoading] = useState(false); // shows "Registering..." on button

  // Called every time user types in any input box
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Called when user clicks the Register button
  const handleSubmit = async () => {
    // Check all fields are filled
    if (!form.name || !form.phone || !form.village) {
      setMessage('❌ Please fill all fields');
      return;
    }
    if (!form.phone.startsWith('+')) {
      setMessage('❌ Phone number must start with + and country code. Example: +919876543210');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Try to send to Member 2's backend
      await axios.post(`${BACKEND}/register`, form);
      setMessage('✅ Registered successfully!');

    } catch (err) {
      // Backend not connected yet? Save to browser memory for demo
      const saved = JSON.parse(localStorage.getItem('bhoomi') || '[]');
      saved.push({ ...form, id: Date.now() });
      localStorage.setItem('bhoomi', JSON.stringify(saved));
      setMessage('✅ Registered! (saved locally — backend not ready yet)');
    }

    // Clear the form
    setForm({ name: '', phone: '', village: '', language: 'tamil' });
    setLoading(false);
  };

  // Reusable style for all input boxes
  const box = {
    width: '100%', padding: '12px', marginBottom: '18px',
    borderRadius: '8px', border: '1px solid #ccc',
    fontSize: '16px', boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', padding: '0 20px' }}>
      <h2 style={{ color: '#1a6b3c', marginBottom: '6px' }}>📋 Villager Registration</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        Add a villager to receive emergency voice alerts
      </p>

      <label>Full Name</label>
      <input style={box} name="name" placeholder="e.g. Rajan Kumar"
        value={form.name} onChange={handleChange} />

      <label>Phone Number (with country code)</label>
      <input style={box} name="phone" placeholder="+919876543210"
        value={form.phone} onChange={handleChange} />

      <label>Village / District</label>
      <input style={box} name="village" placeholder="e.g. Thanjavur"
        value={form.village} onChange={handleChange} />

      <label>Preferred Language</label>
      <select style={box} name="language" value={form.language} onChange={handleChange}>
        <option value="tamil">Tamil</option>
        <option value="hindi">Hindi</option>
        <option value="telugu">Telugu</option>
        <option value="kannada">Kannada</option>
      </select>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%', padding: '14px',
          backgroundColor: loading ? '#999' : '#1a6b3c',
          color: 'white', border: 'none', borderRadius: '8px',
          fontSize: '16px', fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Registering...' : 'Register Villager'}
      </button>

      {/* Show success or error message */}
      {message && (
        <div style={{
          marginTop: '16px', padding: '14px', borderRadius: '8px',
          backgroundColor: message.startsWith('✅') ? '#e6f4ea' : '#fdecea',
          color: message.startsWith('✅') ? '#1a6b3c' : '#c0392b',
          fontWeight: '500'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Register;
import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND = 'http://localhost:3001';

// Demo contacts shown when backend isn't connected yet
const DEMO_CONTACTS = [
  { name: 'Rajan Kumar',  phone: '+919876543210', village: 'Thanjavur',  language: 'tamil' },
  { name: 'Meena Devi',   phone: '+919876543211', village: 'Kumbakonam', language: 'tamil' },
  { name: 'Suresh Babu',  phone: '+919876543212', village: 'Papanasam',  language: 'tamil' },
];

function Dashboard() {
  const [contacts,    setContacts]    = useState([]);
  const [tier,        setTier]        = useState(1);
  const [alertMsg,    setAlertMsg]    = useState('');
  const [sending,     setSending]     = useState(false);
  const [statuses,    setStatuses]    = useState({}); // tracks call result per phone

  // Load contacts when the page first opens
  useEffect(() => { loadContacts(); }, []);

  const loadContacts = async () => {
    try {
      const res = await axios.get(`${BACKEND}/contacts`);
      setContacts(res.data);
    } catch {
      // Backend not ready — use local storage or demo data
      const local = JSON.parse(localStorage.getItem('bhoomi') || '[]');
      setContacts(local.length > 0 ? local : DEMO_CONTACTS);
    }
  };

  const sendAlert = async () => {
    if (!alertMsg.trim()) { alert('Please type an alert message!'); return; }
    if (contacts.length === 0) { alert('No contacts registered!'); return; }

    setSending(true);

    // Mark everyone as "calling..."
    const init = {};
    contacts.forEach(c => { init[c.phone] = 'calling...'; });
    setStatuses(init);

    try {
      await axios.post(`${BACKEND}/send-alert`, {
        tier,
        message: alertMsg,
        contacts: contacts.map(c => c.phone)
      });
    } catch {
      // Backend not ready — still run the visual simulation below
    }

    // Simulate real-time status updates for the demo
    // (in real app, these come from Twilio via Member 4)
    contacts.forEach((c, i) => {
      setTimeout(() => {
        setStatuses(prev => ({
          ...prev,
          [c.phone]: Math.random() > 0.25 ? '✅ Confirmed' : '❌ No Answer'
        }));
      }, 1500 + i * 700);
    });

    setSending(false);
  };

  // Colors and labels for each tier
  const tierColor = { 1: '#c0392b', 2: '#e67e22', 3: '#2980b9', 4: '#27ae60' };
  const tierLabel = {
    1: '🔴 Tier 1 — CRITICAL → Immediate voice call + redial if no answer',
    2: '🟠 Tier 2 — HIGH → Voice call within 15 minutes',
    3: '🔵 Tier 3 — MEDIUM → SMS only (no call)',
    4: '🟢 Tier 4 — LOW → SMS / notification',
  };

  const confirmed = Object.values(statuses).filter(s => s === '✅ Confirmed').length;
  const noAnswer  = Object.values(statuses).filter(s => s === '❌ No Answer').length;
  const calling   = Object.values(statuses).filter(s => s === 'calling...').length;

  return (
    <div style={{ maxWidth: '860px', margin: '30px auto', padding: '0 20px' }}>
      <h2 style={{ color: '#1a6b3c' }}>🚨 Alert Control Panel</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        Send emergency alerts to all registered villagers
      </p>

      {/* ── STAT BOXES ── */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {[
          { label: 'Registered', value: contacts.length,  bg: '#1a6b3c' },
          { label: 'Calling',    value: calling,           bg: '#856404' },
          { label: 'Confirmed',  value: confirmed,         bg: '#27ae60' },
          { label: 'No Answer',  value: noAnswer,          bg: '#c0392b' },
        ].map(s => (
          <div key={s.label} style={{
            backgroundColor: s.bg, color: 'white',
            padding: '16px 22px', borderRadius: '10px', textAlign: 'center', minWidth: '100px'
          }}>
            <div style={{ fontSize: '30px', fontWeight: 'bold' }}>{s.value}</div>
            <div style={{ fontSize: '13px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── TIER SELECTOR ── */}
      <div style={{ marginBottom: '22px' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>1. Choose Alert Tier:</p>
        {[1, 2, 3, 4].map(t => (
          <label key={t} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '11px 14px', marginBottom: '8px', borderRadius: '8px', cursor: 'pointer',
            border: `2px solid ${tier === t ? tierColor[t] : '#ddd'}`,
            backgroundColor: tier === t ? tierColor[t] + '18' : 'white'
          }}>
            <input type="radio" name="tier" checked={tier === t}
              onChange={() => setTier(t)} />
            <span style={{ fontSize: '15px' }}>{tierLabel[t]}</span>
          </label>
        ))}
      </div>

      {/* ── MESSAGE BOX ── */}
      <div style={{ marginBottom: '22px' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>2. Type the Alert Message:</p>
        <textarea
          value={alertMsg}
          onChange={e => setAlertMsg(e.target.value)}
          placeholder="e.g. Heavy flooding expected in Thanjavur. All residents in low-lying areas must evacuate now."
          rows={4}
          style={{
            width: '100%', padding: '12px', fontSize: '15px',
            borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box'
          }}
        />
        <p style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>
          💡 Claude (Member 3) will automatically rewrite this in simple Tamil/Hindi before calling
        </p>
      </div>

      {/* ── SEND BUTTON ── */}
      <button
        onClick={sendAlert}
        disabled={sending}
        style={{
          padding: '16px 36px', fontSize: '17px', fontWeight: 'bold',
          backgroundColor: sending ? '#aaa' : tierColor[tier],
          color: 'white', border: 'none', borderRadius: '10px',
          cursor: sending ? 'not-allowed' : 'pointer',
          marginBottom: '36px', width: '100%'
        }}
      >
        {sending
          ? '📡 Sending alerts...'
          : `🚨 SEND TIER ${tier} ALERT TO ${contacts.length} PEOPLE`}
      </button>

      {/* ── CONTACTS TABLE ── */}
      <h3 style={{ color: '#333', marginBottom: '12px' }}>
        📋 Registered Villagers ({contacts.length})
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#1a6b3c', color: 'white' }}>
            {['Name', 'Phone', 'Village', 'Language', 'Call Status'].map(h => (
              <th key={h} style={{ padding: '12px', textAlign: 'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contacts.map((c, i) => {
            const s = statuses[c.phone];
            const statusBg =
              s === '✅ Confirmed' ? '#e6f4ea' :
              s === '❌ No Answer' ? '#fdecea' :
              s === 'calling...'   ? '#fff8e1' : '#f5f5f5';
            const statusColor =
              s === '✅ Confirmed' ? '#1a6b3c' :
              s === '❌ No Answer' ? '#c0392b' :
              s === 'calling...'   ? '#856404' : '#888';

            return (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fafafa' : 'white' }}>
                <td style={{ padding: '11px', borderBottom: '1px solid #eee' }}>{c.name}</td>
                <td style={{ padding: '11px', borderBottom: '1px solid #eee' }}>{c.phone}</td>
                <td style={{ padding: '11px', borderBottom: '1px solid #eee' }}>{c.village}</td>
                <td style={{ padding: '11px', borderBottom: '1px solid #eee', textTransform: 'capitalize' }}>{c.language}</td>
                <td style={{ padding: '11px', borderBottom: '1px solid #eee' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '12px', fontSize: '13px',
                    backgroundColor: statusBg, color: statusColor, fontWeight: '500'
                  }}>
                    {s || 'Standby'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {contacts.length === 0 && (
        <p style={{ textAlign: 'center', color: '#aaa', padding: '30px' }}>
          No villagers yet. Go to the Register page to add some.
        </p>
      )}
    </div>
  );
}

export default Dashboard;
