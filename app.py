import os
import sys
import importlib.util

# Add backend folder to sys.path so its internal modules (models, database, seed_data) resolve
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend'))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Dynamically load backend/app.py avoiding circular import with root app.py
spec = importlib.util.spec_from_file_location("rythusahayam_backend", os.path.join(BACKEND_DIR, "app.py"))
backend_module = importlib.util.module_from_spec(spec)
sys.modules["rythusahayam_backend"] = backend_module
spec.loader.exec_module(backend_module)

app = backend_module.app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    print(f"RythuSahayam Server starting on http://{host}:{port} ...")
    app.run(host=host, port=port, debug=False)
