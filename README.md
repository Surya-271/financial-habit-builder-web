# Financial Habit Builder & Wealth Growth Tracker (WealthFlow)

FinanceHabit is a college major project. It is a full-stack, production-ready web application designed with modern glassmorphic aesthetics and class-based light/dark theme options. It encourages disciplined personal finance by combining income and expense tracking with daily/weekly/monthly habit streaks, target-saving milestones, investments growth monitoring, and net worth analysis. It also offers administrative dashboards for user regulation and platform-wide analytics.

---

## Final Folder Structure

```text
financial-habit-builder/
├── server/
│   ├── config/
│   │   └── db.js               # Database connection
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT and Admin protection
│   │   └── errorMiddleware.js  # Global JSON error handling
│   ├── models/
│   │   ├── User.js             # User Schema & bcrypt hooks
│   │   ├── Admin.js            # Admin Schema & bcrypt hooks
│   │   ├── Income.js           # Income Schema
│   │   ├── Expense.js          # Expense Schema
│   │   ├── Habit.js            # Habit logs & streak schemas
│   │   ├── SavingsGoal.js      # Savings goal schema
│   │   ├── Investment.js       # Investment holdings schema
│   │   ├── Asset.js            # Asset/Liability schema
│   │   └── Feedback.js         # User feedback schema
│   ├── controllers/
│   │   ├── authController.js   # Login, registration, profile update
│   │   ├── incomeController.js # Income CRUD logic
│   │   ├── expenseController.js# Expense CRUD logic
│   │   ├── habitController.js  # Habit streak & calendar engine
│   │   ├── savingsController.js# Milestone savings allocation
│   │   ├── wealthController.js # Net Worth engine & dashboard compiler
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
│   │   └── jwt.js              # Token signing utility
│   ├── .env                    # Secret keys & connection strings
│   └── server.js               # App entrypoint & admin seeder
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── GlassCard.jsx   # Glassmorphic container wrapper
    │   │   ├── Navbar.jsx      # Sticky responsive navigation header
    │   │   ├── Sidebar.jsx     # Side link panel
    │   │   └── ProtectedRoute.jsx # Route guards (User / Admin)
    │   ├── context/
    │   │   ├── AuthContext.jsx # Standard and admin session context
    │   │   └── ThemeContext.jsx# Light/Dark class theme manager
    │   ├── layouts/
    │   │   └── DashboardLayout.jsx # App shell and backdrop blob vectors
    │   ├── pages/
    │   │   ├── Login.jsx       # Standard Login
    │   │   ├── Register.jsx    # Standard Register
    │   │   ├── Dashboard.jsx   # User Dashboard with ChartJS
    │   │   ├── Income.jsx      # Income CRUD manager
    │   │   ├── Expenses.jsx    # Expense Tracker with budget notifications
    │   │   ├── Habits.jsx      # Habit Streak calendar check-in list
    │   │   ├── Savings.jsx     # Targets and funding milestone tracker
    │   │   ├── Investments.jsx # Holdings portfolio & balance sheets
    │   │   ├── Analytics.jsx   # Asset/Debt composition graphs
    │   │   ├── Profile.jsx     # Budget target settings and profiles
    │   │   ├── Notifications.jsx # State-machine alerts inbox
    │   │   ├── Feedback.jsx    # Inquiry submission form
    │   │   ├── AdminLogin.jsx  # Admin sign-in page
    │   │   ├── AdminDashboard.jsx # System metrics panel
    │   │   ├── AdminUserManagement.jsx # User ban/delete controls
    │   │   ├── AdminReports.jsx# Printable platform PDFs
    │   │   └── AdminFeedback.jsx # Customer feedback inquiries reviewer
    │   ├── services/
    │   │   └── api.js          # Unified Axios client & endpoint maps
    │   ├── index.css           # Global typography & glass classes
    │   ├── main.jsx            # Bootstrap React element
    │   └── App.jsx             # Paths configuration
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── package.json
```

---

## Environment Variables

Create a `.env` file under `/server` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/wealthflow?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_9999_xyz
```

Create a `.env.local` file under `/client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Installation & How to Run Locally

### Prerequisites
- Node.js (version >= 18) installed.
- MongoDB Local Community Server or a MongoDB Atlas Cluster.

### Step 1: Clone and install backend dependencies
Navigate to the server directory:
```bash
cd server
npm install
```

### Step 2: Configure Environment
Copy `.env` variables and update with your own MongoDB connection URL string.

### Step 3: Run the Backend server
For production mode:
```bash
npm start
```
For local live-reloading development mode:
```bash
npm run dev
```
> [!NOTE]
> Upon initial startup, the backend automatically seeds a default system administrator account if none exists.
> **Admin Login Email:** `admin@tracker.com`
> **Admin Login Password:** `admin123456`

### Step 4: Install client dependencies
Navigate to the client directory:
```bash
cd ../client
npm install
```

