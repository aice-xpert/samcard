# SamCard — Digital Business Card Platform

## Proof of Work Report — Subaina Monib

---

### 1. Project Overview

**SamCard** (formerly DigiCard) is a full-stack SaaS platform that enables professionals and businesses to create, customize, share, and track digital business cards. Each card comes with a unique QR code, NFC support, and an analytics dashboard to measure engagement. The platform was built for **AICE XPERT** and is deployed at `samcard.vercel.app`.

The tech stack spans a **Next.js 16 frontend** (App Router, React 19, Tailwind CSS v4, TypeScript), an **Express 5 backend** (Node.js, TypeScript 6, Supabase, Firebase), and a **PostgreSQL database** managed via Prisma ORM. The frontend is hosted on Vercel, the backend on Render, with Supabase providing database, authentication, and file storage.

---

### 2. What I Have Done

I contributed **79 commits** out of a total 387 to the repository. My work spanned feature development, UI/UX implementation, bug fixing, and integration work across the full stack. Here is a detailed breakdown:

#### 2.1 UI/UX — Light/Dark Mode Implementation (Major Theme)

I led the implementation of light/dark mode across the entire application. This was the largest feature during my contributions:

- **Login & Signup pages** — Added full theme switching with proper form styling, input fields, and OAuth buttons adapting to both modes.
- **Landing page** — Implemented theme-aware Hero section, Features grid, Pricing cards, Testimonials, FAQ accordion, and CTA banner.
- **Blog & About Us pages** — Adapted blog listing, individual article pages, and all About Us sub-components (Hero, Innovation, StatsBar, StoryMissionValues, Timeline) to support theme switching.
- **Dashboard pages** — Light mode for the Analytics dashboard (charts, stat cards, device distribution), Order management, Billing, Settings, and Sidebar navigation.
- **Templates, QR Tab, QR Customiser, Phone Preview** — Ensured all card template previews, QR code customization UI, and the live phone preview rendered correctly in both themes.
- **Extra Section Blocks** — Added dark/light mode support for the drag-and-drop content blocks.
- **Forget Password page** — Added light mode styling.
- **SamCard Logo** — Made the brand logo respond to theme changes.

#### 2.2 Feature Development

- **Custom URL / Slug System** — Built the custom slug feature allowing users to set personalized URLs for their digital business cards (`samcard.app/custom-name`). This included slug availability validation, editing capabilities on existing cards, and proper error handling.
- **Email Functionality** — Integrated Nodemailer-based email system for transactional emails including email verification and password reset flows. Connected the frontend forms to backend email endpoints.
- **Template Selection System** — Fixed the template selection flow so that chosen templates persist correctly through the card creation and editing lifecycle, resolving issues where themes would reset unexpectedly.

#### 2.3 Bug Fixing & Polish

Over multiple dedicated bug-fixing sprints, I resolved:

- **UI break issues** — Fixed responsive layout breaks on the live public card page and across dashboard views.
- **Text overflow on public cards** — Ensured long text content in profile sections and other blocks didn't break the card layout.
- **Analytics device data** — Fixed WEB vs mobile device tracking in the analytics module.
- **Leads deletion** — Resolved an error where deleting leads from the CRM interface would fail silently.
- **Profile section toggle** — Fixed the visibility toggle for profile sections in the card preview.
- **Bin icon & share functionality** — Corrected icon rendering and resolved share link generation errors.
- **Cropped images in templates** — Fixed image rendering in template previews where images would display incorrectly.
- **Template persistence** — Ensured template selections and theme overrides were saved and restored correctly across sessions.
- **Logout flow** — Fixed the logout mechanism to properly clear sessions and redirect users.

#### 2.4 Backend Work

- **Email service** — Set up and configured the Nodemailer SMTP service in `backend/services/email.ts` for sending verification and password reset emails via Gmail SMTP.
- **API integration** — Worked on connecting frontend forms and actions to the Express backend endpoints, ensuring proper error handling and response parsing.
- **Authentication flow fixes** — Addressed issues in the login/signup pipeline related to Supabase Auth integration.

#### 2.5 Code Quality & Maintenance

- Regularly merged the latest changes from `main` and resolved merge conflicts across parallel feature branches.
- Participated in collaborative debugging sessions with team members (Zainab, Fatima, Saad) to resolve cross-cutting issues.

---

### 3. Technologies & Tools Used

| Category | Technologies |
|---|---|
| **Frontend** | Next.js 16.2, React 19, TypeScript 5, Tailwind CSS v4, Framer Motion, Recharts, Zustand, Zod, Radix UI |
| **Backend** | Express 5.2, Node.js, TypeScript 6, Supabase (Auth + Storage + DB), Firebase Admin, Passport.js, JWT, bcrypt, Nodemailer, Multer |
| **Database** | PostgreSQL, Prisma ORM 5.22 (40+ models) |
| **Infrastructure** | Vercel (frontend), Render (backend), Supabase Cloud |
| **Tools** | Git, GitHub, VS Code, npm, Vitest, ESLint |

---

### 4. Key Technical Challenges Overcome

1. **Theme Consistency Across a Large Component Tree** — With dozens of pages and hundreds of components, ensuring every element responded correctly to theme changes required careful planning of the context API, localStorage persistence, and avoiding flash-of-wrong-theme on page load.

2. **Template Persistence** — Templates had complex state that interacted with card design settings, QR configurations, and content blocks. Ensuring users didn't lose their template selection through the card creation/edit lifecycle required tracing state management across multiple React components and Zustand stores.

3. **Supabase Auth Integration** — The platform uses both Supabase Auth and custom JWT sessions. Debugging session expiry, token refresh, and cookie management across the middleware, backend, and frontend required a deep understanding of both systems.

4. **Email Delivery Pipeline** — Setting up transactional emails with proper HTML templates, secure token generation, and reliable SMTP configuration through Gmail's security restrictions.

---

### 5. Repository Statistics

- **Total commits**: 387
- **My commits**: 79 (~20%)
- **Total codebase**: ~50,000 lines of TypeScript/TSX/CSS/Prisma
- **Collaborators**: 6 (Subaina, Saad, Zainab, Fatima, Talha, codderrrrr)
- **Project duration**: Active development from April 2026 to present
- **Database models**: 40+ (User, Card, CardDesign, QR Code, Analytics, Leads, Orders, etc.)

---

### 6. Conclusion

This project gave me extensive hands-on experience building a **production-grade SaaS platform** from the ground up. I worked across the entire stack — from pixel-perfect UI implementation and theme systems to backend API development, database schema interactions, authentication flows, and cloud infrastructure. The collaborative nature of the project also strengthened my skills in Git workflows, code review, and cross-team coordination.

---

**Student**: Subaina Monib  
**Email**: subainamonib3@gmail.com  
**Project**: SamCard — Digital Business Card Platform  
**Repository**: https://github.com/aice-xpert/samcard  
**Live Demo**: https://samcard.vercel.app
