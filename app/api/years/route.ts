import { NextResponse } from 'next/server';
import { getAvailableYears, getSalaries } from '@/lib/database';

export async function GET() {
  try {
    // 从工资数据中获取所有可用年份
    const salaries = await getSalaries();
    const years = [...new Set(salaries.map(s => s.month.substring(0, 4)))];

    return NextResponse.json({
      success: true,
      data: years.sort((a, b) => b.localeCompare(a)) // 降序排列
    });
  } catch (error: any) {
    console.error('Error fetching years:', error);
    return NextResponse.json(
      { success: false, error: error.message || '获取年份失败' },
      { status: 500 }
    );
  }
}