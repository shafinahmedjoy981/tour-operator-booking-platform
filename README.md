# Tidewise — Commission-Free Booking & CRM for Tour Operators

> **"Your guests. Your data. Zero commission."**

Tidewise is a focused, commission-free booking engine and guest relationship management system designed specifically for small tour, rental, and activity operators (kayak outfitters, guided eco-tours, charter boats).

---

## 🎨 Design System: "Crystal Glass"

Tidewise features a distinctive frosted crystal glass aesthetic, simulating smooth water and polished marine glass floating over a light ambient gradient mesh.

### Brand Color Tokens
- **Mist Blue (`#A0BDDB`)**: Primary surface tint, subtle background tints, secondary elements, borders, and soft fills.
- **Aqua (`#1EC1CB`)**: Primary action color, active states, focus rings, key highlights, and charts.
- **Deep Navy Ink (`#0F2A3D`)**: High-contrast text, headings, and high-contrast labels on Aqua buttons (passes WCAG AAA with $\ge 7:1$ contrast ratio).
- **Slate (`#5B7184`)**: Secondary text, metadata, captions, and muted timestamps.
- **Pure White (`#FFFFFF`)**: Core reflective highlights and elevated card surfaces.

### Semantic Status Colors
- **Go (`#16A34A` / Soft Green)**: Safe marine water conditions, verified active certifications, paid reservations.
- **Caution (`#D97706` / Soft Amber)**: Rising winds, impending certificate expirations, pending guest waivers.
- **Stop (`#E11D48` / Soft Coral)**: Gale squalls, active offshore lightning cells, dangerous water conditions requiring immediate guest rescheduling.

### Glassmorphism Elevation Levels
1. **Base Glass (`.glass-base`)**:
   - `background: rgba(255, 255, 255, 0.68)`
   - `backdrop-filter: blur(20px) saturate(140%)`
   - `border: 1px solid rgba(255, 255, 255, 0.78)`
   - `box-shadow: 0 8px 32px 0 rgba(160, 189, 219, 0.28)`
2. **Raised Glass (`.glass-raised`)**:
   - `background: rgba(255, 255, 255, 0.82)`
   - `backdrop-filter: blur(24px) saturate(140%)`
   - `border: 1px solid rgba(255, 255, 255, 0.88)`
   - `box-shadow: 0 14px 40px 0 rgba(160, 189, 219, 0.35)`
3. **Modal Glass (`.glass-modal`)**:
   - `background: rgba(255, 255, 255, 0.94)`
   - `backdrop-filter: blur(28px) saturate(150%)`
   - `border: 1px solid rgba(255, 255, 255, 0.95)`
   - `box-shadow: 0 24px 64px 0 rgba(15, 42, 61, 0.18)`

### Accessibility & Fallbacks
- **Reduced Transparency**: Automated fallback to solid `#FFFFFF` with soft border when `prefers-reduced-transparency: reduce` is detected.
- **Reduced Motion**: All animations settle instantly when `prefers-reduced-motion: reduce` is enabled.
- **Contrast**: Status is never conveyed by color alone; always paired with explicit icons and descriptive labels.

---

## 🔒 Production Security & Trust Notes

In production, Tidewise enforces enterprise-grade security protocols tailored for coastal operators:

### 1. Authentication & Session Management
- Multi-Factor Authentication (MFA) via WebAuthn / TOTP.
- Automatic dock terminal session timeout after 15 minutes of inactivity to safeguard unattended dock tablets.
- Audit trail logging all active IP addresses, user agents, and timestamps.

### 2. Role-Based Access Control (RBAC)
- **Owners**: Full visibility into bank payouts, gross revenues, customer CSV export, and deletion controls.
- **Dock Managers**: Schedule slots, approve reschedules, and view daily headcount totals.
- **Guides**: Access strictly limited to assigned departure manifests, guest first names, and critical medical/dietary notes. Revenue, bank details, and full customer PII are strictly excluded.

### 3. Multi-Tenant Account Isolation
- Hard data isolation ensuring each operator tenant has cryptographically partitioned database queries and storage buckets. Zero possibility of cross-operator data leakage.

### 4. Tokenized Hosted Payments (PCI DSS Level 1)
- Operator servers **never** touch, receive, or store raw Primary Account Numbers (PAN) or CVVs.
- Hosted checkout elements (Stripe Elements / Checkout) handle card tokenization client-side directly with the PCI DSS Level 1 certified processor.
- All webhook events are validated using HMAC-SHA256 signatures with replay protection.
- Transactional idempotency keys prevent accidental double charges under intermittent dock cellular connectivity.

### 5. Transactional Capacity Locking
- ACID-compliant atomic transactions lock seats during checkout with a 10-minute hold reservation to prevent overbooking under concurrent customer traffic.

### 6. Data Sovereignty & GDPR Compliance
- Operators own 100% of their customer data. Full database export to CSV is available anytime with a single click.
- "Right to be forgotten" GDPR workflows completely purge personal identifiers upon customer or operator request.

### 7. Widget Embed Security
- Allowed-origins whitelist ensures booking widgets only execute from approved operator domains.
- Strict Content Security Policy (CSP), rate-limiting via Cloudflare edge rules, and automatic input sanitization protect against XSS and CSRF.

### 8. Tamper-Evident Digital Waivers
- Digital signatures captured with verified IP address, user-agent metadata, and UTC timestamp, stored with an immutable SHA-256 hash.

---

## 📱 Mobile-First Dock Usability
- Bottom navigation bar on smartphone viewports with $\ge 44\text{px}$ tap targets.
- **"Guide Mobile View / Dock Manifest"**: 1-tap view designed for dock staff wearing life vests, providing manifests, emergency contacts, VHF channel indicators, and instant 1-tap "Check-in All Guests" actions.
