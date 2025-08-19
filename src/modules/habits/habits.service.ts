import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from './entities/habit.entity';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { HabitCompletion } from './entities/habit-completion.entity';
import { HabitResponseDto } from './dto/habit-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepo: Repository<Habit>,

    @InjectRepository(HabitCompletion)
    private readonly completionRepo: Repository<HabitCompletion>,
  ) {}

  async create(
    createHabitDto: CreateHabitDto,
    userId: string,
  ): Promise<HabitResponseDto> {
    const habit = this.habitRepo.create({
      ...createHabitDto,
      user: { id: userId },
    });

    const saved = await this.habitRepo.save(habit);

    return plainToInstance(HabitResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async findAllByUser(userId: string): Promise<HabitResponseDto[]> {
    const habits = await this.habitRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    return plainToInstance(HabitResponseDto, habits, {
      excludeExtraneousValues: true,
    });
  }

  async completeHabit(
    habitId: string,
    userId: string,
  ): Promise<HabitResponseDto> {
    const habit = await this.findOneByUser(habitId, userId);

    const now = new Date();

    const lastCompletion = await this.completionRepo.findOne({
      where: { habit: { id: habit.id } },
      order: { completed_at: 'DESC' },
    });

    if (lastCompletion) {
      if (habit.frequency === 'daily') {
        if (lastCompletion.completed_at.toDateString() === now.toDateString()) {
          throw new BadRequestException('Habit already completed today.');
        }
      }

      if (habit.frequency === 'weekly') {
        const oneWeekAgo = new Date(now);

        oneWeekAgo.setDate(now.getDate() - 7);

        if (lastCompletion.completed_at > oneWeekAgo) {
          throw new BadRequestException('Habit already completed this week.');
        }
      }

      if (habit.frequency === 'monthly') {
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);

        if (lastCompletion.completed_at > oneMonthAgo) {
          throw new BadRequestException('Habit already completed this month.');
        }
      }
    }

    // 1. Save a new completion record
    const completion = this.completionRepo.create({
      habit,
      completed_at: now,
    });
    await this.completionRepo.save(completion);

    // 2. Update streak + last_completed
    const yesterday = new Date(now);

    yesterday.setDate(now.getDate() - 1);

    if (!habit.last_completed) {
      habit.streak = 1;
    } else if (
      habit.last_completed.toDateString() === yesterday.toDateString()
    ) {
      // continued streak
      habit.streak += 1;
    } else {
      habit.streak = 0;
    }

    habit.last_completed = now;

    const updated = await this.habitRepo.save(habit);

    return plainToInstance(HabitResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  async findOneByUser(
    habitId: string,
    userId: string,
  ): Promise<HabitResponseDto> {
    const habit = await this.habitRepo.findOne({
      where: { id: habitId, user: { id: userId } },
      relations: ['user'],
    });

    if (!habit) {
      throw new NotFoundException(`Habit not found for this user`);
    }

    return plainToInstance(HabitResponseDto, habit, {
      excludeExtraneousValues: true,
    });
  }

  async findOneByUserEntity(habitId: string, userId: string): Promise<Habit> {
    const habit = await this.habitRepo.findOne({
      where: { id: habitId, user: { id: userId } },
      relations: ['user'],
    });

    if (!habit) {
      throw new NotFoundException(`Habit not found for this user`);
    }

    return habit;
  }

  async updateByUser(
    id: string,
    userId: string,
    dto: UpdateHabitDto,
  ): Promise<HabitResponseDto> {
    const habit = await this.findOneByUser(id, userId);
    Object.assign(habit, dto);
    const saved = await this.habitRepo.save(habit);

    return plainToInstance(HabitResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async removeByUser(id: string, userId: string): Promise<void> {
    const habit = await this.findOneByUserEntity(id, userId);
    await this.habitRepo.remove(habit);
  }
}
