# LAFU-SEVER

### Description

아직 준비중입니다...

### Stack

- API
  - GraphQL
    - graphql-yoga
    - dataloder

  - REST API
    - express router
- DB
  - Postgresql + TypeORM

- cache
  - redis

- AWS
  - es2 or ayncapp

- AUTH
  - JsonWebToken
  - mail

- Video
  - 트랜스코딩

- Typescript
  - express

- CI/CD
  - circle ci
  - tarvis ci

- Tool
  - eslint, perttier

- SSR
  - Graphql SSR

- admin 
  - Svelte


### Database Migration

```bash
  npm run typeorm migration:create -- -n filename
  npm run dev:sync
```

### AWS Serverless Deployment

```base
...준비중
```

### Workings

1. GraphQL 서버 구축및 typeorm 유저 모델 생성 ✅

2. AWS 서버리스 및 Webpack 설정