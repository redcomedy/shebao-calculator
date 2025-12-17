# 五险一金计算器

一个基于 Next.js 和 Supabase 的五险一金计算器 Web 应用，支持多城市社保计算。

## 项目特性

- 🏙️ 支持多城市社保标准
- 📊 灵活的工资数据管理
- 🧮 智能社保计算逻辑
- 📱 响应式设计，移动端友好
- 🔍 强大的筛选和排序功能
- 📤 Excel 数据导出功能
- 📅 保留历史计算记录

## 技术栈

- **前端**: Next.js 14 + TypeScript
- **样式**: Tailwind CSS
- **后端**: Supabase (PostgreSQL)
- **文件处理**: xlsx
- **UI组件**: 自定义组件

## 项目结构

```
shebao/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # 主页
│   │   ├── upload/       # 数据上传页
│   │   └── results/      # 结果展示页
│   ├── components/       # 公共组件
│   ├── lib/             # 工具函数和数据库连接
│   └── types/           # TypeScript 类型定义
├── public/              # 静态资源
└── docs/               # 文档
```

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- Git

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd shebao
```

2. 安装依赖
```bash
npm install
```

3. 创建 Supabase 项目
   - 访问 [Supabase](https://supabase.com) 创建新项目
   - 在项目设置中获取 API URL 和 Service Role Key

4. 配置环境变量
```bash
cp .env.example .env.local
```

在 `.env.local` 中填写：
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

5. 创建数据库表
运行 SQL 创建所需表（见 claude.md 中的数据库设计）

6. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

## 使用说明

### 1. 上传城市标准

准备 Excel 文件 `cities.xlsx`，包含以下列：
- city_name: 城市名
- year: 年份
- base_min: 社保基数下限
- base_max: 社保基数上限
- rate: 缴纳比例

### 2. 上传工资数据

准备 Excel 文件 `salaries.xlsx`，包含以下列：
- employee_id: 员工工号
- employee_name: 员工姓名
- month: 年月（YYYYMM格式）
- salary_amount: 工资金额

### 3. 执行计算

1. 选择城市和年份
2. 点击"执行计算"按钮
3. 系统将自动计算并保存结果

### 4. 查看结果

在结果页面可以：
- 按城市、年份、员工姓名筛选
- 对各列进行排序
- 导出为 Excel 文件

## 计算规则

1. **月平均工资计算**
   - 按自然年汇总员工工资
   - 如果数据不足12个月，用实际月份数计算平均

2. **缴费基数确定**
   - 平均工资 < 基数下限 → 使用基数下限
   - 平均工资 > 基数上限 → 使用基数上限
   - 基数下限 ≤ 平均工资 ≤ 基数上限 → 使用平均工资

3. **公司缴纳金额**
   ```
   公司缴纳金额 = 缴费基数 × 缴纳比例
   ```

## API 文档

### 主要 API 端点

- `POST /api/upload/cities` - 上传城市标准
- `POST /api/upload/salaries` - 上传工资数据
- `POST /api/calculate` - 执行计算
- `GET /api/results` - 获取计算结果
- `GET /api/results/export` - 导出 Excel

详细 API 文档请参考 `docs/api.md`

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License