# MannSparsh — Digital Mental Health Platform Context

> **Last Updated**: Feb 11, 2026
> **GitHub**: https://github.com/pranesh190405/MannSparsh.git (branch: `dev`)

---

## 🎯 What This App Does

MannSparsh is a **digital mental health platform for university students** that provides AI-powered chat support, clinical screening tests (PHQ-9 + GAD-7), video counselling sessions, and an anonymous peer support forum. It also features a dedicated counsellor role with dashboards, availability management, and a professional forum.

---

## 🏗 Tech Stack

| Layer      | Technology                                   |
|------------|----------------------------------------------|
| Frontend   | React 19, Vite 7, MUI 7, React Router 7     |
| Backend    | Node.js, Express 5, Mongoose 9               |
| Database   | MongoDB (`mannsparsh` database)               |
| Auth       | JWT + bcrypt                                  |
| AI Chat    | OpenAI API                                    |
| Real-time  | Socket.io (WebRTC signalling for video)       |
| Styling    | MUI + custom gradients/glassmorphism          |
| Forms      | Formik + Yup validation                       |
| State      | React Context API (AuthContext)               |

---

## 📁 Project Structure

```
n:/webdev project 2/
├── backend/
│   ├── server.js                  # Express + Socket.io + MongoDB setup (port 5000)
│   ├── .env                       # MONGO_URI, JWT_SECRET, OPENAI_API_KEY
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification middleware
│   ├── models/
│   │   ├── User.js                # User schema (student + counsellor roles)
│   │   ├── Appointment.js         # Appointment booking
│   │   ├── ChatLog.js             # AI chat history
│   │   ├── CounsellorAvailability.js  # Weekly schedule + blocked dates
│   │   ├── CounsellorForum.js     # Counsellor discussion posts
│   │   ├── CounsellorSlot.js      # Available booking slots
│   │   ├── ForumPost.js           # Student forum posts
│   │   └── Screening.js           # Screening test results
│   ├── routes/
│   │   ├── auth.js                # Register/Login (student + counsellor)
│   │   ├── appointment.js         # Booking, slots, approve
│   │   ├── chat.js                # AI chat with OpenAI
│   │   ├── counsellorAvailability.js  # Manage counsellor schedule
│   │   ├── counsellorForum.js     # Counsellor forum CRUD
│   │   ├── forum.js               # Student forum CRUD
│   │   ├── screening.js           # Submit/retrieve screening results
│   │   └── admin.js               # Admin panel (approve counsellors, stats)
│   └── services/
│       └── openaiService.js       # OpenAI integration with crisis detection
│
├── frontend/
│   ├── index.html                 # Entry point (title: MannSparsh)
│   ├── vite.config.js             # Vite config with proxy to :5000
│   └── src/
│       ├── main.jsx               # App entry (BrowserRouter + ThemeProvider + AuthProvider)
│       ├── App.jsx                # Route definitions
│       ├── theme.js               # MUI custom theme (gradients, colors, typography)
│       ├── context/
│       │   └── AuthContext.jsx    # Auth state (login, register, logout, token)
│       ├── components/
│       │   ├── Auth/
│       │   │   └── ProtectedRoute.jsx  # Route guard
│       │   ├── Layout/
│       │   │   └── MainLayout.jsx      # Sidebar nav + AppBar (responsive drawer)
│       │   └── Video/
│       │       └── VideoRoom.jsx       # WebRTC video call component
│       └── pages/
│           ├── Login.jsx               # Glassmorphism login
│           ├── Register.jsx            # Student registration
│           ├── CounsellorRegister.jsx  # Counsellor registration + approval flow
│           ├── Dashboard.jsx           # Hero, stats, feature cards, quotes
│           ├── CounsellorDashboard.jsx # Counsellor stats, quick actions
│           ├── Screening.jsx           # 16-question screening (9 PHQ-9 + 7 GAD-7)
│           ├── Chat.jsx                # AI chatbot with quick prompts, emotion chips
│           ├── Appointments.jsx        # Book slots + manage appointments
│           ├── CounsellorAvailability.jsx # Manage weekly schedule
│           ├── Forum.jsx               # Anonymous peer support forum
│           ├── CounsellorForum.jsx     # Professional counsellor forum
│           └── AdminDashboard.jsx      # Approve counsellors, view stats
```

---

## 🔐 Authentication Flow

