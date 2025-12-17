import { NextRequest, NextResponse } from 'next/server';
import { insertCities } from '@/lib/database';
import { CityUpload } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cities } = body as { cities: CityUpload[] };

    if (!cities || !Array.isArray(cities)) {
      return NextResponse.json(
        { success: false, error: '请提供有效的城市数据' },
        { status: 400 }
      );
    }

    // 插入城市数据
    await insertCities(cities);

    return NextResponse.json({
      success: true,
      message: `成功上传 ${cities.length} 条城市数据`
    });
  } catch (error: any) {
    console.error('Error uploading cities:', error);
    return NextResponse.json(
      { success: false, error: error.message || '上传失败' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { getCities } = await import('@/lib/database');
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