import os
import sys
import importlib.util

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend'))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

spec = importlib.util.spec_from_file_location("rythusahayam_backend", os.path.join(BACKEND_DIR, "app.py"))
backend_module = importlib.util.module_from_spec(spec)
sys.modules["rythusahayam_backend"] = backend_module
spec.loader.exec_module(backend_module)

app = backend_module.app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
