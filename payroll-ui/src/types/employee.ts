export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  basicSalary?: number;  // Changed from salary to basicSalary to match backend
  joinDate?: string;     // Changed from joiningDate to joinDate to match backend
}

export interface Salary {
  id: number;
  employeeId: number;
  employeeCode: string;
  basicSalary: number;  // Changed from baseSalary to match backend
  allowances?: number;
  deductions?: number;
  netSalary: number;
  payPeriod: string;    // Backend expects LocalDate format YYYY-MM-DD
  status: 'DRAFT' | 'APPROVED' | 'PAID' | 'CANCELLED';  // Updated to match backend enum
  createdAt?: string;   // Added to match backend
}
