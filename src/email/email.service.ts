import * as brevo from '@getbrevo/brevo';
import { EmailDto } from './dto/email.dto';

export const EmailService = async (emailDto: EmailDto) => {
  console.log(emailDto);
  const apiInstance: any = new brevo.TransactionalEmailsApi();

  const apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.SEND_IN_BLUE_EMAIL_API_KEY;

  console.log({
    key: process.env.SEND_IN_BLUE_EMAIL_API_KEY,
    email: process.env.SMTP_SENDER_EMAIL,
    s: process.env.SMTP_SENDER_NAME,
  });

  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = `${emailDto.subject}`;
  sendSmtpEmail.htmlContent = emailDto.htmlContent;
  sendSmtpEmail.sender = {
    name: process.env.SMTP_SENDER_NAME,
    email: process.env.SMTP_SENDER_EMAIL,
  };
  sendSmtpEmail.to = [{ email: emailDto.email, name: emailDto.name }];
  sendSmtpEmail.replyTo = {
    email: process.env.SMTP_SENDER_EMAIL,
    name: process.env.SMTP_SENDER_NAME,
  };
  //   sendSmtpEmail.headers = { 'Some-Custom-Name': 'unique-id-1234' };
  sendSmtpEmail.params = {
    parameter: `Hi &#128075; ${emailDto.name}`,
    subject: emailDto.subject,
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log(
        'API called successfully. Returned data: ' + JSON.stringify(data),
      );
    },
    function (error) {
      console.error(error, 'error');
    },
  );
};
