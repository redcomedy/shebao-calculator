import { NextRequest, NextResponse } from 'next/server';
import { insertSalaries } from '@/lib/database';
import { SalaryUpload } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { salaries } = body as { salaries: SalaryUpload[] };

    if (!salaries || !Array.isArray(salaries)) {
      return NextResponse.json(
        { success: false, error: '请提供有效的工资数据' },
        { status: 400 }
      );
    }

    // 插入工资数据
    await insertSalaries(salaries);

    return NextResponse.json({
      success: true,
      message: `成功上传 ${salaries.length} 条工资数据`
    });
  } catch (error: any) {
    console.error('Error uploading salaries:', error);
    return NextResponse.json(
      { success: false, error: error.message || '上传失败' },
      { status: 500 }
    );
  }
}