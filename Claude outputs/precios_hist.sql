-- HISTORIAL DE PRECIOS — correr una sola vez en el Supabase de GDC (proyecto wstnseufzyavgdovrehu)
-- Una fila por rueda con el cierre de todos los activos (data912) + CCL y MEP.
-- La escribe la función "avisos" (corrida de las 17:30). Son precios públicos de mercado:
-- cualquiera puede leerlos (así lo usan los 5 portafolios), nadie puede escribirlos salvo la función.
create table if not exists public.precios_hist (
  fecha date primary key,
  precios jsonb not null,
  ccl numeric,
  mep numeric,
  ts timestamptz not null default now()
);
alter table public.precios_hist enable row level security;
grant select on public.precios_hist to anon, authenticated;
create policy "precios de mercado: lectura" on public.precios_hist
  for select to anon, authenticated using (true);

-- Para ver cuánto ocupa:  select pg_size_pretty(pg_total_relation_size('public.precios_hist'));
