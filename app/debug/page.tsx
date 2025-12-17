'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [envInfo, setEnvInfo] = useState<any>(null);

  useEffect(() => {
    // 在客户端显示环境变量
    setEnvInfo({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
      NODE_ENV: process.env.NODE_ENV,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">调试信息</h1>

        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">环境变量状态：</h2>
            <pre className="bg-gray-100 p-4 rounded mt-2">
              {JSON.stringify(envInfo, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="font-semibold">Supabase URL：</h2>
            <p className="text-sm text-gray-600 mt-2">
              {process.env.NEXT_PUBLIC_SUPABASE_URL || '未设置'}
            </p>
          </div>

          <div>
            <h2 className="font-semibold">调试步骤：</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>检查 Vercel 控制台的环境变量设置</li>
              <li>确保三个环境变量都已设置</li>
              <li>重新部署项目</li>
              <li>访问 /api/health 查看健康状态</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}