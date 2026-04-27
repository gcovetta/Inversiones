#!/usr/bin/env python3
"""
limpiar_movimientos.py — Borra los movimientos del Supabase de Ana y/o Omar.
Usar SOLO si diagnostico_supabase.py confirmó que tienen datos de GDC.

Los datos correctos de cada portfolio se recuperan del localStorage del browser
la próxima vez que se carga la página.

Uso:
  python3 limpiar_movimientos.py          → limpia Ana y Omar
  python3 limpiar_movimientos.py ana      → solo Ana
  python3 limpiar_movimientos.py omar     → solo Omar
"""
import sys, json, urllib.request

ONLY = next((a for a in sys.argv[1:] if not a.startswith('--')), None)

SUPABASE = {
    'Ana':  {
        'url': 'https://arxntlqhtrtskabzihlf.supabase.co',
        'key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyeG50bHFodHJ0c2thYnppaGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTEyMDMsImV4cCI6MjA5MjM2NzIwM30.q3qnU2rkLDF4xwaKXvu8FvknJBIbhxWj01GRzY6l4dg',
    },
    'Omar': {
        'url': 'https://opbbnvfmgdmdsmbhmgsc.supabase.co',
        'key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wYmJudmZtZ2RtZHNtYmhtZ3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDExNDYsImV4cCI6MjA5Mjg3NzE0Nn0.tpqr2XVrcJuwPsiuonFeBbUrRG7Vt9RzRzIv7uHDCng',
    },
}

def hdrs(key):
    return {'apikey': key, 'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}

def fetch(url, key, path):
    req = urllib.request.Request(f'{url}/rest/v1/{path}', headers=hdrs(key))
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())

def delete_all(url, key, table):
    req = urllib.request.Request(
        f'{url}/rest/v1/{table}?id=gte.0',
        method='DELETE',
        headers=hdrs(key)
    )
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.status

dest = [k for k in SUPABASE if ONLY is None or k.lower() == ONLY.lower()]
if not dest:
    print(f"Portfolio '{ONLY}' no reconocido. Usar 'ana' o 'omar'.")
    sys.exit(1)

print("\n" + "="*55)
print("  LIMPIAR MOVIMIENTOS — Supabase Ana / Omar")
print("="*55)

for name in dest:
    cfg = SUPABASE[name]
    print(f"\n  {name}")
    print(f"  {'─'*40}")

    # Primero mostrar qué hay
    try:
        rows = fetch(cfg['url'], cfg['key'], 'movimientos?select=id,data&order=id.asc')
        tickers = set()
        for r in rows:
            d = r.get('data') or {}
            if d.get('ticker') and d.get('tipo') != 'aporte':
                tickers.add(d['ticker'])
        print(f"  Registros actuales: {len(rows)}")
        print(f"  Tickers: {sorted(tickers)}")
    except Exception as e:
        print(f"  Error leyendo: {e}")
        continue

    if not rows:
        print(f"  Ya está vacío, nada que hacer.")
        continue

    confirm = input(f"\n  ¿Borrar los {len(rows)} registros de {name}? (s/N): ").strip().lower()
    if confirm != 's':
        print(f"  Cancelado.")
        continue

    try:
        status = delete_all(cfg['url'], cfg['key'], 'movimientos')
        print(f"  ✓ Movimientos borrados (HTTP {status})")
        print(f"  → Recargá la página de {name} en el browser para restaurar desde localStorage.")
    except Exception as e:
        print(f"  ERROR al borrar: {e}")

print()
