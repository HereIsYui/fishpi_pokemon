# FishPi Pokemon - 宠物养成游戏后台

## 项目简介

这是一个基于 NestJS 和 MongoDB 的宠物养成游戏后台系统，提供简单的用户登录和完整的宠物养成功能。

## 功能特性

### 用户管理
- 用户注册和登录
- 用户等级和经验值系统
- 用户金币系统

### 宠物系统
- 多种宠物类型（猫、狗、鸟、鱼、兔子）
- 宠物养成系统（喂食、玩耍、睡眠、治疗）
- 宠物状态管理（健康、饥饿、快乐、能量）
- 宠物等级和经验值系统
- 实时状态更新

### 日志系统
- 用户请求日志记录
- 性能监控（响应时间）
- 错误日志追踪
- 日志查询和分析

## 技术栈

- **后端框架**: NestJS 10.0+
- **数据库**: MongoDB (Mongoose)
- **语言**: TypeScript
- **密码加密**: bcrypt
- **数据验证**: class-validator
- **日志系统**: NestJS 内置 Logger
- **API 文档**: 内置代码注释

## 环境配置

### 数据库要求

- MongoDB 4.4+
- 确保MongoDB服务正在运行

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制config示例文件：

```bash
cp config.example.json config.json
```

编辑 `config.json` 文件，配置数据库连接。

### 3. 启动数据库

确保MongoDB服务正在运行：

```bash
# macOS使用Homebrew
brew services start mongodb-community

# 或者使用systemd (Linux)
sudo systemctl start mongod

# 或者直接运行
mongod
```

### 4. 运行应用

开发模式：
```bash
npm run start:dev
```

生产模式：
```bash
npm run build
npm run start:prod
```

## API 文档

### 用户认证

#### 用户注册
```
POST /users/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

响应：
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com",
    "level": 1,
    "experience": 0,
    "coins": 1000,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 用户登录
```
POST /users/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

响应：
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com",
    "level": 1,
    "experience": 0,
    "coins": 1000,
    "lastLoginAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 用户管理

#### 获取用户信息
```
GET /users/:id
```

#### 更新用户信息
```
PATCH /users/:id
Content-Type: application/json

{
  "username": "new_username",
  "avatar": "new_avatar_url"
}
```

#### 增加用户经验值
```
PATCH /users/:id/experience?experience=50
```

#### 增加用户金币
```
PATCH /users/:id/coins?coins=100
```

#### 获取所有用户
```
GET /users
```

#### 通过邮箱查找用户
```
GET /users/email/:email
```

### 宠物管理

#### 创建宠物
```
POST /pets
Content-Type: application/json

{
  "name": "小猫",
  "type": "cat",
  "userId": "user_id_here"
}
```

#### 获取用户宠物列表
```
GET /pets/user/:userId
```

#### 获取宠物统计信息
```
GET /pets/:id/stats
```

#### 更新宠物信息
```
PATCH /pets/:id
Content-Type: application/json

{
  "name": "新名字",
  "level": 2
}
```

#### 宠物交互

喂食宠物：
```
POST /pets/:id/feed
```

和宠物玩耍：
```
POST /pets/:id/play
```

让宠物睡觉：
```
POST /pets/:id/sleep
```

治疗宠物：
```
POST /pets/:id/heal
```

#### 获取所有宠物
```
GET /pets
```

#### 获取宠物类型列表
```
GET /pets/types
```

### 日志管理

#### 获取所有日志
```
GET /logs
```

#### 按用户ID获取日志
```
GET /logs/user/:userId
```

#### 按日期范围获取日志
```
GET /logs/date-range?startDate=2024-01-01&endDate=2024-01-31
```

## 数据模型

### 用户模型 (User)

```typescript
{
  username: string;
  email: string;
  password: string; // 加密存储
  level: number;
  experience: number;
  coins: number;
  isActive: boolean;
  lastLoginAt: Date;
  avatar?: string;
  createdAt: Date;
}
```

### 宠物模型 (Pet)

