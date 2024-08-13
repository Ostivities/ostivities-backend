export const otpGenerator = (): string => {
  const otp = (Math.floor(Math.random() * 900000) + 100000).toString();
  return otp;
};

export const generateDiscountCode = (length: number = 5): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};
