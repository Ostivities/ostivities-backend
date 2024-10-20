import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RevokedDocument = HydratedDocument<Revoked>;

@Schema()
export class Revoked {
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const RevokedSchema = SchemaFactory.createForClass(Revoked);
