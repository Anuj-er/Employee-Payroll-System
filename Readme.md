# 💼 Employee Payroll System

<p align="center">
   <img src="https://img.shields.io/badge/Employee--Payroll--System-Full--Stack-blueviolet?style=for-the-badge&logo=spring&logoColor=white" alt="Employee Payroll System"/>
</p>

<p align="center">
   <b>A modern, full-stack Employee Payroll Management System with Spring Boot microservices and React frontend</b>
</p>

<p align="center">
   <img src="https://img.shields.io/badge/Java-21-blue?style=flat-square&logo=java"/>
   <img src="https://img.shields.io/badge/Spring%20Boot-3.5.5-green?style=flat-square&logo=spring-boot"/>
   <img src="https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react"/>
   <img src="https://img.shields.io/badge/TypeScript-Latest-blue?style=flat-square&logo=typescript"/>
   <img src="https://img.shields.io/badge/MySQL-Database-blue?style=flat-square&logo=mysql"/>
   <img src="https://img.shields.io/badge/JWT-Authentication-green?style=flat-square&logo=json-web-tokens"/>
</p>

---

## 🚀 Overview

The Employee Payroll System is a comprehensive full-stack application featuring Spring Boot microservices backend with a modern React TypeScript frontend. It offers complete employee management and payroll processing with JWT authentication, role-based access control, and responsive design.

---

## ✨ Key Features

### Backend (Spring Boot Microservices)
- 👥 **Employee Management**: Complete CRUD operations with cascade delete
- 💰 **Payroll Processing**: Automated salary calculations with scheduling
- 🔐 **JWT Security**: Token-based authentication with role-based access
- 🏗️ **Microservices Architecture**: Separate services for employees and payroll
- 📊 **Inter-service Communication**: Secure JWT-based service communication
- 🔄 **Status Tracking**: Payroll workflow management (Pending → Processing → Paid)

### Frontend (React TypeScript)
- 🎨 **Modern UI**: Responsive design with gradient themes and animations
- � **Smart Login**: Single page that auto-detects user role
- 👨‍💼 **Admin Dashboard**: Employee management with statistics and bulk operations
- �‍💼 **HR Dashboard**: Payroll processing with financial overview
- 📱 **Mobile-First**: Fully responsive across all device sizes
- ⚡ **Real-time Updates**: Live statistics and status updates

---

## 🛠️ Tech Stack

### Backend
| Component | Technology | Version |
|-----------|------------|---------|
| **Language** | Java | 21 |
| **Framework** | Spring Boot | 3.5.5 |
| **Security** | JWT + Spring Security | Latest |
| **Database** | MySQL | 8.0+ |
| **ORM** | Spring Data JPA | Latest |
| **Build Tool** | Maven | 3.6+ |

### Frontend
| Component | Technology | Version |
|-----------|------------|---------|
| **Framework** | React | 18 |
| **Language** | TypeScript | Latest |
| **Routing** | React Router | 6 |
| **HTTP Client** | Axios | Latest |
| **Styling** | CSS3 + Flexbox/Grid | - |

---

## 🏗️ Architecture

```
Employee-Payroll-System/
├── employee-service/          # Employee microservice (Port: 8081)
│   ├── controller/           # REST endpoints + JWT auth
│   ├── service/             # Business logic + inter-service
│   ├── security/            # JWT utilities + filters
│   └── ...
├── payroll-service/          # Payroll microservice (Port: 8082)
│   ├── controller/          # REST endpoints + JWT auth
│   ├── service/             # Business logic + scheduling
│   ├── security/            # JWT utilities + filters
│   └── ...
└── frontend/                 # React TypeScript app (Port: 3000)
    └── payroll-ui/
        ├── src/components/   # React components
        ├── src/services/     # API integration
        ├── src/contexts/     # Authentication context
        └── ...
```

---

## 🚦 Quick Start

### Prerequisites
- **Java 21** or higher
- **Maven 3.6+**
- **Node.js 16+** and npm
- **MySQL 8.0+**

### 1. Clone the Repository
```bash
git clone https://github.com/Anuj-er/Employee-Payroll-System.git
cd Employee-Payroll-System
```

### 2. Database Setup
```sql
CREATE DATABASE employee_db;
CREATE DATABASE payroll_db;
```

### 3. Start Backend Services

**Terminal 1 - Employee Service:**
```bash
cd employee-service
./mvnw clean install
./mvnw spring-boot:run
# Runs on http://localhost:8081
```

**Terminal 2 - Payroll Service:**
```bash
cd payroll-service
./mvnw clean install
./mvnw spring-boot:run
# Runs on http://localhost:8082
```

