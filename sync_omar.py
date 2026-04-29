#!/usr/bin/env python3
"""
sync_portfolios.py — Sincroniza mejoras de PortafolioGDC.html a todos los portfolios.

Portfolios sincronizados:
  • Omar/PortafolioOmar2.html
  • Ana/PortafolioAna2.html

Uso:  python3 sync_omar.py
      python3 sync_omar.py --dry-run
      python3 sync_omar.py omar
      python3 sync_omar.py ana

Qué sincroniza:
  • Bloque <style> completo (CSS)
  • Scripts CDN en <head>
  • Estructura HTML del dashboard (page-dashboard)
  • Bloque <script> principal (todas las funciones JS)

Qué preserva por portfolio:
  • Título, foto de perfil, nombre en header
  • Supabase URL + KEY propios
  • myReturns históricos propios
  • PIN keys propias

Qué limpia en destino (Omar/Ana siempre arrancan vacíos):
  • PRELOADED = []
  • SYNC_OTHERS = []
  • Paneles ocultos al inicio
  • tbodys de paneles vacíos
  • divs-content vacío
  • trk-tbody vacío
  • Métricas hardcodeadas → —
  • localStorage wipe al arrancar
  • PIN desactivado
"""

import re
import sys
import shutil
import subprocess
from datetime import datetime

DRY_RUN = '--dry-run' in sys.argv
ONLY    = next((a for a in sys.argv[1:] if not a.startswith('--')), None)

GDC_FILE = 'GDC/PortafolioGDC.html'

PORTFOLIOS = {
    'omar': {
        'file':   'Omar/PortafolioOmar2.html',
        'title':  'Portafolio - Omar',
        'foto':   'src="../Omar/perfilOmar.png"',
        'nombre': 'Portafolio - Omar',
        'nav1_href': '../GDC/PortafolioGDC.html', 'nav1_label': 'Portafolio GDC',
        'nav2_href': '../Ana/PortafolioAna2.html', 'nav2_label': 'Portafolio Ana',
    },
    'ana': {
        'file':   'Ana/PortafolioAna2.html',
        'title':  'Portafolio - Ana',
        'foto':   'src="../Ana/PerfilAna.png"',
        'nombre': 'Portafolio - Ana',
        'nav1_href': '../GDC/PortafolioGDC.html', 'nav1_label': 'Portafolio GDC',
        'nav2_href': '../Omar/PortafolioOmar2.html', 'nav2_label': 'Portafolio Omar',
    },
}

GDC_TITLE  = 'Portafolio Tracker — NYSE'
GDC_FOTO   = 'src="PerfilGaston.png"'
GDC_NOMBRE = 'Portafolio Gastón'

# ── Extractores ───────────────────────────────────────────────────────────

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

# ── Limpiezas específicas para Omar/Ana ──────────────────────────────────

