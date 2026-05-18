# 🏗️ BuilderAI — Construction Intelligence Platform

An AI-powered platform that transforms architectural PDFs into actionable construction workflows — from material takeoffs to safety predictions.

## 🚀 Quick Start

```bash
cd e:\biulderAI\builder-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎥 Platform Showcase

Watch a full demonstration of the platform in action, including the AI extracting data from a real commercial office blueprint:

![BuilderAI Showcase Walkthrough](./public/test-pdfs/builder_ai_showcase.webp)

## ✨ Features

### Core Pipeline: Upload → Extract → Build

1. **📄 Intelligent PDF Upload**
   - **What it does:** Allows users to easily drag and drop raw construction documents, including architectural plans, blueprints, and specification sheets (PDF, PNG, JPG, TIFF).
   - **Why it matters:** Eliminates the need for manual data entry, providing a frictionless starting point for any new project.

2. **🧠 AI Scope Extraction & Classification**
   - **What it does:** Our custom NLP engine reads the document, automatically classifying its type (e.g., Blueprint vs. RFQ) and extracting specific tasks (like "Demolish wall" or "Install PEX pipe"). It scores each extracted item with a confidence level so humans know exactly what to review.
   - **Why it matters:** Saves hours of manual document reading by instantly generating an actionable scope of work directly from the text.

3. **🧱 Automated Material Takeoff (BOM)**
   - **What it does:** Analyzes the extracted scope and room dimensions to automatically infer exactly what materials are needed. It calculates precise quantities, applies standard waste factors, and pulls real-time unit pricing and lead times from a simulated supplier database.
   - **Why it matters:** Prevents human error in manual counting, reduces material waste, and ensures you never under-order critical supplies.

4. **💰 Dynamic Quote Builder**
   - **What it does:** Takes the material takeoff and automatically calculates labor costs and delivery fees. It applies a customizable profit margin to instantly generate a professional, ready-to-send project quote.
   - **Why it matters:** Drastically accelerates the sales pipeline, allowing contractors to send accurate, profitable bids in minutes rather than days.

5. **🕵️ Missing Info Detective**
   - **What it does:** Acts as an AI quality control assistant. It cross-references the scope with industry standards to flag missing critical details (e.g., finding a bathroom renovation but no waterproofing specified, or tile work without grout color selected).
   - **Why it matters:** Prevents costly mid-project delays and change orders by generating automatic Request for Information (RFI) prompts before construction even begins.

6. **🛡️ Safety & Permit Predictor**
   - **What it does:** Scans the project scope against a database of local compliance triggers to automatically alert the team if specific permits (Electrical, Plumbing, Structural) are required, and flags site-specific safety protocols (like GFCI near water or Asbestos checks).
   - **Why it matters:** Keeps the project legally compliant and ensures crew safety without requiring a manual review of code books.

7. **🚚 Real-Time Dispatch Board**
   - **What it does:** A Kanban-style logistics board that tracks the delivery of required materials from "Ready to Load" to "Delivered," managing field logistics in real-time.
   - **Why it matters:** Solves supply chain fragmentation by ensuring the right materials hit the job site exactly when the crew needs them.

8. **⚡ Workflow Automations**
   - **What it does:** A customizable engine of WHEN/THEN rules (e.g., "WHEN quote margin drops below 15% THEN notify project manager" or "WHEN project is approved THEN create dispatch tasks").
   - **Why it matters:** Automates repetitive operational tasks, allowing project managers to manage by exception rather than micromanaging every detail.

### Pages
| Route | Description |
|:------|:-----------|
| `/` | Dashboard with metrics, charts, and project overview |
| `/projects` | Project listing with search, filters, and new project modal |
| `/projects/[id]` | Project detail with AI extraction review, materials, quotes, safety |
| `/extraction` | Dedicated AI extraction pipeline with step visualization |
| `/materials` | Supplier catalog with pricing trends and stock alerts |
| `/quotes` | Quote pipeline with margin tracking |
| `/dispatch` | Kanban board for delivery logistics |
| `/safety` | Safety compliance, permits, and inspection checklists |
| `/workflows` | Automation rules engine |

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS + Custom CSS Variables (dark theme)
- **State**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **PDF**: pdfjs-dist, pdf-parse, react-pdf
- **OCR**: Tesseract.js
- **PDF Export**: jsPDF + jspdf-autotable

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── layout.tsx            # Root layout
│   ├── ClientLayout.tsx      # Client-side layout wrapper
│   ├── globals.css           # Design system
│   ├── projects/
│   │   ├── page.tsx          # Projects listing
│   │   └── [id]/page.tsx     # Project detail
│   ├── extraction/page.tsx   # AI Extraction pipeline
│   ├── materials/page.tsx    # Supplier catalog
│   ├── quotes/page.tsx       # Quote management
│   ├── dispatch/page.tsx     # Dispatch Kanban
│   ├── safety/page.tsx       # Safety & Compliance
│   └── workflows/page.tsx    # Automation rules
├── components/
│   └── Sidebar.tsx           # Navigation sidebar
└── lib/
    ├── data.ts               # Types & seed data
    └── store.ts              # Zustand global state
```