```typescript
{
  name: string;
  type: 'cat' | 'dog' | 'bird' | 'fish' | 'rabbit';
  userId: string;
  level: number;
  experience: number;
  health: number; // 0-100
  hunger: number; // 0-100
  happiness: number; // 0-100
  energy: number; // 0-100
  status: 'active' | 'sleeping' | 'sick' | 'happy' | 'hungry';
  lastFed: Date;
  lastPlayed: Date;
  lastSlept: Date;
  battlesWon: number;
  battlesLost: number;
  avatar?: string;
  is_active: boolean;
}
```

### 日志模型 (Log)

```typescript
{
  userId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  ip: string;
  userAgent: string;
  requestBody?: any;
  responseTime?: number;
  errorMessage?: string;
  createdAt: Date;
}
```

## 项目结构

```
src/
├── app.module.ts              # 应用主模块 - 模块依赖配置
├── main.ts                    # 应用入口 - 使用 NestJS Logger 替代 console.log
├── config/                    # 配置文件
│   ├── config-loader.ts       # 配置加载器
│   ├── database.config.ts     # 数据库配置
│   ├── server.config.ts       # 服务器配置
│   └── index.ts               # 配置导出
├── users/                     # 用户模块
│   ├── users.controller.ts    # 用户控制器 - 完整注释
│   ├── users.module.ts       # 用户模块定义
│   ├── users.service.ts      # 用户服务 - TypeScript 类型安全优化
│   ├── schemas/
│   │   └── user.schema.ts    # 用户数据模型
│   └── dto/
│       └── update-user.dto.ts # 用户更新 DTO
├── pets/                      # 宠物模块
│   ├── pets.controller.ts    # 宠物控制器 - 完整注释
│   ├── pets.module.ts       # 宠物模块定义
│   ├── pets.service.ts      # 宠物服务 - 类型安全优化
│   ├── schemas/
│   │   └── pet.schema.ts    # 宠物数据模型
│   └── dto/
│       ├── create-pet.dto.ts  # 宠物创建 DTO
│       └── update-pet.dto.ts # 宠物更新 DTO
├── logs/                      # 日志模块
│   ├── logs.controller.ts    # 日志控制器
│   ├── logs.module.ts       # 日志模块定义
│   ├── logs.service.ts      # 日志服务
│   └── schemas/
│       └── log.schema.ts    # 日志数据模型
└── common/                    # 公共模块
    ├── interceptors/
    │   └── logging.interceptor.ts # 全局日志拦截器 - 使用 NestJS Logger
    └── pipes/
        └── date.pipe.ts      # 日期管道
```

### 核心文件说明

- **main.ts**: 应用启动文件，使用 NestJS Logger 替代原始 console.log
- **logging.interceptor.ts**: 全局日志拦截器，自动记录所有 HTTP 请求
- **pets.service.ts**: 宠物服务，包含完整的业务逻辑和类型安全优化
- **users.service.ts**: 用户服务，已优化 TypeScript 类型定义
- **所有控制器文件**: 添加了完整的 JSDoc 注释和 API 文档

### 架构特点

- **模块化设计**: 清晰的功能模块划分
- **依赖注入**: NestJS 内置的依赖注入机制
- **中间件支持**: 全局管道和拦截器配置
- **配置管理**: 集中化的配置文件管理
- **类型安全**: 全面的 TypeScript 类型定义

## 安全注意事项

1. 确保数据库连接安全
2. 在生产环境中使用HTTPS
3. 定期备份数据库
4. 监控API访问日志
5. 实施适当的访问控制

## 认证说明

本项目使用简单的用户名/密码认证：

1. **用户注册**：提供用户名、邮箱和密码
2. **用户登录**：使用邮箱和密码进行身份验证
3. **密码安全**：使用bcrypt进行密码加密存储
4. **会话管理**：客户端需要在后续请求中携带用户ID

**注意**：此版本不包含JWT token或其他会话管理机制。客户端在登录成功后需要存储用户ID，并在后续API请求中通过查询参数或请求体传递用户ID进行身份识别。

## 许可证

MIT License