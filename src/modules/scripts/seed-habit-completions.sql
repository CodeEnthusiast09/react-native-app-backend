-- Seed habit completions based on current streak values
-- This script generates completion records for each habit based on their current_streak value

DO $$
DECLARE
    habit_record RECORD;
    completion_date DATE;
    i INTEGER;
BEGIN
    -- Loop through each habit that has a current_streak > 0
    FOR habit_record IN 
        SELECT id, current_streak, frequency, last_completed_at, created_at
        FROM habits 
        WHERE current_streak > 0
    LOOP
        -- Calculate the starting date for completions based on frequency
        CASE habit_record.frequency
            WHEN 'daily' THEN
                completion_date := COALESCE(habit_record.last_completed_at::DATE, CURRENT_DATE) - (habit_record.current_streak - 1);
            WHEN 'weekly' THEN
                completion_date := COALESCE(habit_record.last_completed_at::DATE, CURRENT_DATE) - ((habit_record.current_streak - 1) * 7);
            WHEN 'monthly' THEN
                completion_date := COALESCE(habit_record.last_completed_at::DATE, CURRENT_DATE) - ((habit_record.current_streak - 1) * 30);
            ELSE
                completion_date := COALESCE(habit_record.last_completed_at::DATE, CURRENT_DATE) - (habit_record.current_streak - 1);
        END CASE;

        -- Ensure we don't go before the habit was created
        IF completion_date < habit_record.created_at::DATE THEN
            completion_date := habit_record.created_at::DATE;
        END IF;

        -- Insert completion records for the streak
        FOR i IN 1..habit_record.current_streak LOOP
            -- Check if completion already exists for this date
            IF NOT EXISTS (
                SELECT 1 FROM habit_completion 
                WHERE habit_id = habit_record.id 
                AND completed_at::DATE = completion_date
            ) THEN
                INSERT INTO habit_completion (id, completed_at, created_at, habit_id)
                VALUES (
                    gen_random_uuid(),
                    completion_date + INTERVAL '12 hours', -- Set to noon for consistency
                    completion_date + INTERVAL '12 hours',
                    habit_record.id
                );
            END IF;

            -- Increment date based on frequency
            CASE habit_record.frequency
                WHEN 'daily' THEN
                    completion_date := completion_date + INTERVAL '1 day';
                WHEN 'weekly' THEN
                    completion_date := completion_date + INTERVAL '7 days';
                WHEN 'monthly' THEN
                    completion_date := completion_date + INTERVAL '30 days';
                ELSE
                    completion_date := completion_date + INTERVAL '1 day';
            END CASE;
        END LOOP;

        RAISE NOTICE 'Seeded % completions for habit: %', habit_record.current_streak, habit_record.id;
    END LOOP;

    RAISE NOTICE 'Habit completion seeding completed successfully!';
END $$;
