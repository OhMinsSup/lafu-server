export const GRAPHQL_ENDPOINT = '/graphql';
export const PLAYGROUND_ENDPOINT = '/playground';
export const SUBSCRIPTION_ENDPOINT = '/subscription';

export const IS_DEV_CLIENT =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://lafu-web.io';

export const IS_DEV_SERVER =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000/graphql'
    : 'https://lafu-api.io/graphql';

export const IS_PLAYGROUND = 'http://localhost:4000/playground';
