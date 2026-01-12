# Zaynarah – Project Context & System Status

This document is the authoritative technical and product context for the **Zaynarah** e-commerce platform.  
It reflects the **current, real implementation state** of the system.

This file supersedes all prior assumptions and must remain in sync with **production behavior**.

---

## 📌 Project Overview

**Zaynarah** is a luxury e-commerce platform focused on handcrafted Pashmina and heritage products.

The platform is architected as an **enterprise-grade, modular system** with:

- deterministic checkout flows
- server-authoritative order and payment state
- explicit session hydration guarantees
- production-safe routing and state isolation
- operational readiness for scale

The project is currently in a **backend-complete + frontend domain-stabilized phase**.  
All **core commerce flows are implemented and architecturally correct**, with remaining work focused on **UX polish, testing, SEO, and admin completeness** rather than core logic.

---

## 🧱 High-Level Architecture

### Frontend

- **Framework:** Vite + React
- **State Management:** Zustand
  - feature-scoped stores
  - strict separation of **domain state** vs **UI state**
  - hydration only where architecturally justified
- **UI System:** shadcn/ui
- **Routing:** React Router (hydration-aware, guarded)
- **Data Access:** Axios (feature-scoped; consolidation pending)
- **UX Feedback:** Toast-based, non-blocking
- **Checkout Pattern:** Step-based deterministic state machine

### Backend

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT + persistent sessions (JTI-based)
- **Queues:** Redis + BullMQ
- **Payments:** Stripe & Razorpay (server-authoritative)
- **Webhooks:** Stripe & Razorpay (signature verified)
- **Email:** SMTP (Nodemailer)
- **Invoice Generation:** HTML + PDF via Puppeteer

---

## 📊 Feature Status Matrix (Actual State)

| Feature / Module                 | Frontend Status | Backend Status | Notes                                                  |
| -------------------------------- | --------------- | -------------- | ------------------------------------------------------ |
| Auth (Login / Signup / Sessions) | ✅ Complete     | ✅ Complete    | Hydration-safe, remember-me, refresh-safe              |
| Users / Profile                  | ✅ Stable       | ✅ Complete    | Profile UI stable                                      |
| Products / Shop (PLP)            | ✅ Complete     | ✅ Complete    | Domain + UI stores finalized                           |
| Product Detail Page (PDP)        | ✅ Complete     | ✅ Complete    | Store-driven, cached entities                          |
| Cart (Guest + Auth)              | ✅ Complete     | ✅ Complete    | Guest persistence + merge-on-login                     |
| Mini Cart / Cart Badge           | ✅ Stable       | N/A            | Fully synced                                           |
| Checkout (State Machine)         | ✅ Complete     | ✅ Complete    | Domain + UI stores finalized                           |
| Orders                           | ✅ Complete     | ✅ Complete    | Server-authoritative lifecycle                         |
| Payments                         | ✅ Stable       | ✅ Complete    | Webhook-authoritative; dev requires webhook simulation |
| Webhooks                         | ❌ UI           | ✅ Complete    | Stripe + Razorpay implemented, signature verified      |
| Notifications (In-App)           | ✅ Complete     | ✅ Complete    | SSE + pagination + read state                          |
| Notifications (Email)            | ❌ UI           | ✅ Complete    | Rule-based                                             |
| Invoices (HTML + PDF)            | ⚙️ Partial UI   | ✅ Complete    | Download wired via Orders UI                           |
| Refunds                          | ❌ UI           | ✅ Complete    | Admin-only                                             |
| Admin Dashboard                  | ⚙️ Partial UI   | ✅ Complete    | Backend complete, frontend pending                     |
| Categories / Filters             | ⚙️ Basic        | ⚙️ Partial     | Advanced faceting pending                              |
| Coupons / Discounts              | ❌ Not Started  | ❌ Not Started | —                                                      |
| Reviews                          | ⚙️ UI + API     | ✅ Complete    | Verified-purchase enforced; UI polish pending          |
| Wishlist                         | ⚙️ Local        | ✅ Complete    | Backend implemented; FE sync pending                   |
| Uploads / Assets                 | ❌ Not Started  | ❌ Not Started | —                                                      |
| API Client Unification           | ⚙️ Partial      | ✅ Complete    | Frontend consolidation pending                         |
| Error Handling                   | ⚙️ Partial      | ✅ Complete    | FE error boundaries pending                            |
| Performance                      | ⚙️ Partial      | ⚙️ Partial     | FE optimizations pending                               |
| Testing / QA                     | ❌ Not Started  | ⚙️ Partial     | No FE tests                                            |
| Accessibility & SEO              | ❌ Not Started  | N/A            | —                                                      |
| CI/CD                            | ❌ Not Started  | ⚙️ Partial     | FE pipeline missing                                    |

---

## 🛒 Cart & Checkout Philosophy

