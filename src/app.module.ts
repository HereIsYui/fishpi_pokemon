import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PetsModule } from './pets/pets.module';
import { LogsModule } from './logs/logs.module';
import { databaseConfig } from './config';

/**
 * 应用根模块
 * 
 * 模块结构：
 * - MongooseModule: MongoDB数据库连接
 * - UsersModule: 用户管理功能模块
 * - PetsModule: 宠物养成功能模块
 * - LogsModule: 系统日志记录模块
 * 
 * 模块职责：
 * - 组织应用程序的依赖关系
 * - 配置全局数据库连接
 * - 注册所有功能模块
 */
@Module({
  imports: [
    // MongoDB数据库连接，使用配置文件中的URI
    MongooseModule.forRoot(databaseConfig.mongodb.uri),
    
    // 功能模块注册
    UsersModule,    // 用户管理模块
    PetsModule,     // 宠物养成模块
    LogsModule,     // 日志记录模块
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}