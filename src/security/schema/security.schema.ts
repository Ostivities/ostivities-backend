import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { schemaConfig } from 'src/util/schema.config';

export type SecurityDocument = HydratedDocument<Security>;

@Schema(schemaConfig)
export class Security {
  @Prop({ required: true, unique: true })
  publicKey: string;

  @Prop({ required: true })
  secretKey: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    unique: true,
  })
  user: mongoose.Schema.Types.ObjectId;
}

export const SecuritySchema = SchemaFactory.createForClass(Security);
