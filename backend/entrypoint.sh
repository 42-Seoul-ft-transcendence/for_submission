#!/bin/sh

# .env 파일 로딩 (자동으로 로딩되지 않는 환경 대비)
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# DB 마이그레이션 (DATABASE_URL 필요)
npx prisma migrate deploy

# 앱 실행
exec node dist/main.js
