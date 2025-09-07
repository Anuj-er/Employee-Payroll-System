import axios, { AxiosResponse } from 'axios';
import { LoginRequest, LoginResponse } from '../types/auth';
import { Employee, Salary } from '../types/employee';

const EMPLOYEE_SERVICE_URL = 'http://localhost:8081';
const PAYROLL_SERVICE_URL = 'http://localhost:8082';

// Create axios instance
const api = axios.create();

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API
export const authAPI = {
  loginToEmployeeService: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response: AxiosResponse<LoginResponse> = await api.post(
      `${EMPLOYEE_SERVICE_URL}/api/auth/login`,
      credentials
    );
    return response.data;
  },

  loginToPayrollService: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response: AxiosResponse<LoginResponse> = await api.post(
      `${PAYROLL_SERVICE_URL}/api/auth/login`,
      credentials
    );
    return response.data;
  },

  // Smart login - tries both services and determines user role based on username
  smartLogin: async (credentials: LoginRequest): Promise<{ token: string; role: 'ADMIN' | 'HR' }> => {
    // Determine role based on username for proper routing
    const expectedRole = credentials.username === 'admin' ? 'ADMIN' : 'HR';
    
    if (expectedRole === 'ADMIN') {
      try {
        // Try employee service for admin users
        const employeeResponse = await authAPI.loginToEmployeeService(credentials);
        return { token: employeeResponse.token, role: 'ADMIN' };
      } catch (employeeError) {
        try {
          // Fallback to payroll service
          const payrollResponse = await authAPI.loginToPayrollService(credentials);
          return { token: payrollResponse.token, role: 'ADMIN' };
        } catch (payrollError) {
          throw new Error('Invalid credentials');
        }
      }
    } else {
      try {
        // Try payroll service first for HR users
        const payrollResponse = await authAPI.loginToPayrollService(credentials);
        return { token: payrollResponse.token, role: 'HR' };
      } catch (payrollError) {
        try {
          // Fallback to employee service
          const employeeResponse = await authAPI.loginToEmployeeService(credentials);
          return { token: employeeResponse.token, role: 'HR' };
        } catch (employeeError) {
          throw new Error('Invalid credentials');
        }
      }
    }
  }
};

// Employee API
export const employeeAPI = {
  getAllEmployees: async (): Promise<Employee[]> => {
    const response: AxiosResponse<Employee[]> = await api.get(
      `${EMPLOYEE_SERVICE_URL}/api/employees`
    );
    return response.data;
  },

  getEmployeeById: async (id: number): Promise<Employee> => {
    const response: AxiosResponse<Employee> = await api.get(
      `${EMPLOYEE_SERVICE_URL}/api/employees/${id}`
    );
    return response.data;
  },

  getEmployeeByCode: async (employeeCode: string): Promise<Employee> => {
    const response: AxiosResponse<Employee> = await api.get(
      `${EMPLOYEE_SERVICE_URL}/api/employees/code/${employeeCode}`
    );
    return response.data;
  },

  createEmployee: async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
    const response: AxiosResponse<Employee> = await api.post(
      `${EMPLOYEE_SERVICE_URL}/api/employees`,
      employee
    );
    return response.data;
  },

  deleteEmployee: async (id: number): Promise<void> => {
    await api.delete(`${EMPLOYEE_SERVICE_URL}/api/employees/${id}`);
  },

  cascadeDeleteEmployee: async (employeeCode: string): Promise<string> => {
    const response: AxiosResponse<string> = await api.delete(
      `${EMPLOYEE_SERVICE_URL}/api/employees/cascade/${employeeCode}`
    );
    return response.data;
  }
};

// Payroll API
export const payrollAPI = {
  getAllSalaries: async (): Promise<Salary[]> => {
    const response: AxiosResponse<Salary[]> = await api.get(
      `${PAYROLL_SERVICE_URL}/api/payroll`
    );
    return response.data;
  },

  getSalariesByEmployee: async (employeeId: number): Promise<Salary[]> => {
    const response: AxiosResponse<Salary[]> = await api.get(
      `${PAYROLL_SERVICE_URL}/api/payroll/employee/${employeeId}`
    );
    return response.data;
  },

  processSalary: async (salary: Omit<Salary, 'id'>): Promise<Salary> => {
    const response: AxiosResponse<Salary> = await api.post(
      `${PAYROLL_SERVICE_URL}/api/payroll`,
      salary
    );
    return response.data;
  },

  updateSalaryStatus: async (id: number, status: string): Promise<Salary> => {
    const response: AxiosResponse<Salary> = await api.put(
      `${PAYROLL_SERVICE_URL}/api/payroll/${id}/status/${status}`
    );
    return response.data;
  },

  generateBulkPayroll: async (): Promise<string> => {
    const response: AxiosResponse<string> = await api.post(
      `${PAYROLL_SERVICE_URL}/api/payroll/bulk`
    );
    return response.data;
  }
};
