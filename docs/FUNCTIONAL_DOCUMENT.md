# Functional Document
## RK Home Automation Solution — Smart Home UI

**Version:** 1.0  
**Date:** May 2026  
**Product:** smart-home-ui (React SPA)  
**Backend:** Spring Boot REST API + WebSocket  

---

## 1. System Overview

RK Home Automation Solution is a web-based smart home management platform. It allows registered users to monitor, control, and automate smart home devices (lights, fans, ACs, locks, cameras) from a single dashboard. The system communicates with a Spring Boot backend over REST APIs and receives real-time device updates via WebSocket (STOMP over SockJS).

---

## 2. Technology Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Frontend      | React 18, React Router v6           |
| UI Library    | Material UI (MUI) v5                |
| Charts        | Recharts                            |
| HTTP Client   | Axios                               |
| WebSocket     | @stomp/stompjs + sockjs-client      |
| Auth          | JWT (sessionStorage)                |
| Backend       | Spring Boot (REST + WebSocket)      |
| Security      | Spring Security + JWT               |

---

## 3. Application Structure

```
src/
├── App.js                    # Root component, routing, layout
├── index.js                  # React entry point
├── context/
│   └── AuthContext.js        # Global auth state (user, token, login/logout)
├── services/
│   ├── api.js                # Axios instance with JWT interceptor
│   ├── authService.js        # Login, signup, logout, token helpers
│   ├── deviceService.js      # Device CRUD and control API calls
│   └── socket.js             # WebSocket connection (STOMP client)
├── components/
│   ├── Navbar.jsx            # Top navigation bar
│   ├── Footer.jsx            # Site footer
│   ├── DeviceCard.jsx        # Reusable device card with toggle
│   └── ChartComponent.jsx    # Recharts line chart wrapper
├── pages/
│   ├── LandingPage.jsx       # Public home/hero page
│   ├── Login.jsx             # Login form
│   ├── Signup.jsx            # Registration form
│   ├── Dashboard.jsx         # Device overview with live updates
│   ├── Devices.jsx           # Device management (add/delete/toggle)
│   ├── Analytics.jsx         # Per-device power/usage charts
│   ├── Automation.jsx        # Automation rules management
│   └── UserProfile.jsx       # Logged-in user profile
└── utils/
    └── constants.js          # App-wide constants (routes, device types)
```

---

## 4. Module Descriptions

### 4.1 Authentication Module

**Files:** `authService.js`, `AuthContext.js`, `Login.jsx`, `Signup.jsx`

**Flow:**
1. User submits username + password on `/login`
2. `authService.login()` calls `POST /api/auth/login`
3. Backend returns `ApiResponse<AuthResponse>` — token is extracted from `res.data.data.token`
4. Token, username, and email are stored in `sessionStorage`
5. `AuthContext` is updated via `setUser({ token, username, email })`
6. User is redirected to `/dashboard`

**Session Management:**
- `sessionStorage` is used — session ends automatically on tab/browser close
- `isAuthenticated()` validates token is present and not the string `"undefined"`
- `handleLogout()` clears sessionStorage and redirects to `/login`

**Token Handling:**
- JWT is attached to every API request via Axios request interceptor in `api.js`
- Token is also passed to WebSocket as a query param (`?token=...`) and STOMP connect header

**Signup Flow:**
1. User fills username, email, password, confirm password
2. Client validates passwords match
3. Calls `POST /api/auth/register`
4. On success, redirects to `/login`

---

### 4.2 Navigation Module

**File:** `Navbar.jsx`

- Renders top AppBar with brand logo and navigation links
- When **unauthenticated**: shows Login and Sign Up buttons
- When **authenticated**: shows Dashboard, Analytics, Automation, Devices nav links + user Avatar
- Avatar shows first letter of username as initials
- Clicking Avatar opens a dropdown menu with:
  - Username and email header
  - "User Profile" → navigates to `/profile`
  - "Logout" → calls `handleLogout()`

---

### 4.3 Dashboard Module

**File:** `Dashboard.jsx`, `DeviceCard.jsx`

- Fetches all devices on mount via `GET /api/device/list`
- Connects to WebSocket on mount, disconnects on unmount
- Devices are split into "Active" (ON) and "Inactive" (OFF) sections
- Shows live count chips (X ON / X OFF)
- Real-time updates: when a device state changes on the backend, WebSocket pushes the update and the card re-renders instantly
- `DeviceCard` features:
  - Device icon based on type (LIGHT, AC, FAN, TV)
  - ON/OFF toggle button calling `PUT /api/device/control`
  - Fan speed slider (visible when FAN is ON)
  - Location label

---

### 4.4 Devices Module

**File:** `Devices.jsx`

- Full device management page at `/devices`
- Fetches device list on load
- **Add Device** dialog with fields:
  - Name (required)
  - Type: LIGHT / FAN / AC / LOCK / CAMERA / OTHER (required)
  - Location (optional)
  - Metadata (optional, e.g. `brightness=80`)
