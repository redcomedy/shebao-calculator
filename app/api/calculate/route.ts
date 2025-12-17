import { NextRequest, NextResponse } from 'next/server';
import { performCalculation } from '@/lib/calculator';
import { getCityByNameAndYear, getSalariesByYear, insertResult } from '@/lib/database';
import { CalculationOptions } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city_name, year } = body as CalculationOptions;

    if (!city_name || !year) {
      return NextResponse.json(
        { success: false, error: '请提供城市和年份' },
        { status: 400 }
      );
    }

    // 获取城市信息
    const city = await getCityByNameAndYear(city_name, year);
    if (!city) {
      return NextResponse.json(
        { success: false, error: `未找到 ${city_name} ${year} 年的社保标准` },
        { status: 404 }
      );
    }

    // 获取指定年份的工资数据
    const salaries = await getSalariesByYear(year);
    if (!salaries || salaries.length === 0) {
      return NextResponse.json(
        { success: false, error: `未找到 ${year} 年的工资数据` },
        { status: 404 }
      );
    }

    // 执行计算
    const results = await performCalculation(city, year, salaries);

    // 批量插入结果
    for (const result of results) {
      await insertResult(result);
    }

    return NextResponse.json({
      success: true,
      data: {
        count: results.length,
        city_name,
        year,
        message: `成功计算 ${results.length} 位员工的社保费用`
      }
    });
  } catch (error: any) {
    console.error('Error calculating:', error);
    return NextResponse.json(
      { success: false, error: error.message || '计算失败' },
      { status: 500 }
    );
  }
}