1. Students register with university ID, email, password, department, year
2. Counsellors register with specialization, credentials, bio → `isApproved: false`
3. Admin approves counsellors via `/admin` dashboard
4. JWT token stored in localStorage, sent via `x-auth-token` header
5. `AuthContext` wraps the entire app, provides `user`, `login()`, `register()`, `logout()`
6. `ProtectedRoute` redirects unauthenticated users to `/login`

---

## 🧭 Route Map

| Path                       | Component               | Access        |
|----------------------------|-------------------------|---------------|
| `/login`                   | Login                   | Public        |
| `/register`                | Register                | Public        |
| `/counsellor/register`     | CounsellorRegister      | Public        |
| `/`                        | Dashboard               | Authenticated |
| `/screening`               | Screening               | Authenticated |
| `/chat`                    | Chat                    | Authenticated |
| `/appointments`            | Appointments            | Authenticated |
| `/forum`                   | Forum                   | Authenticated |
| `/counsellor/dashboard`    | CounsellorDashboard     | Counsellor    |
| `/counsellor/availability` | CounsellorAvailability  | Counsellor    |
| `/counsellor/forum`        | CounsellorForum         | Counsellor    |
| `/video/:roomId`           | VideoRoom               | Authenticated |
| `/admin`                   | AdminDashboard          | Admin         |

---

## 🗄 API Endpoints

### Auth (`/api/auth`)
- `POST /register` — Register student or counsellor
- `POST /login` — Login, returns JWT
- `GET /me` — Get current user (requires token)

### Appointments (`/api/appointments`)
- `GET /slots` — Available counsellor slots
- `POST /book` — Book an appointment
- `GET /my-appointments` — User's appointments
- `POST /approve/:id` — Counsellor approves appointment

### Chat (`/api/chat`)
- `POST /send` — Send message to MannSparsh AI, get response

### Screening (`/api/screening`)
- `POST /submit` — Submit screening results
- `GET /history` — Get past screening results

### Forum (`/api/forum`)
- `GET /` — All posts
- `POST /` — Create post
- `POST /:id/comment` — Add comment
- `POST /:id/upvote` — Upvote post

### Counsellor Availability (`/api/counsellor-availability`)
- `GET /my-availability` — Get own schedule
- `PUT /update-availability` — Update schedule
- `GET /counsellors` — All counsellors with availability

### Counsellor Forum (`/api/counsellor-forum`)
- `GET /` — All counsellor posts
- `POST /` — Create post
- `POST /:id/comment` — Add comment
- `POST /:id/upvote` — Upvote
- `DELETE /:id` — Delete post

### Admin (`/api/admin`)
- `GET /stats` — Platform statistics
- `GET /pending-counsellors` — Counsellors awaiting approval
- `POST /approve-counsellor/:id` — Approve a counsellor

---

## 🎨 Design System