### 4. Start Frontend Application

**Terminal 3 - React Frontend:**
```bash
cd frontend/payroll-ui
npm install
npm start
# Runs on http://localhost:3000
```

---

## 🔐 Authentication & Access

### Default Credentials

**Admin User (Employee Management):**
- Username: `admin`
- Password: `admin123`
- Access: Full employee CRUD, department management

**HR User (Payroll Management):**
- Username: `hr`
- Password: `hr123`
- Access: Salary processing, payroll management

### JWT Authentication Flow
1. User logs in through React frontend
2. Smart login tries both services to determine role
3. JWT token received and stored locally
4. All API calls include Bearer token
5. Services validate JWT for each request

---

## 📱 Application Screenshots

### Login Page
- Single login page with smart role detection
- Modern gradient design with demo credentials
- Responsive layout for all devices

### Admin Dashboard
- Employee statistics and department overview
- Create, view, and delete employees
- Professional data tables with search/filter
- Cascade delete with confirmation dialogs

### HR Dashboard
- Financial overview with real-time statistics
- Salary processing with automatic calculations
- Payment status management workflow
- Bulk payroll generation capabilities

---

## 📋 API Endpoints

### Employee Service (Port: 8081)
```
POST   /api/auth/login              # JWT authentication
GET    /api/employees               # Get all employees
POST   /api/employees               # Create employee
GET    /api/employees/{id}          # Get by ID
GET    /api/employees/code/{code}   # Get by employee code
DELETE /api/employees/cascade/{code} # Delete with payrolls
```

### Payroll Service (Port: 8082)
```
POST   /api/auth/login              # JWT authentication
GET    /api/payroll/salaries        # Get all salaries
POST   /api/payroll/salaries        # Process new salary
GET    /api/payroll/salaries/employee/{code} # Get by employee
PATCH  /api/payroll/salaries/{id}/status     # Update status
POST   /api/payroll/bulk-generate   # Generate bulk payroll
```

---

## 🎨 UI/UX Features

- **Gradient Themes**: Modern purple/blue gradients throughout
- **Hover Effects**: Interactive buttons with smooth transitions
- **Loading States**: Professional loading indicators
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Mobile-first approach
- **Data Visualization**: Statistics cards with color coding
- **Form Validation**: Real-time validation with error highlighting

---

## 🤖 Automated Features

### Backend Automation
- **Scheduled Payroll**: Monthly automated payroll generation (1st at 9 AM)
- **Duplicate Prevention**: Automatic detection and prevention
- **Status Workflow**: Automated status transitions
- **Error Recovery**: Comprehensive rollback mechanisms

### Frontend Automation
- **Auto-redirect**: Seamless navigation based on auth state
- **Token Refresh**: Automatic token management
- **Role Detection**: Smart login with automatic role assignment
- **Real-time Updates**: Live data refresh and statistics

---

## � Development Setup

### Environment Variables (.env)
```env
REACT_APP_EMPLOYEE_SERVICE_URL=http://localhost:8081
REACT_APP_PAYROLL_SERVICE_URL=http://localhost:8082
REACT_APP_JWT_SECRET=mySecretKeyForJWTTokenGeneration...
```

### Build Commands
```bash
# Backend
./mvnw clean package

# Frontend
npm run build
```

### Testing
```bash
# Backend tests
./mvnw test

# Frontend tests
npm test
```

---

## 👥 Contributors

### 👩‍💻 Akanksha Mishra
**Initial System Development**
- Created foundational Spring Boot microservices architecture
- Implemented Employee and Payroll services with MySQL integration
- Set up REST API endpoints and basic authentication

### 👨‍💻 Anuj Kumar
**System Enhancement & Full-Stack Development**
- **Backend**: Enhanced payroll automation, JWT authentication implementation
- **Frontend**: Complete React TypeScript application development
- **Security**: Migrated to JWT-based authentication across all services
- **UI/UX**: Modern responsive design with role-based dashboards

For detailed contributions, see [CONTRIBUTIONS.md](CONTRIBUTIONS.md).

---

## 🌟 Project Highlights

- **Full-Stack Architecture**: Complete separation of concerns
- **Modern Authentication**: JWT-based security implementation
- **Responsive Design**: Works seamlessly across all devices
- **Role-Based Access**: Different interfaces for different user types
- **Professional UI**: Modern gradients and smooth animations
- **Production Ready**: Comprehensive error handling and validation

---

<p align="center">Made with ❤️ by the Development Team</p>

