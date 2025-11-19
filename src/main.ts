import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { LogsModule } from './logs/logs.module';
import { LogsService } from './logs/logs.service';
import { serverConfig } from './config';

/**
 * 应用程序启动函数
 * 
 * 主要职责：
 * - 创建NestJS应用实例
 * - 配置全局中间件和管道
 * - 启动HTTP服务器
 * 
 * 配置特性：
 * - 全局数据验证管道
 * - 全局日志记录拦截器
 * - CORS跨域支持
 * - 从配置文件中读取服务器设置
 */
async function bootstrap() {
  // 创建NestJS应用实例
  const app = await NestFactory.create(AppModule);
  
  // 创建应用级别的Logger实例
  const logger = new Logger('Bootstrap');
  
  // 全局验证管道 - 自动验证请求数据
  app.useGlobalPipes(new ValidationPipe(serverConfig.validation));
  
  // 获取LogsService实例并创建日志拦截器
  const logsService = app.select(LogsModule).get(LogsService);
  app.useGlobalInterceptors(new LoggingInterceptor(logsService));
  
  // 启用CORS - 允许跨域请求
  app.enableCors(serverConfig.cors);
  
  // 从配置中获取端口和环境信息
  const port = serverConfig.port;
  const nodeEnv = serverConfig.nodeEnv;
  
  // 启动HTTP服务器
  await app.listen(port);
  
  // 使用NestJS内置Logger输出启动信息
  logger.log(`Application is running on port ${port} in ${nodeEnv} mode`);
}

// 启动应用程序
bootstrap();