### Step 5: Start the React Frontend client dev server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Documentation

All routes expect payload data in JSON format and return response envelopes: `{ success: true/false, data/message }`.

| Endpoint | Method | Security | Description |
| :--- | :--- | :--- | :--- |
| **Authentication** | | | |
| `/api/auth/register` | `POST` | Public | Register standard user (returns token) |
| `/api/auth/login` | `POST` | Public | Standard User login (returns token) |
| `/api/auth/profile` | `GET` | User JWT | Fetch profile bio, currency, and budget details |
| `/api/auth/profile` | `PUT` | User JWT | Update name, currency, or credentials |
| **Incomes** | | | |
| `/api/incomes` | `GET` | User JWT | List user incomes (sorted newest first) |
| `/api/incomes` | `POST` | User JWT | Record new earnings inflow |
| `/api/incomes/:id` | `PUT` | User JWT | Edit existing income |
| `/api/incomes/:id` | `DELETE` | User JWT | Remove income entry |
| **Expenses** | | | |
| `/api/expenses` | `GET` | User JWT | List user expenses |
| `/api/expenses` | `POST` | User JWT | Log expense transaction |
| `/api/expenses/:id` | `PUT` | User JWT | Update expense entry |
| `/api/expenses/:id` | `DELETE` | User JWT | Delete expense entry |
| **Habits** | | | |
| `/api/habits` | `GET` | User JWT | Fetch active habits, streaks, and success ratios |
| `/api/habits` | `POST` | User JWT | Launch new daily/weekly/monthly habit tracking |
| `/api/habits/:id/toggle`| `POST` | User JWT | Check-in or backlog completion for a date string |
| `/api/habits/:id` | `DELETE` | User JWT | Purge habit tracking |
| **Savings Goals** | | | |
| `/api/savings` | `GET` | User JWT | List goals and computed progress virtuals |
| `/api/savings` | `POST` | User JWT | Establish savings goal |
| `/api/savings/:id/add-funds`| `POST`| User JWT | Allocate funds (marks completed if target met) |
| `/api/savings/:id` | `DELETE` | User JWT | Delete goal |
| **Wealth & Investments**| | | |
| `/api/wealth/dashboard` | `GET` | User JWT | Fetch unified metrics feed for chart rendering |
| `/api/wealth/investments`| `GET` | User JWT | Retrieve user investment holdings |
| `/api/wealth/investments`| `POST` | User JWT | Add investment portfolio |
| `/api/wealth/assets` | `GET` | User JWT | List ledger accounts (Assets / Liabilities) |
| `/api/wealth/assets` | `POST` | User JWT | Record asset or debt |
| **System Administration**| | | |
| `/api/admin/login` | `POST` | Public | Administrative credentials verification |
| `/api/admin/dashboard` | `GET` | Admin JWT | Telemetry console aggregates |
| `/api/admin/users` | `GET` | Admin JWT | List registered standard users |
| `/api/admin/users/:id/status`| `PUT`| Admin JWT | Suspend or reactivate user |
| `/api/admin/users/:id` | `DELETE` | Admin JWT | Purge user and delete transaction records |
| `/api/admin/feedback` | `GET` | Admin JWT | Review user feedback submissions |
| `/api/admin/feedback/:id/read`| `PUT`| Admin JWT | Mark feedback inquiry as read/resolved |
| `/api/admin/feedback` | `POST` | User JWT | Submit platform inquiry/suggestion |

---

## MongoDB Atlas Setup

1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Shared Serverless Cluster.
3. In **Database Access**, create a user credential (e.g. `dbAdmin`) and copy the password.
4. In **Network Access**, choose "Allow Access from Anywhere" (`0.0.0.0/0`) to allow hosting provider connections (Render).
5. In **Database Cluster Dashboard**, click "Connect" -> choose "Drivers" -> copy your `MONGO_URI` connection string. Replace `<password>` with your created database password.

---

## Deployment Guide

### Deployment: Backend (to Render)
1. Commit the code and push to a remote repository (GitHub).
2. Sign in to [Render](https://render.com/).
3. Click **New +** -> select **Web Service**.
4. Connect your GitHub repository.
5. Setup parameters:
   - **Environment:** `Node`
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
6. Click **Advanced** and add Environment Variables:
   - `MONGO_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: (Your secret token encryption string)
   - `PORT`: `5000`
7. Click **Create Web Service**. Copy the active Render URL (e.g., `https://wealthflow-server.onrender.com`).

### Deployment: Frontend (to Vercel)
1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New** -> choose **Project**.
3. Import your GitHub repository.
4. Setup parameters:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. In **Environment Variables**, add:
   - `VITE_API_URL`: (Your active backend Render URL + `/api`, e.g., `https://wealthflow-server.onrender.com/api`)
6. Click **Deploy**. Vercel will build the React bundles and output your active production website link.
