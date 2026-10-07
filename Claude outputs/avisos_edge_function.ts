// Supabase Edge Function "avisos" — notificaciones push de Inversiones (GDC)
// Corre programada (cron) en días hábiles. Lee de la tabla config:
//   push_subs   → dispositivos suscriptos (los registra la app con 🔔)
//   push_watch  → lo que hay que vigilar (lo publica la app cada vez que la abrís):
//                 posiciones, precios de venta, cobros de los próximos días y fecha de cierre del período
//   push_estado → avisos ya enviados (para no repetir)
// Precios: data912 (BYMA) y tipo de cambio de dolarapi.
// Llamadas: normal (cron, cada hora) → P. Venta, subas de más de 5%, cobros de mañana y cierres
//           ?resumen=1 (cron 17:30) → además manda el resumen del día de la cartera
//                                      y guarda los precios de cierre en la tabla precios_hist (historial)
//           ?test=1 (con tu sesión) → manda un aviso de prueba.
// Cada corrida guarda config push_log (hora, modo, avisos, dispositivos, error) para el panel 🛠 Sistema.
import webpush from "npm:web-push@3.6.7";

const SB = Deno.env.get("SUPABASE_URL")!;
const KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
webpush.setVapidDetails("mailto:gcovetta@gmail.com", Deno.env.get("VAPID_PUBLIC")!, Deno.env.get("VAPID_PRIVATE")!);
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
const DUENO = "gcovetta@gmail.com";

async function getCfg(k: string) {
  const r = await fetch(`${SB}/rest/v1/config?key=eq.${encodeURIComponent(k)}&select=value`, { headers: H });
  const d = await r.json(); let v = d?.[0]?.value;
  if (typeof v === "string") { try { v = JSON.parse(v); } catch { /* */ } }
  return v ?? null;
}
async function setCfg(k: string, v: unknown) {
  await fetch(`${SB}/rest/v1/config?key=eq.${encodeURIComponent(k)}`, { method: "DELETE", headers: H });
  await fetch(`${SB}/rest/v1/config`, { method: "POST", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify({ key: k, value: v, updated_at: new Date().toISOString() }) });
}
// fecha de hoy en Argentina (UTC-3)
function hoyAR(dias = 0) { const d = new Date(Date.now() - 3 * 3600e3 + dias * 86400e3); return d.toISOString().slice(0, 10); }
const fd = (iso: string) => iso.slice(8, 10) + "/" + iso.slice(5, 7);
const n0 = (x: number) => Math.round(x).toLocaleString("es-AR");
const p1 = (x: number) => (x > 0 ? "+" : x < 0 ? "−" : "") + Math.abs(x).toFixed(1).replace(".", ",") + "%";

async function precios() {
  const map: Record<string, number> = {}, pct: Record<string, number> = {};
  for (const p of ["arg_bonds", "arg_corp", "arg_notes", "arg_stocks", "arg_cedears"]) {
    try {
      const r = await fetch(`https://data912.com/live/${p}`, { headers: { Accept: "application/json" } });
      if (!r.ok) continue; const data = await r.json();
      const items = Array.isArray(data) ? data : Object.keys(data || {}).map((k) => ({ symbol: k, ...data[k] }));
      for (const it of items) {
        const t = String(it.ticker || it.symbol || it.id || it.name || "").toUpperCase();
        const px = parseFloat(it.last ?? it.price ?? it.close ?? it.c ?? it.bid ?? 0) || 0;
        if (t && px > 0 && map[t] == null) {
          map[t] = px;
          const prev = parseFloat(it.prev_close ?? it.prevClose ?? it.previous_close ?? 0) || 0;
          const pc = it.pct_change != null ? parseFloat(it.pct_change) : (prev > 0 ? (px - prev) / prev * 100 : NaN);
          if (isFinite(pc)) pct[t] = pc;
        }
      }
    } catch { /* sigue con el resto */ }
  }
  return { map, pct };
}
// Una sola bajada de precios por corrida
let _P: { map: Record<string, number>; pct: Record<string, number> } | null = null;
async function preciosMemo() { if (!_P) _P = await precios(); return _P; }

// Historial: una fila por rueda con el cierre de todos los activos de data912 (+ CCL y MEP)
async function guardarHist(hoy: string): Promise<string> {
  const dow = new Date(hoy + "T12:00:00Z").getUTCDay();
  if (dow === 0 || dow === 6) return "fin de semana";
  const P = await preciosMemo(); const n = Object.keys(P.map).length;
  if (n < 50) return "sin precios";
  // feriado: data912 repite la rueda anterior → si casi todo es igual a lo último guardado, no se guarda
  const r = await fetch(`${SB}/rest/v1/precios_hist?select=fecha,precios&order=fecha.desc&limit=1`, { headers: H });
  if (!r.ok) return "falta la tabla precios_hist";
  const last = (await r.json())?.[0];
  if (last && last.fecha !== hoy && last.precios) {
    let tot = 0, ig = 0;
    for (const k in P.map) if (last.precios[k] != null) { tot++; if (Math.abs(+last.precios[k] - P.map[k]) < 1e-9 || Math.round(P.map[k] * 100) / 100 === +last.precios[k]) ig++; }
    if (tot > 50 && ig / tot > 0.9) return "feriado (sin rueda)";
  }
  const precios: Record<string, number> = {};
  for (const [k, v] of Object.entries(P.map)) precios[k] = Math.round(v * 100) / 100;
  const ccl = await tc("contadoconliqui"), mep = await tc("bolsa");
  const w = await fetch(`${SB}/rest/v1/precios_hist?on_conflict=fecha`, { method: "POST", headers: { ...H, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ fecha: hoy, precios, ccl, mep, ts: new Date().toISOString() }) });
  return w.ok ? `${n} precios` : `error al guardar (${w.status})`;
}

