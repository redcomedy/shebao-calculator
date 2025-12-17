import { NextResponse } from 'next/server';
import { getCities } from '@/lib/database';

export async function GET() {
  try {
    const cities = await getCities();

    return NextResponse.json({
      success: true,
      data: cities
    });
  } catch (error: any) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { success: false, error: error.message || '获取城市数据失败' },
      { status: 500 }
    );
  }
}