import jwt, { SignOptions } from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import User from '../entity/User';

const { SECRET_KEY } = process.env;
if (!SECRET_KEY) {
  const error = new Error('InvalidSecretKeyError');
  error.message = 'Secret key for JWT is missing.';
  if (process.env.npm_lifecycle_event !== 'typeorm') throw error;
}

export const generateToken = (payload: any, options?: SignOptions): Promise<string> => {
  const jwtOptions: SignOptions = {
    issuer: 'lafu.io',
    expiresIn: '7d',
    ...options
  };

  if (!jwtOptions.expiresIn) {
    // removes expiresIn when expiresIn is given as undefined
    delete jwtOptions.expiresIn;
  }

  return new Promise((resolve, reject) => {
    if (!SECRET_KEY) return;
    jwt.sign(payload, SECRET_KEY, jwtOptions, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

export const decodeToken = <T = any>(token: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    if (!SECRET_KEY) return;
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded as any);
    });
  });
};

export function setTokenCookie(
  res: Response,
  tokens: { accessToken: string; refreshToken: string }
) {
  // set cookie
  res.cookie('access_token', tokens.accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    domain: process.env.NODE_ENV === 'development' ? undefined : '.lafu.io'
  });
  res.cookie('refresh_token', tokens.accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    domain: process.env.NODE_ENV === 'development' ? undefined : '.lafu.io'
  });
}

export function setClearTokenCookie(res: Response) {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
}

type TokenData = {
  iat: number;
  exp: number;
  sub: string;
  iss: string;
};

type AccessTokenData = {
  user_id: string;
} & TokenData;

type RefreshTokenData = {
  user_id: string;
  token_id: string;
} & TokenData;

export const refresh = async (req: Request, res: Response, refreshToken: string) => {
  try {
    const decoded = await decodeToken<RefreshTokenData>(refreshToken);
    const user = await getRepository(User).findOne(decoded.user_id);
    if (!user) {
      const error = new Error('InvalidUserError');
      throw error;
    }
    const tokens = await user.refreshUserToken(decoded.token_id, decoded.exp, refreshToken);
    setTokenCookie(res, tokens);
    return decoded.user_id;
  } catch (e) {
    throw e;
  }
};

export const consumeUser = async (req: Request, res: Response, next: NextFunction) => {
  let accessToken: string | undefined = req.cookies['access_token'];
  // tslint:disable-next-line: prefer-const
  let refreshToken: string | undefined = req.cookies['refresh_token'];

  const { authorization } = req.headers;
  if (!accessToken && authorization) {
    accessToken = authorization.split(' ')[1];
  }

  if (!accessToken) {
    res.locals.user_id = null;
    return next();
  }

  try {
    const accessTokenData = await decodeToken<AccessTokenData>(accessToken);
    res.locals.user_id = accessTokenData.user_id;
    const diff = accessTokenData.exp * 1000 - new Date().getTime();
    if (diff < 1000 * 60 * 30 && refreshToken) {
      await refresh(req, res, refreshToken);
    }
  } catch (e) {
    if (!refreshToken) return next();
    try {
      const userId = await refresh(req, res, refreshToken);
      res.locals.user_id = userId;
    } catch (e) {
      throw e;
    }
  }
  next();
};
