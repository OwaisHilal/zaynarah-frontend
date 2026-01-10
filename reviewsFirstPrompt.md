# Zaynarah — Authoritative Frontend Refactor Context (LOCKED)

This prompt defines the **current system state, locked features, architectural rules, and execution protocol** for all future work in this chat.

Any deviation is a **hard regression**.

---

## ✅ COMPLETED & LOCKED FEATURES (DO NOT TOUCH)

The following features have been **successfully refactored**, are **stable**, and are **ARCHITECTURALLY FINAL**.

### ✅ USER / AUTH (LOCKED)

- Zustand domain stores finalized
- Auth & session hydration handled correctly at App scope
- Remember-me logic correct (localStorage vs sessionStorage)
- Session survives hard refresh on protected routes
- Admin routing & CTA issues fixed
- Auth guards wait for hydration correctly
- No regressions

Architecture decisions are FINAL.

---

### ✅ CART (LOCKED)

- Cart domain store finalized
- Guest + authenticated cart fully supported
- Cart persistence & hydration fixed
- Merge-on-login behavior finalized
- Quantity updates stable
- Cart UI fully wired to domain store
- No legacy cart logic remains

Architecture decisions are FINAL.

---

### ✅ CHECKOUT (LOCKED)

- Checkout domain store finalized
- Checkout UI store finalized
- App-level checkout hydration implemented
- Checkout session lifecycle stable
- Shipping → pricing → payment flow fixed
- Stripe + Razorpay wired correctly
- Protected route refresh issues fixed
- No hydration loops, redirects, or UI regressions

Feature is CLOSED.

---

### ✅ NOTIFICATIONS (LOCKED)

- Notifications persisted correctly (MongoDB + worker)
- SSE real-time delivery working
- Notifications domain store implemented
- Notifications page paginated correctly
- Mark-as-read and mark-all-read working
- Notification bell & dropdown wired
- Minor unread-badge timing quirks accepted and deferred

Feature is CLOSED.

---

### ✅ ORDERS (LOCKED)

- Orders domain store finalized
- Orders UI store finalized
- Orders page fully wired
- Order details drawer stable
- Invoice download moved to services layer
- Backend responses handled defensively
- Orders UI removed from User Profile
- No regressions

Feature is LOCKED.

---

### ✅ PRODUCTS (MOSTLY COMPLETE — PARTIALLY LOCKED)

- Products **domain store finalized**
- Products **UI store finalized**
- Entity normalization, pagination, filters, sorting complete
- Product grid & product card wiring complete
- Interaction with CART stable (read-only)
- Interaction with SEARCH stable (read-only)

🚫 Products stores MUST NOT be refactored again  
🚫 Products business logic MUST NOT change

✅ Only **page placement & light architectural cleanup** is allowed (see scope below)

---

## 🚫 ABSOLUTELY LOCKED — DO NOT TOUCH

- USER / AUTH
- CART
- CHECKOUT
- NOTIFICATIONS
- ORDERS

Any change to these is a **hard regression**.

---

## 📌 CURRENT APPLICATION CONTEXT

- Production **React + Vite** ecommerce frontend
- **Zustand** is the primary state manager
- **React Query exists** and MUST NOT be removed unless explicitly approved
- App is currently **stable and working**
- We proceed **incrementally, one feature at a time**
- No resets, no rewrites, no architectural experiments

---

## 🎯 CURRENT GOAL

Introduce and properly refactor the **REVIEWS feature**, while performing **minor structural cleanup** related to page placement.

---

## 🚨 ACTIVE FEATURE IN SCOPE (LOCKED)

👉 **REVIEWS**

This feature is **NOT yet finalized** and requires a **full, proper refactor**.

### REVIEWS scope includes:

- Reviews **domain store**
  - product-scoped reviews
  - pagination & sorting
  - defensive backend handling
  - verified-purchase enforcement (read-only from Orders)
- Reviews **UI store**
  - pagination state
  - sort state
  - modal / interaction state
- Reviews UI & UX
  - Average rating
  - Rating breakdown
  - Reviews list
  - Write-review flow
- Clear separation from PRODUCTS
- No render loops, no unstable selectors, no hydration bugs
- Feature-level ownership (REVIEWS owns its logic and UI)

---

## 🟡 ALLOWED SECONDARY CLEANUP (LIMITED)

👉 **PRODUCTS — PAGE PLACEMENT ONLY**

Allowed:

- Move `ProductPage` and `ShopPage` to `src/pages`
- Adjust routing imports accordingly
- No store changes
- No business logic changes
- No UI/behavior changes

This cleanup exists **only to support proper architecture**, not to refactor PRODUCTS again.

---

## 🚫 HARD EXCLUSIONS (DO NOT TOUCH OR MENTION)

- USER / AUTH
- CART
- CHECKOUT
- NOTIFICATIONS
- ORDERS
- PAYMENTS
- ADMIN
- SEARCH (except read-only integration)

Do NOT refactor or mention these unless explicitly unlocked.

---

## ⛔ NON-NEGOTIABLE RULES

- Refactor **ONLY ONE FEATURE AT A TIME**
- REVIEWS is considered COMPLETE only when:
  - Domain store finalized
  - UI store finalized
  - Components fully wired
  - No legacy or ad-hoc state remains
  - No UI or behavior regressions
  - No warnings, render loops, hydration bugs
- Store hydration & lifecycle handled correctly
- **No new folders or files** unless explicitly approved
- If anything is unclear: **STOP AND ASK BEFORE WRITING CODE**

---

## 🏗️ ARCHITECTURE DIRECTION (LOCKED)

- Zustand stores only
- Strict separation between:
  - **Domain state**
  - **UI state**
- Services remain unchanged unless explicitly approved
- Follow the same discipline used in:
  - USER / AUTH
  - CART
  - CHECKOUT
  - NOTIFICATIONS
  - ORDERS

---

## 🔄 EXECUTION PROCESS (MANDATORY)

Before writing **ANY code**, you must:

1. Acknowledge all rules
2. Confirm the scope is **REVIEWS** (with limited PRODUCTS page cleanup)
3. List **exactly which REVIEWS-related files** you need to see
4. Explain the **REVIEWS-only refactor plan**
5. WAIT for explicit confirmation

---

## 🚫 ABSOLUTE PROHIBITIONS

- ❌ No partial execution
- ❌ No silent refactors
- ❌ No cross-feature bleed

---

## ✅ FINAL INSTRUCTION

Acknowledge these rules, confirm the scope is **REVIEWS**, and ask for the **exact files** required to begin.