async function tc(tipo: string) { try { const r = await fetch(`https://dolarapi.com/v1/dolares/${tipo}`); const d = await r.json(); return parseFloat(d.venta) || null; } catch { return null; } }

async function enviar(subs: any[], msg: { title: string; body: string; url?: string; tag?: string }) {
  const vivos: any[] = []; let ok = 0;
  for (const s of subs) {
    try { await webpush.sendNotification(s, JSON.stringify(msg), { TTL: 6 * 3600 }); vivos.push(s); ok++; }
    catch (e: any) { if (e?.statusCode !== 404 && e?.statusCode !== 410) vivos.push(s); } // 404/410 = el dispositivo ya no existe
  }
  return { vivos, ok };
}

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-user-token" };

// Deja registro de cada corrida (lo muestra el panel 🛠 Sistema del index)
async function log(modo: string, d: Record<string, unknown>) {
  try { await setCfg("push_log", { ts: Date.now(), modo, ...d }); } catch { /* el registro nunca frena los avisos */ }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const url = new URL(req.url);
  const modo = url.searchParams.get("test") ? "prueba" : url.searchParams.get("resumen") ? "cierre" : "horario";
  try { return await correr(req, url, modo); }
  catch (e: any) { await log(modo, { error: String(e?.message || e) }); return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }), { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }); }
});