- Calls `POST /api/device/add`
- **Toggle** button: calls `PUT /api/device/control`, updates status in-place
- **Delete** button: calls `DELETE /api/device/delete/{id}`, removes from list
- Empty state with prompt when no devices exist
- Status color bar on each card (green = ON, grey = OFF)

---

### 4.5 Analytics Module

**File:** `Analytics.jsx`, `ChartComponent.jsx`

- Fetches device list to populate device selector dropdown
- On device selection, fetches analytics via `GET /api/analytics/device/{id}`
- Renders two line charts side by side:
  - Power Consumption (W) over time
  - Usage Duration (min) over time
- Chart data fields: `power`, `duration`, `recordedAt` (x-axis: `time`)
- `ChartComponent` is a reusable Recharts `LineChart` wrapper accepting `data`, `title`, `dataKey`, `color` props

---

### 4.6 Automation Module

**File:** `Automation.jsx`

- Displays automation rules as cards
- Each rule has: name, trigger condition, action, active/paused status
- Toggle switch to enable/disable individual rules
- Add New Rule form with: Rule Name, Trigger, Action fields
- Currently uses local state (mock data) — backend integration pending
- Rules persist only in component state (no API calls yet)

---

### 4.7 User Profile Module

**File:** `UserProfile.jsx`

- Accessible at `/profile` via navbar avatar dropdown
- Displays:
  - Avatar with username initials
  - Username (from auth context)
  - Email (from auth context or sessionStorage)
  - Session expiry (decoded from JWT `exp` claim)
- Decodes JWT payload client-side using `atob()` with Base64URL normalization
- Logout button calls `handleLogout()`
- Back button navigates to previous page

---

### 4.8 Landing Page Module

**File:** `LandingPage.jsx`

- Public page at `/`
- Hero section with gradient background, tagline, and CTA buttons
- Auth-aware CTA:
  - Unauthenticated: "Get Started" (→ `/signup`) + "Login" (→ `/login`)
  - Authenticated: "Go to Dashboard" (→ `/dashboard`)
- Features section: Device Control, Real-Time Updates, Secure Access cards

---

### 4.9 Footer Module

**File:** `Footer.jsx`

- Rendered on all pages via `App.js`
- Sections: Brand tagline, Quick Links, Company links, Contact + Social
- Social media icons: Instagram, X, YouTube, Facebook (open in new tab)
- Copyright: © {year} RK Home Automation Solution. All rights reserved.
- Trademark notice

---

### 4.10 API & WebSocket Services

**`api.js`**
- Axios instance with `baseURL: http://localhost:8080/api`
- Request interceptor: reads token from `sessionStorage` and sets `Authorization: Bearer <token>` header on every request

**`deviceService.js`**

| Function             | Method | Endpoint                        |
|----------------------|--------|---------------------------------|
| `getDevices()`       | GET    | `/api/device/list`              |
| `addDevice(data)`    | POST   | `/api/device/add`               |
| `deleteDevice(id)`   | DELETE | `/api/device/delete/{id}`       |
| `controlDevice(id, action)` | PUT | `/api/device/control`      |
| `getDeviceAnalytics(id)` | GET | `/api/analytics/device/{id}`   |

**`socket.js`**
- Uses `@stomp/stompjs` `Client` with SockJS transport
- Connects to `ws://localhost:8080/ws?token=<jwt>`
- STOMP connect headers include `Authorization: Bearer <token>`
- Subscribes to `/topic/device` for real-time device state updates
- Auto-reconnects every 5 seconds on disconnect
- `disconnectSocket()` calls `client.deactivate()`

---

## 5. Routing Table

| Path          | Component       | Auth Required |
|---------------|-----------------|---------------|
| `/`           | LandingPage     | No            |
| `/login`      | Login           | No            |
| `/signup`     | Signup          | No            |
| `/dashboard`  | Dashboard       | Yes           |
| `/devices`    | Devices         | Yes           |
| `/analytics`  | Analytics       | Yes           |
| `/automation` | Automation      | Yes           |
| `/profile`    | UserProfile     | Yes           |

> Note: Route guards are not yet implemented in the frontend. Protected routes rely on the backend returning 401/403 for unauthenticated requests.

---

## 6. State Management

| State             | Location         | Storage         |
|-------------------|------------------|-----------------|
| Auth user object  | AuthContext      | sessionStorage  |
| JWT token         | sessionStorage   | sessionStorage  |
| Device list       | Component state  | In-memory       |
| Automation rules  | Component state  | In-memory       |
| Chart data        | Component state  | In-memory       |

---

## 7. Known Gaps & Pending Items

| Area              | Gap                                                        |
|-------------------|------------------------------------------------------------|
| Route protection  | No frontend route guards — unauthenticated users can navigate to protected URLs |
| Automation        | Rules are mock data only — no backend API integration      |
| Email in profile  | Backend does not return email in JWT or login response     |
| Error boundaries  | No React error boundaries wrapping pages                   |
| Token refresh     | No refresh token mechanism — session ends when JWT expires |
| Pagination        | Device list has no pagination                              |
| About/Contact     | Footer links to `/about`, `/contact`, `/privacy`, `/terms` — pages not created |
