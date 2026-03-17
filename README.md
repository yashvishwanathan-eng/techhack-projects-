# 🌱 Bhoomi — AI-Powered Rural Emergency Alert System

> *"One phone call can save a life. Bhoomi makes that call."*

Built at Tech Hacks 2.0 | SRM Institute | 17 Hours

---

## 🚨 The Problem

350 million people in rural India have:
- No smartphone
- No internet
- No way to receive emergency warnings

When floods hit — they have no warning.

---

## ✅ Our Solution

Bhoomi is a fully autonomous AI system that:
- Monitors weather data 24/7
- Classifies emergency tier automatically
- Writes alerts in Tamil, Hindi, Telugu
- Calls thousands of button phones simultaneously
- No human admin needed
- Works in 30 seconds

---

## 🏗️ Architecture
```
Weather API → AI Tier Classifier → Groq LLM (Message Writer) → Twilio (Voice Calls)
                                                              → SMS (Advisory)
                                                              → Dashboard (Live Status)
```

---

## 📊 Alert Tier System

| Tier | Level | Action | Example |
|------|-------|--------|---------|
| 1 | Critical | Immediate voice call | Flood evacuation |
| 2 | High | Voice call within 15 min | Heavy rainfall |
| 3 | Medium | SMS only | Light rain advisory |
| 4 | Low | Notification | Weekly crop tips |

---

## 👥 Team Roles

| Member | Role | Tools |
|--------|------|-------|
| Member 1 | Frontend Dashboard | React, TailwindCSS |
| Member 2 | Backend API | Node.js, Express, Firebase |
| Member 3 | AI Agent Pipeline | Python, LangChain, Groq API |
| Member 4 | Voice & Calling | Twilio, ElevenLabs |

---

## 🛠️ Tech Stack

- **AI Agent** — Python, LangChain, Groq (LLaMA 3.3)
- **Weather Data** — OpenWeatherMap API
- **Message Writing** — Groq AI (Tamil, Hindi, Telugu)
- **Voice Calls** — Twilio
- **Backend** — Node.js, Express
- **Frontend** — React, TailwindCSS
- **Database** — Firebase

---

## 🚀 How to Run

### 1. Backend
```bash
cd backend
npm install
npm start
```

### 2. Dashboard
```bash
cd bhoomi-dashboard
npm install
npm start
```

### 3. AI Agent
```bash
cd ai-agent
pip install -r requirements.txt
python agent.py
```

### 4. Voice Calling
```bash
cd voiceAI
npm install
node test-call.js
```

---

## 🔑 Environment Variables

Create `.env` files in each folder:

**ai-agent/.env**
```
OPENWEATHER_API_KEY=your-key
GROQ_API_KEY=your-key
BACKEND_URL=http://localhost:3001
```

**voiceAI/.env**
```
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=your-number
```

---

## 🎯 Demo Flow

1. Register a villager on the dashboard
2. Run `python demo_trigger.py` to trigger Tier 1 flood alert
3. AI writes Tamil/Hindi/Telugu messages automatically
4. Phone rings with flood warning in 30 seconds
5. Dashboard updates with confirmed status

---

## 💡 Impact

- **Zero infrastructure needed** — works on any button phone
- **30 seconds** from danger detected to 10,000 people warned
- **$0.01 per call** — life-saving alerts at minimal cost
- **3 languages** supported — Tamil, Hindi, Telugu

---

## 🏆 Built at Tech Hacks 2.0

> *350 million people have no smartphone. Bhoomi gives them a lifeline.*

SDG 13 — Climate Action | Problem Statement 8
```

Save with **Ctrl + S**, then push to GitHub:
```
cd ..
git add .
git commit -m "added README"
git push