- **Primary**: Indigo (#6366f1 → #8b5cf6 gradient)
- **Secondary**: Pink (#ec4899 → #f472b6)
- **Success**: Emerald (#10b981 → #34d399)
- **Warning**: Amber (#f59e0b → #fbbf24)
- **Background**: #f8fafc
- **Glassmorphism**: `rgba(255,255,255,0.95)` + `backdrop-filter: blur(20px)`
- **All pages** use MUI responsive breakpoints (`xs`, `sm`, `md`, `lg`)
- **Sidebar**: 260px gradient drawer with color-coded navigation items

---

## 🧠 AI Chatbot (MannSparsh AI)

- Uses OpenAI API with a system prompt focused on university student mental health
- **Crisis detection**: Scans for keywords like "suicide", "self-harm", "end my life"
- **Response format**: Returns JSON with `response`, `emotion`, `riskLevel`, `suggestions`
- **Risk levels**: low, moderate, high
- **Action suggestions**: Can suggest booking appointments or taking screening test
- **Fallback**: Provides compassionate responses when API fails

---

## 📊 Screening Tests

- **PHQ-9** (9 questions) — Depression screening
- **GAD-7** (7 questions) — Anxiety screening
- Total: **16 story-based scenario questions** with relatable campus situations
- Scoring: 0-3 per question (Not at all → Nearly every day)
- Results show severity for both depression and anxiety with recommendations

---

## ⚙️ How to Run

```bash
# Backend
cd backend
npm install
# Create .env with: MONGO_URI, JWT_SECRET, OPENAI_API_KEY
npm run dev          # Starts on port 5000

# Frontend
cd frontend
npm install
npm run dev          # Starts on port 5173 (proxied to 5000)
```

---

## 🔧 Future Improvements (15 Features)

### 1. WebRTC Video Call Reliability
**Priority**: 🔴 High | **Files**: `VideoRoom.jsx`, `server.js`
- Currently uses basic WebRTC peer connection via Socket.io signalling
- **Needs**: ICE candidate retry logic, TURN server fallback (e.g. Twilio or Metered), automatic reconnection on network drop, proper cleanup of media streams on disconnect
- **Approach**: Add `oniceconnectionstatechange` handler, implement exponential backoff reconnection, add connection quality indicator (poor/good/excellent), handle `getUserMedia` permission denied gracefully

### 2. Screen Sharing in Video Calls
**Priority**: 🟡 Medium | **Files**: `VideoRoom.jsx`
- **Needs**: Add a "Share Screen" button that calls `navigator.mediaDevices.getDisplayMedia()` and replaces the video track in the peer connection
- **Approach**: Create a toggle button, swap the video track using `RTCRtpSender.replaceTrack()`, handle `getDisplayMedia` rejection, show a visual indicator when screen sharing is active

### 3. In-Call Chat During Video Sessions
**Priority**: 🟡 Medium | **Files**: `VideoRoom.jsx`, `server.js`
- **Needs**: A text chat panel alongside the video call using the existing Socket.io connection
- **Approach**: Add a collapsible chat panel in `VideoRoom.jsx`, use `socket.emit('call-message')` / `socket.on('call-message')` events, store messages locally (no need for DB persistence)

### 4. Toast Notifications (Snackbar)
**Priority**: 🟢 Low | **Files**: All pages, new `ToastContext.jsx`
- Currently uses `alert()` for success/error feedback — needs MUI Snackbar
- **Approach**: Create a `ToastContext` provider with `showToast(message, severity)` method, wrap the app in `main.jsx`, replace all `alert()` calls across pages. Use auto-hide (3-5s) and allow stacking
- **Affected pages**: `Appointments.jsx` (booking), `Forum.jsx` (posting), `Chat.jsx` (errors), `CounsellorAvailability.jsx` (saving)

### 5. Rate Limiting on API Routes
**Priority**: 🔴 High | **Files**: `server.js`, new middleware
- **Needs**: Prevent brute-force login attempts and API abuse
- **Approach**: Install `express-rate-limit`, create rate limiters for auth routes (5 req/min), chat routes (20 req/min), and general routes (100 req/min). Apply as middleware in `server.js`
- **Code**: `const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }); app.use('/api/', limiter);`

### 6. Input Sanitization Middleware
**Priority**: 🔴 High | **Files**: `server.js`, new `sanitize.js` middleware
- **Needs**: Prevent XSS attacks, SQL injection (NoSQL injection for MongoDB), and malformed data
- **Approach**: Install `express-mongo-sanitize` and `xss-clean`, apply as middleware before route handlers. Also add `helmet` middleware (already installed, just needs `app.use(helmet())` in `server.js`)
- **Also validate**: Forum post content, chat messages, registration fields

### 7. Logging System
**Priority**: 🟡 Medium | **Files**: `server.js`, all routes
- `morgan` is already installed but not used
- **Approach**: Add `app.use(morgan('combined'))` for HTTP request logging. For application-level logging, install `winston` and create a `logger.js` service. Log: API errors, auth failures, AI chat errors, WebRTC events
- **Format**: Timestamp + level + message + metadata (userId, route, IP)

### 8. Email Verification for Registration
**Priority**: 🟡 Medium | **Files**: `auth.js`, `User.js`, new `emailService.js`
- Currently users can register with any email — no verification
- **Needs**: Send verification email with token link on registration, add `isEmailVerified` field to User model, block login until verified
- **Approach**: Install `nodemailer`, create `emailService.js`, generate UUID verification token, store in User model with expiry (24h). Create `GET /api/auth/verify/:token` endpoint. Use Gmail SMTP or SendGrid

### 9. Password Reset Flow
**Priority**: 🟡 Medium | **Files**: `auth.js`, new `ForgotPassword.jsx`, `ResetPassword.jsx`
- **Needs**: "Forgot Password?" link on login page, email-based reset
- **Approach**: Create `POST /api/auth/forgot-password` (sends email with reset link), `POST /api/auth/reset-password/:token` (validates token, updates password). Add `resetPasswordToken` and `resetPasswordExpiry` fields to User model. Frontend needs two new pages

### 10. Profile Editing for Students
**Priority**: 🟡 Medium | **Files**: new `Profile.jsx`, `auth.js` or new `profile.js` route
- **Needs**: A profile page where students can update name, department, year, add a bio, and upload a profile picture
- **Approach**: Create `Profile.jsx` with form pre-filled from `AuthContext.user`. Add `PUT /api/auth/update-profile` endpoint. For profile pictures, use `multer` for file upload and store on disk or cloud (Cloudinary). Add profile page to sidebar nav in `MainLayout.jsx`

### 11. Notification System (In-App)
**Priority**: 🟡 Medium | **Files**: new `Notification.js` model, new `notifications.js` route, `MainLayout.jsx`
- **Needs**: Bell icon in AppBar with unread count, dropdown showing notifications
- **Notification triggers**: Appointment approved/rejected, new forum comment on your post, counsellor approval status change
- **Approach**: Create `Notification` model (userId, type, message, isRead, createdAt). Create CRUD routes. Add `NotificationContext` or fetch on interval. Show badge on bell icon in `MainLayout.jsx`

### 12. Dark Mode Toggle
**Priority**: 🟢 Low | **Files**: `theme.js`, `main.jsx`, `MainLayout.jsx`
- **Needs**: Toggle switch in sidebar/AppBar to switch between light and dark themes
- **Approach**: Create two theme objects in `theme.js` (light + dark), add `ThemeContext` with `toggleTheme()`, store preference in `localStorage`. Update all hardcoded colors (e.g., `#f8fafc`, `#e2e8f0`) to use `theme.palette` values. Toggle icon: sun ↔ moon

### 13. PWA Support (Progressive Web App)
**Priority**: 🟢 Low | **Files**: `vite.config.js`, new `manifest.json`, new `sw.js`
- **Needs**: Installable on mobile devices, offline support for cached pages
- **Approach**: Install `vite-plugin-pwa`, configure in `vite.config.js` with app name "MannSparsh", icons, theme color. Add service worker for caching static assets. Create `manifest.json` with app metadata. This allows "Add to Home Screen" on mobile browsers

### 14. Deployment Configuration
**Priority**: 🔴 High | **Files**: new `Dockerfile`, new `docker-compose.yml`, new `nginx.conf`, `.env.production`
- **Needs**: Production-ready deployment setup
- **Approach options**:
  - **Option A (Docker)**: Create Dockerfile for backend (Node), frontend (Nginx serving built files), MongoDB. Use `docker-compose.yml` to orchestrate
  - **Option B (Cloud)**: Deploy backend to Railway/Render, frontend to Vercel/Netlify, MongoDB Atlas for database
  - **Option C (VPS)**: Use PM2 for process management, Nginx as reverse proxy, Let's Encrypt for SSL
- **Environment**: Create `.env.production` with production MONGO_URI, restrict CORS origins, set `NODE_ENV=production`

### 15. Pagination and Performance
**Priority**: 🟡 Medium | **Files**: `forum.js`, `counsellorForum.js`, `appointment.js`, `Forum.jsx`, `Appointments.jsx`
- **Needs**: Forum and appointment lists grow infinitely — needs pagination
- **Approach**: Add `page` and `limit` query params to GET routes (default: page=1, limit=10). Use Mongoose `.skip()` and `.limit()`. On frontend, add "Load More" button or infinite scroll using `IntersectionObserver`. Also add MongoDB indexes on frequently queried fields (`createdAt`, `userId`)

---

### Known Issues to Fix
- `ListItem` with `button` prop may show MUI deprecation warnings → use `ListItemButton` (already fixed in `MainLayout.jsx` but check other components)
- CORS is set to `*` in `server.js` → restrict to `http://localhost:5173` and production domain
- No file upload support for forum attachments or profile pictures
- Screening results not persisted to DB in some edge cases
- Admin dashboard (`AdminDashboard.jsx`) has basic UI — needs redesign to match the rest of the app

---

## 📝 Git History (branch: `dev`)

1. Initial backend + frontend setup
2. Counsellor registration, dashboard, availability pages
3. Counsellor forum + routing updates
4. Expanded screening (16 questions), Dashboard redesign, Chat enhancement
5. Student UI overhaul — Register, Forum, Appointments, MainLayout
6. **Rebrand to MannSparsh** + responsive UI across all pages
