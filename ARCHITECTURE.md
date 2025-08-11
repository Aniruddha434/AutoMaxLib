# System Architecture

Below is the system architecture in Mermaid format.

```mermaid
graph LR
    subgraph Frontend
        React_App["React App (Vite)"]
        Components["UI Components (Radix UI)"]
        Icons["Icons (Lucide React)"]
        React_App --> Components
        React_App --> Icons
        style React_App fill:#e1f5fe
        style Components fill:#e1f5fe
        style Icons fill:#e1f5fe
    end

    subgraph Backend
        Express_API["Express API"]
        Auth_Middleware["Auth Middleware (Clerk)"]
        Security_Middleware["Security Middleware (Helmet, HPP, XSS, Rate Limit)"]
        Error_Handling["Error Handling Middleware"]
        Logging["Logging (Winston)"]
        AIService["AI Service"]
        GithubService["GitHub Service (Octokit)"]
        PaymentService["Payment Service (Razorpay)"]
        SchedulerService["Scheduler Service (Node-Cron, BullMQ)"]
        EmailService["Email Service (Nodemailer)"]
        Express_API --> Auth_Middleware
        Express_API --> Security_Middleware
        Express_API --> Error_Handling
        Express_API --> Logging
        Express_API --> AIService
        Express_API --> GithubService
        Express_API --> PaymentService
        Express_API --> SchedulerService
        Express_API --> EmailService
        style Express_API fill:#f3e5f5
        style Auth_Middleware fill:#f3e5f5
        style Security_Middleware fill:#f3e5f5
        style Error_Handling fill:#f3e5f5
        style Logging fill:#f3e5f5
        style AIService fill:#f3e5f5
        style GithubService fill:#f3e5f5
        style PaymentService fill:#f3e5f5
        style SchedulerService fill:#f3e5f5
        style EmailService fill:#f3e5f5
    end

    subgraph Data_Stores
        MongoDB["MongoDB"]
        Redis["Redis (Caching, BullMQ)"]
        Models["Mongoose Models"]
        Express_API -->|Mongoose| MongoDB
        Express_API --> Redis
        MongoDB --> Models
        style MongoDB fill:#e8f5e8
        style Redis fill:#e8f5e8
        style Models fill:#e8f5e8
    end

    subgraph External_Services
        OpenAI_API["OpenAI API"]
        Google_Gemini_API["Google Gemini API"]
        OpenRouter_API["OpenRouter API"]
        Clerk_Auth["Clerk Authentication"]
        Razorpay_API["Razorpay API"]
        GitHub_API["GitHub API"]
        Nodemailer_Service["Nodemailer"]
        AIService --> OpenAI_API
        AIService --> Google_Gemini_API
        AIService --> OpenRouter_API
        Auth_Middleware --> Clerk_Auth
        PaymentService --> Razorpay_API
        GithubService --> GitHub_API
        EmailService --> Nodemailer_Service
        style OpenAI_API fill:#fff9c4
        style Google_Gemini_API fill:#fff9c4
        style OpenRouter_API fill:#fff9c4
        style Clerk_Auth fill:#fff9c4
        style Razorpay_API fill:#fff9c4
        style GitHub_API fill:#fff9c4
        style Nodemailer_Service fill:#fff9c4
    end

    subgraph CI_CD
        GitHub_Actions["GitHub Actions"]
        GitHub_Actions --> React_App
        GitHub_Actions --> Express_API
        style GitHub_Actions fill:#dcedc8
    end

    React_App -->|HTTP REST| Express_API
    Express_API -->|DB Driver| MongoDB
    Express_API -->|Cache| Redis
```
