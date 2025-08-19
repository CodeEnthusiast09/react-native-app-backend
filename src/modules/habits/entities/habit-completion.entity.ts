import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Habit } from 'src/modules/habits/entities/habit.entity';

@Entity({ name: 'habit_completions' })
export class HabitCompletion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Habit, (habit) => habit.completions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habit_id' })
  habit: Habit;

  @Column({ type: 'timestamp' })
  completed_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
