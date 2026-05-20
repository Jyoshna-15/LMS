# MiniLMS — React Native Expo

A production-grade mobile Learning Management System built with React Native Expo, featuring secure authentication, a full course catalog, bidirectional WebView integration, local push notifications, and robust offline/error handling.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React Native Expo SDK 55 |
| Language | TypeScript (strict mode) |
| Navigation | Expo Router (file-based) |
| Secure Storage | Expo SecureStore |
| App Storage | AsyncStorage |
| HTTP Client | Axios |
| Validation | Zod |
| List Performance | LegendList (`@legendapp/list`) |
| Notifications | Expo Notifications |
| Image Picker | Expo Image Picker |
| Network Monitoring | `@react-native-community/netinfo` |
| Icons | `@expo/vector-icons` (Ionicons) |

---

## Project Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── authSchemas.ts       # Zod schemas for login + register
│   │   ├── authService.ts       # API calls — login, register
│   │   └── authStore.ts         # AuthContext + useAuth hook
│   ├── courses/
│   │   ├── courseContext.tsx     # Global course state, bookmarks, enroll
│   │   ├── courseService.ts     # Fetches products + users, merges into Course[]
│   │   ├── courseTypes.ts       # Course + Instructor TypeScript interfaces
│   │   └── useCourses.ts        # (hook wrapper)
│   └── notifications/
│       └── notificationService.ts  # Permission, bookmark milestone, 24hr reminder
├── lib/
│   ├── api/
│   │   └── client.ts            # Axios instance — interceptors, retry, token refresh
│   └── storage/
│       └── secureStore.ts       # SecureStore helpers for token + user
└── shared/
    ├── components/
    │   ├── ErrorBoundary.tsx    # Two-level React error boundary
    │   └── OfflineBanner.tsx    # Network status banner
    └── hooks/
        └── useNetworkStatus.ts  # NetInfo subscription hook

app/
├── _layout.tsx                  # Root layout — auth guard, notification setup
├── (auth)/
│   ├── login.tsx
│   └── register.tsx
├── (tabs)/
│   ├── index.tsx                # Course list screen
│   ├── bookmarks.tsx
│   └── profile.tsx
└── course/
    ├── [id].tsx                 # Course detail screen
    └── webview.tsx              # Embedded WebView content viewer
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your device, or an Android/iOS simulator

### Installation

```bash
git clone https://github.com/Jyoshna-15/LMS.git
cd MiniLMSNew
npm install
```

### Environment

No `.env` file is required. The API base URL is defined directly in `src/lib/api/client.ts`:

```ts
const BASE_URL = 'https://api.freeapi.app'
```

### Running

```bash
# Start Expo dev server
npm start

# Android
npm run android

# iOS
npm run ios
```

---

## Features

### Authentication
- Register and login via `api.freeapi.app`
- Access token stored in **Expo SecureStore** (encrypted, not accessible to other apps)
- Refresh token stored separately in SecureStore
- Auto-login on app restart — token is checked on mount, no re-login needed
- Full logout clears all tokens and user data atomically

### Course Catalog
- Fetches `/api/v1/public/randomproducts` (treated as courses) and `/api/v1/public/randomusers` (treated as instructors) in **parallel** using `Promise.all`
- Course list uses **LegendList** with `recycleItems` and `estimatedItemSize` for smooth 60fps scrolling
- Real-time search filters on title and description via `useMemo`
- Pull-to-refresh with `RefreshControl`
- Bookmark toggle persists instantly to AsyncStorage and survives app restarts

### Course Detail
- Hero image with overlay, category badge, stats strip (rating, students, duration, lessons)
- Instructor card with avatar, verified badge
- "What you'll learn" and requirements sections
- Sticky bottom bar with enroll button — transitions to "Continue Learning" after enrollment

### WebView — Course Content Viewer
- Renders a fully custom HTML page inside `react-native-webview`
- **Native → WebView**: course data (title, description, instructor, category, price, saved progress, completion status) is injected via `injectJavaScript` using a `CustomEvent` dispatch pattern
- **WebView → Native**: lesson toggle and course completion fire `window.ReactNativeWebView.postMessage` with structured JSON messages (`PROGRESS_UPDATE`, `MARK_COMPLETE`)
- Lesson progress is persisted to AsyncStorage per course and restored on every reopen
- Completion status shown in the native header as a green "Done" pill

