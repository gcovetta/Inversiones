#!/usr/bin/env python3
"""
sync_omar.py — Sincroniza mejoras de PortafolioGDC.html → PortafolioOmar.html

Uso:  python3 sync_omar.py
      python3 sync_omar.py --dry-run   (muestra cambios sin escribir)

Qué sincroniza:
  • Bloque <style> completo (CSS)
  • Scripts CDN en <head>
  • Estructura HTML del dashboard (page-dashboard)
  • Todas las funciones JS (excepto config personal de Omar)

Qué preserva en Omar:
  • Título, foto de perfil, tag de cartera
  • Supabase URL + KEY propios de Omar
  • localStorage keys (ptOMAR_)
  • myReturns históricos propios de Omar
  • PIN keys (ptOMAR_pin_*)
"""

import re
import sys
import shutil
from datetime import datetime

DRY_RUN = '--dry-run' in sys.argv

GDC_FILE  = 'GDC/PortafolioGDC.html'
OMAR_FILE = 'Omar/PortafolioOmar.html'
BACKUP    = f'Omar/PortafolioOmar.bak_{datetime.now().strftime("%Y%m%d_%H%M%S")}.html'

# ── Valores específicos de Omar que GDC no debe pisar ────────────────────
OMAR_IDENTITY = {
    # título
    'GDC_TITLE':   'Portafolio Tracker — NYSE',
    'OMAR_TITLE':  'Portafolio Omar',
    # foto de perfil
    'GDC_FOTO':    'src="PerfilGaston.png"',
    'OMAR_FOTO':   'src="perfilOmar.png"',
    # tag de cartera en el header
    'GDC_TAG':     '<span class="tag">CarteraGDC</span>',
    'OMAR_TAG':    '<span class="tag">CarteraOmar</span>',
    # texto del nombre
    'GDC_NOMBRE':  '>Portafolio GDC<',
    'OMAR_NOMBRE': '>Portafolio Omar<',
}

# Valores de Supabase de Omar (leídos del archivo original para no hardcodearlos aquí)
def extract_supabase(text):
    url_m = re.search(r"var SUPABASE_URL = '([^']+)'", text)
    key_m = re.search(r"var SUPABASE_KEY = '([^']+)'", text)
    return (url_m.group(1) if url_m else None,
            key_m.group(1) if key_m else None)

def extract_my_returns(text):
    m = re.search(r'var myReturns = \[([^\]]+)\]', text)
    return m.group(0) if m else None

def extract_pin_keys(text):
    pk = re.search(r"var PORT_PIN_KEY='([^']+)'", text)
    sk = re.search(r"var PORT_SESSION_KEY='([^']+)'", text)
    return (pk.group(0) if pk else None, sk.group(0) if sk else None)

def extract_localStorage_prefix(text):
    """Devuelve el prefijo de localStorage: ptNYSE_ (GDC) o ptOMAR_"""
    # Buscar el prefijo más frecuente del patrón pt????_
    matches = re.findall(r"'(pt[A-Z]+_)", text)
    if not matches:
        return None
    # Devolver el más frecuente
    return max(set(matches), key=matches.count)

# ── Extractores de secciones ─────────────────────────────────────────────

def extract_block(text, open_tag, close_tag):
    """Extrae el bloque entre open_tag y close_tag (inclusivos)."""
    start = text.find(open_tag)
    if start == -1:
        return None, -1, -1
    end = text.find(close_tag, start) + len(close_tag)
    return text[start:end], start, end

def extract_style_block(text):
    return extract_block(text, '<style>', '</style>')

def extract_head_cdns(text):
    """Extrae las líneas de CDN entre chart.js y </head>"""
    start = text.find('<script src="https://cdn.jsdelivr.net/npm/chart.js')
    end   = text.find('</head>', start)
    return text[start:end], start, end

def extract_dashboard_html(text):
    """Extrae el div page-dashboard completo."""
    marker = 'id="page-dashboard"'
    pos = text.find(marker)
    if pos == -1:
        return None, -1, -1
    # Retroceder hasta el <div
    start = text.rfind('<div', 0, pos)
    # Cerrar el bloque contando niveles de <div>
    depth = 0
    i = start
    while i < len(text):
        if text[i:i+4] == '<div':
            depth += 1
            i += 4
        elif text[i:i+6] == '</div>':
            depth -= 1
            i += 6
            if depth == 0:
                break
        else:
            i += 1
    return text[start:i], start, i

def extract_script_block(text):
    """Extrae el bloque <script> principal (el último / más grande)."""
    # Puede haber varios <script>; tomamos el que contiene 'renderPortfolio'
    pattern = re.compile(r'<script(?:\s[^>]*)?>.*?</script>', re.DOTALL)
    best = None
    for m in pattern.finditer(text):
        if 'renderPortfolio' in m.group(0):
            best = m
            break
    if best is None:
        return None, -1, -1
    return best.group(0), best.start(), best.end()

# ── Aplicar sustituciones de identidad ───────────────────────────────────

