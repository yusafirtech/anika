# Admin Panel Frontend Requirements & Architecture Specification

**Project Domain**: ANIKA TRADING & CO. (Corporate Export, Multi-Sector Trading, Supply Chain, Construction & Infrastructure)  
**Target**: Production-ready, modern, clean SaaS Admin Panel Frontend  

---

## 1. Technology Stack
- **Framework**: React 18 / 19 with TypeScript
- **Styling**: Tailwind CSS (SaaS aesthetic: slate/neutral palette, smooth rounded-2xl/xl borders, subtle border rings, glassmorphism, micro-interactions)
- **Icons**: Lucide React (`lucide-react`)
- **Routing**: React Router (`react-router-dom` v6/v7)
- **HTTP Client**: Axios with centralized interceptors (Bearer token injection, 401 redirect, error handling)
- **Sanitization/Security**: DOMPurify for HTML rendering
- **State & Auth**: React Context API with Role-Based Access Control (RBAC)

---

## 2. Core Architectural Requirements

### A. Centralized API & Auth Architecture
- **`api.ts`**: Pre-configured Axios instance using `import.meta.env.VITE_API_URL || '/api'`, auto-attaching `Bearer <token>` from `localStorage`, and handling 401 unauthenticated redirect. Mock fallbacks included for standalone frontend development.
- **`AuthContext.tsx`**:
  - State: `user`, `role` (`'admin' | 'manager' | 'editor' | 'viewer'`), `isAuthenticated`, `login()`, `logout()`.
  - Permissions Helper: `hasPermission(resource, action)` where action is `'view' | 'create' | 'edit' | 'delete'`.
  - Predefined role-permission matrix.
- **Route Guards**:
  - `<ProtectedRoute>`: Redirects unauthenticated sessions to `/login`.
  - `<PermissionGuard resource="..." action="...">`: Displays an aesthetic "Access Denied" shield screen with back button if permission is lacking.

### B. Global Layout (`App.tsx` & Sidebar)
- **Left Sidebar**:
  - Collapsible navigation groups:
    - *Overview*: Dashboard, Analytics
    - *Content Management*: Export Products, Projects, Hero Section, Team Members, Partners / Testimonials
    - *Operations*: Lead & Inquiry Applications, Tenders
    - *System & Settings*: User & RBAC Management, Audit Logs, Settings
  - Status badges (e.g. pending leads count, "New").
  - Collapsible sidebar toggle (expand / icon-only collapse).
  - Current logged-in user profile card with role badge + quick logout button.
- **Top Bar**:
  - Active breadcrumb navigation & page heading.
  - Mobile hamburger toggle for responsive drawer.
  - Search trigger / command palette trigger (`Cmd+K`).
  - Notification dropdown preview & quick action shortcuts.

### C. Schema-Driven Dynamic CRUD Engine (`CrudView.tsx`)
Generic, reusable CRUD table and modal system driven by `FieldDef[]`:
```typescript
export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'image' | 'icon' | 'array' | 'boolean' | 'date';
  options?: string[]; // for select
  required?: boolean;
  translatable?: boolean; // optional AI auto-translate badge
  placeholder?: string;
  description?: string;
}
```
**Features**:
- Search filter & column sorting.
- Pagination controls with items-per-page selector.
- Add/Edit Slide-over Drawer / Modal dynamically generating appropriate input widgets according to `FieldDef.type`.
- Image preview input with fallback placeholder & preview modal.
- Multi-item tag / chip array editor.
- View details drawer.
- Confirmation modal before deletion with warning aesthetics.
- Export to CSV / JSON utility.

### D. Metrics Dashboard (`AdminDashboard.tsx`)
- Summary KPI Cards with icon, trend indicator (+/- %), and value (Total Inquiries, Active Projects, Export Products, Monthly Volume).
- Visual bar / sparkline indicators.
- Recent Lead Inquiries table with direct status toggle.
- Quick action shortcut cards to primary modules.

---

## 3. Specialized Module Managers
1. **`HeroSectionManager.tsx`**:
   - Manage homepage hero headline slides, sector keywords, background images, and call-to-action links.
2. **`LeadApplicationsManager.tsx`**:
   - Filterable leads table for B2B export inquiries, supply requests, and tender quotes.
   - Inline status change dropdown (`Pending`, `Reviewing`, `Approved`, `Archived`).
   - Modal to view full message, company details, and add internal notes.
   - Export leads data to CSV.
3. **`UserManager.tsx`**:
   - Manage team access, roles (`admin`, `manager`, `editor`, `viewer`), status toggle (Active/Disabled), and granular permission overrides per resource.

---

## 4. File Structure
```
admin/
├── package.json
├── vite.config.ts
├── index.html
├── src/
│   ├── api.ts
│   ├── types.ts
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── components/
│   │   ├── CrudView.tsx
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── PermissionGuard.tsx
│   │   └── ProtectedRoute.tsx
│   └── pages/
│       ├── AdminDashboard.tsx
│       ├── LoginPage.tsx
│       ├── HeroSectionManager.tsx
│       ├── LeadApplicationsManager.tsx
│       ├── UserManager.tsx
│       └── EntityCrudPages.tsx (Products, Projects, Team, Partners)
```
