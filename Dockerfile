# 使用官方的 Node 镜像作为基础镜像
FROM node:22

# 设置工作目录
WORKDIR /usr/src/app

# 将本地的项目文件复制到工作目录
COPY . .

# 安装 pnpm
RUN npm install pnpm -g

# 安装依赖
RUN pnpm install

# 执行构建命令，生成 dist 目录
RUN pnpm build

# 使用 Nginx 镜像作为运行时镜像
FROM nginx:1.26

# 复制自定义 nginx 配置
COPY --from=0 /usr/src/app/dist /usr/share/nginx/html/log-lottery

# 创建自定义 nginx 配置
RUN echo "server {\
    listen 80;\
    server_name localhost;\
    location / {\
        return 301 /log-lottery/;\
    }\
    location /log-lottery {\
        alias /usr/share/nginx/html/log-lottery;\
        index index.html index.htm;\
        try_files \$uri \$uri/ /log-lottery/index.html;\
    }\
}" > /etc/nginx/conf.d/default.conf

# 暴露容器的 80 端口
EXPOSE 80

# Nginx 会在容器启动时自动运行，无需手动设置 CMD