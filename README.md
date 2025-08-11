# ✨ AutoMaxLib: AI-Powered GitHub Automation & Developer Workflow Enhancement

## Table of Contents

- [📚 Table of Contents](#-table-of-contents)
- [🌟 Project Overview](#-project-overview)
- [🚀 Key Features](#-key-features)
- [💻 Technology Stack](#-technology-stack)
  - [Architecture Overview](#architecture-overview)
- [⚡ Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Basic Setup](#basic-setup)
- [⚙️ Installation & Setup](#-installation-setup)
  - [Detailed Setup Steps](#detailed-setup-steps)

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-blue?style=for-the-badge)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-blue?style=for-the-badge)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-blue?style=for-the-badge)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-blue?style=for-the-badge)](https://mongoosejs.com/)
[![Clerk (Authentication)](https://img.shields.io/badge/Clerk%20(Authentication)-blue?style=for-the-badge)](https://clerk.com/)
[![GitHub API](https://img.shields.io/badge/GitHub%20API-blue?style=for-the-badge)](https://docs.github.com/en/rest)
[![Razorpay](https://img.shields.io/badge/Razorpay-blue?style=for-the-badge)](https://razorpay.com/)
[![Winston (Logging)](https://img.shields.io/badge/Winston%20(Logging)-blue?style=for-the-badge)](https://github.com/winstonjs/winston)
[![nodemon](https://img.shields.io/badge/nodemon-blue?style=for-the-badge)](https://nodemon.io/)
[![dotenv](https://img.shields.io/badge/dotenv-blue?style=for-the-badge)](https://github.com/motdotla/dotenv)
[![node-cron](https://img.shields.io/badge/node-cron-blue?style=for-the-badge)](https://www.npmjs.com/package/node-cron)
[![Axios](https://img.shields.io/badge/Axios-blue?style=for-the-badge)](https://axios-http.com/)
[![Helmet](https://img.shields.io/badge/Helmet-blue?style=for-the-badge)](https://helmetjs.github.io/)
[![express-rate-limit](https://img.shields.io/badge/express-rate-limit-blue?style=for-the-badge)](https://www.npmjs.com/package/express-rate-limit)
[![express-slow-down](https://img.shields.io/badge/express-slow-down-blue?style=for-the-badge)](https://www.npmjs.com/package/express-slow-down)
[![express-mongo-sanitize](https://img.shields.io/badge/express-mongo-sanitize-blue?style=for-the-badge)](https://www.npmjs.com/package/express-mongo-sanitize)
[![xss](https://img.shields.io/badge/xss-blue?style=for-the-badge)](https://www.npmjs.com/package/xss)
[![hpp](https://img.shields.io/badge/hpp-blue?style=for-the-badge)](https://www.npmjs.com/package/hpp)
[![perf_hooks](https://img.shields.io/badge/perf_hooks-blue?style=for-the-badge)](https://nodejs.org/api/perf_hooks.html)
[![os (Node.js built-in)](https://img.shields.io/badge/os%20(Node.js%20built-in)-blue?style=for-the-badge)](https://nodejs.org/api/os.html)
[![Lucide React](https://img.shields.io/badge/Lucide%20React-blue?style=for-the-badge)](https://lucide.dev/)
[![React Router](https://img.shields.io/badge/React%20Router-blue?style=for-the-badge)](https://reactrouter.com/en/main)

---

![GitHub Stars](https://img.shields.io/github/stars/AutoMaxLib/AutoMaxLib?style=flat-square&color=FFD700)
![GitHub Forks](https://img.shields.io/github/forks/AutoMaxLib/AutoMaxLib?style=flat-square&color=8A2BE2)
![License](https://img.shields.io/badge/License-Unspecified-lightgrey?style=flat-square)

🌐 [Live Demo: automaxlib.online](https://automaxlib.online)

---

## 📚 Table of Contents

*   [🌟 Project Overview](#-project-overview)
*   [🚀 Key Features](#-key-features)
*   [💻 Technology Stack](#-technology-stack)
*   [⚡ Quick Start](#-quick-start)
*   [⚙️ Installation & Setup](#%EF%B8%8F-installation--setup)
    *   [Prerequisites](#prerequisites)
    *   [Detailed Setup Steps](#detailed-setup-steps)
    *   [Environment Variables](#environment-variables)
*   [💡 Usage Examples](#-usage-examples)
*   [📞 API Documentation](#-api-documentation)
*   [🏗️ Project Structure](#%EF%B8%8F-project-structure)
*   [🛠️ Configuration](#%EF%B8%8F-configuration)
*   [🧪 Testing](#-testing)
*   [🚀 Deployment](#-deployment)
*   [📊 Performance & Optimization](#-performance--optimization)
*   [🔒 Security](#-security)
*   [🐛 Troubleshooting](#-troubleshooting)
*   [📜 License & Acknowledgments](#-license--acknowledgments)
*   [🤝 Support & Community](#-support--community)

---

## 🌟 Project Overview

AutoMaxLib is a cutting-edge, full-stack web application meticulously crafted to empower individual developers and small teams by automating mundane GitHub activities and integrating powerful AI capabilities into their daily workflow. It's designed to ensure a consistent online presence, automate documentation, and significantly streamline development processes.

**What AutoMaxLib Does:**
This platform intelligently manages your GitHub commits, offering innovative features like AI-generated commit messages and content, and ensures your contribution streak is protected through intelligent automated backup commits. Beyond commit automation, AutoMaxLib extends its AI prowess to generate professional README files for personal profiles and entire repositories, and even conjure up architecture diagrams in Mermaid syntax based on repository analysis.

**Problem Solved:**
Developers often struggle with maintaining consistent GitHub activity, crafting descriptive commit messages, or generating comprehensive documentation. AutoMaxLib tackles these challenges head-on by automating these tasks, leveraging AI for creative content generation, and providing tools to keep your GitHub profile active and well-documented with minimal manual effort.

**Target Audience & Use Cases:**
*   **Developers maintaining GitHub activity:** Automate daily commits with varied or AI-generated content to build and maintain GitHub contribution streaks.
*   **Seeking AI assistance for commits:** Utilize AI to generate meaningful commit messages that reflect changes, or inject creative content like quotes and ASCII art into commits.
*   **Generating professional documentation:** Quickly create comprehensive READMEs for personal GitHub profiles or specific repositories using AI, tailored to different templates (modern, professional, minimalist, etc.).
*   **Streamlining project setup:** Automate the creation of architecture diagrams (Mermaid) for projects based on repository analysis.
*   **Managing multiple GitHub repositories:** Connect and automate commits to various repositories from a single dashboard.
*   **Trial exploration:** New users can explore the core features and AI capabilities during a free trial period before committing to a premium plan.
*   **Accessing premium features:** Subscribers can unlock advanced functionalities such as backfilling past commits to fill gaps in activity, advanced pattern generation, and priority support.

**Why AutoMaxLib is Unique:**
AutoMaxLib stands out with its unique blend of automated GitHub operations, deep AI integration for content and documentation, and a robust, production-ready architecture. It's not just a tool; it's a comprehensive assistant for developers aiming for efficiency, consistency, and a polished online presence.

---

## 🚀 Key Features

AutoMaxLib is packed with features designed to elevate your development experience:

*   **🤖 Automated GitHub Commit Scheduling:** Set up daily or custom-timed commits to maintain your GitHub streak effortlessly.
*   **✍️ AI-Powered Commit Message Generation:** Let AI craft intelligent and descriptive commit messages for you.
*   **✨ AI-Generated Commit Content:** Enhance your commits with AI-generated timestamps, inspirational quotes, ASCII art, custom text, or predefined patterns.
*   **🛡️ GitHub Activity Streak Protection:** Intelligent backup commits ensure your contribution streak remains unbroken, even on inactive days.
*   **🔗 GitHub Repository Integration & Management:** Connect your GitHub account, list your repositories, get detailed repo information, and check for file existence directly from the platform.
*   **👤 User Authentication & Management (via Clerk):** Secure and seamless user sign-up, login, and profile management.
*   **💳 Subscription & Payment Processing (via Razorpay):** Manage free trials (15-day) and premium plan subscriptions with robust payment integration.
*   **📄 AI-Powered Personal README Generation:** Generate professional README files for your GitHub profile using multiple templates and custom sections.
*   **📂 AI-Powered Repository README Generation:** Get comprehensive READMEs for your projects, intelligently generated based on repository analysis including file structure, technologies, and CI/CD status.
*   **mermaid: AI-Powered Architecture Diagram Generation:** Visualize your project's structure with AI-generated architecture diagrams in Mermaid syntax, derived from repository analysis.
*   **📈 Comprehensive Commit History Tracking & Analytics:** Monitor your daily commit stats, total commits, current/longest streaks, and success/failure rates.
*   **🔄 Manual Commit Triggering:** Initiate commits on demand for immediate updates.
*   **⏪ Backfill Past GitHub Commits (Premium):** A premium feature allowing you to fill historical gaps in your GitHub activity.
*   **♻️ Retry Mechanism for Failed Commits:** Automatically or manually retry commits that failed.
*   **📊 Robust Logging and Monitoring (with Winston):** Detailed request, error, security, performance, and business event logging for deep insights and debugging.
*   **🔒 Advanced Security Measures:** Implements Helmet, Rate Limiting, Slow Down, MongoDB Sanitize, XSS, HPP, CORS, Request Size Limits, and Suspicious Activity Detection.
*   **🚀 Performance Monitoring:** Tracks API request timing, database query performance, memory/CPU usage, cache performance, and response compression.
*   **✅ Environment Variable Validation:** Ensures critical environment variables are correctly set and validated for production readiness.
*   **🔄 Graceful Database Connection Management:** Robust handling of MongoDB connections.
*   **🎨 User Preferences Management:** Customize your experience with features like dark mode and email notifications.

---

## 💻 Technology Stack

AutoMaxLib is built as a robust full-stack application leveraging modern web technologies.

**Primary Language:**
*   ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) - The core language for both frontend and backend.

**Frontend:**
*   ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) - A declarative, component-based JavaScript library for building user interfaces. Chosen for its efficiency and strong ecosystem.
*   ![Vite](https://img.shields.io/badge/Vite-blue?style=for-the-badge) - A next-generation frontend tooling that provides an extremely fast development experience and optimized build output.
*   ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-blue?style=for-the-badge) - A utility-first CSS framework for rapidly building custom designs without leaving your HTML.
*   ![React Router](https://img.shields.io/badge/React%20Router-blue?style=for-the-badge) - Declarative routing for React, enabling seamless navigation within the single-page application.
*   ![Lucide React](https://img.shields.io/badge/Lucide%20React-blue?style=for-the-badge) - A collection of beautiful and customizable open-source icons, used for visual elements in the UI.
*   `@clerk/clerk-react`: Clerk's official React SDK for integrating secure user authentication and user profiles.

**Backend:**
*   ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) - A JavaScript runtime built on Chrome's V8 JavaScript engine. Chosen for its non-blocking I/O and suitability for real-time applications.
*   ![Express.js](https://img.shields.io/badge/Express.js-blue?style=for-the-badge) - A fast, unopinionated, minimalist web framework for Node.js, providing a robust set of features for web and mobile applications.
*   ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) - A NoSQL document database. Chosen for its flexibility, scalability, and performance.
*   ![Mongoose](https://img.shields.io/badge/Mongoose-blue?style=for-the-badge) - An elegant MongoDB object data modeling (ODM) library for Node.js, providing a straightforward, schema-based solution to model application data.
*   `@clerk/clerk-sdk-node`: Clerk's official Node.js SDK for secure user authentication and management, handling API interactions and webhooks.
*   ![GitHub API](https://img.shields.io/badge/GitHub%20API-blue?style=for-the-badge) - Integrated for repository control, commit operations, and user data.
*   ![Razorpay](https://img.shields.io/badge/Razorpay-blue?style=for-the-badge) - Payment gateway integration for handling subscriptions and premium features.
*   ![Winston (Logging)](https://img.shields.io/badge/Winston%20(Logging)-blue?style=for-the-badge) - A comprehensive and flexible logging library for Node.js, used for structured logging and log file rotation.
*   ![node-cron](https://img.shields.io/badge/node-cron-blue?style=for-the-badge) - A library for scheduling tasks (cron jobs) in Node.js, essential for the automated commit feature.
*   ![Axios](https://img.shields.io/badge/Axios-blue?style=for-the-badge) - A promise-based HTTP client used for making requests to external APIs like GitHub, OpenAI, Gemini, and OpenRouter.
*   **Security & Performance Middleware:**
    *   ![Helmet](https://img.shields.io/badge/Helmet-blue?style=for-the-badge)
    *   ![express-rate-limit](https://img.shields.io/badge/express-rate-limit-blue?style=for-the-badge)
    *   ![express-slow-down](https://img.shields.io/badge/express-slow-down-blue?style=for-the-badge)
    *   ![express-mongo-sanitize](https://img.shields.io/badge/express-mongo-sanitize-blue?style=for-the-badge)
    *   ![xss](https://img.shields.io/badge/xss-blue?style=for-the-badge)
    *   ![hpp](https://img.shields.io/badge/hpp-blue?style=for-the-badge)
    *   ![perf_hooks](https://img.shields.io/badge/perf_hooks-blue?style=for-the-badge)
    *   ![os (Node.js built-in)](https://img.shields.io/badge/os%20(Node.js%20built-in)-blue?style=for-the-badge)
*   `nodemon`: For live reloading during development.
*   `dotenv`: For managing environment variables.

### Architecture Overview

AutoMaxLib employs a clear **monorepo architecture**, separating the application into distinct `frontend` and `backend` subdirectories for modularity and scalability.

**Frontend (React.js)**:
Built with Vite, the frontend follows a standard component-based structure. It organizes UI elements in `components/`, page-specific layouts in `pages/`, global state management via `contexts/` and `hooks/`, API interactions in `services/`, and general helper functions in `utils/`. Tailwind CSS is used for styling, and Clerk's React SDK manages user authentication flows. The entry point is `frontend/src/main.jsx`.

**Backend (Node.js/Express.js)**:
The backend adheres to a service-oriented or layered architecture.
*   **Routes (`routes/`)**: Act as API controllers, defining endpoints and orchestrating requests by calling appropriate services.
*   **Models (`models/`)**: Define MongoDB schemas using Mongoose, encapsulating data structures and database-related logic for entities like `User` and `Commit`.
*   **Services (`services/`)**: Contains the core business logic, handling complex operations, external API integrations (GitHub, AI, Payment), data manipulation, caching, and scheduling. This layer includes substantial logic for AI-driven features (`aiService.js`) and automated tasks (`schedulerService.js`).
*   **Middleware (`middleware/`)**: Centralizes cross-cutting concerns such as Clerk authentication (`clerkMiddleware.js`), comprehensive error handling (`errorHandler.js`), performance measurement (`performance.js`), and robust security measures (`security.js`).
*   **Config (`config/`)**: Manages application-wide configurations, including database connection parameters (`database.js`), Clerk API initialization (`clerk.js`), environment variable validation (`envValidation.js`), and a highly configurable logging system (`logger.js` using Winston).
*   **Migrations (`migrations/`)**: Manages database schema evolution through dedicated scripts.
*   **Entry Point**: `backend/server.js` initializes the Express application, establishes database connections, applies middleware, and sets up all API routes.

This architecture promotes independent development, maintainability, and clear separation of concerns, supporting a robust and scalable application. It prioritizes production readiness through extensive logging, error handling, and security features.

---

## ⚡ Quick Start

Get AutoMaxLib up and running on your local machine in minutes!

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: Version 18 or higher. [Download Node.js](https://nodejs.org/)
*   **npm**: Comes with Node.js.
*   **MongoDB**: A local instance or access to a cloud instance (e.g., MongoDB Atlas). [MongoDB Community Server](https://www.mongodb.com/try/download/community)
*   **Git**: For cloning the repository. [Download Git](https://git-scm.com/downloads)
*   **GitHub Account**: Required for core functionalities.
*   **Clerk Account**: For user authentication. [Sign up for Clerk](https://clerk.com/)

### Basic Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AutoMaxLib/AutoMaxLib.git
    cd AutoMaxLib
    ```

2.  **Configure Environment Variables (Quick):**
    *   **Backend:**
        ```bash
        cd backend
        cp .env.example .env
        # Open .env and fill in MONGODB_URI, CLERK_SECRET_KEY, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET, SESSION_SECRET, FRONTEND_URL (e.g., http://localhost:5173)
        ```
    *   **Frontend:**
        ```bash
        cd ../frontend
        cp .env.example .env.local
        # Open .env.local and fill in VITE_CLERK_PUBLISHABLE_KEY, VITE_API_BASE_URL (e.g., http://localhost:5000/api)
        ```
    *(For detailed environment variable setup, see [Environment Variables](#environment-variables) section.)*

3.  **Install Dependencies:**
    ```bash
    cd backend && npm install
    cd ../frontend && npm install
    ```

4.  **Run Development Servers:**
    ```bash
    # In one terminal, start the backend
    cd backend && npm run dev

    # In another terminal, start the frontend
    cd frontend && npm run dev
    ```

Your AutoMaxLib application should now be accessible:
*   **Frontend:** `http://localhost:5173`
*   **Backend API:** `http://localhost:5000/api`

---

## ⚙️ Installation & Setup

This section provides a detailed guide to setting up AutoMaxLib, including external service integrations and comprehensive environment variable configuration.

### Detailed Setup Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AutoMaxLib/AutoMaxLib.git
    cd AutoMaxLib
    ```

2.  **Install Node.js 18+:**
    Ensure you have Node.js version 18 or higher installed on your system.

3.  **Set up MongoDB:**
    *   **Local:** Install MongoDB Community Server on your machine.
    *   **Cloud:** Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/lp/try4) and obtain your connection string (URI).

4.  **Set up Clerk Account:**
    *   Create an account on [Clerk.dev](https://clerk.com/).
    *   Obtain your `CLERK_PUBLISHABLE_KEY` (for frontend) and `CLERK_SECRET_KEY` (for backend).
    *   Configure webhooks in your Clerk application settings and obtain `CLERK_WEBHOOK_SECRET`. This is crucial for user synchronization.

5.  **Set up GitHub OAuth App:**
    *   Go to your GitHub `Settings` -> `Developer settings` -> `OAuth Apps`.
    *   Register a new OAuth application.
    *   Obtain `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.
    *   Set the **Authorization callback URL** to your backend URL (e.g., `http://localhost:5000/api/github/callback` for local development, or your deployed backend URL).

6.  **Set up Razorpay Account (Optional):**
    *   If you plan to enable payment features, create an account on [Razorpay](https://razorpay.com/).
    *   Obtain your `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
    *   Configure webhooks in your Razorpay dashboard and obtain `RAZORPAY_WEBHOOK_SECRET`.

7.  **Configure Environment Variables:**

    *   **Backend (`backend/.env`):**
        *   Navigate to the `backend` directory: `cd backend`
        *   Create a `.env` file from the example: `cp .env.example .env`
        *   Edit `.env` and fill in the required and optional variables. Refer to `backend/.env.example` and `backend/config/envValidation.js` for detailed descriptions and validation rules.

        ```ini
        # Core Application Settings
        PORT=5000
        NODE_ENV=development # or production
        HOST=localhost
        FRONTEND_URL=http://localhost:5173 # Your frontend URL

        # Clerk Authentication
        CLERK_SECRET_KEY=sk_test_...
        CLERK_WEBHOOK_SECRET=whsec_...

        # MongoDB Database
        MONGODB_URI=mongodb://localhost:27017/automaxlib_dev # or your MongoDB Atlas URI
        # MONGODB_MAX_POOL_SIZE=10 # Optional: Connection pool settings
        # MONGODB_MIN_POOL_SIZE=5
        # MONGODB_SERVER_SELECTION_TIMEOUT=30000
        # MONGODB_SOCKET_TIMEOUT=45000
        # MONGODB_CONNECT_TIMEOUT=30000
        # MONGODB_MONITOR_COMMANDS=false

        # JWT & Session Secrets (MUST be at least 32 characters long for production)
        JWT_SECRET=your_jwt_secret_key_at_least_32_chars
        SESSION_SECRET=your_session_secret_key_at_least_32_chars

        # Security & CORS
        ALLOWED_ORIGINS=http://localhost:5173,https://automaxlib.online # Comma-separated list

        # Logging
        LOG_LEVEL=info # debug, info, warn, error
        # LOG_FILE=logs/app.log # Optional: path to log file
        # LOG_MAX_SIZE=10mb # Optional: Max size of log file before rotation
        # LOG_MAX_FILES=14d # Optional: Max age of log files

        # Razorpay (Optional, if using payment features)
        # RAZORPAY_KEY_ID=rzp_test_...
        # RAZORPAY_KEY_SECRET=your_razorpay_secret
        # RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

        # AI Service Keys (at least one is required for AI features)
        # OPENAI_API_KEY=sk-...
        # GEMINI_API_KEY=your_gemini_api_key
        # OPENROUTER_API_KEY=sk-...

        # Email Service (Optional)
        # SMTP_HOST=smtp.example.com
        # SMTP_PORT=587
        # SMTP_USER=your_email@example.com
        # SMTP_PASS=your_email_password

        # GitHub OAuth
        GITHUB_CLIENT_ID=your_github_client_id
        GITHUB_CLIENT_SECRET=your_github_client_secret

        # Redis (Optional, for caching/session store)
        # REDIS_URL=redis://localhost:6379

        # Sentry (Optional, for error tracking)
        # SENTRY_DSN=https://examplepublickey@o0.ingest.sentry.io/