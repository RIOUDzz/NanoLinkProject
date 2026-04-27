# NanoLink | Premium Microservices URL Shortener 💎🌐

A high-performance, distributed URL shortening ecosystem built with a modern cross-language architecture. NanoLink demonstrates seamless communication between services written in **Node.js**, **Go**, and **Python**, all unified by a central **API Gateway** and a stunning **Next.js** dashboard.

---

## 🏗️ Architecture Overview

NanoLink is split into independent, specialized microservices:

1.  **URL Service (Node.js)**
    - **Responsibility**: Link creation and core management.
    - **ORM**: Sequelize (SQLite).
    - **Port**: 4001
    
2.  **Redirect Service (Go)**
    - **Responsibility**: Blazing fast HTTP 302 redirects.
    - **ORM**: GORM (SQLite).
    - **Port**: 4002
    
3.  **Analytics Service (Python/FastAPI)**
    - **Responsibility**: Real-time click tracking and statistics.
    - **ORM**: SQLModel (SQLAlchemy).
    - **Port**: 4003

4.  **API Gateway (Node.js/Express)**
    - **Responsibility**: Single entry point & reverse proxy for all backend services.
    - **Port**: 8080

5.  **Frontend (Next.js 15)**
    - **Responsibility**: Premium Glassmorphism UI with Framer Motion animations.
    - **Port**: 3000

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Go (v1.20+)
- Python (v3.9+)

### Installation & Run

1.  **Clone the repository**
2.  **Start the Backend Services**:
    - **URL Service**: `cd url-service && npm install && npm start`
    - **Redirect Service**: `cd redirect-service && go run .`
    - **Analytics Service**: `cd analytics-service && python -m venv venv && .\venv\Scripts\activate && pip install -r requirements.txt && python main.py`
    - **Gateway**: `cd gateway && npm install && npm start`

3.  **Start the Frontend**:
    - `cd frontend && npm install && npm run dev`

---

## 🎨 Design Features

- **Glassmorphism**: Ultra-blurred cards, glowing borders, and mesh gradients.
- **Micro-Animations**: Staggered entry motions and floating background blobs powered by `Framer Motion`.
- **Live Stats**: Automatic heartbeat polling for real-time "ClickStream" updates.
- **Responsive**: Fully optimized for mobile, tablet, and desktop viewing.

---

## 📡 API Flow

1.  **POST `/api/shorten`**: Gateway proxies to Node Service -> DB created -> Async Sync to Go Service.
2.  **GET `/:code`**: Gateway proxies to Go Service -> 302 Redirect -> Background call to Python Analytics.
3.  **GET `/api/stats`**: Gateway proxies to Python Service -> Returns live click counts.

---

### 📄 License
Distributed under the MIT License. Built with ❤️ by Antigravity.
