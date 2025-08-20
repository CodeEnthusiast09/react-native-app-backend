import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { HabitCompletion } from '../habits/entities/habit-completion.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(HabitCompletion)
    private readonly habitCompletionRepository: Repository<HabitCompletion>,
  ) {}

  async seedCompletions() {
    console.log('Starting habit completions seeding...');

    const seedSQL = `
     WITH habit_streaks AS (
       SELECT 
    id as habit_id,
    streak,
    last_completed,
    frequency,
    COALESCE(last_completed, CURRENT_DATE) as reference_date
  FROM habits 
  WHERE streak > 0
),
completion_dates AS (
  SELECT 
    habit_id,
    reference_date - (generate_series(0, streak - 1) * 
      CASE 
        WHEN frequency = 'daily' THEN INTERVAL '1 day'
        WHEN frequency = 'weekly' THEN INTERVAL '1 week'  
        WHEN frequency = 'monthly' THEN INTERVAL '1 month'
        ELSE INTERVAL '1 day'
      END
    ) as completion_date
  FROM habit_streaks
)
INSERT INTO habit_completions (habit_id, completed_at, created_at)
SELECT 
  habit_id,
  completion_date,
  completion_date
FROM completion_dates
WHERE NOT EXISTS (
  SELECT 1 FROM habit_completions hc 
  WHERE hc.habit_id = completion_dates.habit_id 
  AND DATE(hc.completed_at) = DATE(completion_dates.completion_date)
)
ORDER BY habit_id, completion_date;

    `;

    try {
      await this.habitCompletionRepository.query(seedSQL);
      console.log('Successfully seeded habit completions');

      type VerificationRow = {
        name: string;
        current_streak: number;
        completion_count: number;
      };

      const verification: VerificationRow[] = await this
        .habitCompletionRepository.query(`
      SELECT 
  h.title,
  h.streak,
  COUNT(hc.id) as completion_count
FROM habits h
LEFT JOIN habit_completions hc ON h.id = hc.habit_id
WHERE h.streak > 0
GROUP BY h.id, h.title, h.streak
ORDER BY h.title;
    `);

      console.log('Verification results:');
      console.table(verification);

      return {
        success: true,
        message: 'Habit completions seeded successfully',
        data: verification,
      };
    } catch (error) {
      console.error('Error seeding habit completions:', error);
      throw error;
    }
  }
}
