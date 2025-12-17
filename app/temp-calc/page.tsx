'use client';

import { useState } from 'react';

export default function TempCalcPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    setResult(null);

    try {
      // 直接插入示例计算结果
      const response = await fetch('/api/init-data', {
        method: 'POST'
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // 3秒后跳转到结果页面
        setTimeout(() => {
          window.location.href = '/results';
        }, 3000);
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">快速计算测试</h1>
        <p className="text-gray-600 mb-6">
          点击下面的按钮初始化示例数据并执行计算
        </p>

        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full px-4 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '处理中...' : '执行计算（佛山 2024）'}
        </button>

        {result && (
          <div className={`mt-6 p-4 rounded-lg ${
            result.success
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}>
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/" className="text-primary-600 hover:text-primary-700">
            返回主页
          </a>
          {' | '}
          <a href="/results" className="text-primary-600 hover:text-primary-700">
            查看结果
          </a>
        </div>
      </div>
    </div>
  );
}