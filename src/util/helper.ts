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

export const emailRegExp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const urlRegExp =
  /^(https?:\/\/)?([a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)(\/[^\s]*)?$/;

export const generateOrderNumber = (): string => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return randomDigits.toString();
};
