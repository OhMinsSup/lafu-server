import Joi from 'joi';
import { Router } from 'express';
import { getRepository } from 'typeorm';
import { generate } from 'shortid';
import Verification, { VerificationTarget } from '../../../entity/Verification';
import User from '../../../entity/User';
import { createAuthEmail } from '../../../template/emailTemplates';
import { sendMail } from '../../../lib/sendEmail';
import { BAD_REQUEST, NOT_FOUND, CODE_EXPIRED, ALREADY_EXIST } from '../../../config/exection';
import UserProfile, { GenderTarget } from '../../../entity/UserProfile';
import {
  generateToken,
  setTokenCookie,
  setClearTokenCookie,
  decodeToken
} from '../../../lib/tokens';
import social from './social';

const auth = Router();

auth.use('/social', social);

auth.post('/sendEmail', async (req, res) => {
  interface Body {
    email: string;
  }

  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required()
  });

  const result = Joi.validate(req.body, schema);
  if (result.error) {
    return res.status(BAD_REQUEST.status).json({
      payload: {
        name: BAD_REQUEST.name,
        status: result.error.name,
        message: result.error.message
      }
    });
  }

  const { email } = req.body as Body;

  try {
    const user = await getRepository(User).findOne({
      email
    });

    const emailAuth = new Verification();
    emailAuth.code = generate();
    emailAuth.payload = email;
    emailAuth.target = 'EMAIL';
    await getRepository(Verification).save(emailAuth);

    const emailTemplate = createAuthEmail(!!user, emailAuth.code);

    setImmediate(() => {
      sendMail({
        to: email,
        ...emailTemplate,
        from: 'verify@lafu.io'
      });
    });

    return res.status(200).json({
      payload: {
        registered: !!user
      }
    });
  } catch (e) {
    throw e;
  }
});

auth.get('/code/:code', async (req, res) => {
  const code = req.params.code;
  const target = (req.query.target as VerificationTarget) || 'EMAIL';

  if (!code) {
    return res.status(BAD_REQUEST.status).json({
      payload: {
        name: BAD_REQUEST.name,
        status: BAD_REQUEST.status,
        message: 'code값이 없습니다.'
      }
    });
  }

  try {
    const emailAuth = await getRepository(Verification).findOne({
      code,
      target
    });

    if (!emailAuth) {
      return res.status(NOT_FOUND.status).json({
        payload: {
          name: NOT_FOUND.name,
          status: NOT_FOUND.status,
          message: '존재하지않는 코드값입니다.'
        }
      });
    }

    const diff = new Date().getTime() - new Date(emailAuth.created_at).getTime();
    if (diff > 1000 * 60 * 60 * 24 || emailAuth.logged) {
      return res.status(CODE_EXPIRED.status).json({
        payload: {
          name: CODE_EXPIRED.name,
          status: CODE_EXPIRED.status,
          message: '전달된 코드값이 만료 되었습니다.'
        }
      });
    }

    const { payload: email } = emailAuth;
    const user = await getRepository(User).findOne({
      email
    });

    if (!user) {
      // generate register token
      const registerToken = await generateToken(
        {
          email,
          id: emailAuth.id
        },
        { expiresIn: '1h', subject: 'email-register' }
      );

      return res.status(200).json({
        payload: {
          email,
          register_token: registerToken
        }
      });
    } else {
      const profile = await getRepository(UserProfile).findOne({
        fk_user_id: user.id
      });
      if (!profile) return;
      const tokens = await user.generateUserToken();
      setTokenCookie(res, tokens);
      // eslint-disable-next-line require-atomic-updates
      emailAuth.logged = true;
      setImmediate(() => {
        getRepository(Verification).save(emailAuth);
      });

      return res.status(200).json({
        payload: {
          ...user,
          profile,
          tokens: {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken
          }
        }
      });
    }
  } catch (e) {
    throw e;
  }
});

auth.post('/register/local', async (req, res) => {
  interface Body {
    register_token: string;
    form: {
      display_name: string;
      username: string;
      thumbnail: string | null;
      gender: GenderTarget | null;
      birth: string | null;
    };
  }

  interface RegisterToken {
    email: string;
    id: string;
    sub: string;
  }

  const schema = Joi.object().keys({
    register_token: Joi.string().required(),
    form: Joi.object()
      .keys({
        display_name: Joi.string()
          .min(1)
          .max(45)
          .required(),
        username: Joi.string()
          .regex(/^[a-z0-9-_]+$/)
          .min(3)
          .max(16)
          .required(),
        thumbnail: Joi.string()
          .uri()
          .allow(null),
        gender: Joi.string().allow(null),
        birth: Joi.string().allow(null)
      })
      .required()
  });

  const result = Joi.validate(req.body, schema);
  if (result.error) {
    return res.status(BAD_REQUEST.status).json({
      payload: {
        name: BAD_REQUEST.name,
        status: result.error.name,
        message: result.error.message
      }
    });
  }

  const { register_token, form } = req.body as Body;

  let decoded: RegisterToken | null = null;
  try {
    decoded = await decodeToken<RegisterToken>(register_token);
    if (decoded.sub !== 'email-register') {
      return res.status(BAD_REQUEST.status).json({
        payload: {
          name: BAD_REQUEST.name,
          status: BAD_REQUEST.status,
          message: '전달된 토큰값이 이메일 회원가입 토큰이 아닙니다.'
        }
      });
    }
  } catch (e) {
    throw new Error(e);
  }

  const { email, id: codeId } = decoded;
  const exists = await getRepository(User)
    .createQueryBuilder()
    .where('email = :email OR username = :username', { email, username: form.username })
    .getOne();

  if (exists) {
    return res.status(200).json({
      payload: {
        name: ALREADY_EXIST.name,
        status: ALREADY_EXIST.status,
        message: '이미 존재하는 이메일 또는 유저명 입니다.'
      }
    });
  }

  const verificationRepo = getRepository(Verification);
  const verification = await verificationRepo.findOne(codeId);
  if (verification) {
    verification.logged = true;
    await verificationRepo.save(verification);
  }

  const userRepo = getRepository(User);
  const user = new User();
  user.email = email;
  user.username = form.username;
  await userRepo.save(user);

  const profile = new UserProfile();
  profile.fk_user_id = user.id;
  profile.display_name = form.display_name;
  profile.thumbnail = form.thumbnail || null;
  profile.birth = form.birth || null;
  profile.gender = form.gender || 'UNKNOWN';
  await getRepository(UserProfile).save(profile);

  const tokens = await user.generateUserToken();
  setTokenCookie(res, tokens);
  return res.status(200).json({
    payload: {
      ...user,
      profile,
      tokens: {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken
      }
    }
  });
});

auth.get('/check', async (req, res) => {
  return res.status(200).json({
    payload: {
      user_id: res.locals.user_id
    }
  });
});

auth.post('/logout', async (req, res) => {
  setClearTokenCookie(res);
  return res.status(200);
});

export default auth;
