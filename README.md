# 🌾 RythuSahayam (రైతు సహాయం)
## Agriculture and Farmers' Welfare Support Platform
### Target Community: Prathuru & Gundimeda Villages, Tadepalli Mandal, Guntur District, Andhra Pradesh

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.1.3-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)](https://sqlite.org)

---

## 📌 Project Identity & Purpose

**RythuSahayam** is a full-stack digital agricultural welfare platform engineered as an academic **Community Service Project (CSP)** to empower the farming communities of **Prathuru** and **Gundimeda** villages in **Tadepalli Mandal, Guntur District, Andhra Pradesh**.

- **Main Tagline:** *"Better Farming • Brighter Future"*
- **Hero Heading:** *"Support for Every Farmer"*
- **Focus Crops:** Paddy (వరి), Chilli (మిరప), Cotton (ప్రత్తి), Maize (మొక్కజొన్న), Vegetables (కూరగాయలు).
- **Core Problem Addressed:** Connecting small, marginal, and tenant farmers with verified government schemes (PM-KISAN, Rythu Bharosa, KCC), APMIP 90% micro-irrigation subsidies, daily Guntur yard mandi prices, Krishna Western Delta canal schedules, and direct grievance redressal.

---

## 🎨 Visual Design Blueprint

The web application faithfully implements the uploaded RythuSahayam prototype design system:
1. **Top Forest-Green Information Bar (`#073e32`):** Location indicator (`Prathuru & Gundimeda | Tadepalli, Andhra Pradesh`) and agricultural motto (`Better Farming • Brighter Future`).
2. **Main Navigation Bar:** White sticky bar with agriculture leaf branding (`🌿 RythuSahayam`), active link highlights, mobile responsive menu, and dark green Farmer Login button.
3. **Hero Section:** Centered headline on cream background (`#fbfaf5`), subtitle, and subtle agricultural motifs.
4. **4-Field Support Search Panel:** Village dropdown (`Prathuru` / `Gundimeda`), Crop Type selector, Problem Category selector, and Find Support action button with dynamic search results.
5. **Essential Farmer Services (4 Cards in a Row):**
   - 💧 Irrigation Support (`/irrigation`)
   - 🌱 Seeds & Fertilizers (`/crop-guidance`)
   - 🏛️ Government Schemes & Loans (`/schemes`)
   - 🐛 Report Crop Problems (`/report-problem`)
6. **Local Agricultural Support (3 Cards in a Row):**
   - 🌦️ Weather & Crop Alerts (with Prathuru/Gundimeda weather switcher & IMD links)
   - ₹ Market Price Updates (Guntur Yard & Tenali Mandi rates per quintal)
   - 🌾 Soil Testing & Crop Advice (Soil Health Card & N-P-K management)
7. **Common Problems in Our Villages (Pills with Modal):**
   - 💧 Irrigation & Electricity
   - ▤ Loan Access
   - 🏠 Crop Storage
   - 🚚 Transport to Market
   - ₹ Fair Crop Prices
   - *"View All Support Options"* button

---

## 🚀 Complete Application Pages

| URL | Page Name | Key Features |
| :--- | :--- | :--- |
| `/` | **Home** | Complete prototype replica with dynamic support search, services, local cards, weather, and common problems modal. |
| `/crop-guidance` | **Crop Guidance Portal** | Deep agronomy for Paddy, Chilli, Cotton, Maize, and Vegetables: soil, sowing, water, NPK fertilizers, IPM pests, and yield. |
| `/irrigation` | **Irrigation Support** | Canal water flow, Drip/Sprinkler methods, APMIP subsidy calculator (up to 90%), and urgent water shortage complaint form. |
| `/schemes` | **Schemes & Loans** | PM-KISAN, YSR Rythu Bharosa, Kisan Credit Card (4% interest), PMFBY free crop insurance, Soil Health Card with direct links. |
| `/market-prices` | **Market Prices** | Interactive mandi board with Min, Max, Modal prices per quintal, trends, and Recharts bar chart price comparisons. |
| `/report-problem` | **Report a Problem** | Full complaint form with image upload, unique ticket generation (`RS-2026-XXXX`), and downloadable report receipt. |
| `/track-complaint` | **Complaint Tracking** | 4-step progress stepper (`Submitted` → `Under Review` → `In Progress` → `Resolved`), officer remarks, and history timeline. |
| `/login` | **Farmer Login** | Secure JWT authentication with 1-click Demo Farmer and Demo Officer login buttons. |
| `/register` | **Farmer Registration** | Full registration with Land Area, Primary Crop, Village, Farming Category, and password hashing. |
| `/dashboard` | **Farmer Dashboard** | Farmer profile card, total/pending/resolved complaint stats, my tickets table, and village advisories feed. |
| `/about` | **About & CSP Context** | Community Service Project objectives, Tadepalli field survey findings, administrative hierarchy, and feedback form. |
| `/admin` | **Administrator Panel** | Role-protected dashboard for Agriculture Officers: update complaint status, add official remarks, and view farmer directory. |

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 6, Tailwind CSS 3.4, React Router DOM 6, Lucide React Icons, Recharts.
- **Backend:** Python 3.11, Flask 3.1.3, Flask-CORS, SQLAlchemy 2.0 (ORM), PyJWT, Werkzeug (PBKDF2 SHA-256 password hashing).
- **Database:** SQLite (`rythusahayam.db`) with relational models and automatic seeding for Guntur / Tadepalli region.

---

## 🔐 Demo Credentials

| Role | Username / Identifier | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Agriculture Officer (Admin)** | `admin@rythusahayam.ap.gov.in` | `Admin@12345` | Full Admin Panel (`/admin`), Status updates, Remarks |
| **Prathuru Farmer (Demo)** | `9988776655` | `Farmer@123` | Farmer Dashboard (`/dashboard`), File & Track complaints |
| **Gundimeda Farmer (Demo)** | `9848012345` | `Farmer@123` | Farmer Dashboard (`/dashboard`), File & Track complaints |

*Note: You can also register a new account on `/register` or click the 1-click demo buttons on `/login`.*

---

## 💻 Quick Start & Running Instructions

### 1. Unified Full-Stack Run (Flask serves React Build & API)

```bash
# 1. From workspace root, seed database (if not already seeded)
python backend/seed_data.py

# 2. Start the unified Flask full-stack application
python backend/app.py
```
Open **`http://127.0.0.1:5000`** in your browser. All pages, APIs, and database actions are live!

### 2. Dual-Server Development Mode (with Vite Hot Reload)

If you wish to run the Vite dev server with instant HMR:

**Terminal 1 (Backend API):**
```bash
python backend/app.py
```

**Terminal 2 (Frontend Dev Server):**
```bash
cd frontend
npm run dev
```
Open **`http://localhost:5173`** in your browser. Vite proxies `/api` requests to Flask on port 5000.

---

---

## ☁️ Deploying to Render (Frontend & Backend)

You can deploy RythuSahayam on [Render](https://render.com) using either of two methods:

### Method 1: Single Unified Full-Stack Service (Recommended & Free Tier Friendly)
In this method, Render builds both React and Python in one Web Service. Flask serves the frontend and APIs from the same origin, avoiding CORS issues and staying comfortably within the Render Free Tier.

1. Push your repository to **GitHub** or **GitLab**.
2. Go to your [Render Dashboard](https://dashboard.render.com/) and click **New + → Web Service**.
3. Connect your GitHub repository.
4. Set the following configuration:
   - **Name:** `rythusahayam`
   - **Language / Runtime:** `Python 3`
   - **Branch:** `main` (or `master`)
   - **Region:** `Oregon (US West)` or your closest region
   - **Build Command:**
     ```bash
     cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt
     ```
   - **Start Command:**
     ```bash
     cd backend && gunicorn app:app --bind 0.0.0.0:$PORT --workers 2
     ```
5. Under **Advanced → Environment Variables**, add:
   - `PYTHON_VERSION`: `3.11.9`
   - `NODE_VERSION`: `20.12.0`
   - `SECRET_KEY`: *(click Generate)*
6. Click **Create Web Service**. Render will build the Vite React application, install Python dependencies, run database migrations/seeds, and launch your live application at `https://rythusahayam.onrender.com`!

---

### Method 2: Two Separate Services (Static Site + Web Service API)

If you prefer microservices with separate frontend and backend deployments on Render:

#### Step 1: Deploy Backend API (Web Service)
1. In Render Dashboard, click **New + → Web Service**.
2. Select your repository and configure:
   - **Name:** `rythusahayam-api`
   - **Runtime:** `Python 3`
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2`
   - **Environment Variables:**
     - `PYTHON_VERSION`: `3.11.9`
     - `SECRET_KEY`: *(Generate random key)*
3. Click **Create Web Service** and copy your backend URL (e.g. `https://rythusahayam-api.onrender.com`).

#### Step 2: Deploy Frontend (Static Site)
1. In Render Dashboard, click **New + → Static Site**.
2. Select your repository and configure:
   - **Name:** `rythusahayam-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
3. Under **Advanced → Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://rythusahayam-api.onrender.com/api` *(use your backend URL from Step 1)*
4. Under **Redirects / Rewrites**:
   - **Type:** `Rewrite`
   - **Source:** `/*`
   - **Destination:** `/index.html`
5. Click **Create Static Site**.

---

### Method 3: 1-Click Render Blueprint (`render.yaml`)
This repository includes a pre-configured `render.yaml` file.
1. In Render Dashboard, click **New + → Blueprint**.
2. Select your repository.
3. Render automatically reads `render.yaml` and deploys both services with all environment variables mapped automatically!

---

## 🧪 Testing

Run the automated backend test suite:
```bash
python backend/test_api.py
```

To re-build the frontend production assets:
```bash
cd frontend
npm run build
```

---

## 📄 Community Service Project Acknowledgments

Developed for the rural farming community of **Prathuru** and **Gundimeda**, Tadepalli Mandal, Andhra Pradesh under the Community Service Project (CSP) guidelines. All agricultural recommendations are aligned with standard practices published by **Acharya N.G. Ranga Agricultural University (ANGRAU)** and the **Department of Agriculture, Govt. of Andhra Pradesh**.
