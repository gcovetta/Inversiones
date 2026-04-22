#!/usr/bin/env python3
"""
sync_portfolios.py — Sincroniza mejoras de PortafolioGDC.html a todos los portfolios.

Portfolios sincronizados:
  • Omar/PortafolioOmar.html
  • Ana/PortafolioAna.html

Uso:  python3 sync_omar.py
      python3 sync_omar.py --dry-run   (muestra cambios sin escribir)
      python3 sync_omar.py omar        (solo sincroniza Omar)
      python3 sync_omar.py ana         (solo sincroniza Ana)

Qué sincroniza:
  • Bloque <style> completo (CSS)
  • Scripts CDN en <head>
  • Estructura HTML del dashboard (page-dashboard)
  • Bloque <script> principal (todas las funciones JS)

Qué preserva por portfolio:
  • Título, foto de perfil, nombre en header
  • Supabase URL + KEY propios de cada portfolio
  • localStorage prefix (ptOMAR_, ptANA_, ...)
  • myReturns históricos propios de cada portfolio
  • PIN keys propias
"""

import re
import sys
import shutil
import subprocess
from datetime import datetime

DRY_RUN    = '--dry-run' in sys.argv
ONLY       = next((a for a in sys.argv[1:] if not a.startswith('--')), None)

GDC_FILE   = 'GDC/PortafolioGDC.html'

# ── Configuración de cada portfolio ──────────────────────────────────────
PORTFOLIOS = {
    'omar': {
        'file':    'Omar/PortafolioOmar.html',
        'title':   'Portafolio Omar',
        'foto':    'src="perfilOmar.png"',
        'nombre':  'Portafolio Omar',
    },
    'ana': {
        'file':    'Ana/PortafolioAna.html',
        'title':   'Portafolio Ana',
        'foto':    'src="PerfilAna.png"',
        'nombre':  'Portafolio Ana',
    },
}

# Valores GDC que se reemplazan en todos los portfolios
GDC_TITLE  = 'Portafolio Tracker — NYSE'
GDC_FOTO   = 'src="PerfilGaston.png"'
GDC_NOMBRE = 'Portafolio Gastón'

# ── Extractores de valores personales ────────────────────────────────────

def extract_supabase(text):
    url_m = re.search(r"var SUPABASE_URL = '([^']+)'", text)
    key_m = re.search(r"var SUPABASE_KEY = '([^']+)'", text)
    return (url_m.group(1) if url_m else None,
            key_m.group(1) if key_m else None)

def extract_my_returns(text):
    m = re.search(r'var myReturns = \[[^\]]+\]', text)
    return m.group(0) if m else None

def extract_pin_keys(text):
    pk = re.search(r"var PORT_PIN_KEY='([^']+)'", text)
    sk = re.search(r"var PORT_SESSION_KEY='([^']+)'", text)
    return (pk.group(0) if pk else None, sk.group(0) if sk else None)

def extract_ls_prefix(text):
    matches = re.findall(r"'(pt[A-Z]+_)", text)
    return max(set(matches), key=matches.count) if matches else None

# ── Extractores de secciones del HTML ────────────────────────────────────

def extract_block(text, open_tag, close_tag):
    start = text.find(open_tag)
    if start == -1:
        return None, -1, -1
    end = text.find(close_tag, start) + len(close_tag)
    return text[start:end], start, end

def extract_style_block(text):
    return extract_block(text, '<style>', '</style>')

def extract_head_cdns(text):
    start = text.find('<script src="https://cdn.jsdelivr.net/npm/chart.js')
    end   = text.find('</head>', start)
    return text[start:end], start, end

def extract_dashboard_html(text):
    marker = 'id="page-dashboard"'
    pos = text.find(marker)
    if pos == -1:
        return None, -1, -1
    start = text.rfind('<div', 0, pos)
    depth, i = 0, start
    while i < len(text):
        if text[i:i+4] == '<div':
            depth += 1; i += 4
        elif text[i:i+6] == '</div>':
            depth -= 1; i += 6
            if depth == 0: break
        else:
            i += 1
    return text[start:i], start, i

def extract_script_block(text):
    pattern = re.compile(r'<script(?:\s[^>]*)?>.*?</script>', re.DOTALL)
    for m in pattern.finditer(text):
        if 'renderPortfolio' in m.group(0):
            return m.group(0), m.start(), m.end()
    return None, -1, -1

# ── Aplicar sustituciones de identidad ───────────────────────────────────

def clear_preloaded_data(text):
    """Vacía PRELOADED para que no haya movimientos GDC hardcodeados.
    TARGET_TABLE se preserva porque es configuración compartida (P. Venta)."""
    text = re.sub(r'var PRELOADED\s*=\s*\[[^\]]*\]', 'var PRELOADED = []', text, flags=re.DOTALL)
    return text

def restore_identity(text, cfg, sb_url, sb_key, my_returns, pin_key, sess_key, ls_prefix):
    """Sustituye valores GDC con los del portfolio destino."""

    # Supabase
    text = re.sub(r"var SUPABASE_URL = '[^']+'",
                  f"var SUPABASE_URL = '{sb_url}'", text)
    text = re.sub(r"var SUPABASE_KEY = '[^']+'",
                  f"var SUPABASE_KEY = '{sb_key}'", text)

    # localStorage prefix
    gdc_prefix = extract_ls_prefix(text)
    if gdc_prefix and ls_prefix and gdc_prefix != ls_prefix:
        text = text.replace(gdc_prefix, ls_prefix)

    # myReturns
    if my_returns:
        text = re.sub(r'var myReturns = \[[^\]]+\]', my_returns, text)

    # PIN keys
    if pin_key:
        text = re.sub(r"var PORT_PIN_KEY='[^']+'", pin_key, text)
    if sess_key:
        text = re.sub(r"var PORT_SESSION_KEY='[^']+'", sess_key, text)

    # Identidad visual
    text = text.replace(GDC_TITLE,  cfg['title'])
    text = text.replace(GDC_FOTO,   cfg['foto'])
    text = text.replace(GDC_NOMBRE, cfg['nombre'])

    # Vaciar datos hardcodeados del GDC
    text = clear_preloaded_data(text)

    return text

