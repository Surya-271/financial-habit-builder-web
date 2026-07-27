# Financial Habit Builder & Wealth Growth Tracker (FinanceHabit)

FinanceHabit is a full-stack, production-ready web application designed with modern glassmorphic aesthetics and class-based light/dark theme options. It includes a high-converting, accessible public SaaS Landing Page and an interactive personal wealth dashboard. 

FinanceHabit encourages disciplined personal finance by combining income and expense tracking with daily/weekly/monthly habit streaks, target-saving milestones, investment growth monitoring, net worth analysis, and administrative moderation tools.

---

## 🚀 Key Features

### Public Landing Page (`/`)
- **Sticky Responsive Navigation**: Brand logo, smooth scroll anchor navigation (`#features`, `#how-it-works`, `#dashboard-preview`, `#tech-stack`, `#why-us`, `#faq`), login/registration action buttons, and mobile drawer menu.
- **Hero Banner**: Animated typography, primary/secondary CTAs, floating finance stat cards (Savings Goals, Habit Streaks, Asset Growth), and gradient backdrop glow vectors.
- **Feature Cards**: 6 glassmorphic feature showcases covering Income, Expenses, Savings, Habits, Investments, and Analytics.
- **Live Dashboard Preview**: Accurate, high-fidelity browser frame mockup rendering actual FinanceHabit wealth metrics and live graphs without relying on stock or placeholder photos.
- **4-Step Workflow**: Timeline guiding users from account creation to wealth growth.
- **Why Choose Us**: Value proposition cards highlighting security, real-time analytics, responsiveness, and modern UI.
- **Platform Metrics & Stats**: Animated counters showcasing community impact with realistic metrics.
- **Built With (Technology Stack)**: Technology cards showcasing React.js, Node.js, Express.js, MongoDB Atlas, Firebase Auth, JWT, Tailwind CSS, Framer Motion, Chart.js, Vercel & Render.
- **FAQ Accordion**: Expandable accessible accordion with smooth Framer Motion height transitions.
- **Call to Action & Footer**: High-impact CTA banner, quick links, social channels, and back-to-top navigation.

### User Wealth Dashboard (`/dashboard`)
- **Net Worth & Metrics Overview**: Real-time summary cards for Net Worth, Income, Expenses, Investments, and Savings Rate.
- **Interactive Chart.js Visualizations**: Income vs. Expense monthly trend line charts and category expense breakdown doughnut graphs.
- **Income & Expense Managers**: Full CRUD operation support for financial inflows and outflows with budget threshold alerts.
- **Habit Streak Engine**: Interactive daily check-in calendar with active streak tracking, best streak calculations, and consistency scoring.
- **Milestone Savings Tracker**: Visual savings goal allocation with automated progress bars and target completion markers.
- **Investments & Assets**: Holdings portfolio tracking for stocks, mutual funds, crypto, assets, and liabilities.
- **Notifications & Feedback**: State-machine alert notifications inbox and user feedback submission forms.

### Administration Console (`/admin`)
- **System Metrics Panel**: Platform-wide user stats, database aggregates, and activity monitoring.
- **User Moderation**: Account status toggles (active/suspended) and user deletion controls.
- **Feedback Reviewer**: Customer inquiry reader with status resolution toggles.
- **Printable System PDFs**: Administrative platform reports.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS v3.4, Framer Motion, Lucide Icons, Chart.js, React-ChartJS-2, React Router DOM v6, React Hot Toast |
| **Backend** | Node.js, Express.js, Mongoose ODM, JWT (JSON Web Tokens), Bcryptjs, CORS, Dotenv |
| **Database** | MongoDB Atlas (Cloud NoSQL Database) / Local MongoDB Server |
| **Authentication** | Firebase Authentication (Email verification/reset) + JWT Bearer Tokens |
| **SEO & Performance**| Open Graph, Twitter Cards, XML Sitemap, Robots.txt, React.lazy() & Suspense Code Splitting |
| **Deployment** | Vercel (Client Frontend) + Render (Server Backend) |

---

## 📁 Project Folder Structure

