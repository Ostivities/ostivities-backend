import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GuestDocument = HydratedDocument<Guests>;

export class Guests {}

export const GuestSchema = SchemaFactory.createForClass(Guests);
