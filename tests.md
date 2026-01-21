# Frontend Testing Strategy — Zaynarah

This document defines the **authoritative frontend testing strategy** for the Zaynarah application. It documents _what is tested, why it is tested, how tests are structured, and what is explicitly out of scope_. This file is a **lockfile for behavior**, not a suggestion.

---

## 1. Purpose

Frontend tests exist to:

- Lock **business‑critical state behavior**
- Prevent **silent regressions** during refactors
- Make async and concurrency bugs **observable**
- Guarantee **deterministic hydration and persistence**
- Ensure UI state cannot drift from domain truth

Tests are **not written for coverage**.
They are written to **freeze intent**.

---

## 2. Tooling

### Runtime

- **Test Runner:** Vitest (v4.x)
- **Mocking:** MSW (Mock Service Worker)
- **State Layer:** Zustand
- **HTTP:** Axios / Fetch (mocked)

### Environment

- Browser-like environment via Vitest
- No real backend required
- No real Redis / SSE / WebSocket connections

---

## 3. Test Structure

Tests are colocated with the code they protect.

```
src/
  stores/
    <feature>/
      __tests__/
        *.test.js
        *.advanced.test.js

src/features/
  <feature>/services/__tests__/
```

### Naming Rules

- `*.test.js` → **Baseline behavior**
- `*.advanced.test.js` → **Adversarial / edge / concurrency behavior**

---

## 4. Layers Under Test

### 4.1 Domain Stores (Zustand)

**Primary source of truth.**

Tested invariants include:

- Hydration correctness
- Persistence semantics
- Idempotency
- Pagination logic
- Deduplication rules
- Error isolation
- Concurrency safety

All domain stores are **fully frozen** once baseline + adversarial tests pass.

---

### 4.2 UI Stores

UI stores are tested separately to ensure:

- Navigation boundaries are enforced
- Loading and error flags are isolated
- Reset behavior is deterministic
- Corrupted state does not crash navigation

UI stores **never** perform I/O and are tested synchronously.

---

### 4.3 API Services

API tests validate **contract behavior**, not backend correctness.

What is tested:

- Auth‑guard behavior
- Safe no‑ops when unauthenticated
- Pagination arguments
- Response passthrough
- Idempotent endpoints

What is _not_ tested:

- Backend validation rules
- Database effects
- Authorization correctness

---

## 5. Mocking Strategy (MSW)

### Single Source of Truth

All HTTP mocks live in:

```
src/test/mockHandlers.js
```

Rules:

- No inline mocks in tests
- No per‑test handler mutation unless required
- Pagination and error shapes must be deterministic

---

## 6. Feature Coverage (Frozen)

The following features are **fully tested and locked**:

- User / Auth
- Cart (Domain + UI)
- Orders (Domain + UI)
- Checkout (Domain + UI + Adversarial)
- Notifications (Domain + UI + API)

Any behavior change in these areas **must break a test first**.

---

## 7. Explicitly Out of Scope

The following are **intentionally not tested**:

- React components
- Styling / layout
- Animations
- Browser APIs
- Stripe / Razorpay SDK internals
- SSE execution logic

These are validated via **manual QA and production monitoring**.

---

## 8. Non‑Negotiable Rules

- No test relies on execution order
- No shared mutable state between tests
- No real network calls
- No snapshot testing
- No implicit behavior assumptions

Violating these rules invalidates the test suite.

---

## 9. How to Run Tests

```
npm test
```

Vitest runs in watch mode by default.
All tests must pass before merging.

---

## 10. Final Principle

> **If a test fails, the system is unsafe — not the test.**

This document is authoritative.
Update it **only** when system behavior intentionally changes.