```text
financial-habit-builder-web/
├── server/
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose database connection
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification & Admin role guard
│   │   └── errorMiddleware.js  # Global JSON error handler
│   ├── models/
│   │   ├── User.js             # User Schema & password hashing hooks
│   │   ├── Admin.js            # Admin Schema & credentials
│   │   ├── Income.js           # Income transaction schema
│   │   ├── Expense.js          # Expense transaction schema
│   │   ├── Habit.js            # Habit logs & streak schemas
│   │   ├── SavingsGoal.js      # Milestone savings schema
│   │   ├── Investment.js       # Holdings & asset schemas
│   │   ├── Asset.js            # Asset/Liability ledger schema
│   │   └── Feedback.js         # User feedback submission schema
│   ├── controllers/
│   │   ├── authController.js   # Login, registration, profile update
│   │   ├── incomeController.js # Income CRUD controller
│   │   ├── expenseController.js# Expense CRUD controller
│   │   ├── habitController.js  # Streak calculation & calendar engine
│   │   ├── savingsController.js# Milestone allocation logic
│   │   ├── wealthController.js # Net Worth engine & dashboard aggregator
│   │   └── adminController.js  # Administrative moderation & reports
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── habitRoutes.js
│   │   ├── savingsRoutes.js
│   │   ├── wealthRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   └── jwt.js              # Token signing & verification utilities
│   ├── .env                    # Environment secrets
│   └── server.js               # Entrypoint & default admin seeder
└── client/
    ├── public/
    │   ├── logo.png            # FinanceHabit Jar Logo
    │   ├── robots.txt          # SEO Web Crawler permissions
    │   └── sitemap.xml         # XML Sitemap
    ├── src/
    │   ├── components/
    │   │   ├── landing/        # Landing Page Sections
    │   │   │   ├── LandingNavbar.jsx
    │   │   │   ├── HeroSection.jsx
    │   │   │   ├── FeaturesSection.jsx
    │   │   │   ├── DashboardPreviewSection.jsx
    │   │   │   ├── HowItWorksSection.jsx
    │   │   │   ├── WhyChooseSection.jsx
    │   │   │   ├── StatsSection.jsx
    │   │   │   ├── TechStackSection.jsx
    │   │   │   ├── FaqSection.jsx
    │   │   │   ├── CtaSection.jsx
    │   │   │   └── LandingFooter.jsx
    │   │   ├── GlassCard.jsx   # Glassmorphic container wrapper
    │   │   ├── Navbar.jsx      # Dashboard navigation header
    │   │   ├── Sidebar.jsx     # Dashboard navigation sidebar
    │   │   └── ProtectedRoute.jsx # Route security guards
    │   ├── context/
    │   │   └── AuthContext.jsx # Authentication state context
    │   ├── layouts/
    │   │   └── DashboardLayout.jsx # Dashboard shell & background vector blobs
    │   ├── pages/
    │   │   ├── LandingPage.jsx # Modern SaaS Landing Page (/)
    │   │   ├── Login.jsx       # User Sign In (/login)
    │   │   ├── Register.jsx    # User Registration (/register)
    │   │   ├── Dashboard.jsx   # User Dashboard (/dashboard)
    │   │   ├── Income.jsx      # Income Manager (/income)
    │   │   ├── Expenses.jsx    # Expense Tracker (/expenses)
    │   │   ├── Habits.jsx      # Habit Streak Tracker (/habits)
    │   │   ├── Savings.jsx     # Savings Goals (/savings)
    │   │   ├── Investments.jsx # Investment Holdings (/investments)
    │   │   ├── Analytics.jsx   # Wealth Analytics (/analytics)
    │   │   ├── Profile.jsx     # Profile & Settings (/profile)
    │   │   ├── Notifications.jsx # Notifications Inbox (/notifications)
    │   │   ├── Feedback.jsx    # Feedback Form (/feedback)
    │   │   ├── AdminLogin.jsx  # Admin Login (/admin/login)
    │   │   └── AdminDashboard.jsx # Admin Console (/admin/dashboard)
    │   ├── services/
    │   │   └── api.js          # Axios client & endpoint maps
    │   ├── index.css           # Global Tailwind & glassmorphism utilities
    │   ├── main.jsx            # React root bootstrap
    │   └── App.jsx             # React Router config & code splitting
    ├── tailwind.config.js
    ├── index.html              # Open Graph & SEO meta tags
    └── package.json
```

---

## ⚙️ Environment Configuration

