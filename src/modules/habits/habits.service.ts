import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from './entities/habit.entity';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { HabitCompletion } from './entities/habit-completion.entity';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepo: Repository<Habit>,

    @InjectRepository(HabitCompletion)
    private readonly completionRepo: Repository<HabitCompletion>,
  ) {}

  async create(createHabitDto: CreateHabitDto, userId: string) {
    const habit = this.habitRepo.create({
      ...createHabitDto,
      user: { id: userId },
    });
    return this.habitRepo.save(habit);
  }

  async findAllByUser(userId: string): Promise<Habit[]> {
    return await this.habitRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async completeHabit(habitId: string, userId: string): Promise<Habit> {
    const habit = await this.findOneByUser(habitId, userId);

    // 1. Save a new completion record
    const completion = this.completionRepo.create({
      habit,
      completed_at: new Date(),
    });
    await this.completionRepo.save(completion);

    // 2. Update streak + last_completed
    const lastCompletion = habit.last_completed
      ? new Date(habit.last_completed)
      : null;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (
      lastCompletion &&
      lastCompletion.toDateString() === yesterday.toDateString()
    ) {
      // Consecutive day → increment streak
      habit.streak += 1;
    } else if (
      !lastCompletion ||
      lastCompletion.toDateString() !== today.toDateString()
    ) {
      // Missed a day or first completion → reset streak
      habit.streak = 1;
    }

    habit.last_completed = today;

    return await this.habitRepo.save(habit);
  }

  async findOneByUser(habitId: string, userId: string): Promise<Habit> {
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
  ): Promise<Habit> {
    const habit = await this.findOneByUser(id, userId);
    Object.assign(habit, dto);
    return await this.habitRepo.save(habit);
  }

  async removeByUser(id: string, userId: string): Promise<void> {
    const habit = await this.findOneByUser(id, userId);
    await this.habitRepo.remove(habit);
  }
}
