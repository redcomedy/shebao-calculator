'use client';

import { useState } from 'react';

export default function InitDatabasePage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleInit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/init-database', {
        method: 'POST'
      });
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">初始化数据库</h1>

        <button
          onClick={handleInit}
          disabled={loading}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '初始化中...' : '初始化数据库'}
        </button>

        {result && (
          <div className={`p-4 rounded ${
            result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <h3 className="font-semibold mb-2">
              {result.success ? '成功' : '失败'}
            </h3>
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6">
          <a href="/" className="text-blue-600 hover:text-blue-700">
            返回主页
          </a>
          {' | '}
          <a href="/upload" className="text-blue-600 hover:text-blue-700">
            前往上传页
          </a>
        </div>
      </div>
    </div>
  );
}