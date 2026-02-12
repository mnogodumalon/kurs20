# Design Brief: Kursverwaltung (Course Management System)

## 1. App Analysis
- **What this app does:** A comprehensive course management system for educational institutions to manage courses, instructors, participants, rooms, and registrations.
- **Who uses this:** Administrative staff at training centers, language schools, or continuing education institutions.
- **The ONE thing users care about most:** Seeing at a glance which courses are running, their capacity status, and managing registrations efficiently.
- **Primary actions:** Create/edit courses, register participants, assign instructors, manage payments.

## 2. What Makes This Design Distinctive
- **Visual identity:** Deep indigo/violet gradient with warm amber accents - professional yet inviting, suggests knowledge and creativity
- **Layout strategy:** Tab-based navigation with a hero stats section showing key metrics (active courses, total participants, revenue)
- **Unique element:** Elegant card system with subtle glass morphism effects and smooth micro-animations

## 3. Theme & Colors
- **Font family:** Plus Jakarta Sans - professional, modern, excellent readability
- **Google Fonts URL:** https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap
- **Why this font:** Clean geometric shapes with humanist touches, perfect for data-heavy interfaces

### Color Palette (HSL)
- **Primary (Indigo):** hsl(245 58% 51%) - Deep, trustworthy, academic
- **Primary Glow:** hsl(245 58% 65%) - Lighter for hover states
- **Secondary (Amber):** hsl(38 92% 50%) - Warm accent for CTAs and highlights
- **Background:** hsl(240 20% 98%) - Subtle cool off-white
- **Surface:** hsl(0 0% 100%) - Pure white for cards
- **Success:** hsl(152 69% 40%) - Confirmations, payments
- **Warning:** hsl(38 92% 50%) - Capacity warnings
- **Muted:** hsl(240 5% 64%) - Secondary text

## 4. Mobile Layout
- **Layout approach:** Single column, bottom navigation tabs for main sections
- **What users see:** Header with app title → Key stats cards → Active tab content → FAB for primary action
- **Touch targets:** Minimum 44px, cards with generous padding

## 5. Desktop Layout
- **Overall structure:** Sidebar navigation (240px) + Main content area
- **Section layout:** Stats grid (4 columns) → Data tables with inline actions
- **Hover states:** Cards lift with shadow, rows highlight, buttons scale

## 6. Components

### Hero KPI Section (4 cards)
1. **Active Courses** - Number with trend indicator
2. **Total Participants** - With registration count this month
3. **Instructors** - Active count
4. **Revenue** - Total from paid registrations

### Tab Sections
1. **Kurse (Courses)** - Table with title, dates, instructor, room, capacity, actions
2. **Dozenten (Instructors)** - Cards with photo placeholder, name, specialty, contact
3. **Teilnehmer (Participants)** - Table with name, email, phone, birth date
4. **Räume (Rooms)** - Grid of room cards with capacity indicators
5. **Anmeldungen (Registrations)** - Table linking participants to courses, payment status

### Primary Action Button
- Context-sensitive FAB: "+ Kurs" in courses tab, "+ Dozent" in instructors tab, etc.
- Uses secondary (amber) color for high visibility

## 7. Visual Details
- **Border radius:** 12px for cards, 8px for buttons, 6px for inputs
- **Shadows:**
  - Cards: `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)`
  - Hover: `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)`
- **Spacing:** 8px base unit, sections separated by 24px
- **Animations:**
  - Hover transitions: 200ms ease-out
  - Page transitions: 300ms with slight fade
  - Loading skeletons with shimmer

## 8. CSS Variables

```css
:root {
  /* Primary - Deep Indigo */
  --primary: 245 58% 51%;
  --primary-foreground: 0 0% 100%;
  --primary-glow: 245 58% 65%;

  /* Secondary - Warm Amber */
  --secondary: 38 92% 50%;
  --secondary-foreground: 0 0% 10%;

  /* Backgrounds */
  --background: 240 20% 98%;
  --foreground: 240 10% 10%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 10%;

  /* Accents */
  --accent: 245 30% 95%;
  --accent-foreground: 245 58% 51%;
  --muted: 240 5% 96%;
  --muted-foreground: 240 5% 45%;

  /* Status */
  --success: 152 69% 40%;
  --success-foreground: 0 0% 100%;
  --warning: 38 92% 50%;
  --destructive: 0 84% 60%;

  /* Borders & Input */
  --border: 240 6% 90%;
  --input: 240 6% 90%;
  --ring: 245 58% 51%;

  /* Radius */
  --radius: 0.75rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -1px rgb(0 0 0 / 0.03);
  --shadow-lg: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05);
}
```
