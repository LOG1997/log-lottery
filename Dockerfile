# 使用官方的 Node 镜像作为基础镜像
FROM node:20.12.2

# 设置工作目录
WORKDIR /usr/src/app

# 将本地的 Vite 项目文件复制到工作目录
COPY . .

# 安装依赖

RUN npm install pnpm -g

RUN pnpm install

# 执行 Vite 构建命令，生成 dist 目录
RUN pnpm build

# 使用 Nginx 镜像作为运行时镜像
FROM nginx:1.26

# 修改nginx配置
# 向 #error_page 前添加内容
# location /log-lottery {
#           alias /usr/share/nginx/log-lottery;
#           index index.html index.htm;
#           try_files $uri $uri/ /log-lottery/index.html;
#         }
RUN sed -i 's/#error_page/location \/log-lottery {\n          alias \/usr\/share\/nginx\/log-lottery;\n          index index.html index.htm;\n          try_files $uri $uri\/ \/log-lottery\/index.html;\n        }\n#error_page/' /etc/nginx/conf.d/default.conf

# 将 Vite 项目的 dist 目录复制到 Nginx 的默认静态文件目录
COPY --from=0 /usr/src/app/dist /usr/share/nginx/log-lottery

# 暴露容器的 80 端口
EXPOSE 80

# Nginx 会在容器启动时自动运行，无需手动设置 CMD
