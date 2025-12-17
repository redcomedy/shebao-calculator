-- 创建城市标准表
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min INTEGER NOT NULL,
  base_max INTEGER NOT NULL,
  rate DECIMAL(5,4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建员工工资表
CREATE TABLE IF NOT EXISTS salaries (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  month TEXT NOT NULL CHECK (month ~ '^\d{6}$'), -- YYYYMM format
  salary_amount INTEGER NOT NULL CHECK (salary_amount > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建计算结果表
CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  employee_name TEXT NOT NULL,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  avg_salary DECIMAL(12,2) NOT NULL,
  contribution_base DECIMAL(12,2) NOT NULL,
  company_fee DECIMAL(12,2) NOT NULL,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_cities_city_year ON cities(city_name, year);
CREATE INDEX IF NOT EXISTS idx_salaries_employee_name ON salaries(employee_name);
CREATE INDEX IF NOT EXISTS idx_salaries_month ON salaries(month);
CREATE INDEX IF NOT EXISTS idx_results_employee_name ON results(employee_name);
CREATE INDEX IF NOT EXISTS idx_results_city_year ON results(city_name, year);
CREATE INDEX IF NOT EXISTS idx_results_calculated_at ON results(calculated_at);

-- 插入示例数据（佛山 2024年）
INSERT INTO cities (city_name, year, base_min, base_max, rate) VALUES
('佛山', '2024', 5284, 26421, 0.15)
ON CONFLICT DO NOTHING;

-- 插入示例工资数据
INSERT INTO salaries (employee_id, employee_name, month, salary_amount) VALUES
('EMP001', '张三', '202401', 8000),
('EMP001', '张三', '202402', 8000),
('EMP001', '张三', '202403', 8500),
('EMP001', '张三', '202404', 8500),
('EMP001', '张三', '202405', 9000),
('EMP001', '张三', '202406', 9000),
('EMP002', '李四', '202401', 15000),
('EMP002', '李四', '202402', 15000),
('EMP002', '李四', '202403', 16000),
('EMP002', '李四', '202404', 16000),
('EMP003', '王五', '202401', 5000),
('EMP003', '王五', '202402', 5000),
('EMP003', '王五', '202403', 5000)
ON CONFLICT DO NOTHING;