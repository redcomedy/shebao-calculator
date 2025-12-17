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

    // 插入示例城市数据
    const { error: citiesError } = await supabaseAdmin
      .from('cities')
      .upsert([
        {
          city_name: '佛山',
          year: '2024',
          base_min: 5284,
          base_max: 26421,
          rate: 0.15
        },
        {
          city_name: '广州',
          year: '2024',
          base_min: 5500,
          base_max: 28074,
          rate: 0.155
        },
        {
          city_name: '深圳',
          year: '2024',
          base_min: 5284,
          base_max: 26421,
          rate: 0.15
        }
      ], { onConflict: 'city_name,year' });

    if (citiesError) {
      console.error('Cities error:', citiesError);
    }

    // 插入示例工资数据
    const { error: salariesError } = await supabaseAdmin
      .from('salaries')
      .upsert([
        {
          employee_id: 'EMP001',
          employee_name: '张三',
          month: '202401',
          salary_amount: 8000
        },
        {
          employee_id: 'EMP001',
          employee_name: '张三',
          month: '202402',
          salary_amount: 8000
        },
        {
          employee_id: 'EMP001',
          employee_name: '张三',
          month: '202403',
          salary_amount: 8500
        },
        {
          employee_id: 'EMP001',
          employee_name: '张三',
          month: '202404',
          salary_amount: 8500
        },
        {
          employee_id: 'EMP001',
          employee_name: '张三',
          month: '202405',
          salary_amount: 9000
        },
        {
          employee_id: 'EMP001',
          employee_name: '张三',
          month: '202406',
          salary_amount: 9000
        },
        {
          employee_id: 'EMP002',
          employee_name: '李四',
          month: '202401',
          salary_amount: 15000
        },
        {
          employee_id: 'EMP002',
          employee_name: '李四',
          month: '202402',
          salary_amount: 15000
        },
        {
          employee_id: 'EMP002',
          employee_name: '李四',
          month: '202403',
          salary_amount: 16000
        },
        {
          employee_id: 'EMP002',
          employee_name: '李四',
          month: '202404',
          salary_amount: 16000
        },
        {
          employee_id: 'EMP003',
          employee_name: '王五',
          month: '202401',
          salary_amount: 5000
        },
        {
          employee_id: 'EMP003',
          employee_name: '王五',
          month: '202402',
          salary_amount: 5000
        },
        {
          employee_id: 'EMP003',
          employee_name: '王五',
          month: '202403',
          salary_amount: 5000
        }
      ], { onConflict: 'employee_id,month' });

    if (salariesError) {
      console.error('Salaries error:', salariesError);
    }

    // 执行一次示例计算（佛山 2024年）
    const { data: salaries2024 } = await supabaseAdmin
      .from('salaries')
      .select('*')
      .like('month', '2024%');

    if (salaries2024 && salaries2024.length > 0) {
      const city = { city_name: '佛山', year: '2024', base_min: 5284, base_max: 26421, rate: 0.15 };

      // 计算张三的平均工资
      const zhangSanSalaries = salaries2024.filter(s => s.employee_name === '张三');
      if (zhangSanSalaries.length > 0) {
        const avgSalary = zhangSanSalaries.reduce((sum, s) => sum + s.salary_amount, 0) / zhangSanSalaries.length;
        const contributionBase = avgSalary < city.base_min ? city.base_min :
                                avgSalary > city.base_max ? city.base_max : avgSalary;
        const companyFee = contributionBase * city.rate;

        await supabaseAdmin
          .from('results')
          .upsert({
            employee_name: '张三',
            city_name: city.city_name,
            year: city.year,
            avg_salary: Number(avgSalary.toFixed(2)),
            contribution_base: contributionBase,
            company_fee: Number(companyFee.toFixed(2))
          }, { onConflict: 'employee_name,city_name,year' });
      }

      // 计算李四的平均工资
      const liSiSalaries = salaries2024.filter(s => s.employee_name === '李四');
      if (liSiSalaries.length > 0) {
        const avgSalary = liSiSalaries.reduce((sum, s) => sum + s.salary_amount, 0) / liSiSalaries.length;
        const contributionBase = avgSalary < city.base_min ? city.base_min :
                                avgSalary > city.base_max ? city.base_max : avgSalary;
        const companyFee = contributionBase * city.rate;

        await supabaseAdmin
          .from('results')
          .upsert({
            employee_name: '李四',
            city_name: city.city_name,
            year: city.year,
            avg_salary: Number(avgSalary.toFixed(2)),
            contribution_base: contributionBase,
            company_fee: Number(companyFee.toFixed(2))
          }, { onConflict: 'employee_name,city_name,year' });
      }

      // 计算王五的平均工资
      const wangWuSalaries = salaries2024.filter(s => s.employee_name === '王五');
      if (wangWuSalaries.length > 0) {
        const avgSalary = wangWuSalaries.reduce((sum, s) => sum + s.salary_amount, 0) / wangWuSalaries.length;
        const contributionBase = avgSalary < city.base_min ? city.base_min :
                                avgSalary > city.base_max ? city.base_max : avgSalary;
        const companyFee = contributionBase * city.rate;

        await supabaseAdmin
          .from('results')
          .upsert({
            employee_name: '王五',
            city_name: city.city_name,
            year: city.year,
            avg_salary: Number(avgSalary.toFixed(2)),
            contribution_base: contributionBase,
            company_fee: Number(companyFee.toFixed(2))
          }, { onConflict: 'employee_name,city_name,year' });
      }
    }

    return NextResponse.json({
      success: true,
      message: '示例数据初始化成功',
      citiesError: citiesError?.message,
      salariesError: salariesError?.message
    });
  } catch (error: any) {
    console.error('Init data error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}