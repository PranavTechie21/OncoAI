<p align="center">
  <img src="assets/OncoAI.png" alt="OncoAI Logo" height = "200" width="180" />
</p>

<h1 align="center">OncoAI — Personalized Cancer Treatment Planning Platform</h1>


> **An enterprise-grade, AI-powered clinical decision support system for precision oncology.**

OncoAI is a full-stack healthcare platform that combines modern web technologies with machine learning to assist clinicians in personalized cancer treatment planning, risk stratification, and longitudinal patient management. Designed with scalability, security, and clinical workflows in mind.

---

## 🌟 Key Highlights

* **Clinical Decision Support (CDSS)** – Evidence-aware AI recommendations aligned with patient-specific data
* **Precision Oncology Ready** – Supports genomic, clinical, and treatment history features
* **Modular ML Integration** – Plug-and-play ML pipelines (classification, risk scoring, survival analysis)
* **Production-Ready Architecture** – Clean separation of frontend, backend, and ML layers
* **Secure by Design** – JWT authentication, role-based access, and audit-friendly APIs

---

## 🚀 Core Features

### 🤖 AI-Powered Treatment Recommendations

* Personalized therapy suggestions using ML models
* Risk-adjusted confidence scoring
* Benefit–risk tradeoff explanations
* Model versioning support

### 🧠 Machine Learning Integration

* scikit-learn compatible pipelines
* Supports:

  * Risk classification
  * Treatment response prediction
  * Survival probability estimation
* Easy replacement with deep learning models (TensorFlow / PyTorch ready)

### 👥 Patient Management System

* Unified longitudinal patient records
* Clinical, demographic, and genomic data storage
* Treatment history & outcome tracking

### 📊 Analytics & Reporting

* Interactive dashboards with real-time metrics
* Patient cohort analysis
* Exportable reports (PDF / Excel)
* Outcome-based treatment evaluation

### 📅 Appointment & Workflow Management

* Calendar-based scheduling
* Doctor assignment & follow-ups
* Status tracking and reminders

### 💬 AI Clinical Assistant

* Context-aware medical chatbot
* Powered by OpenAI GPT-4o / Google Gemini
* Supports:

  * Treatment explanation
  * Clinical query assistance
  * Patient-friendly summaries

### 🎯 Risk Assessment Engine

* AI-generated risk scores
* Multi-factor clinical evaluation
* Stratification for low / medium / high risk

### 🌓 Modern UI/UX

* Dark & Light themes
* Responsive, accessible design
* Built with Tailwind + shadcn/ui

### 🔐 Authentication & Security

* JWT-based authentication
* Secure role-based access control
* CORS-protected APIs

---

## 🧰 Technology Stack

### Frontend

* **React 18** + TypeScript
* **Tailwind CSS** + shadcn/ui
* **React Router v6**
* **Context API** for global state
* **Recharts** for analytics
* **OpenAI / Gemini SDKs** for AI chat

### Backend

* **Flask** (REST API)
* **SQLAlchemy** (ORM)
* **Flask-CORS**
* **JWT Authentication**
* **scikit-learn** (ML integration)
* **SQLite / PostgreSQL**

---

## ⚙️ Getting Started

### Prerequisites

* Node.js **18+**
* Python **3.8+**
* npm & pip

---

## 🧪 Backend Setup

```bash
cd backend
```

### Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\\Scripts\\activate      # Windows
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Environment Configuration

```bash
cp .env.example .env
```

```env
DATABASE_URL=sqlite:///oncoai.db
SECRET_KEY=your-secret-key
JWT_EXPIRY_HOURS=24
```

### Initialize Database

```bash
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

### Run Backend

```bash
python app.py
```

📍 Backend runs on: `http://localhost:5000`

---

## 🎨 Frontend Setup

### Install Dependencies

```bash
npm install
```

### Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-xxxx
# OR
VITE_GEMINI_API_KEY=xxxx
```

### Run Frontend

```bash
npm run dev
```

📍 Frontend runs on: `http://localhost:8080`

---

## ⚡ Quick Start

**Terminal 1 – Backend**

```bash
cd backend
python app.py
```

**Terminal 2 – Frontend**

```bash
npm run dev
```

---

## 🏗️ Project Structure

```
.
├── backend/
│   ├── app.py              # Flask app entry
│   ├── models.py           # Database schemas
│   ├── routes.py           # REST API routes
│   ├── ml_service.py       # ML inference layer
│   ├── requirements.txt
│   └── .env.example
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── contexts/
│   ├── hooks/
│   └── lib/
│
└── README.md
```

---

## 📈 Functional Modules

### Dashboard

* Real-time metrics
* Patient trends
* System health overview

### Patient Profiles

* Clinical summary
* Risk scores
* Treatment timelines

### AI Recommendations

* Ranked therapy options
* Explainable AI outputs
* Model confidence levels

### Reports & Insights

* Interactive charts
* Custom time windows
* Export-ready analytics

### Appointments

* Calendar-based scheduling
* Status & follow-up tracking

---

## 🔮 Roadmap (Suggested Enhancements)

* 🔬 Genomic variant interpretation (VCF support)
* 🧠 Deep learning models for survival analysis
* 📜 Clinical guideline alignment (NCCN / ESMO)
* 🏥 Hospital EMR integration (FHIR-ready)
* 🔒 HIPAA/GDPR compliance layer
* ☁️ Cloud deployment (Docker + AWS/GCP)

---

## 📄 License

**Private / Proprietary**
All rights reserved.

---

> ⚠️ **Disclaimer**: OncoAI is a decision-support tool and not a replacement for professional medical judgment.
