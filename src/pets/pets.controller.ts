import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

/**
 * 宠物管理控制器
 * 提供宠物创建、管理、交互等RESTful API接口
 * 
 * 路径前缀: /pets
 */
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  /**
   * 创建新宠物
   * POST /pets
   * 
   * @param createPetDto 宠物创建信息，包含名称、类型和所属用户ID
   * @returns 创建成功的宠物对象
   */
  @Post()
  create(@Body() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
  }

  /**
   * 获取所有宠物列表
   * GET /pets
   * 
   * @returns 所有宠物的数组
   */
  @Get()
  findAll() {
    return this.petsService.findAll();
  }

  /**
   * 获取指定用户的所有宠物
   * GET /pets/user/:userId
   * 
   * @param userId 用户ID
   * @returns 该用户拥有的所有活跃宠物
   */
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.petsService.findByUserId(userId);
  }

  /**
   * 根据ID获取单个宠物信息
   * GET /pets/:id
   * 
   * @param id 宠物ID
   * @returns 指定ID的宠物详细信息
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findById(id);
  }

  /**
   * 获取宠物详细统计信息
   * GET /pets/:id/stats
   * 
   * @param id 宠物ID
   * @returns 包含所有状态数值的宠物统计信息
   */
  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.petsService.getPetStats(id);
  }

  /**
   * 更新宠物信息
   * PATCH /pets/:id
   * 
   * @param id 要更新的宠物ID
   * @param updatePetDto 更新的宠物信息字段
   * @returns 更新后的宠物信息
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    return this.petsService.update(id, updatePetDto);
  }

  /**
   * 喂食宠物
   * POST /pets/:id/feed
   * 
   * 喂食效果：
   * - 饥饿度 +30 (最高100)
   * - 快乐度 +10 (最高100)
   * - 经验值 +10
   * - 更新最后喂食时间
   * 
   * @param id 宠物ID
   * @returns 喂食后的宠物状态
   */
  @Post(':id/feed')
  feed(@Param('id') id: string) {
    return this.petsService.feedPet(id);
  }

  /**
   * 和宠物玩耍
   * POST /pets/:id/play
   * 
   * 玩耍效果：
   * - 快乐度 +25 (最高100)
   * - 能量 -20 (最低0)
   * - 饥饿度 -15 (最低0)
   * - 经验值 +15
   * - 更新最后玩耍时间
   * 
   * @param id 宠物ID
   * @returns 玩耍后的宠物状态
   */
  @Post(':id/play')
  play(@Param('id') id: string) {
    return this.petsService.playWithPet(id);
  }

  /**
   * 让宠物睡觉
   * POST /pets/:id/sleep
   * 
   * 睡觉效果：
   * - 能量 +40 (最高100)
   * - 健康度 +10 (最高100)
   * - 更新最后睡觉时间
   * 
   * @param id 宠物ID
   * @returns 睡觉后的宠物状态
   */
  @Post(':id/sleep')
  sleep(@Param('id') id: string) {
    return this.petsService.sleepPet(id);
  }

  /**
   * 治疗宠物
   * POST /pets/:id/heal
   * 
   * 治疗效果：
   * - 健康度 +30 (最高100)
   * - 根据状态数值重新计算宠物状态
   * 
   * @param id 宠物ID
   * @returns 治疗后的宠物状态
   */
  @Post(':id/heal')
  heal(@Param('id') id: string) {
    return this.petsService.healPet(id);
  }

  /**
   * 获取支持的宠物类型列表
   * GET /pets/types
   * 
   * @returns 所有可用的宠物类型数组
   */
  @Get('types')
  getTypes() {
    return this.petsService.getPetTypes();
  }
}