def restore_omar_identity(text, omar_sb_url, omar_sb_key, omar_my_returns,
                          omar_pin_key, omar_session_key, omar_ls_prefix):
    """Reemplaza los valores de GDC con los de Omar en el texto ya copiado."""

    # Supabase
    text = re.sub(r"var SUPABASE_URL = '[^']+'",
                  f"var SUPABASE_URL = '{omar_sb_url}'", text)
    text = re.sub(r"var SUPABASE_KEY = '[^']+'",
                  f"var SUPABASE_KEY = '{omar_sb_key}'", text)

    # localStorage prefix
    gdc_prefix = extract_localStorage_prefix(text)
    if gdc_prefix and omar_ls_prefix and gdc_prefix != omar_ls_prefix:
        text = text.replace(gdc_prefix, omar_ls_prefix)

    # myReturns
    if omar_my_returns:
        text = re.sub(r'var myReturns = \[[^\]]+\]', omar_my_returns, text)

    # PIN keys
    if omar_pin_key:
        text = re.sub(r"var PORT_PIN_KEY='[^']+'", omar_pin_key, text)
    if omar_session_key:
        text = re.sub(r"var PORT_SESSION_KEY='[^']+'", omar_session_key, text)

    # Identidad visual
    for field in ['TITLE', 'FOTO', 'TAG', 'NOMBRE']:
        gdc_val  = OMAR_IDENTITY[f'GDC_{field}']
        omar_val = OMAR_IDENTITY[f'OMAR_{field}']
        text = text.replace(gdc_val, omar_val)

    return text

# ── Main ─────────────────────────────────────────────────────────────────

def main():
    with open(GDC_FILE,  'r', encoding='utf-8') as f: gdc  = f.read()
    with open(OMAR_FILE, 'r', encoding='utf-8') as f: omar = f.read()

    # Capturar valores personales de Omar ANTES de tocar nada
    omar_sb_url, omar_sb_key = extract_supabase(omar)
    omar_my_returns          = extract_my_returns(omar)
    omar_pin_key, omar_sess  = extract_pin_keys(omar)
    omar_ls_prefix           = extract_localStorage_prefix(omar)

    if not all([omar_sb_url, omar_sb_key]):
        print("ERROR: No se encontraron las claves Supabase de Omar. Abortando.")
        sys.exit(1)

    print(f"Omar Supabase URL: {omar_sb_url[:40]}...")
    print(f"Omar localStorage prefix: {omar_ls_prefix}")
    print(f"Omar myReturns: {omar_my_returns}")

    new_omar = omar
    changes = []

    # ── 1. Sincronizar bloque <style> ─────────────────────────────────
    gdc_style,  gs, ge = extract_style_block(gdc)
    omar_style, os_, oe = extract_style_block(new_omar)
    if gdc_style and omar_style and gdc_style != omar_style:
        new_style = restore_omar_identity(gdc_style, omar_sb_url, omar_sb_key,
                                          omar_my_returns, omar_pin_key, omar_sess, omar_ls_prefix)
        new_omar = new_omar[:os_] + new_style + new_omar[oe:]
        changes.append('<style> block')
    else:
        print("  <style> — sin cambios")

    # ── 2. Sincronizar CDN scripts en <head> ──────────────────────────
    gdc_cdns,  gc1, gc2 = extract_head_cdns(gdc)
    omar_cdns, oc1, oc2 = extract_head_cdns(new_omar)
    if gdc_cdns and omar_cdns and gdc_cdns != omar_cdns:
        new_omar = new_omar[:oc1] + gdc_cdns + new_omar[oc2:]
        changes.append('CDN scripts')
    else:
        print("  CDN scripts — sin cambios")

    # ── 3. Sincronizar HTML del dashboard ────────────────────────────
    gdc_db,  gd1, gd2 = extract_dashboard_html(gdc)
    omar_db, od1, od2 = extract_dashboard_html(new_omar)
    if gdc_db and omar_db and gdc_db != omar_db:
        new_omar = new_omar[:od1] + gdc_db + new_omar[od2:]
        changes.append('dashboard HTML')
    else:
        print("  dashboard HTML — sin cambios")

    # ── 4. Sincronizar bloque <script> principal ──────────────────────
    gdc_script,  gsc1, gsc2 = extract_script_block(gdc)
    omar_script, osc1, osc2 = extract_script_block(new_omar)
    if gdc_script and omar_script:
        # Normalizar GDC con sustituciones antes de comparar
        gdc_script_normalized = restore_omar_identity(
            gdc_script, omar_sb_url, omar_sb_key,
            omar_my_returns, omar_pin_key, omar_sess, omar_ls_prefix)
        if gdc_script_normalized != omar_script:
            new_omar = new_omar[:osc1] + gdc_script_normalized + new_omar[osc2:]
            changes.append('<script> block')
        else:
            print("  <script> block — sin cambios")

    # ── Verificar que las claves de Omar quedaron bien ─────────────────
    if omar_sb_url not in new_omar:
        print("ERROR: Supabase URL de Omar no está en el archivo sincronizado. Abortando.")
        sys.exit(1)
    if omar_ls_prefix and omar_ls_prefix not in new_omar:
        print(f"ERROR: Prefijo localStorage '{omar_ls_prefix}' no está en el resultado. Abortando.")
        sys.exit(1)

    if not changes:
        print("\nSin cambios que sincronizar.")
        return

    print(f"\nSecciones sincronizadas: {', '.join(changes)}")
    print(f"Tamaño: {len(omar):,} → {len(new_omar):,} bytes")

    if DRY_RUN:
        print("\n[DRY RUN] No se escribió nada.")
        return

    # Backup + write
    shutil.copy(OMAR_FILE, BACKUP)
    print(f"Backup: {BACKUP}")

    with open(OMAR_FILE, 'w', encoding='utf-8') as f:
        f.write(new_omar)
    print(f"✓ {OMAR_FILE} actualizado.")

if __name__ == '__main__':
    main()
