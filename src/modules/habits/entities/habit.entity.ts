import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HabitCompletion } from './habit-completion.entity';

@Entity({ name: 'habits' })
export class Habit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.habits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  streak: number;

  @OneToMany(() => HabitCompletion, (completion) => completion.habit)
  completions: HabitCompletion[];

  @Column({ type: 'timestamp', nullable: true })
  last_completed: Date;

  @Column()
  frequency: string;

  @CreateDateColumn()
  created_at: Date;
}
