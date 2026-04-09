# 🚀 部署指南 - 让你的 AI 机器人上线

---

## 方案一：Render（最简单，无需 Git）

Render 支持直接从压缩包部署，全程在浏览器中操作。

### 步骤

1. **创建部署包**（已自动生成 `chat-agent-app-deploy.zip`）

2. **在 Render 部署**
   - 访问 [render.com](https://render.com)，注册/登录
   - 点击 **"New +"** → **"Web Service"**
   - 选择 **"Deploy an existing project from a ZIP file"**
   - 上传 `chat-agent-app-deploy.zip`
   - 配置：
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npx tsx server/index.ts`
   - 添加环境变量：
     ```
     CODEBUDDY_API_KEY = 你的API密钥
     NODE_ENV = production
     ```
   - 点击 **"Create Web Service"**

3. **等待部署完成**（约 2-3 分钟）

4. **获得公网地址** 🎉
   - Render 会分配 `https://xxx.onrender.com` 地址
   - 任何人都可以通过这个地址使用你的机器人

---

## 方案二：Railway（GitHub 仓库部署）

### 前提：需要 Git 和 GitHub 账号

1. **安装 Git**
   - 下载：https://git-scm.com/download/win
   - 安装后重启电脑

2. **推送到 GitHub**
   - 在 GitHub 创建新仓库：https://github.com/new
   - 双击 `deploy-github.bat` 自动推送

3. **在 Railway 部署**
   - 访问 [railway.app](https://railway.app)，用 GitHub 登录
   - **New Project** → **Deploy from GitHub repo**
   - 选择你的仓库
   - 添加环境变量 `CODEBUDDY_API_KEY`
   - 自动获得公网地址

---

## 方案三：Vercel（纯前端 + Serverless）

> ⚠️ 此方案需要重构后端为 Serverless 函数，较复杂

---

## ⚠️ 重要：获取 CODEBUDDY_API_KEY

部署前你需要获取 API Key：

1. 打开终端，运行 `codebuddy login`
2. 登录成功后，API Key 会自动保存在本地
3. 或者在 CodeBuddy 控制台获取 API Key

---

## 📁 关键文件说明

| 文件 | 说明 |
|------|------|
| `Dockerfile` | Docker 容器构建（VPS 部署用） |
| `docker-compose.yml` | Docker Compose 编排 |
| `.env.example` | 环境变量模板 |
| `ecosystem.config.cjs` | PM2 进程管理配置 |
| `start.bat` | Windows 本地生产启动 |
| `deploy-github.bat` | GitHub 推送部署脚本 |

---

## 🔒 安全提醒

- **API Key** 是你的付费凭证，千万不要公开分享
- 公网部署后，任何人都能使用你的 API 额度
- 建议在 `server/index.ts` 中添加用户认证和速率限制
