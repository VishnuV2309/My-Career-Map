# MyCareerMap – Personalized Career & Skills Advisor

## Team: NeuroSync
**Problem Statement:** Personalized Career and Skills Advisor (Google Gen AI Hackathon – PS5)

### Team Members
- Vishnu V – Team Leader / AI-ML Developer  
- Amrutha D – Frontend Developer  
- Kareeshma – Backend Developer  
- Lokesh – Database & API Integration  
- Davashish – UI/UX & Cloud Deployment  

---

## 1. Overview
MyCareerMap is an AI-powered Personalized Career GPS that helps students discover and achieve their ideal career paths.  
It combines skills, interests, personality, and life skills into one 360° Student Profile and uses AI to recommend career options, skill roadmaps, and mentors.  

Think of it as **LinkedIn + Career Counselor + AI Mentor + Growth Tracker** in one platform.

---

## 2. Core Features

### 2.1 360° Student Profiling
- Psychometric and life skills evaluation  
- Technical and cognitive skill assessment  
- Interest and value-based mapping  
- Output: Skill Graph, Personality Map, Interest Cloud  

### 2.2 AI Career Mapping
- AI-generated Career Match Score (% fit for roles)  
- Career Clusters (AI & Data, Design, Green Tech, etc.)  
- Gap Analyzer (identifies missing skills)  
- Dynamic skill roadmap generation  

### 2.3 Learning & Growth Ecosystem
- Skill roadmap with month-wise milestones  
- Smart resource recommender (NPTEL, Coursera, YouTube, Kaggle)  
- Life skills builder with gamified tasks  

### 2.4 Engagement & Motivation
- Gamification: badges, streaks, leaderboards  
- Mentorship and peer connect using AI suggestions  

### 2.5 Innovation Layer
- "What-If" Career Simulator to compare career paths  
- Job trends integration with real-time data  
- AI Mentor (Gemini-powered conversational assistant)  
- Educator Dashboard for tracking student readiness  

---

## 3. Process Flow
```

Student Login → Psychometric + Skills Test
→ AI Engine (Vertex AI + FastAPI)
→ Career Match % + Skill Roadmap
→ Dashboard (Career | Roadmap | Gamification | Mentorship)

```

---

## 4. System Architecture

### Frontend
- Next.js (React)  
- TailwindCSS  
- shadcn/ui Components  
- Chart.js / Recharts for visualization  

### Backend
- FastAPI (Python)  
- REST APIs: /assess, /careers, /roadmap  
- Uvicorn server  

### AI / ML Layer
- Google Vertex AI / Gemini API  
- Psychometric Classifier  
- Skill Graph Embedding (pgvector)  
- Career Recommendation Engine  
- Generative Roadmap Assistant  

### Database
- PostgreSQL (Cloud SQL)  
- pgvector for embeddings  

### Integrations
- Learning APIs: Coursera, NPTEL, YouTube  
- Job APIs: LinkedIn, Naukri (mocked for demo)  
- Authentication: Firebase Auth  

### Cloud Infrastructure
- Google Cloud Run  
- BigQuery  
- Vertex AI  
- Cloud Storage  
- Frontend hosted on Vercel  

---

## 5. Estimated Implementation Cost

| Component | Platform | Monthly Cost (₹) |
|------------|-----------|------------------|
| Backend APIs | Cloud Run | 2,500–4,000 |
| Database | Cloud SQL (PostgreSQL) | 2,000–4,000 |
| AI Models | Vertex AI | 8,000–12,000 |
| Analytics | BigQuery | 1,500–3,000 |
| Authentication | Firebase Auth | Free Tier |
| Frontend Hosting | Vercel | Free / 1,500 |
| **Total MVP Cost** | — | **≈ ₹15,000–20,000 / month** |

---

## 6. Why MyCareerMap Stands Out
- Goes beyond traditional career quizzes — combines skills, personality, and life skills  
- Provides measurable, data-driven insights  
- Gamified approach motivates consistent learning  
- Real-time job trend adaptation  
- Scalable from single users to nationwide education systems  

**Tagline:** India’s First AI-Driven Career GPS – Dynamic, Measurable, and Fun.

---

## 7. Tech Stack Summary

| Layer | Tools & Frameworks |
|-------|--------------------|
| Frontend | Next.js, TailwindCSS, shadcn/ui, Chart.js |
| Backend | FastAPI (Python), REST APIs |
| AI Layer | Vertex AI, Gemini API, pgvector |
| Database | PostgreSQL (Cloud SQL) |
| Integrations | Coursera, NPTEL, YouTube, LinkedIn |
| Cloud Infra | Google Cloud (Run, BigQuery, Storage, Firebase) |
| Hosting | Vercel |

---

## 8. Demo Flow (Hackathon Walkthrough)

1. Student logs in and completes psychometric + skills test  
2. AI builds a 360° profile  
3. Dashboard displays:  
   - Career matches with % fit  
   - Skill roadmap and milestones  
   - Recommended resources (courses/projects)  
   - Gamified badges and streaks  
4. Student tests “What if I choose Data Science vs Cybersecurity?”  
5. AI displays alternate career roadmaps  

---

## 9. Unique Selling Proposition (USP)
**India’s First AI-Based Career GPS – Personalized, Adaptive, and Engaging**

- Evolves dynamically with job market changes  
- Combines psychometrics, skill mapping, and gamification  
- Encourages measurable, goal-based progress  

---

## 10. Running Locally (Offline Development)

To get started, take a look at `src/app/page.tsx`.

### Requirements
- Node.js (v20 or later)  
- npm (v9 or later)  

### 10.1 Environment Setup

Before running the app, you need to set up your environment variables.

1. Create a `.env` file in the **root** of your project.  
2. Add your Gemini API key (obtainable from [Google AI Studio](https://aistudio.google.com/app/apikey)).

```

GEMINI_API_KEY="YOUR_API_KEY"

````

### 10.2 Install Dependencies
Navigate to the root directory and install the required packages:

```bash
npm install
````

### 10.3 Running in VS Code (Recommended)

1. Open the project in Visual Studio Code.
2. Open the integrated terminal (`Ctrl + ~`).
3. Split the terminal into two panels.

**Terminal 1 – Start Next.js Development Server**

```bash
npm run dev
```

Access the app at:
[http://localhost:9002](http://localhost:9002)

**Terminal 2 – Start Genkit AI Server**

```bash
npm run genkit:dev
```

This launches the AI flow server used by the app.

### 10.4 Running with Other Editors

If not using VS Code, open two separate terminal windows:

**Terminal 1**


npm run dev




**Terminal 2**

npm run genkit:dev




Both servers must run simultaneously for full functionality.

---

## 11. Team – NeuroSync

| Name      | Role                          |
| --------- | ----------------------------- |
| Vishnu V  | Team Leader / AI-ML Developer |
| Amrutha D | Frontend Developer            |
| Kareeshma | Backend Developer             |
| Lokesh    | Database & API Integration    |
| Davashish | UI/UX & Cloud Deployment      |

---

## 12. Contact

**Vishnu V**
Email: [vishnuv2309@gmail.com](mailto:vishnuv2309@gmail.com)

---
