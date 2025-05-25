# 🏗️ NestJS MSA (마이크로서비스 아키텍처)

완전히 독립적인 마이크로서비스들로 구성된 프로젝트입니다.

## 📁 프로젝트 구조

```
nest.js-msa-monorepo/
├── apps/
│   ├── api-gateway/      # API 게이트웨이 (포트: 3000)
│   ├── user-service/     # 사용자 관리 서비스 (포트: 3001)
│   └── post-service/     # 게시글 관리 서비스 (포트: 3002)
└── package.json          # 서비스 오케스트레이션
```

## 🚀 실행 방법

### **🎯 루트에서 통합 관리 (권장)**

```bash
# 1. 모든 서비스 의존성 설치
yarn install:all

# 2. 모든 서비스 동시 실행 (개발 모드)
yarn dev
# 또는
yarn start:all

# 3. 개별 서비스 실행
yarn start:user    # User Service만
yarn start:post    # Post Service만
yarn start:api     # API Gateway만

# 4. 프로덕션 빌드 & 실행
yarn prod
```

### **📋 기타 유용한 명령어**

```bash
# 모든 서비스 빌드
yarn build:all

# 모든 서비스 테스트
yarn test:all

# 모든 서비스 린트
yarn lint:all

# 모든 서비스 클린
yarn clean:all

# 초기 설정 (의존성 설치 + 빌드)
yarn setup
```

### **🔧 개별 서비스 실행 (필요시)**

```bash
# User Service
cd apps/user-service
yarn install
yarn start:dev

# Post Service
cd apps/post-service
yarn install
yarn start:dev

# API Gateway
cd apps/api-gateway
yarn install
yarn start:dev
```

## 🔧 서비스 독립성

- **완전 독립**: 각 서비스는 고유한 `package.json`, `node_modules` 보유
- **독립 배포**: 서비스별로 개별 빌드/배포 가능
- **기술 스택 자유도**: 서비스마다 다른 버전/라이브러리 사용 가능
- **팀 독립성**: 서비스별로 다른 팀이 개발 가능
- **통합 관리**: 루트에서 모든 서비스를 편리하게 관리

## 📡 서비스 간 통신

- **방식**: TCP Transport (NestJS Microservices)
- **API Gateway**: 클라이언트 요청의 유일한 진입점
- **인증**: JWT 토큰 기반

## 🔗 API 엔드포인트

### **사용자 관리**

- `POST /api/users/register` - 사용자 등록
- `POST /api/users/login` - 로그인
- `GET /api/users/profile` - 프로필 조회
- `PUT /api/users/profile` - 프로필 수정

### **게시글 관리**

- `POST /api/posts` - 게시글 작성
- `GET /api/posts` - 게시글 목록 (페이징)
- `GET /api/posts/:id` - 게시글 상세
- `PUT /api/posts/:id` - 게시글 수정
- `DELETE /api/posts/:id` - 게시글 삭제

## 🐳 Docker 배포 (향후 계획)

각 서비스를 독립적인 Docker 컨테이너로 배포할 수 있습니다.

```bash
# 각 서비스별 Dockerfile 생성 예정
# docker-compose.yml로 전체 시스템 관리 예정
```
