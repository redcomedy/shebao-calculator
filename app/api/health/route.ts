import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // 检查环境变量
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set',
    };

    // 检查 Supabase 连接
    let supabaseStatus = 'Not connected';
    let tables = null;

    if (supabaseAdmin) {
      supabaseStatus = 'Connected';
      try {
        const { data, error } = await supabaseAdmin
          .from('cities')
          .select('count')
          .single();

        if (!error) {
          tables = {
            cities: 'Accessible'
          };
        }
      } catch (e) {
        tables = { error: 'Table access failed' };
      }
    }

    return NextResponse.json({
      success: true,
      environment: envVars,
      supabase: {
        status: supabaseStatus,
        tables: tables
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}