-- Optional: Clean up any duplicate completions that might exist
-- Run this if you need to remove duplicates before seeding

WITH duplicate_completions AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY habit_id, completed_at::DATE 
            ORDER BY created_at
        ) as rn
    FROM habit_completion
)
DELETE FROM habit_completion 
WHERE id IN (
    SELECT id 
    FROM duplicate_completions 
    WHERE rn > 1
);
