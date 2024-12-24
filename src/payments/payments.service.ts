import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Events } from '../event/schema/event.schema';
import { Model } from 'mongoose';
import { User } from '../auth/schema/auth.schema';
import { HttpService } from '@nestjs/axios';
import { InitiatePaymentDto } from './dto/payments.dto';
import { firstValueFrom } from 'rxjs';
import { Payments } from './schema/payments.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Events.name) private eventModel: Model<Events>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Payments.name) private paymentModel: Model<Payments>,
    private readonly httpService: HttpService,
  ) {}

  async initiatePayment(dto: InitiatePaymentDto) {
    const userData = await this.userModel.findById({ _id: dto.user_id });

    const eventData = await this.eventModel.findOne({
      unique_key: dto.event_unique_key,
    });

    if (!userData) {
      throw new ForbiddenException('User not found');
    }

    if (!eventData) {
      throw new BadRequestException('Event not found');
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${process.env.OSTIVITIES_PAYSTACK_API_BASE_URL}/transaction/initialize`,
          { email: dto.email, amount: dto.amount },
          {
            headers: {
              Authorization: `Bearer ${process.env.OSTIVITIES_PAYSTACK_SECRET_KEY}`,
            },
          },
        ),
      );
      console.log(data, 'data');
      // Update payment model
      if (data) {
        const payment = new this.paymentModel({
          user: dto.user_id,
          event: eventData?._id,
          amount: dto.amount,
          payment_reference: data.data.reference,
          status: 'pending',
        });
        await payment.save();
      }

      return data;
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }

  async validatePayment(reference: string) {
    const payment = await this.paymentModel.findOne({
      payment_reference: reference,
    });

    if (!payment) {
      throw new ForbiddenException('Invalid payment reference');
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${process.env.OSTIVITIES_PAYSTACK_API_BASE_URL}/transaction/verify/${reference}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.OSTIVITIES_PAYSTACK_SECRET_KEY}`,
            },
          },
        ),
      );
      if (data) {
        await this.paymentModel.updateOne({
          payment_reference: reference,
          status: data?.data?.status,
          meta_data: data?.data,
        });
      }
      return { data, message: `Payment of ${payment.amount} was successful.` };
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }
}
