import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { schemaConfig } from 'src/util/schema.config';

export type FeesDocument = HydratedDocument<Fees>;

@Schema(schemaConfig)
export class Fees {
  @Prop({
    type: Number,
    required: true,
  })
  fee: string;

  @Prop({
    type: [Number, String],
    required: false,
  })
  service_charge: string | number;
}

export const FeesSchema = SchemaFactory.createForClass(Fees);
