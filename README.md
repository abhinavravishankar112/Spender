# Spendr 💸

A premium, modern personal finance and expense tracker built with **React Native**, **Expo (SDK 57)**, and **TypeScript**. Spendr features a sleek slate-and-indigo dark-first design, interactive dashboards, category-based budget utilization metrics, live exchange rate conversions, and secure auth state persistence.

---

## ✨ Features

- **Elegant UI & Custom Components** — Built with rich custom design elements (glassmorphic cards, pressable haptic buttons, floating label inputs) following a curated slate-indigo visual scheme.
- **Expo Router Navigation (File-based)** — Organized with a root Stack navigator routing between an `(auth)` onboarding/login group and an `(app)` tabbed dashboard group.
- **Dual-mode Authentication** — Integrated with Firebase Authentication (modular v9+). Falls back to a persistent Mock Auth mechanism if environment config keys are absent, keeping the app immediately runable.
- **Live Multi-Currency Ledger** — Stored in a base USD ledger and translated in real-time. Supports toggling between **USD ($)**, **INR (₹)**, and **EUR (€)** across all summaries, tables, and budgets.
- **Live Exchange Rate API** — Dynamically fetches live exchange rates from the Open ER-API (`https://open.er-api.com/v6/latest/USD`) on startup with automated offline backup configurations.
- **Smart Budget Indicators** — Visual progress bars for category budgets (Food, Entertainment, Transport, Utilities, Rent) that change color dynamically (Green 🟢, Orange 🟡, Red 🔴) as they reach threshold limits.
- **Automated Jest Tests** — 100% verified state machines and styling utility test suites running on Jest 29 and React Native Testing Library.

---

## 🛠️ Tech Stack

| Layer | Choice |
| :--- | :--- |
| **Framework** | Expo SDK 57 (React Native 0.86.0) |
| **Language** | TypeScript |
| **State Management** | Zustand (Store-based) |
| **Local Persistence** | `@react-native-async-storage/async-storage` |
| **Navigation** | Expo Router v4 (nested stack & tab structure) |
| **Icons & Symbols** | `expo-symbols` (SF Symbols / Material Icons) |
| **Testing** | Jest 29 & `@testing-library/react-native` |

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── _layout.tsx         # Auth guard, splash, and root Stack navigator
│   ├── index.tsx           # Entry redirect pointing to onboarding
│   ├── (auth)/             # Authentication stack
│   │   ├── _layout.tsx
│   │   ├── onboarding.tsx  # Intro screen detailing app benefits
│   │   ├── login.tsx       # Credentials form + Demo Mode trigger
│   │   └── register.tsx    # Sign up form
│   └── (app)/              # Authenticated tabs stack
│       ├── _layout.tsx     # Tab bar layout
│       ├── index.tsx       # Dashboard, total summaries, and add transaction modal
│       ├── transactions.tsx# Searchable ledger log with delete actions
│       ├── analytics.tsx   # Budget progress bars and set limit inputs
│       └── settings.tsx    # Profile card, currency preference selectors, reset tool
├── components/
│   └── ui/                 # Reusable atomic UI elements
│       ├── Button.tsx      # Customized pressable haptic buttons
│       ├── Card.tsx        # Flat, outline, or glass card containers
│       └── Input.tsx       # Text inputs with password visibility toggle
├── constants/
│   └── theme.ts            # Slate/indigo light & dark styling constants
├── services/
│   ├── api.ts              # Live exchange rates fetching and server sync simulation
│   └── firebase.ts         # Firebase initialization + Mock auth service
├── store/
│   ├── authStore.ts        # Zustand auth state machine
│   └── financeStore.ts     # Zustand financial ledger store
└── types/
    ├── declarations.d.ts   # Typings declarations for CSS files
    └── styleMock.js        # Mock styling sheet for Jest runs
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18.18.0 or later, npm v10+)
- [Expo Go app](https://expo.dev/client) installed on your mobile device (to scan the QR code), or an iOS/Android simulator configured.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/abhinavravishankar112/Spender.git
   cd Spender
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the Expo local development server:
```bash
npm run start
```

Press:
- **`i`** to open in the iOS simulator.
- **`a`** to open in the Android emulator.
- **`w`** to open in the browser.
- Or scan the QR code using your phone's camera (iOS) or Expo Go app (Android).

---

## 🔒 Firebase Configuration (Optional)

To enable real Firebase Authentication instead of the default Mock fallback, configure these variables in a `.env` file in the root of the project:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

If these keys are left empty, the app will automatically start in **Mock Authentication mode**, allowing you to log in with any email (e.g. `demo@spendr.com`) and password (`demopassword`).

---

## 🧪 Running Unit Tests

Unit tests are written using Jest and `@testing-library/react-native`.

To execute the test suite:
```bash
npm run test
```

Expected output:
```bash
PASS src/components/ui/__tests__/Button.test.tsx
PASS src/store/__tests__/financeStore.test.ts

Test Suites: 2 passed, 2 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        0.538 s, estimated 1 s
```
