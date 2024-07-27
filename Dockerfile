
#使用node作为基础镜像
FROM node:18-alpine AS build
#设置工作目录
WORKDIR /app-management
# 拷贝 package.json 和 package-lock.json 到工作目录
COPY package*.json ./
# 从本地复制 node_modules
COPY node_modules ./node_modules
# 拷贝所有文件到工作目录
COPY . .
# 构建生产环境代码
RUN npm run build
# 暴露容器的 3000 端口
EXPOSE 3000
# 运行 Vue 应用
CMD ["npm", "start"]