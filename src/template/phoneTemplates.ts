export const createAuthSMS = (registered: boolean, code: string) => {
  const keywords = registered
    ? {
        text: '로그인'
      }
    : {
        text: '회원가입'
      };

  const body = `lafu 서비스 ${keywords.text}을 하시겠습니까? 인증코드는 ${code}입니다. 해당 인증코드는 24시간동안 유효합니다.`;
  return {
    body
  };
};
