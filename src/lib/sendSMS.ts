import Twilio from 'twilio';
import { createAuthSMS } from '../template/phoneTemplates';

const { TWILIO_SID, TWILIO_TOKEN, TWILIO_PHONE } = process.env;
if (!TWILIO_SID || !TWILIO_TOKEN || TWILIO_PHONE) {
  const error = new Error('Invalid TWILIO_SID & TWILIO_TOKEN & TWILIO_PHONE Error');
  error.message = 'TWILIO_SID,TWILIO_TOKEN,TWILIO_PHONE is missing.';
  throw error;
}

const twilioClient = Twilio(TWILIO_SID, TWILIO_TOKEN);

const sendSMS = (to: string, body: string) => {
  return twilioClient.messages.create({
    body,
    to,
    from: TWILIO_PHONE
  });
};

export const sendVerificationSMS = (registered: boolean, to: string, code: string) => {
  const { body } = createAuthSMS(registered, code);
  return sendSMS(to, body);
};
