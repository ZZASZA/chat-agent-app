# 多阶段构建

# 阶段 1：构建前端
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 阶段 2：生产运行
FROM node:22-alpine AS runner
WORKDIR /app

# 安装 tsx 用于运行 TypeScript 服务器
RUN npm install -g tsx

COPY package*.json ./
RUN npm ci --omit=dev

# 从构建阶段复制前端产物
COPY --from=builder /app/dist ./dist
COPY server ./server
COPY data ./data

# 环境变量
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["tsx", "server/index.ts"]
