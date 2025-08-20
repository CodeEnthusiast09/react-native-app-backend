-- Verification query to check the seeded completions
SELECT 
    h.name,
    h.current_streak,
    h.frequency,
    COUNT(hc.id) as completion_count,
    MIN(hc.completed_at) as first_completion,
    MAX(hc.completed_at) as last_completion
FROM habits h
LEFT JOIN habit_completion hc ON h.id = hc.habit_id
WHERE h.current_streak > 0
GROUP BY h.id, h.name, h.current_streak, h.frequency
ORDER BY h.name;
