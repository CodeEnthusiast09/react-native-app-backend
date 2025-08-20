import { Expose, Transform } from 'class-transformer';
import { HabitCompletion } from '../entities/habit-completion.entity';

export class HabitCompletionResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Transform(({ obj }: { obj: HabitCompletion }) => obj?.habit?.id)
  habit_id: string;

  @Expose()
  completed_at: Date;
}
