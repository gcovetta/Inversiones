#!/usr/bin/env python3
"""
Borra los targets (P. Venta) de GDC que se colaron en Omar y Ana.
Uso: python3 limpiar_targets.py
"""
import urllib.request, json

PORTFOLIOS = [
    {
        'name': 'Omar',
        'url':  'https://opbbnvfmgdmdsmbhmgsc.supabase.co',
        'key':  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wYmJudmZtZ2RtZHNtYmhtZ3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDExNDYsImV4cCI6MjA5Mjg3NzE0Nn0.tpqr2XVrcJuwPsiuonFeBbUrRG7Vt9RzRzIv7uHDCng'
    },
    {
        'name': 'Ana',
        'url':  'https://arxntlqhtrtskabzihlf.supabase.co',
        'key':  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyeG50bHFodHJ0c2thYnppaGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTEyMDMsImV4cCI6MjA5MjM2NzIwM30.q3qnU2rkLDF4xwaKXvu8FvknJBIbhxWj01GRzY6l4dg'
    },
]

# Keys a limpiar que se colaron de GDC
KEYS_TO_CLEAR = ['targets', 'rubros']

def req(url, method, key, body=None):
    headers = {
        'apikey': key,
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    r = urllib.request.Request(url, method=method, headers=headers,
                                data=json.dumps(body).encode() if body else None)
    try:
        with urllib.request.urlopen(r) as resp:
            return resp.status
    except urllib.error.HTTPError as e:
        return e.code

for p in PORTFOLIOS:
    print(f"\n{p['name']}:")
    base = p['url'] + '/rest/v1/config'
    for k in KEYS_TO_CLEAR:
        s = req(f"{base}?key=eq.{k}", 'DELETE', p['key'])
        print(f"  DELETE {k}: {s} {'✓' if s in (200,204) else '✗'}")

print('\nListo. Omar y Ana ya no tienen targets ni rubros de GDC.')
