# 抽奖系统后端服务

这是一个基于 Node.js + SQLite 的轻量级后端服务，用于存储抽奖系统的数据，实现跨浏览器/设备数据共享。

## 安装

```bash
cd server
npm install
```

## 启动服务

```bash
# 生产模式
npm start

# 开发模式（自动重启）
npm run dev
```

服务将在 `http://localhost:3456` 启动。

## API 接口

### 主题管理
- `GET /api/themes` - 获取所有主题
- `GET /api/themes/:id` - 获取单个主题
- `POST /api/themes` - 创建主题
- `PUT /api/themes/:id` - 更新主题
- `DELETE /api/themes/:id` - 删除主题

### 人员配置
- `GET /api/themes/:themeId/person` - 获取人员配置
- `POST /api/themes/:themeId/person` - 保存人员配置

### 奖品配置
- `GET /api/themes/:themeId/prize` - 获取奖品配置
- `POST /api/themes/:themeId/prize` - 保存奖品配置

### 全局配置
- `GET /api/themes/:themeId/global` - 获取全局配置
- `POST /api/themes/:themeId/global` - 保存全局配置

## 数据存储

数据存储在 `server/lottery.db` SQLite 数据库文件中。

## 注意事项

1. 如果后端服务未启动，前端会自动降级使用 localStorage 存储
2. 建议在同一局域网内使用，确保所有设备都能访问后端服务
3. 如需外网访问，请配置相应的端口转发或使用 ngrok 等工具
