#!/usr/bin/env python3
"""
diagnostico_supabase.py — Muestra qué hay en el Supabase de cada portfolio.
Correrlo desde tu Mac:  python3 diagnostico_supabase.py
"""
import json, urllib.request, sys

SUPABASE = {
    'GDC':  {'url':'https://wstnseufzyavgdovrehu.supabase.co','key':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdG5zZXVmenlhdmdkb3ZyZWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzU0MTYsImV4cCI6MjA5MTM1MTQxNn0.0mmKvfCM_HoBJjbIhFzM5TeKEc-LphQwEXNjHqV_CfU'},
    'Ana':  {'url':'https://arxntlqhtrtskabzihlf.supabase.co','key':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyeG50bHFodHJ0c2thYnppaGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTEyMDMsImV4cCI6MjA5MjM2NzIwM30.q3qnU2rkLDF4xwaKXvu8FvknJBIbhxWj01GRzY6l4dg'},
    'Omar': {'url':'https://opbbnvfmgdmdsmbhmgsc.supabase.co','key':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wYmJudmZtZ2RtZHNtYmhtZ3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDExNDYsImV4cCI6MjA5Mjg3NzE0Nn0.tpqr2XVrcJuwPsiuonFeBbUrRG7Vt9RzRzIv7uHDCng'},
}

def hdrs(key):
    return {'apikey':key,'Authorization':f'Bearer {key}','Content-Type':'application/json'}

def fetch(url, key, path):
    req = urllib.request.Request(f'{url}/rest/v1/{path}', headers=hdrs(key))
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())

print("\n" + "="*60)
print("  DIAGNÓSTICO SUPABASE — movimientos por portfolio")
print("="*60)

for name, cfg in SUPABASE.items():
    print(f"\n{'─'*60}")
    print(f"  {name}")
    print(f"{'─'*60}")
    try:
        rows = fetch(cfg['url'], cfg['key'], 'movimientos?select=id,data&order=id.asc')
        print(f"  Total registros: {len(rows)}")
        if not rows:
            print("  ⚠️  TABLA VACÍA")
            continue

        compras = {}
        for row in rows:
            d = row.get('data') or {}
            t = d.get('tipo','')
            ticker = d.get('ticker','?')
            if t not in ('aporte',):
                compras.setdefault(ticker, []).append(t)

        print(f"  Tickers encontrados ({len(compras)}):")
        for ticker, tipos in sorted(compras.items()):
            conteo = {}
            for tp in tipos:
                conteo[tp] = conteo.get(tp, 0) + 1
            detalle = ', '.join(f"{k}:{v}" for k,v in conteo.items())
            print(f"    {ticker:<12} {detalle}")

        # Config table
        cfg_rows = fetch(cfg['url'], cfg['key'], 'config?select=key')
        ks = sorted(r['key'] for r in cfg_rows)
        print(f"\n  Config keys: {ks}")

    except Exception as e:
        print(f"  ERROR: {e}")

print()
