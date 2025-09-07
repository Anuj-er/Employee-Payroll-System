# Contributors

This document tracks the contributions made to the Employee Payroll System project.

## Contributors

### 👩‍💻 Akanksha Mishra
**Initial System Development**
- Created the foundational Spring Boot microservices architecture
- Implemented Employee Service with CRUD operations
- Implemented Payroll Service with salary management
- Set up MySQL database integration with JPA/Hibernate
- Configured Spring Security with role-based authentication
- Implemented JDBC operations alongside Hibernate
- Created basic REST API endpoints for both services
- Set up project structure and configuration files

### 👨‍💻 Anuj Kumar
**System Enhancement & Bug Fixes**
- Enhanced payroll automation with scheduled tasks
- Implemented duplicate payroll prevention
- Added employee ID mapping between services  
- Enhanced error handling and transaction management
- Added payroll status tracking with workflow states
- Implemented comprehensive data validation
- Fixed validation order and business logic issues
- Added proper error handling in service client
- Enhanced input validation with annotations
- Removed unused code and cleaned up architecture
- Added global exception handlers for better error responses

**JWT Authentication Implementation**
- Migrated from HTTP Basic Auth to JWT-based authentication
- Added JWT dependencies (jjwt-api, jjwt-impl, jjwt-jackson) to both services
- Implemented JwtUtil classes for token generation, validation, and parsing
- Created JwtAuthenticationFilter for request-level JWT validation
- Added AuthController with /api/auth/login endpoints for both services
- Configured SecurityConfig to disable Basic Auth and enable JWT-only authentication
- Implemented JwtInterServiceClient for secure service-to-service communication
- Updated all inter-service calls to use JWT authentication instead of Basic Auth
- Added JWT configuration properties (secret key, expiration time)
- Enhanced security with stateless session management and proper filter chains

---
