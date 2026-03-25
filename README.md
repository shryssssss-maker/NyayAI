# ⚖️ NyayaAI

> **Intelligent Legal Assistance for Every Indian Citizen**
> 
> *Production-grade · 5-Agent Pipeline · Dual-Side Marketplace · BNS / BNSS / IPC / CPC / CrPC*

---

## 📋 Table of Contents

- [What is NyayaAI?](#what-is-nyayaai)
- [The Problem](#the-problem)
- [How It Works](#how-it-works)
- [The 5-Agent Pipeline](#the-5-agent-pipeline)
- [Dual-Side Marketplace](#dual-side-marketplace)
- [Lawyer Portal](#lawyer-portal)
- [System Architecture](#system-architecture)
- [Data Model](#data-model)
- [Tech Stack](#tech-stack)
- [Build Phases](#build-phases)
- [Success Metrics](#success-metrics)
- [Roadmap](#roadmap)

---

## What is NyayaAI?

NyayaAI is a **multi-agent legal platform** that gives Indian citizens instant access to verified legal guidance — and connects them to real lawyers through a transparent marketplace.

| | |
|---|---|
| **Version** | v4.0 — Full Dual-Side Marketplace |
| **Platform** | Web App + Mobile PWA |
| **Languages** | Hindi · English · Hinglish |
| **Legal Corpus** | BNS · BNSS · IPC · CrPC · CPC |
| **Status** | Final — Ready for Development |

### What's New in v4.0

- 🧑‍💼 **Lawyer Dashboard** — Full professional portal for advocates
- 📋 **Available Cases Feed** — Lawyers browse open citizen cases
- 🔄 **Case Pipeline** — Pending → Offered → Active → Completed
- 🎯 **Speciality Feed** — Cases matched to declared domains
- 🚨 **Unassigned Queue** — Prevents cases from going stale
- 🔬 **Lawyer Legal Explorer** — Professional AI research tool

---

## The Problem

### Citizen Side
- Legal info is **fragmented** across hundreds of acts and state-level variations
- India's 2023 criminal law overhaul (IPC → BNS, CrPC → BNSS) left most resources outdated
- Professional consultation costs **₹2,000–₹10,000+** — out of reach for most
- Lawyer discovery is **100% word-of-mouth** — opaque and geographically limited

### Lawyer Side
- District court advocates have **no digital channel** to reach clients
- Cases arrive **cold** — no context, wasting the first consultation on intake
- No tool to research **BNS/BNSS alongside legacy IPC/CrPC**
- Junior lawyers outside metros struggle with **unpredictable client acquisition**

### The Gap

| Gap | NyayaAI Solution |
|-----|-----------------|
| Lawyers invisible outside personal networks | Verified marketplace with AI matching |
| Citizens arrive without context | AI brief dispatched before first contact |
| No fee transparency | Fee ranges + in-platform negotiation |
| No BNS/BNSS research tool for lawyers | Legal Explorer with full corpus |
| District lawyers have no lead pipeline | Available Cases feed filtered by speciality |

---

## How It Works

### Complete End-to-End Flow

```mermaid
flowchart TD
    A([👤 Citizen Opens NyayaAI]) --> B[Describe Legal Situation]
    B --> C{Intake Agent}
    C --> D[Guided Q&A + OCR Upload]
    D --> E[Fact Summary for Confirmation]
    E --> F{Citizen Confirms?}
    F -- No --> D
    F -- Yes --> G[Research Agent]

    G --> H[(Qdrant Vector DB\nBNS / BNSS / IPC)]
    G --> I[(Neo4j Graph\nAct → Section)]
    H --> J[Strategy Agent]
    I --> J
    J --> K{Lawyer Needed?}
    K -- No --> L[Drafting Agent\nGenerates Documents]
    K -- Yes --> M[Marketplace\nTop Matched Lawyers]

    L --> N[Explainability Agent\nConfidence Scores + Audit Trail]
    M --> O[Citizen Views Lawyer Cards]
    O --> P[Sends AI Brief to Lawyer]

    P --> Q([👨‍⚖️ Lawyer Receives Brief])
    Q --> R[Reviews Full AI Brief]
    R --> S[Makes Offer + Fee Quote]
    S --> T{Citizen Accepts?}
    T -- Negotiates --> S
    T -- Yes --> U[Active Case]
    U --> V[Lawyer Tracks Milestones]
    V --> W[Case Complete]
    W --> X[Citizen Leaves Review]
    X --> Y([✅ Profile Updated])

    style A fill:#1a1a2e,color:#fff
    style Q fill:#16213e,color:#fff
    style Y fill:#0f3460,color:#fff
    style C fill:#e94560,color:#fff
    style G fill:#e94560,color:#fff
    style J fill:#e94560,color:#fff
    style L fill:#e94560,color:#fff
    style N fill:#e94560,color:#fff
```

---

## The 5-Agent Pipeline

Each citizen case passes through five specialised AI agents in sequence.

```mermaid
flowchart LR
    subgraph PIPELINE ["🤖 Five-Agent Pipeline"]
        direction LR
        A1["**Agent 1**\n🗣️ Intake\nGuided Q&A\nOCR Processing\nEvidence Tagging"]
        A2["**Agent 2**\n🔍 Research\nBNS/BNSS Retrieval\nState Variations\nSemantic Search"]
        A3["**Agent 3**\n🧠 Strategy\nAction Plan\nForum Routing\nLawyer Flag"]
        A4["**Agent 4**\n📝 Drafting\nLegal Notice\nFIR Draft\nAffidavit"]
        A5["**Agent 5**\n🔎 Explainability\nConfidence Scores\nCitation Sources\nAudit Trail"]

        A1 --> A2 --> A3 --> A4 --> A5
    end

    style A1 fill:#2d1b69,color:#fff
    style A2 fill:#1a237e,color:#fff
    style A3 fill:#1b5e20,color:#fff
    style A4 fill:#e65100,color:#fff
    style A5 fill:#b71c1c,color:#fff
```

### Agent Details

| Agent | Role | v4.0 Addition |
|-------|------|--------------|
| **Intake** | Converts citizen narrative → structured JSON via guided Q&A, OCR, evidence tagging | No change |
| **Research** | Semantic retrieval from Qdrant + Neo4j — BNS/BNSS primary with state variations | Powers Lawyer Explorer with deeper citations |
| **Strategy** | Builds prioritised action plan, sets `lawyer_recommended` flag | Sets fee estimate range for posted cases |
| **Drafting** | Generates legal documents — Word + PDF export | Generates lawyer case summary card |
| **Explainability** | Confidence scores, retrieval sources, reasoning chain | Lawyer mode: full HC/SC citation text |

---

## Dual-Side Marketplace

### Matching Algorithm

The matching engine scores all available lawyers using 5 weighted factors.

```mermaid
pie title Lawyer Match Score Weights
    "Domain Match" : 30
    "Jurisdictional Match" : 25
    "Outcome Similarity" : 25
    "Review Score" : 15
    "Availability & Response Rate" : 5
```

### Brief Dispatch Flow

```mermaid
sequenceDiagram
    actor C as 👤 Citizen
    participant S as NyayaAI System
    actor L as 👨‍⚖️ Lawyer

    C->>S: Completes case analysis
    S->>S: Matching engine scores lawyers
    S->>C: Shows top 3–5 lawyer cards
    C->>S: Clicks "Send Case Brief"
    S->>L: Dispatches AI-generated brief
    L->>S: Opens brief (status → Viewed)
    L->>S: Makes offer with fee quote
    S->>C: Notifies citizen of offer
    C->>L: Negotiates via message thread
    C->>S: Accepts offer
    S->>L: Case moves to Active pipeline
    S->>C: Confirms acceptance
```

---

## Lawyer Portal

The Lawyer Portal is a **separate professional interface** — not a citizen dashboard variant. Every screen is built around the advocate's workflow.

### Portal Navigation

```mermaid
flowchart TD
    LOGIN([🔐 Lawyer Login\nEmail + Bar Council ID])
    LOGIN --> NAV

    subgraph NAV ["Lawyer Portal Navigation"]
        AC["📋 Available Cases\nAll open citizen cases\nFilter by domain, state, budget"]
        MC["📁 My Cases\nFull pipeline management\nPending → Active → Completed"]
        MS["🎯 My Speciality\nPre-filtered by declared domains\nNew case badge count"]
        UQ["🚨 Unassigned Queue\nCases with no offers\nTime badges + urgency alerts"]
        MP["👤 My Profile\nProfile builder\nVerification + completeness"]
        LE["🔬 Legal Explorer\nAI research tool\nSection lookup + case law"]
    end

    NAV --> AC
    NAV --> MC
    NAV --> MS
    NAV --> UQ
    NAV --> MP
    NAV --> LE

    style LOGIN fill:#1a1a2e,color:#fff
    style AC fill:#0d47a1,color:#fff
    style MC fill:#1b5e20,color:#fff
    style MS fill:#4a148c,color:#fff
    style UQ fill:#b71c1c,color:#fff
    style MP fill:#e65100,color:#fff
    style LE fill:#006064,color:#fff
```

### Case Pipeline Stages

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Available : Case posted by citizen
    Available --> Pending : Lawyer makes offer
    Pending --> Available : Lawyer withdraws offer
    Pending --> Active : Citizen accepts
    Active --> Completed : Lawyer marks complete
    Completed --> [*]

    note right of Pending
        Citizen can negotiate
        via message thread
    end note

    note right of Active
        Milestones tracked
        Documents shared
        Deadline reminders sent
    end note
```

### Unassigned Case Escalation

```mermaid
timeline
    title Unassigned Case Escalation Timeline
    0h  : Case posted by citizen
        : Appears in Available Cases feed
    24h : No offers received
        : Moves to Unassigned Queue
        : Matched lawyers notified
    48h : Still no offers
        : "Urgent" indicator applied
        : Push sent to top 10 matched lawyers
    72h : Still no offers
        : Pinned to top of queue — "Critical"
        : Citizen offered option to broaden jurisdiction or adjust budget
```

### Lawyer Profile Completeness

| Section | Weight |
|---------|--------|
| Photo & Bio | 15% |
| Specialisations | 15% |
| Fee Structure | 15% |
| Case History (3+ cases) | 20% |
| Verification Badge | 20% |
| Practice Courts | 10% |
| Languages | 5% |

> ⚠️ Profiles below **60% completeness** are ranked lower in citizen search results.

---

## System Architecture

```mermaid
flowchart TB
    subgraph FRONTEND ["🖥️ Frontend — Next.js 14 + Tailwind"]
        CW["/citizen/* — Citizen Portal"]
        LW["/lawyer/* — Lawyer Portal"]
    end

    subgraph BACKEND ["⚙️ Backend — FastAPI (Python, Async)"]
        CA["Citizen API Router"]
        LA["Lawyer Portal Service"]
        MS["Marketplace Service\nMatching · Brief Dispatch · Offers"]
        NS["Notification Service\nRedis pub/sub + Celery"]
        TQ["Task Queue\nRedis + Celery"]
    end

    subgraph AGENTS ["🤖 LangGraph Agent Pipeline"]
        AG1["Intake"] --> AG2["Research"] --> AG3["Strategy"] --> AG4["Drafting"] --> AG5["Explainability"]
    end

    subgraph STORAGE ["🗄️ Data Layer"]
        QD[(Qdrant\nVector DB\nLegal Corpus)]
        N4[(Neo4j\nGraph DB\nAct → Section)]
        PG[(PostgreSQL\nSupabase\nAll Relational Data)]
        RD[(Redis\nQueues + Pub/Sub)]
        SS[(Supabase Storage\nDocs + Media)]
    end

    CW --> CA
    LW --> LA
    CA --> AGENTS
    CA --> MS
    LA --> MS
    AGENTS --> QD
    AGENTS --> N4
    AGENTS --> PG
    MS --> PG
    NS --> RD
    TQ --> RD
    AG4 --> SS

    style FRONTEND fill:#1a237e,color:#fff
    style BACKEND fill:#1b5e20,color:#fff
    style AGENTS fill:#4a148c,color:#fff
    style STORAGE fill:#37474f,color:#fff
```

---

## Data Model

### Key Tables — v4 Additions

```mermaid
erDiagram
    LAWYER_PROFILES {
        uuid lawyer_id PK
        varchar name
        varchar bar_council_id
        boolean verified
        text[] specialisations
        text[] practice_courts
        float win_rate
        float review_avg
        int review_count
        boolean accepting_cases
        float profile_completeness
    }

    CASE_PIPELINE {
        uuid pipeline_id PK
        uuid case_id FK
        uuid lawyer_id FK
        enum stage
        int offer_amount
        text offer_message
        timestamp offered_at
        timestamp accepted_at
        enum outcome
        jsonb milestones
    }

    LAWYER_REVIEWS {
        uuid review_id PK
        uuid lawyer_id FK
        uuid citizen_id FK
        uuid pipeline_id FK
        smallint rating
        text written_review
        boolean is_verified
    }

    LAWYER_SAVED_RESEARCH {
        uuid research_id PK
        uuid lawyer_id FK
        uuid pipeline_id FK
        text query
        jsonb result_snapshot
    }

    UNASSIGNED_ESCALATIONS {
        uuid escalation_id PK
        uuid case_id FK
        float hours_open
        smallint escalation_level
        int notifications_sent
        timestamp resolved_at
    }

    LAWYER_PROFILES ||--o{ CASE_PIPELINE : "engages in"
    LAWYER_PROFILES ||--o{ LAWYER_REVIEWS : "receives"
    LAWYER_PROFILES ||--o{ LAWYER_SAVED_RESEARCH : "saves"
    CASE_PIPELINE ||--o| LAWYER_REVIEWS : "generates"
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Agent Orchestration** | LangGraph (Python) |
| **LLM** | Claude Sonnet via Anthropic API |
| **Vector DB** | Qdrant (self-hosted or Cloud) |
| **Graph DB** | Neo4j Aura Free |
| **Relational DB** | PostgreSQL via Supabase |
| **Embeddings** | text-embedding-3-large (OpenAI) |
| **OCR** | Tesseract + Claude Vision API |
| **Backend** | FastAPI (Python, async) |
| **Task Queue** | Redis + Celery |
| **Frontend** | Next.js 14 + Tailwind CSS |
| **Auth** | Supabase Auth — OTP / Bar Council ID |
| **File Storage** | Supabase Storage |
| **Document Generation** | docx (npm) · ReportLab (PDF) |
| **Deployment** | Railway (backend) · Vercel (frontend) |
| **External APIs** | IndianKanoon · eCourts · Gazette RSS |

---

## Build Phases

```mermaid
gantt
    title NyayaAI v4 — Hackathon Build Timeline
    dateFormat HH
    axisFormat Hour %H

    section Pre-Hackathon
    Lawyer portal UI (9 screens)        :done, 00, 2h
    Case pipeline schema                :done, 00, 2h
    Matching engine implementation      :done, 00, 2h
    Legal Explorer lawyer mode          :done, 00, 2h
    Escalation + alert engine           :done, 00, 2h

    section Phase 1 — Core Pipeline (0–12h)
    Wire 5 agents to live knowledge     :active, 00, 4h
    Citizen intake → analysis E2E       :04, 4h
    Lawyer matching wired to Strategy   :08, 4h

    section Phase 2 — Marketplace (12–24h)
    Brief dispatch pipeline             :12, 3h
    Case pipeline UI — Kanban stages    :15, 3h
    Lawyer Profile Builder live         :18, 2h
    Speciality feed + Unassigned Queue  :20, 4h

    section Phase 3 — Polish (24–36h)
    Full E2E demo flow                  :24, 4h
    Notifications live both sides       :28, 4h
    Performance optimisation (<45s)     :32, 4h
```

---

## Success Metrics

### Platform Quality

| Metric | Target |
|--------|--------|
| BNS/BNSS Citation Accuracy | > 98% |
| State Variation Accuracy | > 92% |
| Intake Domain Classification | > 90% |
| Analysis Pipeline Latency | < 45 seconds |

### Marketplace — Citizen Side

| Metric | Target |
|--------|--------|
| Cases surfaced to marketplace | > 45% |
| Profile view rate | > 55% |
| Brief dispatch rate | > 30% |
| Offer received within 48h | > 65% |
| Offer acceptance rate | > 50% |

### Marketplace — Lawyer Side

| Metric | Target |
|--------|--------|
| Brief response rate (within 24h) | > 70% |
| Case completion rate | > 80% |
| Review submission rate | > 40% |
| Unassigned case resolution (72h) | > 75% |
| Median profile completeness | > 80% |

---

## Roadmap

```mermaid
flowchart LR
    subgraph NEAR ["🟢 Near-Term"]
        R1["Lawyer-side\ndocument drafting"]
        R2["eCourts win record\nverification"]
        R3["Video consultation\nbooking"]
        R4["Payment & escrow\nin-platform"]
    end

    subgraph MID ["🟡 Mid-Term"]
        R5["WhatsApp intake\nbot"]
        R6["Regional languages\nTamil · Telugu · Bengali · Marathi"]
        R7["Bar Council API\nauto-verification"]
        R8["Lok Adalat /\nMediation routing"]
    end

    subgraph LONG ["🔵 Long-Term"]
        R9["Predictive outcome\nsimulation"]
        R10["Community feed\nanonymised cases"]
        R11["React Native\nmobile app"]
        R12["Real-time Gazette\nalerts"]
    end

    NEAR --> MID --> LONG

    style NEAR fill:#1b5e20,color:#fff
    style MID fill:#e65100,color:#fff
    style LONG fill:#1a237e,color:#fff
```

---

## User Roles

| Role | Profile | Primary Needs |
|------|---------|--------------|
| **Citizen** | No legal knowledge, Hinglish-first | Understand rights · get documents · find affordable lawyer |
| **Educated Citizen** | English-fluent, urban professional | Fast analysis · self-represent or smart lawyer selection |
| **Junior Lawyer** | 0–5 years, building practice | Client leads · AI research · profile visibility |
| **Senior Lawyer** | 5+ years, HC/SC experience | Qualified high-value leads · pre-qualified briefs |
| **Law Student / Paralegal** | Legal training background | Case research · statute lookup · outcome data |
| **Platform Admin** | Internal team | Lawyer verification · dispute resolution · quality control |

---

## Non-Goals for v4.0

> The following are explicitly **out of scope** for this version:

- ❌ Court e-filing automation
- ❌ Native mobile app (PWA only)
- ❌ Regional languages beyond Hindi / English / Hinglish
- ❌ Aadhaar-based KYC
- ❌ In-platform payment processing or escrow
- ❌ AI automation of lawyer responses on the lawyer's behalf

---

<div align="center">

**NyayaAI v4.0** · Hackathon Build · Full Dual-Side Marketplace · BNS / BNSS / IPC / CPC · 5-Agent Pipeline

*Intelligent Legal Assistance for Every Indian Citizen*

</div>