> **Note on communication approach:** The assignment mentions "headers" for WebView communication. `injectJavaScript` + `postMessage` was chosen instead because it enables true **bidirectional** communication — headers are one-way (request-time only) and cannot carry runtime state back to the native layer. This is the standard production pattern for native↔WebView data exchange.

### Notifications
- Requests permission on first app launch
- **Bookmark milestone**: fires immediately when the user saves their 5th course
- **Inactivity reminder**: schedules a notification 24 hours from every app open, cancelling and rescheduling on each launch so the window always resets

### State Management
- **Auth state**: React Context backed by Expo SecureStore — survives process kills
- **Course state**: React Context backed by AsyncStorage — course list cached locally, bookmarks and enrolments persisted
- **Logout**: clears SecureStore tokens + all AsyncStorage keys including per-course progress and completion state

### Error Handling
- **Axios retry**: network errors and 5xx responses are retried up to 3 times with exponential backoff (500ms → 1s → 2s)
- **Token refresh queue**: concurrent 401 responses are queued and replayed after a single refresh, preventing duplicate refresh calls
- **Error boundaries**: two-level (app-wide + per-screen) class component boundaries catch render errors with a "Try Again" reset
- **Offline banner**: NetInfo subscription shows a persistent banner when connectivity is lost
- **WebView errors**: `onError` callback shows a full-screen error state with retry

### Profile
- Displays username, email, stats (available courses, bookmarked, enrolled)
- Learning progress bar (enrolled / total)
- Avatar update via camera or photo library (Expo Image Picker), persisted to AsyncStorage
- Logout with confirmation dialog

---

## Architectural Decisions

### Why StyleSheet.create instead of NativeWind?

NativeWind has known compatibility issues with Expo SDK 55 — specifically around the Metro transform pipeline introduced in this SDK version. Using NativeWind would have required ejecting from managed workflow or pinning to an older Metro version, both of which introduce more risk than they solve. `StyleSheet.create` provides equivalent functionality, full TypeScript inference on style properties, and zero runtime overhead.

### Why Context API instead of Redux or Zustand?

The app has two isolated state domains — auth and courses. Both are simple enough that a context + hook pattern covers all requirements without the boilerplate of Redux or the additional dependency of Zustand. If the app grew to 10+ screens with cross-cutting state concerns, migrating to Zustand would be straightforward since the hook interface (`useAuth`, `useCourseContext`) abstracts the implementation.

### Why LegendList instead of FlatList?

LegendList's `recycleItems` prop reuses component instances as the user scrolls rather than unmounting and remounting them. On a list of 20 course cards — each with an image, memoized subcomponents, and bookmark state — this meaningfully reduces GC pressure and keeps scroll performance consistent.

### Why SecureStore for tokens, AsyncStorage for everything else?

Expo SecureStore uses the device keychain (iOS) and EncryptedSharedPreferences (Android) — both are hardware-backed on modern devices. Auth tokens are the only sensitive data in this app, so they get hardware encryption. Course data, bookmarks, and preferences are not sensitive and AsyncStorage's simpler API and higher size limits make it the right fit.

### Why injectJavaScript over headers for WebView communication?

HTTP headers are set at request time and travel one way — from native to the WebView's initial page load. They cannot be used to send data after the page loads, and the WebView cannot respond through headers. `injectJavaScript` + `postMessage` gives a proper event-driven channel that works in both directions at any point in the page lifecycle, which is exactly what lesson progress tracking requires.

---

## Known Limitations

- Course content (lesson list) is static — the freeapi.app API does not provide real lesson data
- Stats on the course detail screen (rating, student count, duration) are placeholder values
- Profile "Edit Profile", "Notifications", and "Settings" menu items are UI only — not yet implemented
- No pagination on the course list — fetches 20 items on load

---

## APK

https://drive.google.com/file/d/1nPteJ1QKp2Vc5DvliUck_x-FcOE1oDJq/view?usp=sharing

### Build locally

```bash
npx expo run:android
```

---

## API Reference

Base URL: `https://api.freeapi.app`

| Endpoint | Usage |
|---|---|
| `POST /api/v1/users/register` | Create account |
| `POST /api/v1/users/login` | Login, returns access + refresh tokens |
| `POST /api/v1/users/refresh-token` | Refresh expired access token |
| `GET /api/v1/public/randomproducts` | Course data source |
| `GET /api/v1/public/randomusers` | Instructor data source |
