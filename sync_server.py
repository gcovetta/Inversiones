#!/usr/bin/env python3
"""
sync_server.py — Servidor local para el botón Sync de PortafolioGDC.html

Levanta un servidor HTTP en localhost:5050.
El botón Sync del browser llama a POST /sync y este script corre sync_omar.py.

Uso:
    python3 sync_server.py            # corre en puerto 5050
    python3 sync_server.py 5051       # corre en otro puerto

Detener: Ctrl+C
"""

import sys
import subprocess
import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
from datetime import datetime

PORT  = int(sys.argv[1]) if len(sys.argv) > 1 else 5050
# El sync script está en el mismo directorio que este archivo
BASE  = os.path.dirname(os.path.abspath(__file__))
SYNC  = os.path.join(BASE, 'sync_omar.py')


class SyncHandler(BaseHTTPRequestHandler):

    def log_message(self, fmt, *args):
        # Log limpio con timestamp
        print(f"  [{datetime.now().strftime('%H:%M:%S')}] {fmt % args}")

    def _cors(self):
        """Headers CORS para que el browser pueda llamar localhost."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        """Preflight CORS."""
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_GET(self):
        if self.path == '/ping':
            self._respond(200, {'status': 'ok', 'server': 'sync_server', 'port': PORT})
        else:
            self._respond(404, {'error': 'Not found'})

    def do_POST(self):
        if self.path == '/sync':
            self._run_sync()
        else:
            self._respond(404, {'error': 'Not found'})

    def _run_sync(self):
        print(f"\n{'─'*50}")
        print(f"  SYNC solicitado desde browser")
        print(f"{'─'*50}")
        try:
            result = subprocess.run(
                [sys.executable, SYNC],
                capture_output=True,
                text=True,
                cwd=BASE,
                timeout=60
            )
            output  = result.stdout + result.stderr
            success = result.returncode == 0
            print(output)
            self._respond(200 if success else 500, {
                'ok':     success,
                'output': output,
                'ts':     datetime.now().strftime('%H:%M:%S')
            })
        except subprocess.TimeoutExpired:
            self._respond(500, {'ok': False, 'output': 'Timeout: el sync tardó más de 60s'})
        except Exception as e:
            self._respond(500, {'ok': False, 'output': str(e)})

    def _respond(self, code, data):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self._cors()
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main():
    server = HTTPServer(('127.0.0.1', PORT), SyncHandler)
    print(f"""
╔══════════════════════════════════════════╗
║        Sync Server — GDC Portfolio       ║
╠══════════════════════════════════════════╣
║  Escuchando en  http://localhost:{PORT}    ║
║  Sync script:   sync_omar.py             ║
║  Detener:       Ctrl+C                   ║
╚══════════════════════════════════════════╝
""")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n  Servidor detenido.')


if __name__ == '__main__':
    main()
