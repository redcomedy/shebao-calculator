// 城市/社保标准表
export interface City {
  id: number;
  city_name: string;
  year: string;
  base_min: number;
  base_max: number;
  rate: number;
  created_at?: string;
}

// 员工工资表
export interface Salary {
  id: number;
  employee_id: string;
  employee_name: string;
  month: string; // YYYYMM格式
  salary_amount: number;
  created_at?: string;
}

// 计算结果表
export interface Result {
  id: number;
  employee_name: string;
  city_name: string;
  year: string;
  avg_salary: number;
  contribution_base: number;
  company_fee: number;
  calculated_at: string;
}

// 上传的城市数据（Excel格式）
export interface CityUpload {
  city_name: string;
  year: string;
  base_min: number;
  base_max: number;
  rate: number;
}

// 上传的工资数据（Excel格式）
export interface SalaryUpload {
  employee_id: string;
  employee_name: string;
  month: string;
  salary_amount: number;
}

// 计算选项
export interface CalculationOptions {
  city_name: string;
  year: string;
}

// 筛选选项
export interface FilterOptions {
  cities?: string[];
  years?: string[];
  employee_name?: string;
}

// 排序选项
export interface SortOption {
  field: keyof Result;
  order: 'asc' | 'desc';
}

// API 响应格式
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}