async function correr(req: Request, url: URL, modo: string) {
  _P = null;
  const extra: Record<string, unknown> = {};
  if (modo === "cierre") { try { extra.hist = await guardarHist(hoyAR()); } catch (e: any) { extra.hist = "error: " + String(e?.message || e); } }
  let subs: any[] = (await getCfg("push_subs")) || [];
  if (!subs.length) { await log(modo, { ...extra, subs: 0, avisos: 0, enviados: 0 }); return new Response(JSON.stringify({ ok: true, msg: "sin dispositivos suscriptos" }), { headers: { ...CORS, "Content-Type": "application/json" } }); }

  // Aviso de prueba: solo si lo pide el dueño con su sesión
  if (url.searchParams.get("test")) {
    const tok = (req.headers.get("x-user-token") || "");
    const u = await fetch(`${SB}/auth/v1/user`, { headers: { apikey: KEY, Authorization: `Bearer ${tok}` } }).then((r) => r.ok ? r.json() : null).catch(() => null);
    if (!u || u.email !== DUENO) return new Response("no autorizado", { status: 401, headers: CORS });
    const r = await enviar(subs, { title: "🔔 Inversiones", body: "Los avisos funcionan en este dispositivo.", tag: "test" });
    if (r.vivos.length !== subs.length) await setCfg("push_subs", r.vivos);
    await log(modo, { ...extra, subs: r.vivos.length, avisos: 1, enviados: r.ok });
    return new Response(JSON.stringify({ ok: true, enviados: r.ok }), { headers: { ...CORS, "Content-Type": "application/json" } });
  }

  const w = await getCfg("push_watch");
  if (!w) { await log(modo, { ...extra, subs: subs.length, avisos: 0, enviados: 0, error: "sin push_watch (abrí la app una vez)" }); return new Response(JSON.stringify({ ok: true, msg: "sin datos para vigilar (abrí la app una vez)" })); }
  const estado: Record<string, string> = (await getCfg("push_estado")) || {};
  const hoy = hoyAR(), manana = hoyAR(1), avisos: { title: string; body: string; tag: string; key: string }[] = [];
  const cart = w.cartera || "GDC";

  // 1) Precio de venta alcanzado
  const tgs: any[] = w.targets || [], pos: any[] = w.pos || [];
  const P = (tgs.length || pos.length) ? await preciosMemo() : { map: {}, pct: {} };
  const px: Record<string, number> = P.map, pct: Record<string, number> = P.pct;
  if (tgs.length) {
    const ccl = await tc("contadoconliqui"), mep = await tc("bolsa");
    const hits: string[] = [];
    for (const g of tgs) {
      const raw = px[String(g.sym || g.t).toUpperCase()]; if (!raw) continue;
      let usd: number | null = null;
      if (g.k === "usd") usd = raw;                                   // bono comprado en dólares (C/D)
      else if (g.k === "bono") usd = mep ? raw * (g.r || 1) / mep : null;
      else usd = ccl ? raw * (g.r || 1) / ccl : null;                 // Cedears y acciones argentinas
      if (!usd || !(g.pv > 0)) continue;
      if (g.last > 0 && (usd / g.last > 2.5 || usd / g.last < 0.4)) continue; // precio raro: no avisar
      const key = `pv:${g.t}:${g.pv}`;
      if (usd >= g.pv && !estado[key]) { hits.push(`${g.t} (USD ${usd.toFixed(2)} ≥ ${g.pv})`); estado[key] = hoy; }
      if (usd < g.pv * 0.97 && estado[key]) delete estado[key];        // si vuelve a bajar, puede volver a avisar
    }
    if (hits.length) avisos.push({ title: `🎯 ${cart}: P. Venta alcanzado`, body: hits.join(" · "), tag: "pv", key: "" });
  }
  // 1b) Subas de más de 5% en el día (una vez por activo y por día)
  const subas = pos.map((p: any) => ({ t: p.t, c: pct[String(p.sym || p.t).toUpperCase()] })).filter((x: any) => isFinite(x.c) && x.c >= 5 && !estado[`up5:${x.t}:${hoy}`]);
  if (subas.length) {
    subas.sort((a: any, b: any) => b.c - a.c);
    avisos.push({ title: `🚀 ${cart}: suba de más de 5%`, body: subas.map((x: any) => `${x.t} ${p1(x.c)}`).join(" · "), tag: "up5", key: "" });
    subas.forEach((x: any) => { estado[`up5:${x.t}:${hoy}`] = hoy; });
  }
  // 1c) Resumen del día (corrida de las 17:30): como "Desde tu última visita" de la app
  if (url.searchParams.get("resumen") && pos.length && !estado[`res:${hoy}`]) {
    let tot = 0, dif = 0; const mov: { t: string; c: number }[] = [];
    for (const p of pos) {
      const v = +p.v || 0; tot += v; const c = pct[String(p.sym || p.t).toUpperCase()];
      if (!isFinite(c) || !v) continue; dif += v - v / (1 + c / 100); if (c !== 0) mov.push({ t: p.t, c });
    }
    tot += +w.liq || 0;
    const base = tot - dif, tp = base > 0 ? dif / base * 100 : 0;
    const up = mov.filter((x) => x.c > 0).sort((a, b) => b.c - a.c).slice(0, 3), dn = mov.filter((x) => x.c < 0).sort((a, b) => a.c - b.c).slice(0, 3);
    const body = `Hoy ${p1(tp)} (${dif >= 0 ? "+" : "−"}USD ${n0(Math.abs(dif))})` +
      (up.length ? ` · subieron ${up.map((x) => `${x.t} ${p1(x.c)}`).join(", ")}` : "") +
      (dn.length ? ` · bajaron ${dn.map((x) => `${x.t} ${p1(x.c)}`).join(", ")}` : "");
    avisos.push({ title: `📊 ${cart} al cierre · USD ${n0(tot)}`, body, tag: "res", key: `res:${hoy}` });
  }
  // 2) Cobros de mañana
  const cob = (w.cobros || []).filter((c: any) => c.f === manana);
  const kc = `cob:${manana}`;
  if (cob.length && !estado[kc]) {
    avisos.push({ title: `💰 ${cart}: mañana cobrás`, body: cob.map((c: any) => `${c.t} ${c.m === "USD" ? "USD " : "$ "}${n0(c.x)}`).join(" · "), tag: "cob", key: kc });
  }
  // 3) Cierre de período (7 días antes y el día del corte)
  for (const c of (w.cortes || [])) {
    const dias = Math.round((Date.parse(c.fecha) - Date.parse(hoy)) / 86400e3);
    const k = `cie:${c.nombre}:${c.fecha}:${dias}`;
    if ((dias === 7 || dias === 0) && !estado[k]) avisos.push({ title: `📅 ${c.nombre}: cierre de período`, body: dias ? `El período cierra el ${fd(c.fecha)} (en 7 días).` : `Hoy cierra el período: abrí la app y tocá "Cerrar período".`, tag: "cie", key: k });
  }

  let enviados = 0;
  for (const a of avisos) {
    const r = await enviar(subs, { title: a.title, body: a.body, tag: a.tag, url: w.url || undefined });
    enviados += r.ok; subs = r.vivos; if (a.key) estado[a.key] = hoy;
  }
  // limpiar marcas viejas (más de 60 días) y guardar
  const lim = hoyAR(-60); for (const k of Object.keys(estado)) if (estado[k] < lim) delete estado[k];
  await setCfg("push_estado", estado);
  if (avisos.length) await setCfg("push_subs", subs);
  await log(modo, { ...extra, subs: subs.length, avisos: avisos.length, enviados, precios: Object.keys(px).length });
  return new Response(JSON.stringify({ ok: true, avisos: avisos.length, enviados }), { headers: { ...CORS, "Content-Type": "application/json" } });
}
