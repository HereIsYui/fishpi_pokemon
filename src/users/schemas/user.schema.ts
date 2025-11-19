import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  experience: number;

  @Prop({ default: 1000 })
  coins: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastLoginAt?: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  avatar?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);