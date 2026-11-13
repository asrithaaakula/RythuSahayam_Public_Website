import os
import sys

# Add backend directory to sys.path so all imports (models, database, seed_data) resolve
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend'))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app import app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    print(f"RythuSahayam server starting on http://{host}:{port} ...")
    app.run(host=host, port=port, debug=False)
