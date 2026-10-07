-- Nuevos horarios de los avisos (Supabase de GDC → SQL Editor → New query → Run)
-- · Cada hora de 12 a 16 (hora Argentina), lunes a viernes: P. Venta, subas de más de 5%, cobros y cierres
-- · 17:30: lo mismo + el resumen del día
-- Primero se borran los dos horarios anteriores.

select cron.unschedule('avisos-11hs');
select cron.unschedule('avisos-17hs');

select cron.schedule(
  'avisos-horario',
  '0 15-19 * * 1-5',
  $$ select net.http_post(
       url := 'https://wstnseufzyavgdovrehu.supabase.co/functions/v1/avisos',
       headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdG5zZXVmenlhdmdkb3ZyZWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzU0MTYsImV4cCI6MjA5MTM1MTQxNn0.0mmKvfCM_HoBJjbIhFzM5TeKEc-LphQwEXNjHqV_CfU'),
       body := '{}'::jsonb
     ); $$
);

select cron.schedule(
  'avisos-cierre',
  '30 20 * * 1-5',
  $$ select net.http_post(
       url := 'https://wstnseufzyavgdovrehu.supabase.co/functions/v1/avisos?resumen=1',
       headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdG5zZXVmenlhdmdkb3ZyZWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzU0MTYsImV4cCI6MjA5MTM1MTQxNn0.0mmKvfCM_HoBJjbIhFzM5TeKEc-LphQwEXNjHqV_CfU'),
       body := '{}'::jsonb
     ); $$
);

-- Para verlos:  select jobname, schedule from cron.job;