### Guest-First Commerce (Implemented)

- Full browsing and cart usage without authentication
- Persistent guest cart via `localStorage`
- Zero forced login friction

### Cart Merge on Login (Implemented)

- Safe merge on authentication
- Backend conflict resolution
- Guest cart cleared post-merge

---

## 🧾 Checkout Flow (Server-Authoritative)

1. Cart seeds checkout once
2. Checkout session initialized from cart snapshot
3. Shipping address selection
4. Shipping method selection
5. Pricing finalized (shipping + tax)
6. Order created in `pending` state
7. Payment initiated
8. **Payment confirmed ONLY via webhook**
9. Order marked `paid`, stock reduced, cart cleared

> In local/dev environments, webhook simulation or tunneling is required for orders to transition to `paid`.

---

## 🔐 Checkout State Guarantees (Hardened)

- Checkout domain store is the **single source of truth**
- Cart is never re-read after checkout initialization
- Shipping methods load only after address selection
- Totals persist across refresh via controlled hydration
- App-level hydration prevents redirect loops and blank screens
- No phantom items, no subtotal resets, no duplicate sessions

---

## 🔐 Authentication & Sessions

- JWT with persistent session records
- Supports:
  - Remember-me
  - Multi-device sessions
  - Session revocation
  - Activity tracking
- Route guards wait for auth hydration
- Hard refresh on protected routes is safe
- Logout restores guest cart context

---

## 📦 Orders (Frontend & Backend)

### Orders Frontend (Completed)

- Orders domain store finalized
- Orders UI store finalized
- Orders list and detail views wired
- Invoice download wired via services layer
- Defensive handling of backend response shapes
- Orders UI removed from User Profile (single source of truth)
- No regressions

### Orders Backend (Stable)

- Server-authoritative order lifecycle
- Draft → pending → paid / failed transitions
- Webhook-driven payment confirmation
- Invoice generation (HTML + PDF)
- Idempotent updates

---

## 📦 Products (Frontend & Backend)

### Products Frontend (Completed)

- Products **domain store** finalized
- Products **UI store** finalized
- Normalized product entities with ID mapping
- Page-scoped fetching only
- Centralized caching with reuse across navigation
- Filters, sorting, pagination store-driven
- No App-level hydration
- No regressions

### Products Backend (Stable)

- Paginated, filterable, sortable APIs
- Server-side validation
- Consistent response envelopes
- Defensive error handling

---

## ⭐ Reviews System (Current State)

### Backend (Complete)

- Review CRUD APIs implemented
- Verified-purchase enforcement via orders
- Rating aggregation and stats materialized
- Moderation hooks in place
- Server-authoritative validation

### Frontend (Functional, Needs Polish)

- Reviews list, summary, and breakdown wired
- Write-review modal implemented
- Zustand-backed domain + UI state
- UX polish and visual hierarchy pending

---

## 📩 Notifications & Emails

### In-App Notifications (Complete)

- Stored in MongoDB
- Read/unread tracking
- Real-time delivery via SSE
- Pagination supported
- Deduplicated via queue job IDs

### Email Notifications

- Rule-based dispatch
- Async delivery via queue
- Invoice PDFs attached automatically
- SMTP provider configurable

---

## 💳 Payments & Webhooks

- No client-side payment confirmation
- Payments confirmed exclusively via:
  - Stripe webhooks
  - Razorpay webhooks
- Signature verification enforced
- Duplicate webhook safety implemented
- Stock decrement and cart clearing executed once
- Local/dev requires webhook simulation or tunneling

---

## 🧪 Stability Assessment

### Fully Stable

- Authentication & session hydration
- Cart lifecycle
- Checkout domain & UI
- Orders frontend & backend
- Products frontend & backend
- Payments & webhooks (production)
- Notifications (in-app & email)
- Invoice generation
- Protected routing & refresh behavior
- Reviews backend logic

### Needs Frontend Work

- Reviews UX polish
- Admin UI completeness
- API client consolidation
- Error boundary coverage

### Not Started

- Frontend testing
- Accessibility & SEO
- CI/CD (frontend)
- Uploads & asset pipeline

---

## 🧭 Overall Project Health

- **Status:** 🟢 Core commerce flows production-safe
- **Execution Progress:** ~95%
- **Architecture Quality:** ⭐⭐⭐⭐⭐ (commerce core)

### Primary Remaining Risks

- Frontend testing gap
- Admin UX completeness
- SEO & accessibility
- Local/dev payment realism (webhooks)

---

## 📍 Next Planned Phase

### 👉 One of the following (to be chosen):

- Reviews UI/UX polish
- Payments dev tooling (webhook simulation)
- Admin frontend completion
- Frontend testing & error boundaries
- SEO & performance optimization

---

**This document must be updated whenever system behavior, guarantees, or architecture changes.**
