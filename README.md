# RetinaPulse - Member 3 Frontend Implementation
**Project:** Multimodal Health Screening & Analysis System  
**Owner:** Member 3 (Frontend Developer)  
**Deliverable Folder:** `frontend/`  
**Stack:** React 19, Vite, Tailwind CSS v4, Chart.js, react-chartjs-2, React Router DOM, Axios  

---

## 1. Quick Start

To launch the frontend locally on port 3000:

```bash
cd frontend
npm run dev
```

The application will be live at: `http://localhost:3000`

To create an optimized production build:
```bash
npm run build
npm run preview
```

---

## 2. Architecture & File Structure

```
frontend/
├── public/
│   └── favicon.svg                  # Clinical eye + pulse SVG favicon
├── src/
│   ├── api.js                       # Centralized API service layer (FastAPI + Simulation)
│   ├── main.jsx                     # React entry point
│   ├── App.jsx                      # App router, global state & compliance footer
│   ├── index.css                    # Tailwind CSS v4 + clinical base typography
│   ├── components/
│   │   ├── MedicalIcons.jsx         # Custom SVG medical icons (replaces Lucide & emojis)
│   │   ├── Navbar.jsx               # Clinical header, custom domain badge & patient selector
│   │   ├── ImageUpload.jsx          # Drag-and-drop fundus upload + quality gate telemetry
│   │   ├── EyeAssessment.jsx        # DenseNet201 diagnosis, Grad-CAM toggle & reticle HUD
│   │   ├── VitalsPanel.jsx          # Telemetry monitoring grid (HR, SpO2, Temperature)
│   │   ├── ManualVitals.jsx         # Operator intake fallback with preset test profiles
│   │   ├── PatientForm.jsx          # Patient registration modal
│   │   ├── PatientHistory.jsx       # Longitudinal records & Chart.js multi-axis trend lines
│   │   └── ReportDownload.jsx       # Printable Clinical Summary Dossier & PDF generator
│   └── pages/
│       ├── ScreeningDashboard.jsx   # Primary clinical screening workstation
│       ├── PatientsPage.jsx         # Directory of registered patients
│       ├── CustomDomainGuide.jsx    # Production DNS (CNAME/A) & SSL configuration
│       ├── TermsAndConditions.jsx   # Clinical Terms of Use (non-diagnostic AI advisory)
│       └── PrivacyPolicy.jsx        # PHI & biometric imaging security policy
├── package.json
└── vite.config.js                   # Vite + Tailwind CSS v4 configuration
```

---

## 3. How Member 3 Connects to Member 1 & Member 2

### When Member 2's FastAPI Backend is Running:
The app automatically talks to `http://localhost:8000/api/v1`:
- `POST /api/v1/predict_eye` -> Evaluates fundus image, returns DenseNet201 prediction & Grad-CAM heatmap
- `POST /api/v1/submit_vitals` -> Processes HR, SpO2, and Temp via XGBoost
- `POST /api/v1/patients` -> Registers new patient
- `GET /api/v1/patients` -> Fetches all patient records
- `GET /api/v1/patients/:id/sessions` -> Fetches longitudinal history
- `GET /api/v1/sessions/:id/report` -> Downloads clinical summary PDF

### When Member 1 & 2 are Still Building:
The frontend includes an **Intelligent Clinical Simulation Engine** in `src/api.js`. You can demo and test every single button, fundus condition (Normal, Cataract, Glaucoma, Diabetic Retinopathy), Grad-CAM toggle, quality gate score, and vitals scenario without needing the backend to be online. Once Member 2 starts the backend, it seamlessly connects.

---

## 4. Compliance Checklist (DOs & DON'Ts)

- [x] Custom clinical SVG favicon (`public/favicon.svg`)
- [x] Terms & Conditions page (`/terms`) with clinical disclaimer
- [x] Privacy Policy page (`/privacy`) with PHI and biometric guidelines
- [x] Custom domain support (`screening.medpulse.io`) + DNS verification guide (`/domain-guide`)
- [x] AI disclosure tags on all synthetic clinical evaluation images
- [x] Descriptive, accessible alt tags on all images
- [x] Precision reticle cursor animation in fundus viewer for foveal coordinate inspection
- [x] No Lucide icons (handcrafted medical SVGs)
- [x] No emojis (professional clinical badges)
- [x] No harsh gradients (subtle clinical slate and neutral palette)
- [x] No drop shadows (clean 1px clinical borders)
- [x] No pure white background (`#f8fafc` clinical slate-50 base)
- [x] No Inter/Geist/Space Grotesk (uses Plus Jakarta Sans)
- [x] No em dashes (clean punctuation)
- [x] Skeleton loaders during AI model inference
