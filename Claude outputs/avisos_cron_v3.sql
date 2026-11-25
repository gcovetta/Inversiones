-- Avisos cada 15 minutos en horario de mercado (para que el arbitraje avise a tiempo)
-- Supabase de GDC → SQL Editor → New query → Run
-- · Cada 15 min de 11:00 a 16:45 (hora Argentina), lunes a viernes: arbitraje, P. Venta, subas, cobros y cierres
--   (cada aviso se manda una sola vez: repetir la corrida no duplica los avisos)
-- · El de las 17:30 con el resumen del día queda igual.

select cron.unschedule('avisos-horario');

select cron.schedule(
  'avisos-horario',
  '*/15 14-19 * * 1-5',
  $$ select net.http_post(
       url := 'https://wstnseufzyavgdovrehu.supabase.co/functions/v1/avisos',
       headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdG5zZXVmenlhdmdkb3ZyZWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzU0MTYsImV4cCI6MjA5MTM1MTQxNn0.0mmKvfCM_HoBJjbIhFzM5TeKEc-LphQwEXNjHqV_CfU'),
       body := '{}'::jsonb
     ); $$
);

-- Para verlos:  select jobname, schedule from cron.job;
