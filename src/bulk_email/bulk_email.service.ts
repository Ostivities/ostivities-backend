import * as brevo from '@getbrevo/brevo';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { BulkEmailDto } from './dto/email.dto';

@Injectable()
export class BulkEmailService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async sendBulkEmail(dto: BulkEmailDto, userId?: string): Promise<any> {
    if (userId) {
      const userData = await this.userModel.findById(userId);
      if (!userData) {
        throw new Error('User not found');
      }
    }

    try {
      const apiInstance: any = new brevo.TransactionalEmailsApi();

      const apiKey = apiInstance.authentications['apiKey'];
      apiKey.apiKey = process.env.SEND_IN_BLUE_EMAIL_API_KEY;

      const sendSmtpEmail = new brevo.SendSmtpEmail();

      sendSmtpEmail.subject = `${dto.email_subject}`;
      sendSmtpEmail.htmlContent = dto.email_content;
      sendSmtpEmail.sender = {
        name: dto.sender_name,
        email: dto.sender_email,
      };
      sendSmtpEmail.to = [...dto.receipients];
      sendSmtpEmail.replyTo = {
        email: dto.reply_to ? dto.reply_to : process.env.SMTP_NO_REPLY,
        name: dto.sender_name,
      };
      //   sendSmtpEmail.headers = { 'Some-Custom-Name': 'unique-id-1234' };
      sendSmtpEmail.params = {
        parameter: `Hi`,
        subject: dto.email_subject,
      };

      // sendSmtpEmail.attachment = dto.email_attachment;

      await apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data: any) {
          console.log('API called successfully. Returned data: ', data);
        },
        function (error: any) {
          console.error(error, 'error');
        },
      );
    } catch (error) {
      return error;
    }
  }
}
