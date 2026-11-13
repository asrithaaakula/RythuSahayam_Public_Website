import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import app
from seed_data import seed_database

def run_tests():
    seed_database()
    client = app.test_client()

    # 1. Test /api/crops
    res = client.get('/api/crops')
    assert res.status_code == 200, f"Crops failed: {res.status_code}"
    crops = res.get_json()['crops']
    print(f"[OK] /api/crops returned {len(crops)} crops")

    # 2. Test /api/schemes
    res = client.get('/api/schemes')
    assert res.status_code == 200
    schemes = res.get_json()['schemes']
    print(f"[OK] /api/schemes returned {len(schemes)} schemes")

    # 3. Test /api/market-prices
    res = client.get('/api/market-prices')
    assert res.status_code == 200
    prices = res.get_json()['prices']
    print(f"[OK] /api/market-prices returned {len(prices)} prices")

    # 4. Test /api/weather
    res = client.get('/api/weather?village=Prathuru')
    assert res.status_code == 200
    w = res.get_json()
    print(f"[OK] /api/weather returned temp: {w['temperature']} deg C for {w['village']}")

    # 5. Test /api/auth/login with demo farmer
    res = client.post('/api/auth/login', json={'identifier': '9988776655', 'password': 'Farmer@123'})
    assert res.status_code == 200
    data = res.get_json()
    token = data['token']
    print(f"[OK] /api/auth/login success for {data['user']['full_name']}")

    # 6. Test /api/complaints submission
    new_comp = {
        'farmer_name': 'Test Farmer Prathuru',
        'mobile': '9848099999',
        'village': 'Prathuru',
        'crop_type': 'Chilli',
        'problem_category': 'Crop Diseases',
        'problem_title': 'Fungal Leaf Spot Testing',
        'description': 'Automated test complaint for verifying grievance resolution pipeline.'
    }
    res = client.post('/api/complaints', json=new_comp)
    assert res.status_code == 201
    cid = res.get_json()['complaint_id']
    print(f"[OK] /api/complaints created new ticket: {cid}")

    # 7. Test /api/complaints/<id>
    res = client.get(f'/api/complaints/{cid}')
    assert res.status_code == 200
    comp_obj = res.get_json()['complaint']
    assert comp_obj['status'] == 'Submitted'
    print(f"[OK] /api/complaints/{cid} tracking verified (Status: {comp_obj['status']})")

    # 8. Test /api/support/search
    res = client.get('/api/support/search?village=Prathuru&crop=Paddy&category=Irrigation')
    assert res.status_code == 200
    support = res.get_json()
    print(f"[OK] /api/support/search identified RSK: {support['local_contacts']['rsk_name']}")

    # 9. Test SPA static route and deep link routes
    res = client.get('/')
    assert res.status_code == 200
    assert b'RythuSahayam' in res.data
    print("[OK] SPA index.html served correctly at root '/'")

    for route in ['/crop-guidance', '/irrigation', '/schemes', '/market-prices', '/report-problem', '/track-complaint', '/login', '/register', '/dashboard', '/about', '/admin']:
        r = client.get(route)
        assert r.status_code == 200, f"Route {route} failed with {r.status_code}"
        assert b'RythuSahayam' in r.data, f"Route {route} did not return index.html"
        print(f"[OK] Route '{route}' returns 200 OK index.html for client routing")

    print("\nALL BACKEND & SPA DEEP-LINK TESTS PASSED SUCCESSFULLY! 100% FUNCTIONAL.")

if __name__ == '__main__':
    run_tests()
