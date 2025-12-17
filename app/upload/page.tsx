'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { parseCitiesExcel, parseSalariesExcel, generateCitiesTemplate, generateSalariesTemplate } from '@/lib/excel';
import { validateCityData, validateSalaryData } from '@/lib/calculator';
import { CityUpload, SalaryUpload } from '@/types';

export default function UploadPage() {
  const [uploadingCities, setUploadingCities] = useState(false);
  const [uploadingSalaries, setUploadingSalaries] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCitiesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCities(true);
    setMessage(null);

    try {
      const buffer = await file.arrayBuffer();
      const citiesData = parseCitiesExcel(buffer);

      const validation = validateCityData(citiesData);
      if (!validation.isValid) {
        showMessage('error', `数据验证失败：\n${validation.errors.join('\n')}`);
        return;
      }

      const response = await fetch('/api/upload/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cities: citiesData }),
      });

      const result = await response.json();

      if (result.success) {
        showMessage('success', `成功上传 ${citiesData.length} 条城市数据！`);
        e.target.value = '';
        // 更新城市列表
        loadCitiesAndYears();
      } else {
        showMessage('error', result.error || '上传失败');
      }
    } catch (error) {
      console.error('Error uploading cities:', error);
      showMessage('error', '上传失败，请检查文件格式');
    } finally {
      setUploadingCities(false);
    }
  };

  const handleSalariesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSalaries(true);
    setMessage(null);

    try {
      const buffer = await file.arrayBuffer();
      const salariesData = parseSalariesExcel(buffer);

      const validation = validateSalaryData(salariesData);
      if (!validation.isValid) {
        showMessage('error', `数据验证失败：\n${validation.errors.join('\n')}`);
        return;
      }

      const response = await fetch('/api/upload/salaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ salaries: salariesData }),
      });

      const result = await response.json();

      if (result.success) {
        showMessage('success', `成功上传 ${salariesData.length} 条工资数据！`);
        e.target.value = '';
      } else {
        showMessage('error', result.error || '上传失败');
      }
    } catch (error) {
      console.error('Error uploading salaries:', error);
      showMessage('error', '上传失败，请检查文件格式');
    } finally {
      setUploadingSalaries(false);
    }
  };

  const handleCalculate = async () => {
    if (!selectedCity || !selectedYear) {
      showMessage('error', '请选择城市和年份');
      return;
    }

    setCalculating(true);
    setMessage(null);

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city_name: selectedCity,
          year: selectedYear,
        }),
      });

      const result = await response.json();

      if (result.success) {
        showMessage('success', `计算完成！共计算 ${result.data.count} 位员工的社保费用`);
      } else {
        showMessage('error', result.error || '计算失败');
      }
    } catch (error) {
      console.error('Error calculating:', error);
      showMessage('error', '计算失败，请重试');
    } finally {
      setCalculating(false);
    }
  };

  const loadCitiesAndYears = async () => {
    try {
      const [citiesResponse, yearsResponse] = await Promise.all([
        fetch('/api/cities'),
        fetch('/api/years')
      ]);

      const citiesData = await citiesResponse.json();
      const yearsData = await yearsResponse.json();

      if (citiesData.success) {
        const cities = citiesData.data as any[];
        const uniqueCities = [...new Set(cities.map((c: any) => c.city_name))];
        setCities(uniqueCities);
      }

      if (yearsData.success) {
        const years = yearsData.data as string[];
        const uniqueYears = [...new Set(years)];
        setYears(uniqueYears.sort((a: string, b: string) => b.localeCompare(a)));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const downloadTemplate = async (type: 'cities' | 'salaries') => {
    try {
      const arrayBuffer = type === 'cities'
        ? generateCitiesTemplate()
        : generateSalariesTemplate();

      const blob = new Blob([arrayBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type === 'cities' ? '城市标准模板' : '工资数据模板'}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading template:', error);
      showMessage('error', '下载模板失败');
    }
  };

  // 页面加载时获取城市和年份列表
  useEffect(() => {
    loadCitiesAndYears();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回主页
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">数据上传与管理</h1>
              <p className="mt-1 text-gray-600">上传城市标准和工资数据，执行社保计算</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Message Alert */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {message.type === 'success' ? (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium whitespace-pre-line">
                    {message.text}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-8">
            {/* 城市标准上传 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">上传城市社保标准</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  上传包含城市社保标准的 Excel 文件。文件应包含：城市名、年份、基数下限、基数上限、缴纳比例。
                </p>
                <div className="flex items-center space-x-4">
                  <label className="relative cursor-pointer bg-white rounded-lg font-medium text-primary-600 hover:text-primary-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                    <span>选择文件</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".xlsx,.xls"
                      onChange={handleCitiesUpload}
                      disabled={uploadingCities}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => downloadTemplate('cities')}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    下载模板文件
                  </button>
                  {uploadingCities && (
                    <span className="text-primary-600">上传中...</span>
                  )}
                </div>
              </div>
            </div>

            {/* 工资数据上传 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">上传员工工资数据</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  上传包含员工工资数据的 Excel 文件。文件应包含：员工工号、员工姓名、年月（YYYYMM）、工资金额。
                </p>
                <div className="flex items-center space-x-4">
                  <label className="relative cursor-pointer bg-white rounded-lg font-medium text-primary-600 hover:text-primary-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                    <span>选择文件</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".xlsx,.xls"
                      onChange={handleSalariesUpload}
                      disabled={uploadingSalaries}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => downloadTemplate('salaries')}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    下载模板文件
                  </button>
                  {uploadingSalaries && (
                    <span className="text-primary-600">上传中...</span>
                  )}
                </div>
              </div>
            </div>

            {/* 执行计算 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">执行社保计算</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  选择城市和年份，系统将自动计算每位员工的社保费用。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      选择城市
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      disabled={calculating}
                    >
                      <option value="">请选择城市</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      选择年份
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      disabled={calculating}
                    >
                      <option value="">请选择年份</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleCalculate}
                  disabled={calculating || !selectedCity || !selectedYear}
                  className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {calculating ? '计算中...' : '执行计算'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}