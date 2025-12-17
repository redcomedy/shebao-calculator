import { City, Salary, Result } from '@/types';
import { format } from 'date-fns';

// 按员工分组并计算月平均工资
export function calculateAverageSalaries(salaries: Salary[]): Map<string, number> {
  const employeeSalaries = new Map<string, { total: number; count: number }>();

  // 按员工分组汇总
  salaries.forEach(salary => {
    const current = employeeSalaries.get(salary.employee_name) || { total: 0, count: 0 };
    employeeSalaries.set(salary.employee_name, {
      total: current.total + salary.salary_amount,
      count: current.count + 1
    });
  });

  // 计算平均工资
  const averageSalaries = new Map<string, number>();
  employeeSalaries.forEach((value, key) => {
    averageSalaries.set(key, Number((value.total / value.count).toFixed(2)));
  });

  return averageSalaries;
}

// 计算缴费基数
export function calculateContributionBase(
  avgSalary: number,
  baseMin: number,
  baseMax: number
): number {
  if (avgSalary < baseMin) {
    return baseMin;
  }
  if (avgSalary > baseMax) {
    return baseMax;
  }
  return avgSalary;
}

// 执行完整的计算流程
export async function performCalculation(
  city: City,
  year: string,
  salaries: Salary[]
): Promise<Result[]> {
  const results: Result[] = [];

  // 获取指定年份的工资数据
  const yearSalaries = salaries.filter(salary => salary.month.startsWith(year));

  // 计算每位员工的平均工资
  const averageSalaries = calculateAverageSalaries(yearSalaries);

  // 为每位员工计算结果
  averageSalaries.forEach((avgSalary, employeeName) => {
    const contributionBase = calculateContributionBase(
      avgSalary,
      city.base_min,
      city.base_max
    );

    const companyFee = Number((contributionBase * city.rate).toFixed(2));

    results.push({
      id: 0, // 将在数据库插入时生成
      employee_name: employeeName,
      city_name: city.city_name,
      year: year,
      avg_salary: avgSalary,
      contribution_base: contributionBase,
      company_fee: companyFee,
      calculated_at: new Date().toISOString()
    });
  });

  return results;
}

// 格式化金额显示
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  }).format(amount);
}

// 格式化日期显示
export function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
  } catch {
    return dateString;
  }
}

// 验证工资数据
export function validateSalaryData(salaries: any[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  salaries.forEach((salary, index) => {
    const row = index + 2; // Excel行号（从2开始，因为第一行是标题）

    if (!salary.employee_id || typeof salary.employee_id !== 'string') {
      errors.push(`第${row}行：员工工号不能为空`);
    }

    if (!salary.employee_name || typeof salary.employee_name !== 'string') {
      errors.push(`第${row}行：员工姓名不能为空`);
    }

    if (!salary.month || !/^\d{6}$/.test(salary.month.toString())) {
      errors.push(`第${row}行：年月格式不正确，应为6位数字（YYYYMM）`);
    }

    if (!salary.salary_amount || isNaN(Number(salary.salary_amount)) || Number(salary.salary_amount) <= 0) {
      errors.push(`第${row}行：工资金额必须大于0`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

// 验证城市数据
export function validateCityData(cities: any[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  cities.forEach((city, index) => {
    const row = index + 2;

    if (!city.city_name || typeof city.city_name !== 'string') {
      errors.push(`第${row}行：城市名称不能为空`);
    }

    if (!city.year || !/^\d{4}$/.test(city.year.toString())) {
      errors.push(`第${row}行：年份格式不正确，应为4位数字（YYYY）`);
    }

    if (!city.base_min || isNaN(Number(city.base_min)) || Number(city.base_min) < 0) {
      errors.push(`第${row}行：基数下限不能为负数`);
    }

    if (!city.base_max || isNaN(Number(city.base_max)) || Number(city.base_max) < 0) {
      errors.push(`第${row}行：基数上限不能为负数`);
    }

    if (city.base_min && city.base_max && Number(city.base_min) > Number(city.base_max)) {
      errors.push(`第${row}行：基数下限不能大于基数上限`);
    }

    if (!city.rate || isNaN(Number(city.rate)) || Number(city.rate) < 0 || Number(city.rate) > 1) {
      errors.push(`第${row}行：缴纳比例必须在0到1之间`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}