# 极简镜像：仅存放 dist 产物，无多余依赖
FROM scratch

# 将 Actions 构建好的 dist 目录复制到镜像根目录
COPY dist /dist

# 标记工作目录（方便服务器提取）
WORKDIR /dist
