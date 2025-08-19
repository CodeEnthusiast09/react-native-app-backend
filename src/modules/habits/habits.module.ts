import { Module } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { HabitCompletion } from './entities/habit-completion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, HabitCompletion])],
  controllers: [HabitsController],
  providers: [HabitsService],
})
export class HabitsModule {}
