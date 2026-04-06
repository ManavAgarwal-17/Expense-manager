# 💰 Ex Financer - Personal Expense Manager

A modern, full-featured expense tracking application built with Next.js, featuring beautiful visualizations, subscription management, and comprehensive financial insights.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-Latest-2D3748)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)


### 🌐 [Live Demo](https://expense-manager-jet-nu.vercel.app/)

## ✨ Features


### 📊 Dashboard
- **Income & Expense Flow Chart** - Visualize your cash flow with category-based stacked bar charts
  - Toggle between Monthly and Yearly views
  - Category-specific color coding
  - Interactive tooltips with detailed breakdowns
  - Net income/loss calculations
- **Budget Tracking** - Monitor spending against budgets with daily, monthly, and yearly views
- **Category Breakdown** - Pie charts showing spending and income distribution by category
- **Quick Stats** - At-a-glance view of income, expenses, and active subscriptions

### 💳 Subscription Management
- Track recurring expenses with multiple renewal periods:
  - One-time payments
  - Monthly subscriptions
  - Quarterly subscriptions
  - Yearly subscriptions
- Pause/activate subscriptions
- Automatic monthly cost calculations
- Visual status indicators

### 💵 Transaction Management
- Add, edit, and delete transactions
- Categorize income and expenses
- Date-based filtering
- Detailed transaction history
- Category-based organization

### 📈 Budget Planning
- Set budgets by category and time period
- Visual progress indicators
- Over-budget warnings
- Historical budget tracking

### 🎨 Modern UI/UX
- Beautiful gradient backgrounds (orange, yellow, blue themes)
- Dark mode optimized
- Responsive design for all devices
- Custom confirmation dialogs
- Smooth animations and transitions
- Premium glassmorphism effects

### 🔐 Authentication & Security
- Secure user registration and login
- **Password Security**: Verification mechanisms and visibility toggles
- **Account Protection**: "Confirm Password" on registration
- Session-based authentication using JWT

### 👤 Profile Management
- **Personal Information**: Edit name, date of birth, and profession
- **Security Settings**: Change password with current password verification
- **Data Control**:
  - **Reset Data**: Clear all transactions/budgets without deleting account
  - **Delete Account**: Permanently remove account and all associated data
- **Currency Preferences**: Global currency symbol selection

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/verma1039/expense-manager.git
cd expense-manager
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up the database**
```bash
npx prisma db push
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Authentication**: Custom JWT-based auth

## 🚀 Deployment & Production

The application is deployed on **Vercel** and uses **Neon** (PostgreSQL) as the production database, ensuring high availability and scalability.

- **Migration**: Successfully migrated from SQLite to **PostgreSQL** using Prisma.
- **Security**: Secure environment variable management (`DATABASE_URL`, `JWT_SECRET`) ensures production safety.
- **Auth**: Robust **JWT-based authentication** system fully operational in production.
- **Quality**: Production builds utilize **strict TypeScript checks** to ensure code reliability.
- **Stability**: Resolved critical production issues involving Zod validation and build caching.

### 🛠️ Production Stack
- **Vercel** (Hosting & CI/CD)
- **Neon** (Serverless PostgreSQL)
- **Prisma** (ORM)
- **Next.js** (Framework)

## 📁 Project Structure


```
expense-tracker/
├── app/
│   ├── actions/          # Server actions
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard pages
│   │   ├── budget/
│   │   ├── subscriptions/
│   │   └── transactions/
│   ├── login/
│   └── register/
├── components/
│   ├── dashboard/        # Dashboard components
│   └── ui/              # Reusable UI components
├── lib/                 # Utilities and helpers
├── prisma/              # Database schema
└── public/              # Static assets
```

## 🎯 Key Features Explained

### Income & Expense Flow Chart
- **Monthly View**: Displays all 12 months with categorized income/expense bars
- **Yearly View**: Shows multi-year trends for long-term analysis
- **Category Colors**: Consistent color mapping across all categories
- **Interactive Tooltips**: Hover to see detailed breakdowns and net calculations

### Subscription Tracking
- **Flexible Periods**: Support for one-time, monthly, quarterly, and yearly renewals
- **Smart Calculations**: Automatic normalization to monthly equivalents
- **Status Management**: Easily pause or activate subscriptions
- **Visual Indicators**: Color-coded status badges

### Budget Management
- **Multi-Period Support**: Track daily, monthly, and yearly budgets
- **Real-time Updates**: See spending progress in real-time
- **Category-based**: Set budgets for specific spending categories
- **Visual Alerts**: Over-budget warnings with red indicators

## 🎨 Design Philosophy

The application follows modern design principles:
- **Premium Aesthetics**: Gradient backgrounds and glassmorphism effects
- **Color Psychology**: Strategic use of colors (green for income, red for expenses)
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Accessibility**: High contrast ratios and clear visual hierarchy

## 🔒 Security

- Secure password hashing
- JWT-based session management
- Server-side validation
- Protected API routes
- User data isolation

## 📝 Database Schema

The application uses Prisma with PostgreSQL for data persistence:
- **Users**: Authentication and profile data
- **Transactions**: Income and expense records
- **Budgets**: Budget allocations and tracking
- **Subscriptions**: Recurring payment management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Aditya Verma**
- GitHub: [@verma1039](https://github.com/verma1039)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Recharts for beautiful chart components
- Prisma for the excellent ORM
- Tailwind CSS for utility-first styling

---