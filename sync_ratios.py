#!/usr/bin/env python3
"""
sync_ratios.py — Sincroniza configuración compartida de GDC → Omar y Ana.

Sincroniza:
  • ratios    — ratios CEDEAR por ticker
  • targets   — P. Venta por ticker
  • rubros    — clasificación de rubros por ticker

Uso:
  python3 sync_ratios.py           (sincroniza Omar y Ana)
  python3 sync_ratios.py omar      (solo Omar)
  python3 sync_ratios.py ana       (solo Ana)
  python3 sync_ratios.py --dry-run (muestra valores sin escribir)
"""

import sys
import json
import urllib.request

DRY_RUN = '--dry-run' in sys.argv
ONLY    = next((a for a in sys.argv[1:] if not a.startswith('--')), None)

SUPABASE = {
    'gdc': {
        'url': 'https://wstnseufzyavgdovrehu.supabase.co',
        'key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdG5zZXVmenlhdmdkb3ZyZWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzU0MTYsImV4cCI6MjA5MTM1MTQxNn0.0mmKvfCM_HoBJjbIhFzM5TeKEc-LphQwEXNjHqV_CfU',
    },
    'omar': {
        'url': 'https://bekepiyyyxipyduawuyq.supabase.co',
        'key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJla2VwaXl5eXhpcHlkdWF3dXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTA1MDYsImV4cCI6MjA5MjI2NjUwNn0.1gNq-GlKBpaSGZXWZAAtiWHhwIr8V0MWMcss69cW6Bs',
    },
    'ana': {
        'url': 'https://arxntlqhtrtskabzihlf.supabase.co',
        'key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyeG50bHFodHJ0c2thYnppaGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTEyMDMsImV4cCI6MjA5MjM2NzIwM30.q3qnU2rkLDF4xwaKXvu8FvknJBIbhxWj01GRzY6l4dg',
    },
}

# Claves a sincronizar: (config_key, label)
SYNC_KEYS = [
    ('ratios',  'Ratios CEDEAR'),
    ('targets', 'P. Venta'),
    ('rubros',  'Rubros'),
]

def sb_headers(key):
    return {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': f'Bearer {key}',
    }

def sb_get(url, key, path):
    req = urllib.request.Request(f'{url}/rest/v1/{path}', headers=sb_headers(key))
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())

def sb_upsert(url, key, table, payload):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        f'{url}/rest/v1/{table}',
        data=data,
        headers={**sb_headers(key), 'Prefer': 'resolution=merge-duplicates'},
        method='POST',
    )
    with urllib.request.urlopen(req, timeout=10) as r:
        return r.status

def fetch_config(name, config_key):
    cfg = SUPABASE[name]
    rows = sb_get(cfg['url'], cfg['key'], f'config?key=eq.{config_key}&select=value')
    if not rows:
        return None
    val = rows[0].get('value', '{}')
    return json.loads(val) if isinstance(val, str) else val

def push_config(name, config_key, value):
    cfg = SUPABASE[name]
    payload = {'key': config_key, 'value': json.dumps(value)}
    return sb_upsert(cfg['url'], cfg['key'], 'config', payload)

# ── Main ─────────────────────────────────────────────────────────────────

print(f"\n{'─'*50}")
print("  SYNC CONFIG  GDC → Omar / Ana")
print(f"{'─'*50}")

gdc_data = {}
for config_key, label in SYNC_KEYS:
    try:
        val = fetch_config('gdc', config_key)
        gdc_data[config_key] = val
        count = len(val) if val else 0
        print(f"  GDC {label:<18} {count} entradas" if count else f"  GDC {label:<18} (vacío)")
    except Exception as e:
        print(f"  ERROR leyendo GDC {label}: {e}")
        gdc_data[config_key] = None

if DRY_RUN:
    print('\n  [DRY RUN] No se escribió nada.')
    sys.exit(0)

dest = [k for k in ('omar', 'ana') if ONLY is None or k == ONLY.lower()]
if not dest:
    print(f"Portfolio '{ONLY}' no reconocido.")
    sys.exit(1)

for name in dest:
    print(f"\n  → {name.upper()}")
    for config_key, label in SYNC_KEYS:
        gdc_val = gdc_data.get(config_key)
        if gdc_val is None:
            print(f"    {label:<18} — sin datos en GDC, omitido")
            continue
        try:
            existing = fetch_config(name, config_key) or {}
            merged   = {**existing, **gdc_val}
            push_config(name, config_key, merged)
            print(f"    {label:<18} ✓ {len(merged)} entradas")
        except Exception as e:
            print(f"    {label:<18} ERROR: {e}")

print()
