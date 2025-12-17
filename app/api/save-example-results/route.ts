import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not connected'
      });
    }

    // 示例计算结果
    const results = [
      {
        employee_name: '张三',
        city_name: '佛山',
        year: '2024',
        avg_salary: 8500,
        contribution_base: 8500,
        company_fee: 1275
      },
      {
        employee_name: '李四',
        city_name: '佛山',
        year: '2024',
        avg_salary: 15500,
        contribution_base: 15500,
        company_fee: 2325
      },
      {
        employee_name: '王五',
        city_name: '佛山',
        year: '2024',
        avg_salary: 5000,
        contribution_base: 5284,
        company_fee: 792.6
      }
    ];

    // 清空现有的结果（可选）
    // await supabaseAdmin
    //   .from('results')
    //   .delete()
    //   .eq('city_name', '佛山')
    //   .eq('year', '2024');

    // 插入新的计算结果
    const { data, error } = await supabaseAdmin
      .from('results')
      .insert(results)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: '成功保存示例计算结果！',
      count: data?.length || 0,
      data: data
    });
  } catch (error: any) {
    console.error('Error saving results:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '保存失败'
    }, { status: 500 });
  }
}