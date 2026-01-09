# Zaynarah – Project Context & System Status

This document is the authoritative technical and product context for the **Zaynarah** e-commerce platform.  
It reflects the **current, real implementation state** of the system.

This file supersedes all prior assumptions and must remain in sync with production behavior.

---

## 📌 Project Overview

**Zaynarah** is a luxury e-commerce platform focused on handcrafted Pashmina and heritage products.

The platform is architected as an **enterprise-grade, modular system** with:

- deterministic checkout flows
- server-authoritative order and payment state
- explicit session hydration guarantees
- production-safe routing and state isolation
- operational readiness for scale

The project is currently in a **backend-complete + frontend domain-stabilized phase**, with all critical commerce flows hardened and verified.

---

## 🧱 High-Level Architecture

### Frontend

- **Framework:** Vite + React
- **State Management:** Zustand
  - feature-scoped stores
  - strict separation of domain state vs UI state
  - app-level hydration only
- **UI System:** shadcn/ui
- **Routing:** React Router (hydration-aware, guarded)
- **Data Access:** Axios (partial consolidation pending)
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
- **PDF Generation:** Puppeteer (invoice generation)

---

## 📊 Feature Status Matrix (Actual State)

| Feature / Module                 | Frontend Status | Backend Status | Notes                                     |
| -------------------------------- | --------------- | -------------- | ----------------------------------------- |
| Auth (Login / Signup / Sessions) | ✅ Complete     | ✅ Complete    | Hydration-safe, remember-me, refresh-safe |
| Users / Profile                  | ✅ Stable       | ✅ Complete    | Profile UI complete                       |
| Products / Shop (PLP)            | ✅ Stable       | ✅ Complete    | Pagination & filters stable               |
| Product Detail Page (PDP)        | ✅ Stable       | ✅ Complete    | Add-to-cart stable                        |
| Cart (Guest + Auth)              | ✅ Complete     | ✅ Complete    | Guest persistence + merge-on-login        |
| Mini Cart / Cart Badge           | ✅ Stable       | N/A            | Fully synced                              |
| Checkout (State Machine)         | ✅ Complete     | ✅ Complete    | Domain + UI stores finalized              |
| Orders                           | ⚙️ UI Partial   | ✅ Complete    | Frontend refactor pending                 |
| Payments                         | ✅ Stable       | ✅ Complete    | Webhook-authoritative                     |
| Webhooks                         | ❌ UI           | ✅ Complete    | Production-safe                           |
| Notifications (In-App)           | ✅ Complete     | ✅ Complete    | SSE + pagination + read state             |
| Notifications (Email)            | ❌ UI           | ✅ Complete    | Rule-based                                |
| Invoices (HTML + PDF)            | ❌ UI           | ✅ Complete    | Auto-generated                            |
| Refunds                          | ❌ UI           | ✅ Complete    | Admin-only                                |
| Admin Dashboard                  | ⚙️ Partial UI   | ✅ Complete    | Frontend incomplete                       |
| Categories / Filters             | ⚙️ Partial      | ⚙️ Partial     | Advanced faceting pending                 |
| Coupons / Discounts              | ❌ Not Started  | ❌ Not Started | —                                         |
| Reviews                          | ⚙️ UI Only      | ❌ Not Started | APIs missing                              |
| Wishlist                         | ⚙️ Local        | ❌ Not Started | Backend pending                           |
| Uploads / Assets                 | ❌ Not Started  | ❌ Not Started | —                                         |
| API Client Unification           | ⚙️ Partial      | ✅ Complete    | Frontend consolidation pending            |
| Error Handling                   | ⚙️ Partial      | ✅ Complete    | FE boundaries pending                     |
| Performance                      | ⚙️ Partial      | ⚙️ Partial     | FE optimizations pending                  |
| Testing / QA                     | ❌ Not Started  | ⚙️ Partial     | No FE tests                               |
| Accessibility & SEO              | ❌ Not Started  | N/A            | —                                         |
| CI/CD                            | ❌ Not Started  | ⚙️ Partial     | FE pipeline missing                       |

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

1. Cart seeds checkout **once**
2. Checkout session initialized from cart snapshot
3. Shipping address selection
4. Shipping method selection
5. Pricing finalized (shipping + tax)
6. Order locked → `priced`
7. Payment prepared → `payment_pending`
8. **Payment confirmed ONLY via webhook**
9. Order marked paid, stock reduced, cart cleared

---

## 🔐 Checkout State Guarantees (Hardened)

- Checkout domain store is the **single source of truth**
- Cart is never re-read after checkout session initialization
- Shipping methods load only after address selection
- Totals persist across refresh via controlled hydration
- App-level hydration prevents redirect loops and blank screens
- No phantom items, no subtotal resets, no duplicate sessions

---

## 🔐 Authentication & Sessions

- JWT with persistent session records
- Supports:
  - Remember Me
  - Multi-device sessions
  - Session revocation
  - Activity tracking
- Route guards wait for auth hydration
- Hard refresh on protected routes is safe
- Logout restores guest cart context

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
- Asynchronous delivery via queue
- Invoice PDFs attached automatically
- SMTP provider configurable

---

## 💳 Payments & Webhooks

- **No client-side payment confirmation**
- All payments confirmed exclusively via:
  - Stripe webhooks
  - Razorpay webhooks
- Signature verification enforced
- Duplicate webhook safety implemented
- Stock decrement and cart clearing executed once

---

## 🧪 Stability Assessment

### Fully Stable

- Authentication and session hydration
- Cart lifecycle
- Checkout domain and UI
- Order state machine (backend)
- Payments and webhooks
- Notifications (in-app and email)
- Invoice generation
- Protected routing and refresh behavior

### Needs Frontend Refactor

- Orders UI domain separation
- Admin UI completeness
- API client consolidation

### Not Started (Remaining Work)

- Frontend testing
- Accessibility and SEO
- CI/CD for frontend
- Uploads and asset pipeline

---

## 🧭 Overall Project Health

- **Status:** 🟢 Core commerce flows production-safe
- **Execution Progress:** ~92%
- **Architecture Quality:** ⭐⭐⭐⭐⭐ (commerce core)

### Primary Remaining Risks

1. Orders frontend architecture debt
2. Frontend testing gap
3. Admin UX completeness
4. SEO and accessibility

---

## 📍 Next Planned Phase

### 👉 Orders Frontend Domain Refactor (Next)

- Introduce Orders domain store
- Introduce Orders UI store
- Rewire Orders pages and components
- Eliminate direct API usage from UI
- Preserve existing UI and behavior

---

**This document must be updated whenever system behavior, guarantees, or architecture changes.**
