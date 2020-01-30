# LAFU-SEVER

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
  - EC2
  - CodeDeploy
  - AutoScaling
  - Elastic Load Balancing
  - RDBS 
    - postgresql
- AUTH
  - JsonWebToken
  - nodemailer
  - social
    - google
    - facebook
    - github 

- Video/Image Upload
  -  Cloudinary

- Typescript
  - express

- CI/CD
  - tarvis ci

- Tool
  - eslint
  - perttier

### Database Migration

```bash
  npm run typeorm migration:create -n filename
  npm run dev:sync
```

### Workings