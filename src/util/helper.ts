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

export const getFormattedDate = (): string => {
  const date = new Date();

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  const getOrdinalSuffix = (day: number): string => {
    const exceptions = [11, 12, 13];
    if (exceptions.includes(day % 100)) return 'th'; // Handles 11th, 12th, 13th as exceptions
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
};

export const formatNumber = (value: number | string): string => {
  const number = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(number)) return '0.00';

  // Format number with two decimal places and comma separators
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
