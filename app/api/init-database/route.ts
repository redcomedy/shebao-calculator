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

    const results = {
      cities: { status: 'Not checked', count: 0 },
      salaries: { status: 'Not checked', count: 0 },
      results: { status: 'Not checked', count: 0 }
    };

    // 检查 cities 表
    try {
      const { data: citiesData, error: citiesError } = await supabaseAdmin
        .from('cities')
        .select('count');

      if (citiesError) throw citiesError;
      results.cities = { status: 'OK', count: citiesData[0].count || 0 };
    } catch (error) {
      console.error('Cities table error:', error);
    }

    // 检查 salaries 表
    try {
      const { data: salariesData, error: salariesError } = await supabaseAdmin
        .from('salaries')
        .select('count');

      if (salariesError) throw salariesError;
      results.salaries = { status: 'OK', count: salariesData[0].count || 0 };
    } catch (error) {
      console.error('Salaries table error:', error);
    }

    // 检查 results 表
    try {
      const { data: resultsData, error: resultsError } = await supabaseAdmin
        .from('results')
        .select('count');

      if (resultsError) throw resultsError;
      results.results = { status: 'OK', count: resultsData[0].count || 0 };
    } catch (error) {
      console.error('Results table error:', error);
    }

    // 如果 salaries 表为空，插入示例数据
    if (results.salaries.count === 0) {
      const sampleSalaries = [
        { employee_id: 'EMP001', employee_name: '张三', month: '202401', salary_amount: 8000 },
        { employee_id: 'EMP001', employee_name: '张三', month: '202402', salary_amount: 8000 },
        { employee_id: 'EMP001', employee_name: '张三', month: '202403', salary_amount: 8500 },
        { employee_id: 'EMP001', employee_name: '张三', month: '202404', salary_amount: 8500 },
        { employee_id: 'EMP001', employee_name: '张三', month: '202405', salary_amount: 9000 },
        { employee_id: 'EMP001', employee_name: '张三', month: '202406', salary_amount: 9000 },
        { employee_id: 'EMP002', employee_name: '李四', month: '202401', salary_amount: 15000 },
        { employee_id: 'EMP002', employee_name: '李四', month: '202402', salary_amount: 15000 },
        { employee_id: 'EMP002', employee_name: '李四', month: '202403', salary_amount: 16000 },
        { employee_id: 'EMP002', employee_name: '李四', month: '202404', salary_amount: 16000 },
        { employee_id: 'EMP003', employee_name: '王五', month: '202401', salary_amount: 5000 },
        { employee_id: 'EMP003', employee_name: '王五', month: '202402', salary_amount: 5000 },
        { employee_id: 'EMP003', employee_name: '王五', month: '202403', salary_amount: 5000 }
      ];

      const { error: insertError } = await supabaseAdmin
        .from('salaries')
        .insert(sampleSalaries);

      if (!insertError) {
        results.salaries.count = sampleSalaries.length;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialization complete',
      results
    });
  } catch (error: any) {
    console.error('Init database error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}