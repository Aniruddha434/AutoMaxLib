# System Architecture

Below is the system architecture in Mermaid format.

```mermaid
graph LR
    subgraph Frontend
        UI["React App<br/>(React, Vite, Tailwind CSS, React Router)"]
        style UI fill:#e1f5fe
    end

    subgraph Backend
        API_Gateway["Express.js API<br/>(Node.js, Express.js)"]
        AUTH_Service["Clerk Auth"]
        PAYMENT_Service["Razorpay"]
        style API_Gateway fill:#f3e5f5
        style AUTH_Service fill:#f3e5f5
        style PAYMENT_Service fill:#f3e5f5
    end

    subgraph Data
        DB["MongoDB<br/>(Mongoose)"]
        style DB fill:#e8f5e8
    end

    subgraph External
        GITHUB["GitHub API"]
        style GITHUB fill:#f0f8ff
    end

    subgraph CI_CD
        CI["GitHub Actions"]
        style CI fill:#f0fff0
    end

    UI -->|HTTP/REST| API_Gateway
    API_Gateway -->|HTTP/REST| GITHUB
    API_Gateway -->|DB Driver| DB
    API_Gateway -->|API| AUTH_Service
    API_Gateway -->|API| PAYMENT_Service
    CI -->|Deployment| API_Gateway
    CI -->|Deployment| UI
```
