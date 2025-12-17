import { supabaseAdmin } from './supabase';
import { City, Salary, Result, CityUpload, SalaryUpload } from '@/types';

// 检查 Supabase 是否已初始化
function checkSupabase() {
  if (!supabaseAdmin) {
    throw new Error('Supabase is not initialized. Please check your environment variables.');
  }
}

// 城市数据相关操作
export async function getCities(): Promise<City[]> {
  checkSupabase();
  const { data, error } = await supabaseAdmin!
    .from('cities')
    .select('*')
    .order('city_name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function insertCities(cities: CityUpload[]): Promise<void> {
  checkSupabase();
  const { error } = await supabaseAdmin!
    .from('cities')
    .insert(cities);

  if (error) throw error;
}

export async function getCityByNameAndYear(cityName: string, year: string): Promise<City | null> {
  checkSupabase();
  const { data, error } = await supabaseAdmin!
    .from('cities')
    .select('*')
    .eq('city_name', cityName)
    .eq('year', year)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
}

// 工资数据相关操作
export async function getSalaries(): Promise<Salary[]> {
  checkSupabase();
  const { data, error } = await supabaseAdmin!
    .from('salaries')
    .select('*')
    .order('employee_name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function insertSalaries(salaries: SalaryUpload[]): Promise<void> {
  checkSupabase();
  const { error } = await supabaseAdmin!
    .from('salaries')
    .insert(salaries);

  if (error) throw error;
}

export async function getSalariesByYear(year: string): Promise<Salary[]> {
  checkSupabase();
  const { data, error } = await supabaseAdmin!
    .from('salaries')
    .select('*')
    .like('month', `${year}%`)
    .order('employee_name', { ascending: true });

  if (error) throw error;
  return data || [];
}

// 计算结果相关操作
export async function insertResult(result: Omit<Result, 'id' | 'calculated_at'>): Promise<void> {
  checkSupabase();
  const { error } = await supabaseAdmin!
    .from('results')
    .insert({
      ...result,
      calculated_at: new Date().toISOString()
    });

  if (error) throw error;
}

export async function getResults(filters?: {
  cities?: string[];
  years?: string[];
  employee_name?: string;
}): Promise<Result[]> {
  checkSupabase();
  let query = supabaseAdmin!
    .from('results')
    .select('*')
    .order('calculated_at', { ascending: false });

  if (filters) {
    if (filters.cities && filters.cities.length > 0) {
      query = query.in('city_name', filters.cities);
    }
    if (filters.years && filters.years.length > 0) {
      query = query.in('year', filters.years);
    }
    if (filters.employee_name) {
      query = query.ilike('employee_name', `%${filters.employee_name}%`);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// 获取所有可用的城市列表
export async function getAvailableCities(): Promise<string[]> {
  checkSupabase();
  const { data, error } = await supabaseAdmin!
    .from('results')
    .select('city_name')
    .order('city_name');

  if (error) throw error;

  const cities = [...new Set(data?.map(item => item.city_name))];
  return cities.filter(Boolean);
}

// 获取所有可用的年份列表
export async function getAvailableYears(): Promise<string[]> {
  checkSupabase();
  const { data, error } = await supabaseAdmin!
    .from('results')
    .select('year')
    .order('year', { ascending: false });

  if (error) throw error;

  const years = [...new Set(data?.map(item => item.year))];
  return years.filter(Boolean);
}