import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PetDocument = Pet & Document;

export enum PetType {
  FISH = "fish",
  CAT = "cat",
}

export enum PetStatus {
  ACTIVE = "active",
  SLEEPING = "sleeping",
  SICK = "sick",
  HAPPY = "happy",
  HUNGRY = "hungry",
}

@Schema({ timestamps: true })
export class Pet {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: PetType })
  type: PetType;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  experience: number;

  @Prop({ default: 100 })
  health: number;

  @Prop({ default: 100 })
  hunger: number;

  @Prop({ default: 100 })
  happiness: number;

  @Prop({ default: 100 })
  energy: number;

  @Prop({ default: PetStatus.ACTIVE, enum: PetStatus })
  status: PetStatus;

  @Prop({ default: Date.now })
  lastFed: Date;

  @Prop({ default: Date.now })
  lastPlayed: Date;

  @Prop({ default: Date.now })
  lastSlept: Date;

  @Prop()
  avatar?: string;

  @Prop({ default: 0 })
  battlesWon: number;

  @Prop({ default: 0 })
  battlesLost: number;

  @Prop({ default: true })
  is_active: boolean;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
