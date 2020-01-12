# LAFU-SEVER

### Description

애니메이션 사이트 클론 프로젝트

### Stack

-EVN 
 - PM2
 - Webpack

- API
  - GraphQL
    - Apollo Graphql
    - dataloder

  - REST API
    - express router
- DB
  - Postgresql + TypeORM

- cache
  - redis

- AWS
  - ec2, CodeDeploy, S3, RDBS - postgresql

- AUTH
  - JsonWebToken
  - mail

- Video
  - 트랜스코딩

- Typescript
  - express

- CI/CD
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

### Workings