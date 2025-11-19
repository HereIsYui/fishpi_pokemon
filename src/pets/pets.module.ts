import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pet, PetSchema } from './schemas/pet.schema';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }]),
  ],
  providers: [PetsService],
  controllers: [PetsController],
  exports: [PetsService],
})
export class PetsModule {}