def apply_clean_transforms(text, cfg):
    """Aplica todas las limpiezas necesarias para que Omar/Ana arranquen vacíos."""

    # 1. PRELOADED y SYNC_OTHERS vacíos
    text = re.sub(r'var PRELOADED = \[.*?\];', 'var PRELOADED = [];', text, flags=re.DOTALL)
    text = re.sub(r'var SYNC_OTHERS = \[.*?\];', 'var SYNC_OTHERS = [];', text, flags=re.DOTALL)

    # 2. Nav links
    text = text.replace('../Ana/PortafolioAna.html', cfg['nav1_href'])
    text = text.replace('Portafolio Ana', cfg['nav1_label'], 1)
    text = text.replace('../Omar/PortafolioOmar.html', cfg['nav2_href'])
    text = text.replace('Portafolio Omar', cfg['nav2_label'], 1)

    # 3. Vaciar tbody de paneles
    for bid in ['body-nyse','body-brasil','body-europa','body-bonos','body-on','body-argentina','body-cripto','body-china']:
        text = re.sub(r'(<tbody id="' + bid + r'">)(.*?)(</tbody>)',
                      lambda m: m.group(1) + m.group(3), text, flags=re.DOTALL)

    # 4. Vaciar panel-meta
    for pid in ['panel-nyse-meta','panel-brasil-meta','panel-europa-meta','panel-bonos-meta',
                'panel-on-meta','panel-argentina-meta','panel-cripto-meta','panel-china-meta']:
        text = re.sub(r'(<span id="' + pid + r'"[^>]*>)(.*?)(</span>)',
                      lambda m: m.group(1) + m.group(3), text, flags=re.DOTALL)

    # 5. Ocultar paneles al inicio
    for pid in ['panel-nyse','panel-brasil','panel-europa','panel-bonos',
                'panel-on','panel-argentina','panel-cripto','panel-china']:
        text = text.replace(f'<div class="card" id="{pid}" style="">',
                            f'<div class="card" id="{pid}" style="display:none">')
        text = text.replace(f'<div class="card" id="{pid}" style="display: none;">',
                            f'<div class="card" id="{pid}" style="display:none">')

    # 6. Limpiar métricas principales hardcodeadas
    text = text.replace('>$230.121<', '>—<')
    text = re.sub(r'id="m-rend"><span[^>]+>\+21%</span>', 'id="m-rend">—', text)
    text = re.sub(r'id="m-ganancia"><span[^>]+>\+\$40\.187</span>', 'id="m-ganancia">—', text)
    text = text.replace('>$97.010<', '>—<')
    text = text.replace('>$2.819.117<', '>—<')
    text = text.replace('>$4.228.676<', '>—<')
    text = text.replace('>$2.652<', '>—<')

    # 7. Vaciar divs-content (gráfico dividendos hardcodeado)
    start_idx = text.find('<div id="divs-content"')
    if start_idx >= 0:
        line_end = text.index('\n', start_idx)
        text = text[:start_idx] + '<div id="divs-content" class=""></div>' + text[line_end:]

    # 8. Vaciar trk-tbody
    text = re.sub(r'(<tbody id="trk-tbody">)(.*?)(</tbody>)',
                  lambda m: m.group(1) + m.group(3), text, flags=re.DOTALL)

    # 9. Limpiar métricas tracker
    text = text.replace('>USD 2.453,72<', '>—<')
    text = text.replace('>USD 10,67<', '>—<')
    text = text.replace('>Total: USD 2.453,72<', '>Total: USD 0<')
    text = text.replace('>≈ $3.608.931 ARS<', '><')

    # 10. PIN desactivado
    text = text.replace(
        'function portCheckSession(){',
        'function portCheckSession(){portUnblur();return; // PIN desactivado'
    )
    text = text.replace(
        'renderMovimientos();renderPortfolio();renderRatios();renderTargets();renderDividendos();renderDivsCard();portCheckSession();',
        'renderMovimientos();renderPortfolio();renderRatios();renderTargets();renderDividendos();renderDivsCard();portUnblur();'
    )

    # 11. Script limpieza total localStorage al arrancar
    cleanup = '<script>(function(){try{Object.keys(localStorage).forEach(function(k){localStorage.removeItem(k);});}catch(e){}})();</script>\n'
    if 'Object.keys(localStorage)' not in text:
        text = text.replace('<script>\n// ── Soporte coma', cleanup + '<script>\n// ── Soporte coma', 1)

    # 12. Null checks para panel-china eliminado
    text = text.replace(
        "['panel-nyse','panel-bonos','panel-argentina','panel-brasil','panel-europa','panel-on','panel-china','panel-cripto'].forEach(function(id){document.getElementById(id).style.display='none';});",
        "['panel-nyse','panel-bonos','panel-argentina','panel-brasil','panel-europa','panel-on','panel-china','panel-cripto'].forEach(function(id){var el=document.getElementById(id);if(el)el.style.display='none';});"
    )
    text = text.replace(
        "    if(!rows||!rows.length){panel.style.display='none';return;}\n    panel.style.display='';body.innerHTML=rows.join('');",
        "    if(!panel||!body){return;}\n    if(!rows||!rows.length){panel.style.display='none';return;}\n    panel.style.display='';body.innerHTML=rows.join('');"
    )

    return text

# ── Restaurar identidad ───────────────────────────────────────────────────

