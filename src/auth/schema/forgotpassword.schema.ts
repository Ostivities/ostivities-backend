import { Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<ForgotPassword>;

@Schema()
export class ForgotPassword {}
