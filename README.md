# 🎓 Digital Resource Booking System

A full-stack university resource management web application designed to streamline the booking of campus resources such as labs, classrooms, and event halls. The system provides secure, role-based dashboards for Admin, Faculty, and Students with conflict prevention, transparent approval workflows, and real-time booking tracking.

---

## 🌟 Features

### 🔐 Role-Based Access Control
- Separate dashboards for Admin, Faculty, and Students
- Secure login with JWT authentication
- Role-based authorization using Spring Security

### 📅 Resource Booking System
- Students can propose event or booking requests
- Faculty can review and submit official booking requests
- Admin can approve or reject booking requests
- Real-time booking status tracking

### ⏱️ Conflict Prevention
- Prevents double booking automatically
- Mandatory 30-minute buffer between bookings
- Ensures proper resource scheduling

### 🛡️ Security Features
- JWT-based authentication
- Secure REST API endpoints
- Account lock after multiple failed login attempts
- Protected backend routes

### 📢 Transparent Feedback System
- Admin can provide rejection reasons
- Users can view booking status updates instantly
- Centralized error handling system

### 🎨 Modern UI
- Premium Glassmorphism design
- Responsive layout
- Professional dashboard interface
- Clean and user-friendly experience

---

## 🏗️ Technology Stack

### Backend
- Java 17
- Spring Boot
- Spring Security
- JWT Authentication
- MongoDB (Atlas or Local)
- Maven
- RESTful API

---

### Frontend
- React.js
- Axios
- Lucide React Icons
- Vanilla CSS (Glassmorphism)
- Vite

---

## 📁 Project Structure

```
Digital-Resource-Booking-System/
│
├── Campus-Backend/
│   ├── src/main/java/com/campusmanagement/
│   │   ├── controller/      # REST Controllers
│   │   ├── service/         # Business Logic
│   │   ├── repository/      # MongoDB Repositories
│   │   ├── model/           # Database Models
│   │   ├── config/          # Security Configuration
│   │   └── CampusApplication.java
│   │
│   ├── src/main/resources/
│   │   └── application.properties
│   │
│   └── pom.xml
│
├── Campus-Frontend/
│   ├── src/
│   │   ├── components/      # Reusable Components
│   │   ├── pages/           # Dashboard Pages
│   │   ├── services/        # API Calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Java 17 or higher
- Node.js (v18 or higher)
- npm
- MongoDB (Local or Atlas)
- Maven or Maven Wrapper
- Git

---

## ⚙️ Backend Setup

### Step 1: Navigate to Backend Folder
```bash
cd Campus-Backend
```

### Step 2: Configure MongoDB
Open file: `src/main/resources/application.properties`

Example configuration:
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/campusDB
spring.data.mongodb.database=campusDB

jwt.secret=yourSecretKey
jwt.expiration=86400000
```

### Step 3: Run Backend Server
**Windows:**
```powershell
.\mvnw.cmd spring-boot:run
```

**Mac/Linux:**
```bash
./mvnw spring-boot:run
```

Backend will run at: `http://localhost:8080`

---

## 💻 Frontend Setup

### Step 1: Navigate to Frontend Folder
```bash
cd Campus-Frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Frontend Server
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## 📡 API Endpoints

### Authentication APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |

### Booking APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/bookings` | Get all bookings |
| GET | `/api/bookings/{id}` | Get booking by ID |
| POST | `/api/bookings` | Create booking |
| PUT | `/api/bookings/{id}/approve` | Approve booking |
| PUT | `/api/bookings/{id}/reject` | Reject booking |

### Resource APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/resources` | Get all resources |
| POST | `/api/resources` | Create resource |
| PUT | `/api/resources/{id}` | Update resource |
| DELETE | `/api/resources/{id}` | Delete resource |

---

## 📊 Booking Workflow
1. Student submits request
2. Faculty reviews request
3. Admin approves or rejects
4. Booking confirmed or rejected

---

## 👥 User Roles

### 🎓 Student
- Submit booking requests
- View booking status
- Track request progress
- View campus schedule

### 👩🏫 Faculty
- Review student booking requests
- Submit official booking requests
- Monitor resource availability

### 👨💼 Admin
- Approve or reject bookings
- Provide rejection reasons
- Manage campus resources
- Monitor system activities

---

## 🗄️ Database
**MongoDB Collections:**
- `users`
- `bookings`
- `resources`

---

## 🔒 Security Features
- JWT Authentication
- Spring Security Integration
- Role-Based Access Control
- Secure REST APIs
- Account protection system (lock after 3 failed attempts)

---

## 🧪 Testing API
Use **Postman** or any API client.

**Base URL:** `http://localhost:8080`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <your_token>"
}
```
