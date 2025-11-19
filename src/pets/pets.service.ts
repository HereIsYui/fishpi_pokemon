import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pet, PetDocument, PetStatus, PetType } from './schemas/pet.schema';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

/**
 * 宠物服务类
 * 处理宠物创建、管理、交互、状态计算等核心业务逻辑
 */
@Injectable()
export class PetsService {
  constructor(@InjectModel(Pet.name) private petModel: Model<PetDocument>) {}

  /**
   * 创建新宠物
   * 
   * @param createPetDto 宠物创建信息
   * @returns 创建的宠物对象
   */
  async create(createPetDto: CreatePetDto): Promise<Pet> {
    const pet = new this.petModel(createPetDto);
    return pet.save();
  }

  /**
   * 获取所有宠物
   * 
   * @returns 所有宠物的数组
   */
  async findAll(): Promise<Pet[]> {
    return this.petModel.find().exec();
  }

  /**
   * 获取指定用户的所有活跃宠物
   * 
   * @param userId 用户ID
   * @returns 该用户拥有的所有活跃宠物
   */
  async findByUserId(userId: string): Promise<Pet[]> {
    return this.petModel.find({ userId, is_active: true }).exec();
  }

  /**
   * 根据ID查找宠物
   * 
   * @param id 宠物ID
   * @returns 宠物对象或null
   */
  async findById(id: string): Promise<Pet | null> {
    return this.petModel.findById(id).exec();
  }

  /**
   * 更新宠物信息
   * 
   * @param id 宠物ID
   * @param updatePetDto 更新的字段
   * @returns 更新后的宠物对象或null
   */
  async update(id: string, updatePetDto: UpdatePetDto): Promise<Pet | null> {
    return this.petModel.findByIdAndUpdate(id, updatePetDto, { new: true }).exec();
  }

  /**
   * 删除宠物
   * 
   * @param id 宠物ID
   * @returns 被删除的宠物对象或null
   */
  async delete(id: string): Promise<Pet | null> {
    return this.petModel.findByIdAndDelete(id).exec();
  }

  /**
   * 喂食宠物
   * 
   * 喂食效果：
   * - 饥饿度 +30 (最高100)
   * - 快乐度 +10 (最高100)
   * - 经验值 +10
   * - 根据新的状态数值重新计算宠物状态
   * - 更新最后喂食时间
   * 
   * @param id 宠物ID
   * @returns 喂食后的宠物对象
   * @throws NotFoundException 当宠物不存在时
   */
  async feedPet(id: string): Promise<Pet | null> {
    const pet = await this.findById(id);
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    const newHunger = Math.min(100, pet.hunger + 30);
    const newHappiness = Math.min(100, pet.happiness + 10);
    const newExperience = pet.experience + 10;

    const newLevel = Math.floor(newExperience / 100) + 1;
    const newStatus = this.calculatePetStatus(newHunger, pet.health, pet.energy, newHappiness);

    return this.update(id, {
      hunger: newHunger,
      happiness: newHappiness,
      experience: newExperience,
      level: newLevel,
      status: newStatus,
      lastFed: new Date(),
    });
  }

  /**
   * 和宠物玩耍
   * 
   * 玩耍效果：
   * - 快乐度 +25 (最高100)
   * - 能量 -20 (最低0)
   * - 饥饿度 -15 (最低0)
   * - 经验值 +15
   * - 根据新的状态数值重新计算宠物状态
   * - 更新最后玩耍时间
   * 
   * @param id 宠物ID
   * @returns 玩耍后的宠物对象
   * @throws NotFoundException 当宠物不存在时
   */
  async playWithPet(id: string): Promise<Pet | null> {
    const pet = await this.findById(id);
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    const newHappiness = Math.min(100, pet.happiness + 25);
    const newEnergy = Math.max(0, pet.energy - 20);
    const newHunger = Math.max(0, pet.hunger - 15);
    const newExperience = pet.experience + 15;

    const newLevel = Math.floor(newExperience / 100) + 1;
    const newStatus = this.calculatePetStatus(newHunger, pet.health, newEnergy, newHappiness);

    return this.update(id, {
      happiness: newHappiness,
      energy: newEnergy,
      hunger: newHunger,
      experience: newExperience,
      level: newLevel,
      status: newStatus,
      lastPlayed: new Date(),
    });
  }

  /**
   * 让宠物睡觉
   * 
   * 睡觉效果：
   * - 能量 +40 (最高100)
   * - 健康度 +10 (最高100)
   * - 状态判断：能量大于80时为活跃状态，否则为睡觉状态
   * - 更新最后睡觉时间
   * 
   * @param id 宠物ID
   * @returns 睡觉后的宠物对象
   * @throws NotFoundException 当宠物不存在时
   */
  async sleepPet(id: string): Promise<Pet | null> {
    const pet = await this.findById(id);
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    const newEnergy = Math.min(100, pet.energy + 40);
    const newHealth = Math.min(100, pet.health + 10);
    const newStatus = newEnergy > 80 ? PetStatus.ACTIVE : PetStatus.SLEEPING;

    return this.update(id, {
      energy: newEnergy,
      health: newHealth,
      status: newStatus,
      lastSlept: new Date(),
    });
  }

