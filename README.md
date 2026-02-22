# EaaS Plus v1 — Energy-as-a-Service Platform

A full-stack Energy-as-a-Service (EaaS) platform prototype built for the IntelliSmart hackathon. The platform consists of two parts:

1. **Consumer App** — [eaasv1.netlify.app](https://eaasv1.netlify.app) — for end consumers to subscribe to solar energy plans, track usage, manage billing, and interact with an AI energy advisor.

2. **IntelliSmart Admin Portal** — [eaasv1.netlify.app/admin](https://eaasv1.netlify.app/admin) — for IntelliSmart operators to manage EaaS rollout across their existing smart meter network across UP, Bihar, Assam, and Gujarat.

---

## Demo Credentials

### Consumer App
- **User 1:** demo@eaas.com / demo123
- **User 2:** demo2@eaas.com / demo123

### IntelliSmart Admin Portal
- **Admin:** admin@intellismart.in / admin123

---

## Features

### Consumer App
- 🌞 Solar energy subscription plans (Basic Solar, Solar + Battery, Premium)
- 📊 Real-time energy dashboard (solar generation, battery level, grid import/export)
- 💳 Billing management with INR pricing
- 🔗 DISCOM integration and net-metering tracker
- 🤖 Lumi AI Advisor powered by Gemini 2.0
- ⚙️ Subscription and settings management

### IntelliSmart Admin Portal
- 📊 Smart meter network overview across 4 states (22L+ meters)
- ⚡ Demand forecasting and grid stress zone identification
- 🚨 ML-powered anomaly and theft detection alerts
- 💰 EaaS revenue opportunity calculator for DISCOMs
- 🚀 State-wise deployment readiness scorecard
- 🌐 CBQoS & AMI 2.0 network traffic monitoring with AT&C loss tracking and SAIDI/SAIFI metrics

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Recharts
- **Backend:** Node.js, Express (Railway deployment)
- **AI:** Google Gemini 2.0 (Lumi AI Advisor)
- **Deployment:** Netlify (frontend), Railway (backend)

---

## Acknowledgements & Inspiration

The AI/ML features in the IntelliSmart Admin Portal are conceptually inspired by the following open source projects. The current prototype uses simulated data to demonstrate what these models would produce when connected to real IntelliSmart meter data from the Head End System (HES).

| Feature | Inspired By | ML Approach |
|---------|-------------|-------------|
| Anomaly & Theft Detection | [vaishnavi-1/Electricity-theft-detection-using-ML](https://github.com/vaishnavi-1/Electricity-theft-detection-using-ML) | CNN-based abnormal consumption pattern detection on smart grid data |
| Demand Forecasting | [kaymen99/AI-for-energy-sector](https://github.com/kaymen99/AI-for-energy-sector) | Deep Learning models for energy demand prediction using historical and weather data |
| Grid Stress & Load Analysis | [Helmholtz-AI-Energy/electric-generation-forecasting](https://github.com/Helmholtz-AI-Energy/electric-generation-forecasting) | ML-based electric generation and load forecasting |
| Solar Energy Prediction | [ColasGael/Machine-Learning-for-Solar-Energy-Prediction](https://github.com/ColasGael/Machine-Learning-for-Solar-Energy-Prediction) | Weather-based solar panel output prediction |
| Energy AI Reference | [AI4Electricity/Awesome-AI-for-Electricity](https://github.com/AI4Electricity/Awesome-AI-for-Electricity) | Curated reference for AI/ML approaches in electric power systems |

### Production Integration Plan
When real meter data is available from IntelliSmart's HES/MDM system:
- The **theft detection** CNN model would replace mock anomaly alerts with real flagged meters
- The **demand forecasting** model would replace hardcoded demand curves with live predictions
- The **solar prediction** model would power the EaaS eligibility scoring for each meter holder

---

## CBQoS & AMI 2.0

The admin portal's CBQoS tab is based on concepts from IntelliSmart's AMI 2.0 infrastructure:
- **Class-Based Quality of Service (CBQoS):** Prioritizes critical grid data (outage alerts, last-gasp signals) over routine billing traffic
- **AT&C Loss Tracking:** Monitors Aggregate Technical & Commercial losses per DISCOM
- **SAIDI/SAIFI Metrics:** Tracks grid reliability and outage frequency/duration trends
- **Network Protocols:** NB-IoT, RF Mesh, and PLC communication protocol distribution

---

## About IntelliSmart

[IntelliSmart Infra](https://www.intellismartinfra.in/) is India's leading smart metering and digital solutions provider, a joint venture of EESL and NIIF, focused on smart meter infrastructure and AI/ML-based analysis for power utilities across India.

---

## License

MIT
