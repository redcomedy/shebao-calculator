import { NextRequest, NextResponse } from 'next/server';
import { getResults } from '@/lib/database';
import { exportResultsToExcel } from '@/lib/excel';
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

    // 获取结果数据
    const results = await getResults(filters);

    if (!results || results.length === 0) {
      return NextResponse.json(
        { success: false, error: '没有可导出的数据' },
        { status: 404 }
      );
    }

    // 导出为 Excel
    const arrayBuffer = exportResultsToExcel(results);

    // 返回文件
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="社保计算结果_${new Date().toISOString().split('T')[0]}.xlsx"`
      }
    });
  } catch (error: any) {
    console.error('Error exporting results:', error);
    return NextResponse.json(
      { success: false, error: error.message || '导出失败' },
      { status: 500 }
    );
  }
}