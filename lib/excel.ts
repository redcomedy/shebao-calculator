import * as XLSX from 'xlsx';
import { CityUpload, SalaryUpload } from '@/types';

// 解析城市标准 Excel 文件
export function parseCitiesExcel(buffer: ArrayBuffer): CityUpload[] {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  return data.map((row: any) => ({
    city_name: row['城市名'] || row['city_name'] || row['城市名称'],
    year: String(row['年份'] || row['year']),
    base_min: Number(row['基数下限'] || row['base_min'] || row['社保基数下限']),
    base_max: Number(row['基数上限'] || row['base_max'] || row['社保基数上限']),
    rate: Number(row['缴纳比例'] || row['rate'] || row['综合缴纳比例'])
  }));
}

// 解析工资数据 Excel 文件
export function parseSalariesExcel(buffer: ArrayBuffer): SalaryUpload[] {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  return data.map((row: any) => ({
    employee_id: String(row['员工工号'] || row['employee_id'] || row['工号']),
    employee_name: String(row['员工姓名'] || row['employee_name'] || row['姓名']),
    month: String(row['年月'] || row['month'] || row['年份月份']),
    salary_amount: Number(row['工资金额'] || row['salary_amount'] || row['工资'])
  }));
}

// 导出结果到 Excel 文件
export function exportResultsToExcel(results: any[]): ArrayBuffer {
  // 创建工作簿
  const workbook = XLSX.utils.book_new();

  // 准备数据
  const exportData = results.map(result => ({
    '员工姓名': result.employee_name,
    '城市': result.city_name,
    '年份': result.year,
    '月平均工资': result.avg_salary,
    '缴费基数': result.contribution_base,
    '公司缴纳金额': result.company_fee,
    '计算时间': new Date(result.calculated_at).toLocaleString('zh-CN')
  }));

  // 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // 设置列宽
  const colWidths = [
    { wch: 15 }, // 员工姓名
    { wch: 15 }, // 城市
    { wch: 10 }, // 年份
    { wch: 15 }, // 月平均工资
    { wch: 15 }, // 缴费基数
    { wch: 15 }, // 公司缴纳金额
    { wch: 25 }  // 计算时间
  ];
  worksheet['!cols'] = colWidths;

  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, '社保计算结果');

  // 导出为 ArrayBuffer
  return XLSX.write(workbook, {
    type: 'array',
    bookType: 'xlsx',
    cellStyles: true
  });
}

// 生成城市数据模板
export function generateCitiesTemplate(): ArrayBuffer {
  const workbook = XLSX.utils.book_new();
  const templateData = [
    {
      '城市名': '佛山',
      '年份': '2024',
      '基数下限': 5284,
      '基数上限': 26421,
      '缴纳比例': 0.15
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // 设置列宽
  worksheet['!cols'] = [
    { wch: 15 }, // 城市名
    { wch: 10 }, // 年份
    { wch: 15 }, // 基数下限
    { wch: 15 }, // 基数上限
    { wch: 15 }  // 缴纳比例
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, '城市标准');

  return XLSX.write(workbook, {
    type: 'array',
    bookType: 'xlsx'
  });
}

// 生成工资数据模板
export function generateSalariesTemplate(): ArrayBuffer {
  const workbook = XLSX.utils.book_new();
  const templateData = [
    {
      '员工工号': 'EMP001',
      '员工姓名': '张三',
      '年月': '202401',
      '工资金额': 8000
    },
    {
      '员工工号': 'EMP001',
      '员工姓名': '张三',
      '年月': '202402',
      '工资金额': 8000
    },
    {
      '员工工号': 'EMP002',
      '员工姓名': '李四',
      '年月': '202401',
      '工资金额': 15000
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // 设置列宽
  worksheet['!cols'] = [
    { wch: 15 }, // 员工工号
    { wch: 15 }, // 员工姓名
    { wch: 10 }, // 年月
    { wch: 15 }  // 工资金额
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, '工资数据');

  return XLSX.write(workbook, {
    type: 'array',
    bookType: 'xlsx'
  });
}