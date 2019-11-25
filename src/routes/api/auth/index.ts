import Joi from 'joi';
import { Router } from 'express';
import { getRepository } from 'typeorm';
import { generate } from 'shortid';
import Verification from '../../../entity/Verification';
import User from '../../../entity/User';
import { createAuthEmail } from '../../../template/emailTemplates';
import { sendMail } from '../../../lib/sendEmail';
import { sendVerificationSMS } from '../../../lib/sendSMS';

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
    return res.status(400).json({
      name: '잘못된 파라미터',
      payload: {
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

    res.status(200).json({
      payload: {
        registered: !!user
      }
    });
  } catch (e) {
    throw e;
  }
});

auth.post('/sendPhone', async (req, res) => {
  interface Body {
    phone: string;
  }

  const schema = Joi.object().keys({
    phone: Joi.string().required()
  });

  const result = Joi.validate(req.body, schema);
  if (result.error) {
    return res.status(400).json({
      name: '잘못된 파라미터',
      payload: {
        status: result.error.name,
        message: result.error.message
      }
    });
  }

  const { phone } = req.body as Body;

  try {
    const user = await getRepository(User).findOne({
      phoneNumber: phone
    });

    const phoneAuth = new Verification();
    phoneAuth.code = generate();
    phoneAuth.payload = phone;
    phoneAuth.target = 'PHONE';
    await getRepository(Verification).save(phoneAuth);

    setImmediate(() => {
      sendVerificationSMS(!!user, phone, phoneAuth.code);
    });

    res.status(200).json({
      payload: {
        registered: !!user
      }
    });
  } catch (e) {
    throw e;
  }
});

export default auth;
