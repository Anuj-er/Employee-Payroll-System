# Getting Started

# Employee Service

## Overview
<p align="center">
   <img src="https://img.shields.io/badge/Employee--Payroll--Service-SpringBoot-blueviolet?style=for-the-badge&logo=spring&logoColor=white" alt="Employee Payroll Service"/>
</p>

<h1 align="center">💼 Employee Payroll Service</h1>

<p align="center">
   <b>A modern, robust, and scalable Employee Payroll Management System built with Spring Boot</b>
</p>

<p align="center">
   <img src="https://img.shields.io/badge/Java-17-blue?style=flat-square&logo=java"/>
   <img src="https://img.shields.io/badge/Spring%20Boot-2.7-green?style=flat-square&logo=spring-boot"/>
   <img src="https://img.shields.io/badge/Maven-Build-orange?style=flat-square&logo=apache-maven"/>
</p>

---

## 🚀 Overview

Employee Payroll Service is a microservices-based application designed to manage employee data and payroll efficiently. It leverages the power of Spring Boot for rapid development and easy deployment.

---

## 🏗️ Project Structure

<details>
<summary>Click to expand</summary>

```bash
Employee-Payroll/
├── employee-service/
│   └── ...
├── payroll-service/
│   └── ...
└── Readme.md
```
</details>

---

## ✨ Features

- Employee CRUD operations
- Payroll calculation and management
- RESTful APIs
- Secure authentication & authorization
- Modular microservices architecture
- Easy integration and deployment

---

## 🛠️ Tech Stack

| Technology     | Description                |
|---------------|----------------------------|
| Java 17       | Programming Language       |
| Spring Boot   | Backend Framework          |
| Maven         | Build & Dependency Manager |
| H2/MySQL      | Database                   |
| REST API      | Communication              |

---

## 🚦 Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/AkankshaMishra2/Employee-Payroll-Service.git
    ```
2. **Navigate to a service:**
    ```bash
    cd employee-service
    # or
    cd payroll-service
    ```
3. **Build the project:**
    ```bash
    ./mvnw clean install
    ```
4. **Run the application:**
    ```bash
    ./mvnw spring-boot:run
    ```

---

## 📂 Folder Structure

```bash
employee-service/
├── src/main/java/com/company/employee/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   └── dto/
└── src/main/resources/
      └── application.properties

payroll-service/
├── src/main/java/com/company/payroll/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   └── dto/
└── src/main/resources/
      └── application.properties
```

---

## 👩‍💻 Contributors

<p align="center">
    <img src="https://github.com/AkankshaMishra2.png" width="70" style="border-radius:50%" alt="Akanksha"/>   
    <img src="https://github.com/Anushi13prsnl.png" width="70" style="border-radius:50%" alt="Anushi"/>
   <img src="https://github.com/Anuj-er.png" width="70" style="border-radius:50%" alt="Anuj"/>
   <img src="https://github.com/abhinavrathee" width="70" style="border-radius:50%" alt="Abhinav"/>
</p>

<p align="center">
   <b>Akanksha</b> • <b>Anushi</b> • <b>Anuj</b> • <b>Abhinav</b>
</p>

---

## 🌟 Special Thanks

> "Teamwork makes the dream work!"

---



## Prerequisites
- Java 17 or above
- Maven
- MySQL (or your configured database)

## Setup Instructions
1. **Clone the repository** (if not already done):
   ```
   git clone <your-repo-url>
   ```
2. **Configure the database:**
   - Update `src/main/resources/application.properties` with your MySQL credentials and database name.
   - Example:
     ```
     spring.datasource.url=jdbc:mysql://localhost:3306/employee_db
     spring.datasource.username=root
     spring.datasource.password=yourpassword
     ```
3. **Set up Spring Security credentials:**
   - In `application.properties` or your security config, set the username and password for HTTP Basic Auth.

4. **Build the project:**
   ```
   mvn clean install
   ```
5. **Run the service:**
   ```
   mvn spring-boot:run
   ```
   The service will start on [http://localhost:8081](http://localhost:8081) by default.

## API Endpoints
- `POST /api/employees` — Create a new employee
- `GET /api/employees` — Get all employees
- `GET /api/employees/{id}` — Get employee by ID
- `GET /api/employees/code/{employeeCode}` — Get employee by code
- `GET /api/employees/department/{department}` — Get employees by department
- `DELETE /api/employees/{id}` — Delete employee by ID
- `DELETE /api/employees/cascade/{id}` — Delete employee and their salaries (calls payroll-service)

## Authentication
All endpoints are protected by HTTP Basic Auth. Use the credentials set in your configuration.

## Notes
- Make sure payroll-service is running for cascade delete to work.
- Use Postman, curl, or a browser (with authentication) to test endpoints.


# Payroll Service

## Overview
This microservice manages salary and payroll data for employees. It provides REST APIs for generating payroll, fetching salary records, and supports both JPA (Hibernate) and JDBC for database operations. Authentication is enforced via Spring Security.

## Prerequisites
- Java 17 or above
- Maven
- MySQL (or your configured database)

## Setup Instructions
1. **Clone the repository** (if not already done):
   ```
   git clone <your-repo-url>
   ```
2. **Configure the database:**
   - Update `src/main/resources/application.properties` with your MySQL credentials and database name.
   - Example:
     ```
     spring.datasource.url=jdbc:mysql://localhost:3306/payroll_db
     spring.datasource.username=root
     spring.datasource.password=yourpassword
     ```
3. **Set up Spring Security credentials:**
   - In `application.properties` or your security config, set the username and password for HTTP Basic Auth.

4. **Build the project:**
   ```
   mvn clean install
   ```
5. **Run the service:**
   ```
   mvn spring-boot:run
   ```
   The service will start on [http://localhost:8082](http://localhost:8082) by default.

## API Endpoints
- `POST /api/payroll` — Generate payroll for an employee
- `GET /api/payroll/employee/{employeeId}` — Get payroll records for an employee (JPA)
- `GET /api/payroll/employee/{employeeId}/jdbc` — Get payroll records for an employee (JDBC)
- `DELETE /api/payroll/salaries/by-employee/{employeeCode}` — Delete all salary records for an employee (used by employee-service for cascade delete)

## Authentication
All endpoints are protected by HTTP Basic Auth. Use the credentials set in your configuration.

