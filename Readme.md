# 💼 Employee Payroll System

<p align="center">
   <img src="https://img.shields.io/badge/Employee--Payroll--System-SpringBoot-blueviolet?style=for-the-badge&logo=spring&logoColor=white" alt="Employee Payroll System"/>
</p>

<p align="center">
   <b>A modern, robust, and scalable Employee Payroll Management System built with Spring Boot Microservices</b>
</p>

<p align="center">
   <img src="https://img.shields.io/badge/Java-21-blue?style=flat-square&logo=java"/>
   <img src="https://img.shields.io/badge/Spring%20Boot-3.5.5-green?style=flat-square&logo=spring-boot"/>
   <img src="https://img.shields.io/badge/Maven-Build-orange?style=flat-square&logo=apache-maven"/>
   <img src="https://img.shields.io/badge/MySQL-Database-blue?style=flat-square&logo=mysql"/>
</p>

---

## 🚀 Overview

The Employee Payroll System is a comprehensive microservices-based application designed to efficiently manage employee data and payroll operations. Built with Spring Boot, it offers scalability, security, and ease of deployment with automated payroll processing capabilities.

---

## ✨ Key Features

- 👥 **Employee Management**: Complete CRUD operations for employee data
- 💰 **Payroll Processing**: Automated salary calculations with scheduling
- 🔐 **Security**: Role-based authentication (ADMIN/HR roles)
- 🏗️ **Microservices Architecture**: Separate services for employees and payroll
- 📊 **Dual Data Access**: Both JPA/Hibernate and JDBC support
- ✅ **Data Validation**: Comprehensive input validation and error handling
- 🔄 **Status Tracking**: Payroll workflow management with status updates
- 🚫 **Duplicate Prevention**: Built-in checks to prevent duplicate payroll entries

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Language** | Java | 21 |
| **Framework** | Spring Boot | 3.5.5 |
| **Security** | Spring Security | Latest |
| **Database** | MySQL | 8.0+ |
| **ORM** | Spring Data JPA | Latest |
| **Database Access** | JDBC Template | Latest |
| **Build Tool** | Maven | 3.6+ |
| **Validation** | Bean Validation | Latest |

---

## 🏗️ Architecture

```
Employee-Payroll-System/
├── employee-service/          # Employee management microservice (Port: 8081)
│   ├── controller/           # REST API endpoints
│   ├── service/             # Business logic
│   ├── repository/          # Data access layer
│   ├── entity/              # JPA entities
│   └── exception/           # Error handling
├── payroll-service/          # Payroll management microservice (Port: 8082)
│   ├── controller/          # REST API endpoints
│   ├── service/             # Business logic & scheduling
│   ├── repository/          # Data access (JPA + JDBC)
│   ├── entity/              # JPA entities
│   ├── dto/                 # Data transfer objects
│   ├── enums/               # Status enumerations
│   └── exception/           # Error handling
└── CONTRIBUTIONS.md          # Team contributions
```

---

## 🚦 Quick Start

### Prerequisites
- **Java 21** or higher
- **Maven 3.6+**
- **MySQL 8.0+**

### 1. Clone the Repository
```bash
git clone https://github.com/Anuj-er/Employee-Payroll-System.git
cd Employee-Payroll-System
```

### 2. Database Setup
Create two MySQL databases:
```sql
CREATE DATABASE employee_db;
CREATE DATABASE payroll_db;
```

### 3. Configure Database Connection
Update `application.properties` in both services:

**Employee Service (`employee-service/src/main/resources/application.properties`)**:
```properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/employee_db
spring.datasource.username=root
spring.datasource.password=your_password
```

**Payroll Service (`payroll-service/src/main/resources/application.properties`)**:
```properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/payroll_db
spring.datasource.username=root
spring.datasource.password=your_password
```

### 4. Build and Run Services

**Terminal 1 - Employee Service**:
```bash
cd employee-service
./mvnw clean install
./mvnw spring-boot:run
```

**Terminal 2 - Payroll Service**:
```bash
cd payroll-service
./mvnw clean install
./mvnw spring-boot:run
```

Services will be available at:
- **Employee Service**: http://localhost:8081
- **Payroll Service**: http://localhost:8082

---

## 📋 API Documentation

### Employee Service (Port: 8081)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/employees` | Create new employee | ADMIN |
| GET | `/api/employees` | Get all employees | ADMIN |
| GET | `/api/employees/{id}` | Get employee by ID | ADMIN |
| GET | `/api/employees/code/{code}` | Get employee by code | ADMIN |
| GET | `/api/employees/department/{dept}` | Get employees by department | ADMIN |
| DELETE | `/api/employees/{id}` | Delete employee | ADMIN |
| DELETE | `/api/employees/cascade/{code}` | Delete employee & payrolls | ADMIN |

### Payroll Service (Port: 8082)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payroll` | Generate payroll | HR |
| GET | `/api/payroll/employee/{id}` | Get payroll by employee (JPA) | HR |
| GET | `/api/payroll/employee/{id}/jdbc` | Get payroll by employee (JDBC) | HR |
| GET | `/api/payroll/status/{status}` | Get payrolls by status | HR |
| PUT | `/api/payroll/{id}/status` | Update payroll status | HR |
| POST | `/api/payroll/bulk` | Generate bulk payroll | HR |

---

## 🔐 Authentication

Both services use **HTTP Basic Authentication**:

- **Employee Service**: `admin:admin123` (ADMIN role)
- **Payroll Service**: `hr:hr123` (HR role)

Example using curl:
```bash
curl -u admin:admin123 http://localhost:8081/api/employees
```

---

## 🤖 Automated Features

### Scheduled Payroll Generation
- **Schedule**: 1st of every month at 9:00 AM
- **Configuration**: `payroll.automation.enabled=true`
- **Cron Expression**: `0 0 9 1 * ?`

### Bulk Processing
- **Transactional Mode**: All-or-nothing bulk payroll generation
- **Error Handling**: Comprehensive rollback on failures
- **Duplicate Prevention**: Automatic detection and prevention

---

## 👥 Contributors

<p align="center">
   <img src="https://github.com/Anushi13prsnl.png" width="70" height="70" style="border-radius:50%;object-fit:cover;" alt="Anushi"/>
   <img src="https://github.com/Anuj-er.png" width="70" height="70" style="border-radius:50%;object-fit:cover;" alt="Anuj"/>
   <img src="https://github.com/AkankshaMishra2.png" width="70" height="70" style="border-radius:50%;object-fit:cover;" alt="Akanksha"/>
   <img src="https://github.com/abhinavrathee.png" width="70" height="70" style="border-radius:50%;object-fit:cover;" alt="Abhinav"/>
</p>

<p align="center">
   <b>Anushi</b> • <b>Anuj</b> • <b>Akanksha</b> • <b>Abhinav</b>
</p>

For detailed contribution information, see [CONTRIBUTIONS.md](CONTRIBUTIONS.md).

---

## 🌟 Special Thanks

> "Individual commitment to a group effort – that is what makes a team work, a company work, a society work, a civilization work." - Vince Lombardi

---

<p align="center">Made with ❤️ by the Team</p>

