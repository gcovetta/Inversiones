-- ════════════════════════════════════════════════════════════════════════════
-- VISTA FAMILIAR — permisos de solo lectura
-- Cada bloque va en el Supabase de ESA cartera (SQL Editor → New query → pegar → Run).
-- Le permite a esa persona leer SOLO su resumen (config 'vista_familiar'); nada más.
-- ════════════════════════════════════════════════════════════════════════════

-- ── ANA  (proyecto arxntlqhtrtskabzihlf) ────────────────────────────────────
create policy "vista familiar: Ana lee su resumen" on public.config
  for select to authenticated
  using (key = 'vista_familiar' and lower(auth.jwt() ->> 'email') = 'anifv@hotmail.com');

-- ── HILDA  (proyecto zqlpfvxgtxfnqztiudzc) ──────────────────────────────────
create policy "vista familiar: Hilda lee su resumen" on public.config
  for select to authenticated
  using (key = 'vista_familiar' and lower(auth.jwt() ->> 'email') = 'hildadieguez@hotmail.com');

-- ── JULI  (proyecto ujgkiuqvehidcnbtwrqn) ───────────────────────────────────
create policy "vista familiar: Juli lee su resumen" on public.config
  for select to authenticated
  using (key = 'vista_familiar' and lower(auth.jwt() ->> 'email') = 'julianalvarezsolanas@gmail.com');

-- ── OMAR  (proyecto opbbnvfmgdmdsmbhmgsc) ───────────────────────────────────
create policy "vista familiar: Omar lee su resumen" on public.config
  for select to authenticated
  using (key = 'vista_familiar' and lower(auth.jwt() ->> 'email') = 'kolia-omar@hotmail.com');

-- Para sacarle el acceso a alguien (en su proyecto), por ejemplo Ana:
--   drop policy "vista familiar: Ana lee su resumen" on public.config;
