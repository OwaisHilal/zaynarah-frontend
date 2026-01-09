We have SUCCESSFULLY COMPLETED the following refactors across previous chats.
These features are LOCKED, STABLE, AND MUST NOT BE TOUCHED.

✅ WHAT IS ALREADY DONE (LOCKED — DO NOT TOUCH)
✅ USER / AUTH (COMPLETED EARLIER)

Zustand domain stores finalized

Auth & session hydration handled correctly at App scope

Remember-me works correctly (localStorage vs sessionStorage)

Session survives hard refresh on protected routes

Admin routing & CTA issues fixed

Auth guards wait for hydration correctly

No regressions

Architecture decisions are FINAL

✅ CART (COMPLETED EARLIER)

Cart domain store finalized

Guest cart + authenticated cart fully supported

Cart persistence & hydration fixed

Merge-on-login behavior finalized

Quantity updates stable

Cart UI fully wired to domain store

No legacy cart logic remains

Architecture decisions are FINAL

✅ CHECKOUT (COMPLETED EARLIER)

Checkout domain store finalized

Checkout UI store finalized (steps, progress, loading, errors)

App-level checkout hydration implemented

Checkout session lifecycle stable

Shipping address → shipping method → pricing flow fixed

Payment flow (Stripe + Razorpay) wired correctly

Protected / verified route refresh issues fixed

No blank screens, forced redirects, or hydration loops

UI & behavior unchanged

Feature is CLOSED and must not be revisited unless explicitly requested

✅ NOTIFICATIONS (COMPLETED EARLIER)

Notifications persisted correctly in backend (MongoDB + worker)

SSE real-time delivery working

Notifications domain store implemented

Notifications page loads paginated history correctly

Mark-as-read and mark-all-read working

Notification dropdown & bell wired

Minor unread-badge timing quirks accepted and deferred

Feature is functionally complete and CLOSED

✅ ORDERS (COMPLETED IN PREVIOUS CHAT)

Orders domain store finalized

Orders UI store finalized (selection, pagination, lifecycle)

Orders page fully wired to domain store

Order details drawer correctly wired

Invoice download moved to services layer (no manual API calls)

Backend response shape handled defensively

Orders UI removed from User Profile (single source of truth)

No regressions

Feature is CLOSED and LOCKED

🚫 LOCKED FEATURES — DO NOT TOUCH

USER / AUTH

CART

CHECKOUT

NOTIFICATIONS

ORDERS

Any change to these is a hard regression.

📌 CURRENT CONTEXT

This is a production React + Vite ecommerce frontend

Zustand is used for all state management

React Query exists in some places and MUST NOT be removed unless explicitly approved

The app is currently STABLE and WORKING

We are continuing incremental, feature-by-feature refactors

No resets, no rewrites, no architectural experiments

🎯 GOAL

Continue a FULL STRUCTURAL STORE REFACTOR, one feature at a time, building on the completed:

USER / AUTH

CART

CHECKOUT

NOTIFICATIONS

ORDERS

🚨 FEATURE TO REFACTOR (NEXT — LOCKED SCOPE)

👉 PRODUCTS

Includes ONLY:

Products domain store (entities, pagination, normalization)

Products UI store (filters, sorting, loading, view state)

Shop page wiring

Product grid & product card state wiring

Product filters state management

Interaction with CART without modifying CART

Interaction with SEARCH without modifying SEARCH

🚫 HARD EXCLUSIONS (DO NOT TOUCH OR MENTION)

USER / AUTH

CART

CHECKOUT

NOTIFICATIONS

ORDERS

PAYMENTS

ADMIN

SEARCH (except read-only integration)

Do NOT mention or refactor these unless PRODUCTS is 100% finished and I explicitly say:

“next feature”

⛔ NON-NEGOTIABLE RULES

Refactor ONLY ONE FEATURE AT A TIME

A feature is considered COMPLETE ONLY WHEN:

Its Zustand domain store is finalized

Its Zustand UI store is finalized

All pages/components are fully wired

NO old state logic remains

NO UI or behavior changes

NO regressions

NO new warnings, infinite loops, hydration bugs, or redirects

Store hydration and lifecycle timing must be handled at App scope

NO new folders or files unless I explicitly approve

If anything is unclear: STOP AND ASK BEFORE WRITING CODE

🏗️ ARCHITECTURE DIRECTION (LOCKED)

Zustand stores only

Clear separation between:

Domain state (business data)

UI state (view / interaction state)

Services stay exactly as they are unless explicitly approved

Follow the same discipline used in:

USER / AUTH

CART

CHECKOUT

NOTIFICATIONS

ORDERS

🔄 PROCESS (MANDATORY)

Before writing ANY code, you must:

List exactly which PRODUCTS-related files you need to see

Explain the refactor plan for PRODUCTS ONLY

WAIT for my explicit confirmation

🚫 ABSOLUTE PROHIBITIONS

🚫 No partial execution

🚫 No silent refactors

🚫 No cross-feature bleed

✅ FINAL INSTRUCTION

Acknowledge these rules, confirm the scope is PRODUCTS ONLY, and ask for the exact files you need to begin.
