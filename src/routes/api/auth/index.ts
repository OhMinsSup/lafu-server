import Joi from 'joi';
import { Router } from 'express';
import { getRepository } from 'typeorm';
import { generate } from 'shortid';
import Verification, { VerificationTarget } from '../../../entity/Verification';
import User from '../../../entity/User';
import { createAuthEmail } from '../../../template/emailTemplates';
import { sendMail } from '../../../lib/sendEmail';
import { BAD_REQUEST, NOT_FOUND, CODE_EXPIRED } from '../../../config/exection';
import UserProfile from '../../../entity/UserProfile';
import { generateToken, setTokenCookie } from '../../../lib/tokens';

const auth = Router();

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

export default auth;
