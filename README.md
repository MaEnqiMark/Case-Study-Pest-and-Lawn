# PestxLawn — AI-Powered Pest & Lawn Care Platform

A full-stack case study for a pest and lawn control company in Norman, Oklahoma. The project consists of two applications that address both sides of the business: customer acquisition and internal operations.

## Architecture

```
AO Case Study/
├── part1-increasing-upside/    # Customer-facing website (Next.js)
├── part2-decreasing-cost/      # Employee operations dashboard (Vite + React)
└── README.md
```

---

## Part 1 — Customer-Facing Website

**Stack:** Next.js 16, React 19, Tailwind CSS v4, TypeScript

**Purpose:** Digital sales funnel to increase inbound leads, improve conversion rates, and expand customer lifetime value.

### Pages & Features

| Page | Description |
|------|-------------|
| **Home** | SEO-optimized landing page with service overview, customer reviews, and team photos |
| **Services & Plans** | Subscription tiers (Basic, Standard, Premium) for pest and lawn care with pricing |
| **Find the Right Treatment** | AI-powered pest identification — upload a photo or describe the issue, receive a service recommendation |
| **Shop** | Product catalog (consumer-grade pesticides, fertilizers, equipment) with cart and checkout |
| **AI Chatbot** | Conversational assistant for pest/lawn questions, powered by Claude API |
| **Contact** | Inquiry form that sends a real email to the service manager via Resend API |
| **Login/Signup** | Customer authentication portal for account management |

### API Routes

- `/api/chatbot` — Claude-powered conversational AI for pest & lawn questions
- `/api/pest-id` — AI pest identification from photo uploads or text descriptions
- `/api/recommendations` — Service plan recommendations based on customer profile
- `/api/emails` — Transactional email via Resend (contact forms, follow-ups, promotions)
- `/api/customers` — Customer data management
- `/api/forecast` — Pest forecast data endpoint

### Running Locally

```bash
cd part1-increasing-upside
npm install
```

Create `.env.local`:
```
ANTHROPIC_API_KEY=<your-anthropic-api-key>
RESEND_API_KEY=<your-resend-api-key>
```

Both keys are optional — the app falls back to mock responses if not provided.

```bash
npm run dev
```

Runs on **http://localhost:3000**

---

## Part 2 — Employee Operations Dashboard

**Stack:** Vite, React 18, TypeScript, Tailwind CSS v4, shadcn/ui, Recharts

**Purpose:** Internal operations platform to optimize technician routing, automate reporting, track inventory, forecast demand, and identify cross-sell opportunities.

### Pages & Features

| Page | Description |
|------|-------------|
| **Dashboard** | Command center with live KPIs: today's jobs, avg utilization, reports filed, low stock alerts, route savings |
| **Customers** | Full customer database with action-required flags (overdue, cross-sell gap, forecast risk). Each customer links to a detailed profile page |
| **Customer Profile** | AI property summary, service history, cross-sell recommendations with bundle pricing, send promo email button, location risk data, contact history, pending actions |
| **Route Planning** | TSP-optimized technician routes. Brute-force exact solver for 8 or fewer stops, nearest-neighbor + 2-opt for larger routes. Shows original vs optimized mileage and savings % |
| **Technicians** | Technician directory with specialties, certifications, active routes, and performance metrics |
| **Scheduling** | Daily schedules with real haversine-based drive times, 30-min job buffers, and utilization tracking across a 23-vehicle fleet |
| **Inventory** | Chemical and product tracking with dynamic categories, reorder thresholds, low stock alerts, and automatic deduction on report commit |
| **Tech Reports** | AI-structured field reports from technician notes. Keyword-based NLP extracts service details, issues, recommendations, and products used. Committing a report auto-decrements inventory |
| **Forecasting** | Live weather data (Open-Meteo API), pest threat forecasts, lawn health risk, revenue opportunity alerts, Google Maps heatmap overlay, and historical accuracy charts (88% avg over 12 months) |

### Key Algorithms

- **Route Optimization:** Traveling Salesman Problem solver — exact permutation for n <= 8, nearest-neighbor + 2-opt improvement for larger routes
- **Drive Time Calculation:** Haversine distance between GPS coordinates multiplied by 3 min/mile (~20 mph in-town average)
- **Report Generation:** Keyword-based NLP parses field transcripts for location (interior/exterior), issues (infestation, moisture, burrows), and auto-maps service type to default product lists
- **Forecast Model:** Combines Open-Meteo weather data (temperature, humidity, precipitation, soil moisture) with historical pest biology patterns for the Norman, OK region

### Data Architecture

The dashboard uses React Context for shared state:

- **RoutesContext** — Technician routes, GPS coordinates, optimization calculations, haversine utility
- **InventoryContext** — Product catalog, stock levels, status tracking, auto-deduction
- **ReportsContext** — Service reports, technician logs, customer history

### Running Locally

```bash
cd part2-decreasing-cost
npm install
```

Create `.env.local` (optional):
```
ANTHROPIC_API_KEY=<your-anthropic-api-key>
```

```bash
npm run dev
```

Runs on **http://localhost:3001**

---

## Deployment

Both apps are deployed on Vercel.

### Part 1 (Next.js)
Deploys automatically from the GitHub repo. Set `ANTHROPIC_API_KEY` and `RESEND_API_KEY` as environment variables in Vercel project settings.

### Part 2 (Vite)
Requires `vercel.json` in the project root:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

The SPA rewrite rule ensures client-side routing works on all paths.

---

## External APIs

| API | Used In | Purpose | Key Required |
|-----|---------|---------|-------------|
| **Anthropic (Claude)** | Part 1 & 2 | AI chatbot, pest identification, report structuring | Yes (optional — mock fallback) |
| **Resend** | Part 1 & 2 | Transactional and promotional email delivery | Yes (optional — mock fallback) |
| **Open-Meteo** | Part 2 | Live weather data for pest forecasting | No (free, no key) |
| **Google Maps Embed** | Part 2 | Regional pest risk heatmap visualization | No (free embed) |

---

## Impact Projections

Based on a $2.5M revenue company with 5 technicians, 2,000 customers, and a 23-vehicle fleet:

| Category | Annual Impact |
|----------|--------------|
| Route fuel & wear savings | $10,218 |
| Recovered capacity (AI reports) | $140,400 |
| Stockout avoidance | $4,900 |
| Scheduling buffer (missed job recovery) | $7,800 |
| Admin time recovered | $15,405 |
| Utilization uplift (10% improvement) | $105,300 |
| Product sales (pesticide/fertilizer) | $23,333 |
| Cross-sell conversion (15% of single-service customers) | $234,000 |
| New digital leads | $64,800 |
| Targeted advertising (forecast-driven, 15% lead increase) | $36,000 |
| **Total** | **$642,156 (~25.7% of revenue)** |

---

## Requirements

- Node.js 18+
- npm 9+
