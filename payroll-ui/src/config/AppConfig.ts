import RestTemplate from '../services/RestTemplate';

// Configuration similar to Spring's @Configuration
class AppConfig {
  private static _restTemplate: RestTemplate;

  static get restTemplate(): RestTemplate {
    if (!AppConfig._restTemplate) {
      AppConfig._restTemplate = new RestTemplate();
    }
    return AppConfig._restTemplate;
  }

  // Environment variables and configuration
  static get config() {
    return {
      employeeServiceUrl: process.env.REACT_APP_EMPLOYEE_SERVICE_URL || 'http://localhost:8081',
      payrollServiceUrl: process.env.REACT_APP_PAYROLL_SERVICE_URL || 'http://localhost:8082',
      jwtSecret: process.env.REACT_APP_JWT_SECRET || 'mySecretKeyForJWTTokenGeneration1234567890123456789012345678901234567890',
      apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
    };
  }
}

export default AppConfig;