def restore_identity(text, cfg, sb_url, sb_key, my_returns, pin_key, sess_key):
    text = re.sub(r"var SUPABASE_URL = '[^']+'", f"var SUPABASE_URL = '{sb_url}'", text)
    text = re.sub(r"var SUPABASE_KEY = '[^']+'", f"var SUPABASE_KEY = '{sb_key}'", text)
    if my_returns:
        text = re.sub(r'var myReturns = \[[^\]]+\]', my_returns, text)
    if pin_key:
        text = re.sub(r"var PORT_PIN_KEY='[^']+'", pin_key, text)
    if sess_key:
        text = re.sub(r"var PORT_SESSION_KEY='[^']+'", sess_key, text)
    text = text.replace(GDC_TITLE,  cfg['title'])
    text = text.replace(GDC_FOTO,   cfg['foto'])
    text = text.replace(GDC_NOMBRE, cfg['nombre'])
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

    sb_url, sb_key = extract_supabase(target)
    my_returns     = extract_my_returns(target)
    pin_key, sess  = extract_pin_keys(target)

    if not all([sb_url, sb_key]):
        print(f"  ERROR: No se encontraron claves Supabase. Abortando.")
        return False

    print(f"  Supabase URL : {sb_url[:45]}...")

    new_target = target
    changes    = []

    # <style>
    gdc_style, gs, ge = extract_style_block(gdc)
    tgt_style, ts, te = extract_style_block(new_target)
    if gdc_style and tgt_style:
        normed = restore_identity(gdc_style, cfg, sb_url, sb_key, my_returns, pin_key, sess)
        if normed != tgt_style:
            new_target = new_target[:ts] + normed + new_target[te:]
            changes.append('<style>')

    # CDN scripts
    gdc_cdns, gc1, gc2 = extract_head_cdns(gdc)
    tgt_cdns, tc1, tc2 = extract_head_cdns(new_target)
    if gdc_cdns and tgt_cdns and gdc_cdns != tgt_cdns:
        new_target = new_target[:tc1] + gdc_cdns + new_target[tc2:]
        changes.append('CDN')

    # Dashboard HTML
    gdc_db, gd1, gd2 = extract_dashboard_html(gdc)
    tgt_db, td1, td2 = extract_dashboard_html(new_target)
    if gdc_db and tgt_db and gdc_db != tgt_db:
        new_target = new_target[:td1] + gdc_db + new_target[td2:]
        changes.append('dashboard HTML')

    # <script> principal
    gdc_js, gjs1, gjs2 = extract_script_block(gdc)
    tgt_js, tjs1, tjs2 = extract_script_block(new_target)
    if gdc_js and tgt_js:
        normed = restore_identity(gdc_js, cfg, sb_url, sb_key, my_returns, pin_key, sess)
        if normed != tgt_js:
            new_target = new_target[:tjs1] + normed + new_target[tjs2:]
            changes.append('<script>')

    # Aplicar limpiezas específicas Omar/Ana SIEMPRE
    new_target = apply_clean_transforms(new_target, cfg)
    changes.append('clean transforms')

    # Verificaciones
    if sb_url not in new_target:
        print(f"  ERROR: Supabase URL perdida. Abortando.")
        return False

    print(f"  Sincronizado: {', '.join(changes)}")
    print(f"  Tamaño: {len(target):,} → {len(new_target):,} bytes")

    if DRY_RUN:
        print("  [DRY RUN] No se escribió nada.")
        return True

    backup = target_file.replace('.html', f'.bak_{datetime.now().strftime("%Y%m%d_%H%M%S")}.html')
    shutil.copy(target_file, backup)

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

    if not DRY_RUN:
        print(f"\n{'─'*50}")
        print("  SYNC RATIOS  →  Supabase Omar + Ana")
        print(f"{'─'*50}")
        script = sys.argv[0].replace('sync_omar.py', 'sync_ratios.py')
        import os
        if os.path.exists(script):
            args = [sys.executable, script]
            if ONLY:
                args.append(ONLY)
            result = subprocess.run(args, capture_output=False)
            if result.returncode != 0:
                print("  ADVERTENCIA: sync_ratios.py terminó con error.")

    print()

if __name__ == '__main__':
    main()
