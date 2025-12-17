import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // 检查 Supabase 连接
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not connected'
      });
    }

    // 检查 cities 表
    const { data: cities, error: citiesError } = await supabaseAdmin
      .from('cities')
      .select('*');

    // 检查 salaries 表
    const { data: salaries, error: salariesError } = await supabaseAdmin
      .from('salaries')
      .select('*');

    // 检查 results 表
    const { data: results, error: resultsError } = await supabaseAdmin
      .from('results')
      .select('*');

    return NextResponse.json({
      success: true,
      data: {
        cities: {
          count: cities?.length || 0,
          error: citiesError?.message,
          data: cities
        },
        salaries: {
          count: salaries?.length || 0,
          error: salariesError?.message,
          data: salaries
        },
        results: {
          count: results?.length || 0,
          error: resultsError?.message,
          data: results
        }
      }
    });
  } catch (error: any) {
    console.error('Test DB error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}