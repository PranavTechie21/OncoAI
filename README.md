# OncoAI - Personalized Cancer Treatment Planning Platform

**Full-stack application with React frontend and Flask backend with ML model integration**

A modern, AI-powered platform for personalized cancer treatment planning and patient management.

## Features

- 🤖 **AI-Powered Recommendations** - ML-driven personalized treatment suggestions with risk assessment
- 🧠 **ML Model Integration** - Easy integration of your trained cancer treatment models
- 📊 **Analytics & Reports** - Comprehensive patient data analysis and visualization
- 👥 **Patient Management** - Complete patient records with clinical data storage
- 📅 **Appointment Scheduling** - Manage patient appointments and follow-ups
- 💬 **AI Chatbot** - Interactive assistant powered by OpenAI/Gemini
- 📈 **Treatment Pathways** - Visualize patient-specific treatment protocols
- 🎯 **Risk Assessment** - AI-calculated risk scores based on clinical factors
- 🌓 **Dark Mode** - Beautiful dark and light themes
- 🔐 **Authentication** - Secure JWT-based login and user management

## Tech Stack

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** + shadcn/ui
- **React Router v6** for routing
- **React Context API** for state management
- **Recharts** for data visualization
- **OpenAI GPT-4o / Google Gemini** for AI chatbot

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database operations
- **Flask-CORS** - Cross-origin resource sharing
- **JWT** - Authentication tokens
- **scikit-learn** - ML model integration
- **SQLite/PostgreSQL** - Database

## Getting Started

### Prerequisites

- **Node.js 18+** and npm (for frontend)
- **Python 3.8+** (for backend)
- **pip** (Python package manager)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
# Copy example file
cp .env.example .env

# Edit .env and set:
# DATABASE_URL=sqlite:///oncoai.db
# SECRET_KEY=your-secret-key-here
```

5. Initialize database:
```bash
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

6. Start the backend server:
```bash
python app.py
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env file in root directory
VITE_API_URL=http://localhost:5000/api
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-your-key-here
# OR
VITE_GEMINI_API_KEY=your-gemini-key-here
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:8080`

### Quick Start (Both Servers)

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```


## Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
.
├── backend/                 # Flask backend
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   ├── routes.py           # API routes
│   ├── ml_service.py       # ML model service
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
│
├── src/                     # React frontend
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   └── ...            # Custom components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   │   └── api.ts        # Backend API client
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   └── lib/               # Utilities
│
└── README.md              # This file
```

## Features Overview

### Dashboard
- Real-time analytics and metrics
- Patient overview and trends
- Quick actions and shortcuts

### Patient Management
- Comprehensive patient records
- Risk score assessment
- Treatment history tracking
- Genomic profile analysis

### AI Recommendations
- Personalized treatment suggestions
- Confidence scoring
- Benefits and risk analysis
- Priority-based filtering

### Reports
- Interactive charts and visualizations
- Exportable reports (PDF, Excel)
- Custom date ranges
- Treatment outcome analysis

### Appointments
- Calendar view
- Schedule management
- Doctor assignment
- Status tracking

## License

Private - All rights reserved
