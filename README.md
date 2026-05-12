# ⚡ Life OS — Full-Stack Productivity Suite

A **production-grade** full-stack application with:
- 🏋️ **Habit Forge** — Advanced habit tracker with streaks, heatmaps, analytics
- 💰 **Wealth Map** — Expense tracker with budgets, charts, category breakdowns
- ✅ **Task Engine** — Todo manager with Kanban board, subtasks, projects

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Framer Motion, Recharts, Zustand |
| Styling | Tailwind CSS + inline CSS-in-JS |
| Backend | Spring Boot 3.2, Spring Security 6 |
| Auth | JWT (access + refresh tokens) |
| Database | H2 (dev) / MySQL or PostgreSQL (prod) |
| Build | Maven |

---

## 🚀 Quick Start

### Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs at: `http://localhost:8080`
H2 Console: `http://localhost:8080/h2-console`

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🔐 Authentication

All API endpoints (except `/api/auth/**`) require JWT Bearer token.

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "tokenType": "Bearer",
  "user": { "id": 1, "firstName": "John", "email": "john@example.com" }
}
```

### Refresh Token
```http
POST /api/auth/refresh
{ "refreshToken": "eyJ..." }
```

---

## 📡 API Reference

### 💪 Habits

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/habits` | Get all habits |
| POST | `/api/habits` | Create habit |
| PUT | `/api/habits/{id}` | Update habit |
| DELETE | `/api/habits/{id}` | Delete habit |
| PATCH | `/api/habits/{id}/archive` | Archive habit |
| POST | `/api/habits/{id}/log` | Log completion |
| GET | `/api/habits/{id}/logs` | Get habit logs |
| GET | `/api/habits/stats` | Dashboard stats |

**Create Habit:**
```json
{
  "name": "Morning Meditation",
  "description": "10 minutes mindfulness",
  "icon": "🧘",
  "color": "#34d399",
  "frequency": "DAILY",
  "category": "MINDFULNESS"
}
```

**Log Habit:**
```json
{
  "completed": true,
  "logDate": "2025-05-11",
  "mood": 4,
  "notes": "Felt great!"
}
```

### 💰 Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get all transactions |
| POST | `/api/expenses` | Add transaction |
| PUT | `/api/expenses/{id}` | Update transaction |
| DELETE | `/api/expenses/{id}` | Delete transaction |
| GET | `/api/expenses/range?start=&end=` | Filter by date range |
| GET | `/api/expenses/stats` | Dashboard stats |
| POST | `/api/expenses/budgets` | Create budget |
| GET | `/api/expenses/budgets?month=&year=` | Get budgets |
| DELETE | `/api/expenses/budgets/{id}` | Delete budget |

**Add Transaction:**
```json
{
  "title": "Grocery Shopping",
  "amount": 1500.00,
  "type": "EXPENSE",
  "category": "FOOD",
  "paymentMethod": "UPI",
  "expenseDate": "2025-05-11",
  "currency": "INR"
}
```

### ✅ Todos

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all tasks |
| POST | `/api/todos` | Create task |
| PUT | `/api/todos/{id}` | Update task |
| DELETE | `/api/todos/{id}` | Delete task |
| PATCH | `/api/todos/{id}/toggle` | Toggle complete |
| GET | `/api/todos/status/{status}` | Filter by status |
| GET | `/api/todos/stats` | Dashboard stats |
| POST | `/api/todos/projects` | Create project |
| GET | `/api/todos/projects` | Get all projects |
| DELETE | `/api/todos/projects/{id}` | Delete project |

**Create Task:**
```json
{
  "title": "Complete API documentation",
  "description": "Write full Swagger docs",
  "priority": "HIGH",
  "status": "TODO",
  "dueDate": "2025-05-15",
  "estimatedMinutes": 60,
  "tags": "work, documentation",
  "projectId": 1
}
```

---

## 📁 Project Structure

```
life-os/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/lifeos/
│       ├── LifeOsApplication.java
│       ├── config/
│       │   ├── ApplicationConfig.java
│       │   ├── SecurityConfig.java
│       │   └── GlobalExceptionHandler.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── HabitController.java
│       │   ├── ExpenseController.java
│       │   └── TodoController.java
│       ├── dto/
│       │   ├── AuthDto.java
│       │   ├── HabitDto.java
│       │   ├── ExpenseDto.java
│       │   └── TodoDto.java
│       ├── entity/
│       │   ├── User.java
│       │   ├── Habit.java
│       │   ├── HabitLog.java
│       │   ├── Expense.java
│       │   ├── Budget.java
│       │   ├── Todo.java
│       │   └── Project.java
│       ├── repository/
│       ├── security/
│       │   ├── JwtService.java
│       │   └── JwtAuthenticationFilter.java
│       └── service/
│           ├── AuthService.java
│           ├── HabitService.java
│           ├── ExpenseService.java
│           └── TodoService.java
│
└── frontend/
    ├── package.json
    └── src/
        ├── App.jsx
        ├── index.js
        ├── services/api.js
        ├── store/authStore.js
        ├── components/layout/Layout.jsx
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── LifeOSHome.jsx
            ├── HabitDashboard.jsx
            ├── ExpenseDashboard.jsx
            └── TodoDashboard.jsx
```

---

## 🔧 Production Setup

### Switch to MySQL/PostgreSQL

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/lifeos_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
```

Add to `pom.xml`:
```xml
<dependency>
  <groupId>com.mysql</groupId>
  <artifactId>mysql-connector-j</artifactId>
  <scope>runtime</scope>
</dependency>
```

### Environment Variables (Production)

```bash
export JWT_SECRET=your-super-secret-key-minimum-256-bits
export JWT_EXPIRATION=86400000
export SPRING_DATASOURCE_URL=jdbc:mysql://...
export APP_CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Build for Production

```bash
# Backend
cd backend && mvn clean package -DskipTests
java -jar target/life-os-backend-1.0.0.jar

# Frontend
cd frontend && npm run build
# Serve the build/ folder with nginx or any static server
```

---

## ✨ Features

### Habit Forge
- ✅ Create habits with custom icons, colors, categories
- 🔥 Automatic streak tracking (current + longest)
- 📊 Weekly progress bar charts
- 🎯 Completion rate analytics
- 📅 Daily/Weekly/Monthly frequency support
- 🗂️ Archive habits

### Wealth Map
- 💸 Income & expense tracking
- 📈 6-month trend area chart
- 🥧 Category breakdown pie chart
- 💼 Budget creation & monitoring
- 🏦 Multiple payment method support
- 💱 Multi-currency support

### Task Engine
- 📋 List view with filters
- 🗂️ Kanban board (Todo/In Progress/Review/Done/Cancelled)
- 🎯 Priority levels (Low/Medium/High/Urgent)
- 🌲 Subtask support (nested tasks)
- 📁 Project grouping
- ⚠️ Overdue detection
- ⏱️ Time estimation tracking
- 🏷️ Tagging system

---

## 📝 License

MIT — Build something amazing!
