# LAFU-SEVER

### Description

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
  - 트랜스코딩 (Cloudinary)

- Typescript
  - express

- CI/CD
  - tarvis ci

- Tool
  - eslint, perttier

- SSR
  - Graphql SSR



### Database Migration

```bash
  npm run typeorm migration:create -n filename
  npm run dev:sync
```

### Workings