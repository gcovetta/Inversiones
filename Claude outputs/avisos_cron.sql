-- Programa la función "avisos" de lunes a viernes a las 11:00 y a las 17:00 (hora de Argentina = UTC-3).
-- Pegalo en Supabase (GDC) → SQL Editor → New query → Run.
-- Antes: Database → Extensions → activar "pg_cron" y "pg_net".

select cron.schedule(
  'avisos-11hs',
  '0 14 * * 1-5',
  $$ select net.http_post(
       url := 'https://wstnseufzyavgdovrehu.supabase.co/functions/v1/avisos',
       headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdG5zZXVmenlhdmdkb3ZyZWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzU0MTYsImV4cCI6MjA5MTM1MTQxNn0.0mmKvfCM_HoBJjbIhFzM5TeKEc-LphQwEXNjHqV_CfU'),
       body := '{}'::jsonb
     ); $$
);

select cron.schedule(
  'avisos-17hs',
  '0 20 * * 1-5',
  $$ select net.http_post(
       url := 'https://wstnseufzyavgdovrehu.supabase.co/functions/v1/avisos',
       headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdG5zZXVmenlhdmdkb3ZyZWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzU0MTYsImV4cCI6MjA5MTM1MTQxNn0.0mmKvfCM_HoBJjbIhFzM5TeKEc-LphQwEXNjHqV_CfU'),
       body := '{}'::jsonb
     ); $$
);

-- Para ver que quedaron:   select jobname, schedule from cron.job;
-- Para borrarlos:          select cron.unschedule('avisos-11hs'); select cron.unschedule('avisos-17hs');
