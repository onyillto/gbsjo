# Gbajo — Co-operative Manager

A clean, modern Next.js dashboard for managing cooperative societies. Built with the Donezo-inspired design system and a blue institutional theme.

## What's inside

- **10 full pages**: Dashboard, Members, Tenants, Contributions, Subscriptions, Wallets, Payments, Withdrawals, Elections, Votes, Settings
- **Full CRUD**: Add, edit, delete across all entities
- **Zustand state**: Lightweight global state with pre-loaded mock data
- **Pure CSS design**: No heavy images — everything renders from code (fast, crisp)
- **Plus Jakarta Sans**: Imported from Google Fonts for clean typography
- **Blue brand theme**: `#2563eb` primary with a full ramp

## Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Zustand
- Lucide React icons

## Get started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Structure

```
app/
  page.tsx              Dashboard (Donezo-style layout)
  users/                Members
  tenants/              Organizations
  contributions/        Contribution tracking
  subscriptions/        Subscription plans
  wallets/              Member wallets
  payments/             Payment transactions
  withdrawals/          Withdrawal requests
  elections/            Elections
  votes/                Vote records
  settings/             Settings

components/
  Sidebar.tsx           Navigation with MENU/GENERAL groups
  Topbar.tsx            Search + notifications + profile
  DashboardLayout.tsx   Layout wrapper
  StatCard.tsx          Stat cards with dashed decoration
  PageHeader.tsx        Page title + actions
  Table.tsx             Data tables
  Modal.tsx             Dialogs

store/
  gbajoStore.ts         Zustand store + all types + mock data
```

## Design notes

- **Sidebar**: MENU and GENERAL sections, active-state indicator bar on the left, promotional card at the bottom
- **Topbar**: Search input with ⌘F hint, mail + notifications + user profile
- **Stat cards**: Clean white cards with dashed background decorations (matches Donezo's aesthetic)
- **Dashboard bar chart**: Pure CSS bars with dashed pattern for the non-highlighted days
- **Progress circle**: SVG-based with a dashed track
- **Time tracker**: Dark card with geometric ring decorations

## Customizing

- **Colors**: Edit the `brand` palette in `tailwind.config.js`
- **Font**: Change the `@import` URL at the top of `app/globals.css`
- **Mock data**: Edit the `mock...` arrays in `store/gbajoStore.ts`

---

Built clean. No heavy images. Just CSS + well-structured components.
