# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# 종속성 설치
COPY package.json package-lock.json ./
RUN npm ci

# .env.production → .env 로 복사 (vite는 .env 읽음)
COPY .env.production .env

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# Production stage: Nginx로 정적 파일 서빙
FROM nginx:alpine
RUN apk update && apk add openssl
WORKDIR /usr/share/nginx/html

# 기존 index.html 삭제 (기본 welcome page 방지)
RUN rm -rf ./*

# 빌드된 정적 파일 복사
COPY --from=builder /app/dist ./

# Nginx 설정 복사 (리버스 프록시 설정할 경우 수정 가능)
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN openssl req -x509 \
        -newkey rsa:4096 \
        -days 365 \
        -nodes \
        -out /etc/ssl/certs/cert.pem \
        -keyout /etc/ssl/private/key.pem -sha256 \
        -subj "/C=KR/ST=Seoul/L=Gangnam/O=MyCompany/OU=Dev/CN=example.com"

EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]

