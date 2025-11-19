import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

/**
 * 用户注册数据传输对象
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * 用户登录数据传输对象
 */
export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

/**
 * 用户服务类
 * 处理用户注册、登录、信息管理等核心业务逻辑
 */
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * 创建新用户
   * 
   * @param userData 用户注册信息
   * @returns 创建的用户对象
   * @throws UnauthorizedException 当邮箱或用户名已存在时
   */
  async create(userData: RegisterDto): Promise<User> {
    // 检查邮箱是否已存在
    const existingUserByEmail = await this.findByEmail(userData.email);
    if (existingUserByEmail) {
      throw new UnauthorizedException('Email already exists');
    }

    // 检查用户名是否已存在
    const existingUserByUsername = await this.findByUsername(userData.username);
    if (existingUserByUsername) {
      throw new UnauthorizedException('Username already exists');
    }

    // 密码加密，使用salt round 10
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    return user.save();
  }

  /**
   * 用户登录验证
   * 
   * @param loginData 登录信息
   * @returns 登录成功的用户信息（不包含密码）
   * @throws UnauthorizedException 当邮箱或密码错误时
   */
  async login(loginData: LoginDto): Promise<User> {
    const user = await this.userModel.findOne({ email: loginData.email });
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 更新最后登录时间
    await this.updateLastLogin((user as unknown as { _id: { toString: () => string } })._id.toString());
    
    // 移除密码字段后返回
    const userObj = user.toObject();
    delete userObj.password;
    return userObj as User;
  }

  /**
   * 根据邮箱查找用户
   * 
   * @param email 用户邮箱
   * @returns 用户对象或null
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * 根据用户名查找用户
   * 
   * @param username 用户名
   * @returns 用户对象或null
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  /**
   * 根据ID查找用户
   * 
   * @param id 用户ID
   * @returns 用户对象（不包含密码）或null
   */
  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    if (user) {
      const userObj = user.toObject();
      delete userObj.password;
      return userObj as User;
    }
    return null;
  }

  /**
   * 获取所有用户
   * 
   * @returns 所有用户数组（不包含密码）
   */
  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => {
      const userObj = user.toObject();
      delete userObj.password;
      return userObj as User;
    });
  }

  /**
   * 更新用户信息
   * 
   * @param id 用户ID
   * @param updateData 更新的字段数据
   * @returns 更新后的用户信息（不包含密码）或null
   */
  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    // 如果更新密码，需要加密处理
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    
    if (user) {
      const userObj = user.toObject();
      delete userObj.password;
      return userObj as User;
    }
    return null;
  }

  /**
   * 增加用户经验值
   * 
   * 经验值规则：
   * - 每100经验值升1级
   * - 等级 = floor(经验值 / 100) + 1
   * 
   * @param id 用户ID
   * @param experience 增加的经验值数量
   * @returns 更新后的用户信息或null
   */
  async addExperience(id: string, experience: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    const newExperience = user.experience + experience;
    const newLevel = Math.floor(newExperience / 100) + 1;

    return this.update(id, {
      experience: newExperience,
      level: newLevel,
    });
  }

  /**
   * 增加用户金币
   * 
   * @param id 用户ID
   * @param coins 增加的金币数量（可为负数，但不能低于0）
   * @returns 更新后的用户信息或null
   */
  async addCoins(id: string, coins: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    return this.update(id, {
      coins: Math.max(0, user.coins + coins),
    });
  }

  /**
   * 更新用户最后登录时间
   * 
   * @param id 用户ID
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { lastLoginAt: new Date() });
  }
}