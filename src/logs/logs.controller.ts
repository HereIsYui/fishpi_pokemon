import { Controller, Get, Query, Param } from '@nestjs/common';
import { LogsService } from './logs.service';
import { ParseDatePipe } from '../common/pipes/date.pipe';

/**
 * 日志管理控制器
 * 提供系统日志查询和分析的RESTful API接口
 * 
 * 路径前缀: /logs
 */
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  /**
   * 获取所有日志记录
   * GET /logs
   * 
   * @returns 所有系统日志的数组，按创建时间倒序排列
   * 
   * 返回数据包含：
   * - userId: 用户ID
   * - endpoint: 请求端点
   * - method: HTTP方法
   * - statusCode: 响应状态码
   * - ip: 客户端IP
   * - userAgent: 用户代理
   * - responseTime: 响应时间（毫秒）
   * - createdAt: 日志创建时间
   */
  @Get()
  findAll() {
    return this.logsService.findAll();
  }

  /**
   * 根据用户ID获取日志
   * GET /logs/user/:userId
   * 
   * @param userId 用户ID，从URL路径参数获取
   * @returns 指定用户的所有日志记录，按创建时间倒序排列
   * 
   * 用途：
   * - 追踪特定用户的活动记录
   * - 分析用户行为模式
   * - 监控异常访问
   */
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.logsService.findByUserId(userId);
  }

  /**
   * 根据日期范围获取日志
   * GET /logs/date-range?startDate=日期&endDate=日期
   * 
   * @param startDate 开始日期，通过ParseDatePipe自动转换为Date对象
   * @param endDate 结束日期，通过ParseDatePipe自动转换为Date对象
   * @returns 指定日期范围内的所有日志记录
   * 
   * 查询示例：
   * GET /logs/date-range?startDate=2024-01-01&endDate=2024-01-31
   * 
   * 用途：
   * - 生成特定时期的系统报告
   * - 分析流量高峰时段
   * - 监控系统健康状态
   */
  @Get('date-range')
  findByDateRange(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
  ) {
    return this.logsService.findByDateRange(startDate, endDate);
  }
}