# ── Sincronizar un portfolio ──────────────────────────────────────────────

def sync_portfolio(name, cfg, gdc):
    target_file = cfg['file']
    print(f"\n{'─'*50}")
    print(f"  {name.upper()}  →  {target_file}")
    print(f"{'─'*50}")

    try:
        with open(target_file, 'r', encoding='utf-8') as f:
            target = f.read()
    except FileNotFoundError:
        print(f"  ERROR: {target_file} no existe.")
        return False

    # Capturar valores personales ANTES de tocar nada
    sb_url, sb_key  = extract_supabase(target)
    my_returns      = extract_my_returns(target)
    pin_key, sess   = extract_pin_keys(target)
    ls_prefix       = extract_ls_prefix(target)

    if not all([sb_url, sb_key]):
        print(f"  ERROR: No se encontraron claves Supabase. Abortando este portfolio.")
        return False

    print(f"  Supabase URL : {sb_url[:45]}...")
    print(f"  LS prefix    : {ls_prefix}")
    print(f"  myReturns    : {my_returns}")

    new_target = target
    changes    = []

    # ── <style> ──────────────────────────────────────────────────────────
    gdc_style,   gs,  ge  = extract_style_block(gdc)
    tgt_style,  ts_, te_  = extract_style_block(new_target)
    if gdc_style and tgt_style:
        normed = restore_identity(gdc_style, cfg, sb_url, sb_key,
                                  my_returns, pin_key, sess, ls_prefix)
        if normed != tgt_style:
            new_target = new_target[:ts_] + normed + new_target[te_:]
            changes.append('<style>')
        else:
            print("  <style>           — sin cambios")

    # ── CDN scripts ──────────────────────────────────────────────────────
    gdc_cdns, gc1, gc2 = extract_head_cdns(gdc)
    tgt_cdns, tc1, tc2 = extract_head_cdns(new_target)
    if gdc_cdns and tgt_cdns and gdc_cdns != tgt_cdns:
        new_target = new_target[:tc1] + gdc_cdns + new_target[tc2:]
        changes.append('CDN')
    else:
        print("  CDN scripts       — sin cambios")

    # ── Dashboard HTML ───────────────────────────────────────────────────
    gdc_db, gd1, gd2 = extract_dashboard_html(gdc)
    tgt_db, td1, td2 = extract_dashboard_html(new_target)
    if gdc_db and tgt_db and gdc_db != tgt_db:
        new_target = new_target[:td1] + gdc_db + new_target[td2:]
        changes.append('dashboard HTML')
    else:
        print("  dashboard HTML    — sin cambios")

    # ── <script> principal ───────────────────────────────────────────────
    gdc_js,  gjs1, gjs2 = extract_script_block(gdc)
    tgt_js,  tjs1, tjs2 = extract_script_block(new_target)
    if gdc_js and tgt_js:
        normed = restore_identity(gdc_js, cfg, sb_url, sb_key,
                                  my_returns, pin_key, sess, ls_prefix)
        if normed != tgt_js:
            new_target = new_target[:tjs1] + normed + new_target[tjs2:]
            changes.append('<script>')
        else:
            print("  <script>          — sin cambios")

    # ── Verificaciones ───────────────────────────────────────────────────
    if sb_url not in new_target:
        print(f"  ERROR: Supabase URL no está en el resultado. Abortando.")
        return False
    if ls_prefix and ls_prefix not in new_target:
        print(f"  ERROR: Prefijo LS '{ls_prefix}' no está en el resultado. Abortando.")
        return False

    if not changes:
        print("\n  Sin cambios que sincronizar.")
        return True

    print(f"\n  Sincronizado: {', '.join(changes)}")
    print(f"  Tamaño: {len(target):,} → {len(new_target):,} bytes")

    if DRY_RUN:
        print("  [DRY RUN] No se escribió nada.")
        return True

    backup = target_file.replace('.html', f'.bak_{datetime.now().strftime("%Y%m%d_%H%M%S")}.html')
    shutil.copy(target_file, backup)
    print(f"  Backup: {backup}")

    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(new_target)
    print(f"  ✓ {target_file} actualizado.")
    return True

# ── Main ─────────────────────────────────────────────────────────────────

def main():
    with open(GDC_FILE, 'r', encoding='utf-8') as f:
        gdc = f.read()

    targets = {k: v for k, v in PORTFOLIOS.items()
               if ONLY is None or k == ONLY.lower()}

    if not targets:
        print(f"Portfolio '{ONLY}' no reconocido. Opciones: {', '.join(PORTFOLIOS)}")
        sys.exit(1)

    for name, cfg in targets.items():
        sync_portfolio(name, cfg, gdc)

    # ── Sync ratios GDC → todos los portfolios destino ────────────────────
    if not DRY_RUN:
        print(f"\n{'─'*50}")
        print("  SYNC RATIOS  →  Supabase Omar + Ana")
        print(f"{'─'*50}")
        script = sys.argv[0].replace('sync_omar.py', 'sync_ratios.py')
        args = [sys.executable, script]
        if ONLY:
            args.append(ONLY)
        result = subprocess.run(args, capture_output=False)
        if result.returncode != 0:
            print("  ADVERTENCIA: sync_ratios.py terminó con error.")

    print()

if __name__ == '__main__':
    main()
