import { NextRequest, NextResponse } from 'next/server';
import { getResults } from '@/lib/database';
import { FilterOptions } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 获取筛选参数
    const cities = searchParams.get('cities')?.split(',').filter(Boolean) || undefined;
    const years = searchParams.get('years')?.split(',').filter(Boolean) || undefined;
    const employee_name = searchParams.get('employee_name') || undefined;

    const filters: FilterOptions = {
      cities,
      years,
      employee_name
    };

    const results = await getResults(filters);

    return NextResponse.json({
      success: true,
      data: results
    });
  } catch (error: any) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { success: false, error: error.message || '获取结果数据失败' },
      { status: 500 }
    );
  }
}