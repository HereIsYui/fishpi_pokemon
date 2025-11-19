import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LogsService } from '../../logs/logs.service';

/**
 * 日志拦截器
 * 
 * 全局请求拦截器，自动记录所有HTTP请求的详细信息：
 * - 记录请求时间、响应时间、状态码等信息
 * - 自动脱敏敏感字段（密码、token等）
 * - 同时记录到控制台和数据库
 * - 支持错误处理和异常记录
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(private readonly logsService: LogsService) {}

  /**
   * 拦截HTTP请求并记录日志
   * 
   * 实现细节：
   * - 在请求处理前记录开始时间
   * - 使用RxJS的tap操作符监听响应完成和错误
   * - 成功响应：记录正常日志到控制台和数据库
   * - 错误响应：记录错误信息并保持原始错误状态
   * 
   * @param context 执行上下文，包含请求和响应对象
   * @param next 下一个处理程序
   * @returns 可观察的响应流
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip } = request;
    const userAgent = request.get('User-Agent') || '';
    const startTime = Date.now();

    return next
      .handle()
      .pipe(
        tap({
          next: () => {
            const responseTime = Date.now() - startTime;
            const statusCode = response.statusCode;
            
            // 记录控制台日志
            this.logger.log(
              `${method} ${url} - ${statusCode} - ${responseTime}ms - ${ip}`,
            );

            // 记录到数据库
            this.logToDatabase(request, statusCode, responseTime, userAgent, ip);
          },
          error: (error) => {
            const responseTime = Date.now() - startTime;
            const statusCode = error.status || 500;
            
            this.logger.error(
              `${method} ${url} - ${statusCode} - ${responseTime}ms - ${error.message}`,
            );

            this.logToDatabase(request, statusCode, responseTime, userAgent, ip, error.message);
          },
        }),
      );
  }

  /**
   * 记录日志到数据库
   * 
   * 用户ID获取策略：
   * 1. 优先从查询参数获取（OAuth方式）
   * 2. 其次从请求体获取
   * 3. 从URL路径参数中推断（用户相关路径）
   * 4. 默认使用'anonymous'
   * 
   * @param request HTTP请求对象
   * @param statusCode HTTP状态码
   * @param responseTime 响应时间（毫秒）
   * @param userAgent 用户代理字符串
   * @param ip 客户端IP地址
   * @param errorMessage 错误信息（可选）
   */
  private async logToDatabase(
    request: Request,
    statusCode: number,
    responseTime: number,
    userAgent: string,
    ip: string,
    errorMessage?: string,
  ) {
    try {
      // 从请求中获取用户ID，可能来自不同的来源
      let userId = 'anonymous';
      
      // 从查询参数中获取userId (OAuth方式)
      if (request.query.userId && typeof request.query.userId === 'string') {
        userId = request.query.userId;
      }
      // 从请求体中获取userId
      else if (request.body && request.body.userId) {
        userId = request.body.userId;
      }
      // 从URL参数中获取userId
      else if (request.params && request.params.id && 
               (request.path.includes('/users/') || request.path.includes('/pets/user/'))) {
        // 如果是用户相关的路径，尝试从路径中提取userId
        userId = request.params.id;
      }
      
      await this.logsService.create({
        userId,
        endpoint: request.url,
        method: request.method,
        statusCode,
        ip,
        userAgent,
        requestBody: this.sanitizeRequestBody(request.body),
        responseTime,
        errorMessage,
      });
    } catch (error) {
      this.logger.error('Failed to log to database:', error);
    }
  }

  /**
   * 请求体脱敏处理
   * 
   * 安全特性：
   * - 脱敏敏感字段，防止密码等敏感信息泄露
   * - 支持字段：password, token, secret, authorization
   * - 脱敏后的值显示为'***'
   * 
   * @param body 原始请求体
   * @returns 脱敏后的请求体或undefined
   */
  private sanitizeRequestBody(body: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!body) return undefined;
    
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'authorization'];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***';
      }
    });
    
    return sanitized;
  }
}