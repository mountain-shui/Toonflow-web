# 阶段1：构建 Vite 静态产物
FROM node:20-alpine AS build-stage
WORKDIR /app
# 复制依赖文件，优先装依赖（利用镜像缓存）
COPY package.json package-lock.json ./
RUN npm ci --registry=https://registry.npmmirror.com
# 复制全部代码
COPY . .
# 构建生产产物（注意：若有环境变量，需提前配置）
RUN npm run build

# 阶段2：用 Nginx 托管静态文件
FROM nginx:alpine AS production-stage
# 复制构建产物到 Nginx 静态目录
COPY --from=build-stage /app/dist /usr/share/nginx/html
# 可选：替换 Nginx 配置（解决前端路由刷新404问题）
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 暴露端口
EXPOSE 8888
# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]