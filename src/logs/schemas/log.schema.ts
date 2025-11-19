import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  endpoint: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  statusCode: number;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  requestBody?: Record<string, unknown>;

  @Prop()
  responseTime?: number;

  @Prop()
  errorMessage?: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);