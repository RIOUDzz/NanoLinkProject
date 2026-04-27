# 🚀 URL Shortener Microservices Project (with API Gateway)

## 📌 Objective

Build a small application using **Microservice Architecture** with an **API Gateway**.

The system allows:

* Creating short URLs
* Redirecting to original URLs
* (Optional) Tracking visits

---

## 🧠 Architecture Overview

```
Client (Postman / Browser)
        ↓
   API Gateway
        ↓
-----------------------------
| URL | Redirect | Analytics |
-----------------------------
```

---

## ⚙️ Microservices Description

### 🔗 1. URL Service

Responsible for:

* Generating short codes
* Storing original URLs

Endpoints:

* `POST /shorten` → create short URL
* `GET /urls` → list all URLs

---

### 🔁 2. Redirect Service

Responsible for:

* Receiving short code
* Returning original URL

Endpoints:

* `GET /:code` → get original URL

---

### 📊 3. Analytics Service (Optional)

Responsible for:

* Counting visits per URL

Endpoints:

* `POST /visit`
* `GET /stats`

---

### 🚪 4. API Gateway (Node.js/Express)

Acts as the **single entry point** for all API requests. Keeps the backend independent from the frontend UI.

Responsibilities:

* Route API requests to internal services
* Hide internal service structure
* Continues functioning even if the Frontend goes down

Routes:

* `POST /api/shorten` → proxy to URL Service
* `GET /api/urls` → proxy to URL Service
* `GET /:code` → proxy to Redirect Service

---

### 🌐 5. Frontend UI (Next.js)

Responsible for:

* Providing the user interface
* Communicating exclusively with the API Gateway

---

## 🗂️ Project Structure

```
microservices/
│
├── frontend/ (Next.js)
├── gateway/ (Node.js)
├── url-service/
├── redirect-service/
└── analytics-service/ (optional)
```

---

## 🔌 Port Mapping (Local Development)

To avoid conflicts, each service will run on a dedicated port:

* **Frontend UI**: `3000`
* **API Gateway**: `8080`
* **URL Service**: `4001`
* **Redirect Service**: `4002`
* **Analytics Service**: `4003`

---

## 📜 API Data Contracts

### 1. Shorten URL Request
`POST /api/shorten`
* **Body:** `{"url": "https://example.com"}`
* **Response:** `{"shortCode": "abc12", "originalUrl": "https://example.com"}`

### 2. Redirect Request
`GET /:code`
* **Response:** Redirects to the original URL (HTTP 302) or returns `{"error": "URL not found"}` (HTTP 404)

---

## 🔄 System Workflow

### 1. Create Short URL

Client (Browser UI) → API Gateway → URL Service
→ Generate code → Store → Return response

---

### 2. Access Short URL

Client (Browser UI) → API Gateway → Redirect Service
→ Request URL Service → Find original URL
→ Return redirect response

---

### 3. (Optional) Track Visit

Redirect Service → Analytics Service
→ Store visit data

---

## 🧪 Testing Plan

Using Postman:

### Create URL

```
POST /api/shorten
{
  "url": "https://example.com"
}
```

---

### Get All URLs

```
GET /api/urls
```

---

### Redirect

```
GET /r/{code}
```

---

## 🧱 Technologies Used

* **Next.js (React)**: For the standalone Frontend UI
* **Node.js (Express)**: For the API Gateway and the URL Service
* **Python (FastAPI / Flask)**: Great for the Analytics Service
* **Go (Gin)**: Perfect for the high-performance Redirect Service

---

## 🎯 Key Concepts Demonstrated

* Microservices architecture
* API Gateway pattern
* Service-to-service communication
* Separation of concerns
* Scalability design

---

## 💡 Notes

* Each service runs independently on a different port
* Data is stored in memory (no database for simplicity)
* System can be extended with authentication or database later
* **Environment Variables**: The API Gateway will read internal service URLs (e.g., `URL_SERVICE_URL`) from a `.env` file to ensure URLs are never hardcoded.

---

## 🏁 Conclusion

This project demonstrates how to:

* Split a system into independent services
* Use an API Gateway to manage communication
* Build a scalable and maintainable backend architecture