  /**
   * 治疗宠物
   * 
   * 治疗效果：
   * - 健康度 +30 (最高100)
   * - 根据新的健康度重新计算宠物状态
   * 
   * @param id 宠物ID
   * @returns 治疗后的宠物对象
   * @throws NotFoundException 当宠物不存在时
   */
  /**
   * 治疗宠物
   * 
   * 治疗效果：
   * - 健康度 +30 (最高100)
   * - 根据新的健康度重新计算宠物状态
   * 
   * @param id 宠物ID
   * @returns 治疗后的宠物对象
   * @throws NotFoundException 当宠物不存在时
   */
  async healPet(id: string): Promise<Pet | null> {
    const pet = await this.findById(id);
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    const newHealth = Math.min(100, pet.health + 30);
    const newStatus = this.calculatePetStatus(pet.hunger, newHealth, pet.energy, pet.happiness);

    return this.update(id, {
      health: newHealth,
      status: newStatus,
    });
  }

  /**
   * 获取宠物详细统计信息
   * 
   * 返回包含所有宠物状态数值的完整统计信息
   * 
   * @param id 宠物ID
   * @returns 包含所有宠物属性的对象
   * @throws NotFoundException 当宠物不存在时
   */
  /**
   * 获取宠物详细统计信息
   * 
   * 返回包含所有宠物状态数值的完整统计信息
   * 
   * @param id 宠物ID
   * @returns 包含所有宠物属性的对象
   * @throws NotFoundException 当宠物不存在时
   */
  async getPetStats(id: string): Promise<Record<string, unknown>> {
    const pet = await this.findById(id);
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    return {
      id: (pet as any)._id,
      name: pet.name,
      type: pet.type,
      level: pet.level,
      experience: pet.experience,
      health: pet.health,
      hunger: pet.hunger,
      happiness: pet.happiness,
      energy: pet.energy,
      status: pet.status,
      battlesWon: pet.battlesWon,
      battlesLost: pet.battlesLost,
      lastFed: pet.lastFed,
      lastPlayed: pet.lastPlayed,
      lastSlept: pet.lastSlept,
    };
  }

  /**
   * 随时间更新宠物状态
   * 
   * 定时任务方法，根据时间流逝自动更新所有宠物的状态：
   * - 饥饿度：每小时减少2点
   * - 快乐度：每小时减少1.5点
   * - 能量：每小时减少1点
   * - 根据新的状态数值重新计算宠物状态
   * 
   * 此方法应由定时任务调用，模拟真实时间流逝对宠物的影响
   */
  /**
   * 随时间更新宠物状态
   * 
   * 定时任务方法，根据时间流逝自动更新所有宠物的状态：
   * - 饥饿度：每小时减少2点
   * - 快乐度：每小时减少1.5点
   * - 能量：每小时减少1点
   * - 根据新的状态数值重新计算宠物状态
   * 
   * 此方法应由定时任务调用，模拟真实时间流逝对宠物的影响
   */
  async updatePetStatsOverTime(): Promise<void> {
    const pets = await this.findAll();
    const now = new Date();

    for (const pet of pets) {
      const hoursSinceLastFed = (now.getTime() - pet.lastFed.getTime()) / (1000 * 60 * 60);
      const hoursSinceLastPlay = (now.getTime() - pet.lastPlayed.getTime()) / (1000 * 60 * 60);
      const hoursSinceLastSleep = (now.getTime() - pet.lastSlept.getTime()) / (1000 * 60 * 60);

      const newHunger = Math.max(0, pet.hunger - Math.floor(hoursSinceLastFed * 2));
      const newHappiness = Math.max(0, pet.happiness - Math.floor(hoursSinceLastPlay * 1.5));
      const newEnergy = Math.max(0, pet.energy - Math.floor(hoursSinceLastSleep * 1));

      const newStatus = this.calculatePetStatus(newHunger, pet.health, newEnergy, newHappiness);

      await this.update((pet as any)._id, {
        hunger: newHunger,
        happiness: newHappiness,
        energy: newEnergy,
        status: newStatus,
      });
    }
  }

  /**
   * 计算宠物状态
   * 
   * 根据宠物各项数值自动判断当前状态：
   * - 健康度 < 30：生病状态
   * - 能量 < 20：睡觉状态
   * - 饥饿度 < 30：饥饿状态
   * - 快乐度 > 80 && 健康度 > 80 && 能量 > 60：快乐状态
   * - 其他情况：活跃状态
   * 
   * @param hunger 饥饿度 (0-100)
   * @param health 健康度 (0-100)
   * @param energy 能量值 (0-100)
   * @param happiness 快乐度 (0-100)
   * @returns 计算出的宠物状态
   */
  /**
   * 计算宠物状态
   * 
   * 根据宠物各项数值自动判断当前状态：
   * - 健康度 < 30：生病状态
   * - 能量 < 20：睡觉状态
   * - 饥饿度 < 30：饥饿状态
   * - 快乐度 > 80 && 健康度 > 80 && 能量 > 60：快乐状态
   * - 其他情况：活跃状态
   * 
   * @param hunger 饥饿度 (0-100)
   * @param health 健康度 (0-100)
   * @param energy 能量值 (0-100)
   * @param happiness 快乐度 (0-100)
   * @returns 计算出的宠物状态
   */
  private calculatePetStatus(hunger: number, health: number, energy: number, happiness: number): PetStatus {
    if (health < 30) return PetStatus.SICK;
    if (energy < 20) return PetStatus.SLEEPING;
    if (hunger < 30) return PetStatus.HUNGRY;
    if (happiness > 80 && health > 80 && energy > 60) return PetStatus.HAPPY;
    return PetStatus.ACTIVE;
  }

  async getPetTypes(): Promise<string[]> {
    return Object.values(PetType);
  }
}