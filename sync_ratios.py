#!/usr/bin/env python3
"""
sync_ratios.py — Copia los ratios de GDC (Supabase) a Omar y Ana.

Uso:
  python3 sync_ratios.py           (sincroniza Omar y Ana)
  python3 sync_ratios.py omar      (solo Omar)
  python3 sync_ratios.py ana       (solo Ana)
  python3 sync_ratios.py --dry-run (muestra los ratios sin escribir)
"""

import sys
import json
import urllib.request
import urllib.error

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

def headers(key):
    return {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': f'Bearer {key}',
    }

def sb_get(url, key, path):
    req = urllib.request.Request(f'{url}/rest/v1/{path}', headers=headers(key))
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())

def sb_upsert(url, key, table, payload):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        f'{url}/rest/v1/{table}',
        data=data,
        headers={**headers(key), 'Prefer': 'resolution=merge-duplicates'},
        method='POST',
    )
    with urllib.request.urlopen(req, timeout=10) as r:
        return r.status

def fetch_ratios(name):
    cfg = SUPABASE[name]
    rows = sb_get(cfg['url'], cfg['key'], 'config?key=eq.ratios&select=value')
    if not rows:
        return None
    val = rows[0].get('value', '{}')
    return json.loads(val) if isinstance(val, str) else val

def push_ratios(name, ratios):
    cfg = SUPABASE[name]
    payload = {'key': 'ratios', 'value': json.dumps(ratios)}
    status = sb_upsert(cfg['url'], cfg['key'], 'config', payload)
    return status

# ── Main ─────────────────────────────────────────────────────────────────

print('\n── Leyendo ratios de GDC Supabase...')
try:
    gdc_ratios = fetch_ratios('gdc')
except Exception as e:
    print(f'  ERROR leyendo GDC: {e}')
    sys.exit(1)

if not gdc_ratios:
    print('  No hay ratios guardados en GDC Supabase (config key=ratios vacío).')
    sys.exit(0)

print(f'  {len(gdc_ratios)} ratios encontrados:')
for ticker, ratio in sorted(gdc_ratios.items()):
    print(f'    {ticker}: {ratio}')

if DRY_RUN:
    print('\n  [DRY RUN] No se escribió nada.')
    sys.exit(0)

targets = [k for k in ('omar', 'ana') if ONLY is None or k == ONLY.lower()]

for name in targets:
    print(f'\n── Sincronizando → {name.upper()}...')
    try:
        existing = fetch_ratios(name) or {}
        merged = {**existing, **gdc_ratios}
        push_ratios(name, merged)
        print(f'  ✓ {len(merged)} ratios guardados en {name.upper()} Supabase.')
    except Exception as e:
        print(f'  ERROR en {name}: {e}')

print()