### Server Environment (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/financehabit?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_9999_xyz
```

### Client Environment (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Local Development Guide

### Prerequisites
- Node.js (version >= 18) installed.
- MongoDB Local Server or MongoDB Atlas Cluster.

### Step 1: Start Backend Server
```bash
cd server
npm install
npm run dev
```
> [!NOTE]
> Upon initial startup, the backend automatically seeds default system administrator credentials:
> - **Admin Email:** `admin@tracker.com`
> - **Admin Password:** `admin123456`

### Step 2: Start Client Dev Server
```bash
cd ../client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 📡 API Reference Table

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| **Auth & Profiles** | | | |
| `/api/auth/register` | `POST` | Public | Register standard user |
| `/api/auth/login` | `POST` | Public | Standard User login |
| `/api/auth/profile` | `GET` | User JWT | Fetch user profile & budget settings |
| `/api/auth/profile` | `PUT` | User JWT | Update user profile & currency preference |
| **Incomes** | | | |
| `/api/incomes` | `GET` | User JWT | List user incomes |
| `/api/incomes` | `POST` | User JWT | Create new income entry |
| `/api/incomes/:id` | `PUT` | User JWT | Edit income entry |
| `/api/incomes/:id` | `DELETE` | User JWT | Delete income entry |
| **Expenses** | | | |
| `/api/expenses` | `GET` | User JWT | List user expenses |
| `/api/expenses` | `POST` | User JWT | Log expense transaction |
| `/api/expenses/:id` | `PUT` | User JWT | Update expense entry |
| `/api/expenses/:id` | `DELETE` | User JWT | Delete expense entry |
| **Habits** | | | |
| `/api/habits` | `GET` | User JWT | Fetch active habits, streaks, and success scores |
| `/api/habits` | `POST` | User JWT | Launch new habit tracker |
| `/api/habits/:id/toggle`| `POST` | User JWT | Check-in habit completion for date |
| `/api/habits/:id` | `DELETE` | User JWT | Delete habit tracker |
| **Savings Goals** | | | |
| `/api/savings` | `GET` | User JWT | List savings goals & progress percentages |
| `/api/savings` | `POST` | User JWT | Establish new savings goal |
| `/api/savings/:id/add-funds`| `POST`| User JWT | Allocate funds to savings goal |
| `/api/savings/:id` | `DELETE` | User JWT | Delete savings goal |
| **Wealth & Investments**| | | |
| `/api/wealth/dashboard` | `GET` | User JWT | Fetch dashboard metrics & charts payload |
| `/api/wealth/investments`| `GET` | User JWT | Retrieve user investment holdings |
| `/api/wealth/investments`| `POST` | User JWT | Add investment portfolio holding |
| `/api/wealth/assets` | `GET` | User JWT | List asset & liability ledger items |
| `/api/wealth/assets` | `POST` | User JWT | Record asset or debt item |
| **Admin Moderation** | | | |
| `/api/admin/login` | `POST` | Public | Admin login verification |
| `/api/admin/dashboard` | `GET` | Admin JWT | Telemetry console aggregates |
| `/api/admin/users` | `GET` | Admin JWT | List registered users |
| `/api/admin/users/:id/status`| `PUT`| Admin JWT | Suspend or reactivate user |
| `/api/admin/users/:id` | `DELETE` | Admin JWT | Delete user and related records |
| `/api/admin/feedback` | `GET` | Admin JWT | Review customer feedback |

---

## 🌐 Production Deployment

### Backend Deployment (Render)
1. Push repository to GitHub.
2. Sign in to [Render](https://render.com/) and create a new **Web Service**.
3. Set **Build Command:** `cd server && npm install` and **Start Command:** `cd server && npm start`.
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT=5000`.

### Frontend Deployment (Vercel)
1. Sign in to [Vercel](https://vercel.com/) and import the repository.
2. Select **Root Directory:** `client`, **Framework:** `Vite`, **Build Command:** `npm run build`.
3. Add environment variable: `VITE_API_URL` pointing to your active Render backend API URL.

---

## 🔮 Future Enhancements
- [ ] Automated bank account feed integration via Plaid API.
- [ ] AI-assisted financial advice and expense anomaly detection.
- [ ] Exportable tax reports in CSV and PDF formats.
- [ ] Multi-currency real-time conversion rates.
