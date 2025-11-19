import { Controller, Get, Post, Param, Patch, Body, Query } from '@nestjs/common';
import { UsersService, LoginDto, RegisterDto } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * 用户管理控制器
 * 提供用户注册、登录、信息管理等RESTful API接口
 * 
 * 路径前缀: /users
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 用户注册接口
   * POST /users/register
   * 
   * @param registerDto 用户注册信息，包含用户名、邮箱和密码
   * @returns 注册成功的用户信息（不包含密码）
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    
    // 移除密码字段，确保安全性
    const userObj = (user as unknown as { toObject: () => Record<string, unknown> }).toObject();
    delete userObj.password;
    
    return {
      success: true,
      user: userObj,
    };
  }

  /**
   * 用户登录接口
   * POST /users/login
   * 
   * @param loginDto 登录信息，包含邮箱和密码
   * @returns 登录成功的用户信息（不包含密码）
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.login(loginDto);
    
    return {
      success: true,
      user,
    };
  }

  /**
   * 获取所有用户列表
   * GET /users
   * 
   * @returns 所有用户信息的数组（不包含密码）
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * 根据ID获取单个用户信息
   * GET /users/:id
   * 
   * @param id 用户ID
   * @returns 指定ID的用户信息（不包含密码）
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  /**
   * 根据邮箱获取用户信息
   * GET /users/email/:email
   * 
   * @param email 用户邮箱
   * @returns 匹配邮箱的用户信息（不包含密码）
   */
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  /**
   * 更新用户信息
   * PATCH /users/:id
   * 
   * @param id 要更新的用户ID
   * @param updateUserDto 更新的用户信息字段
   * @returns 更新后的用户信息（不包含密码）
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * 增加用户经验值
   * PATCH /users/:id/experience?experience=数值
   * 
   * @param id 用户ID
   * @param experience 要增加的经验值数量
   * @returns 更新后的用户信息（包含新的等级和经验值）
   */
  @Patch(':id/experience')
  addExperience(
    @Param('id') id: string,
    @Query('experience') experience: number,
  ) {
    return this.usersService.addExperience(id, experience);
  }

  /**
   * 增加用户金币
   * PATCH /users/:id/coins?coins=数值
   * 
   * @param id 用户ID
   * @param coins 要增加的金币数量（可为负数）
   * @returns 更新后的用户信息（包含新的金币数量）
   */
  @Patch(':id/coins')
  addCoins(@Param('id') id: string, @Query('coins') coins: number) {
    return this.usersService.addCoins(id, coins);
  }
}