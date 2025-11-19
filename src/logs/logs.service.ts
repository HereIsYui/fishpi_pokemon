import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './schemas/log.schema';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async create(logData: Partial<Log>): Promise<Log> {
    const log = new this.logModel(logData);
    return log.save();
  }

  async findAll(): Promise<Log[]> {
    return this.logModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByUserId(userId: string): Promise<Log[]> {
    return this.logModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Log[]> {
    return this.logModel
      .find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ createdAt: -1 })
      .exec();
  }
}