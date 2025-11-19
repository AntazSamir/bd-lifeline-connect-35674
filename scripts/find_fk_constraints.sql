-- Find foreign key constraints that reference auth.users
-- Run this in Supabase SQL editor (Project -> SQL)

SELECT
  con.conname AS constraint_name,
  con.conrelid::regclass AS referencing_table,
  array_agg(pg_attribute.attname ORDER BY cols.ordinality) AS referencing_columns,
  con.confrelid::regclass AS referenced_table
FROM pg_constraint con
JOIN LATERAL unnest(con.conkey) WITH ORDINALITY AS cols(attnum, ordinality) ON true
JOIN pg_attribute ON pg_attribute.attrelid = con.conrelid AND pg_attribute.attnum = cols.attnum
WHERE con.contype = 'f'
  AND con.confrelid::regclass::text = 'auth.users'
GROUP BY constraint_name, referencing_table, referenced_table
ORDER BY referencing_table;

-- If the above returns no rows, run the broader query below to find any FK referencing a UUID column named id in other tables.
--
-- SELECT tc.table_schema, tc.table_name, kcu.column_name, ccu.table_name AS foreign_table, ccu.column_name AS foreign_column
-- FROM information_schema.table_constraints AS tc
-- JOIN information_schema.key_column_usage AS kcu
--   ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
-- JOIN information_schema.constraint_column_usage AS ccu
--   ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
-- WHERE tc.constraint_type = 'FOREIGN KEY'
--   AND ccu.table_name = 'users';
