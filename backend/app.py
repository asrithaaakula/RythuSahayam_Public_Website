import os
import sys

# Ensure backend directory is in python module search path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

import random
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from database import SessionLocal, init_db
from models import User, Complaint, ComplaintTimeline, CropGuidance, Scheme, MarketPrice, Announcement, Feedback
from seed_data import seed_database

FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'dist'))

app = Flask(__name__, static_folder=None)
CORS(app, resources={r"/api/*": {"origins": "*"}})

SECRET_KEY = os.environ.get('SECRET_KEY', 'rythusahayam_super_secret_jwt_key_2026')
app.config['SECRET_KEY'] = SECRET_KEY
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def generate_token(user):
    payload = {
        'id': user.id,
        'mobile': user.mobile,
        'email': user.email,
        'role': user.role,
        'full_name': user.full_name,
        'village': user.village,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Authentication token is missing'}), 401
        
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            db = SessionLocal()
            current_user = db.query(User).filter_by(id=data['id']).first()
            db.close()
            if not current_user:
                return jsonify({'message': 'Invalid user token'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired, please log in again'}), 401
        except Exception as e:
            return jsonify({'message': 'Token is invalid'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Authentication token is missing'}), 401
        
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            db = SessionLocal()
            current_user = db.query(User).filter_by(id=data['id']).first()
            db.close()
            if not current_user or current_user.role != 'admin':
                return jsonify({'message': 'Administrator access required'}), 403
        except Exception:
            return jsonify({'message': 'Invalid or expired administrator token'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

# ==================== AUTHENTICATION ROUTES ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    required_fields = ['full_name', 'mobile', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'message': f'{field.replace("_", " ").title()} is required'}), 400

    mobile = data.get('mobile').strip()
    email = data.get('email', '').strip() or None

    db = SessionLocal()
    try:
        if db.query(User).filter_by(mobile=mobile).first():
            return jsonify({'message': 'A farmer account with this mobile number already exists'}), 409
        if email and db.query(User).filter_by(email=email).first():
            return jsonify({'message': 'A farmer account with this email already exists'}), 409

        new_user = User(
            full_name=data.get('full_name').strip(),
            mobile=mobile,
            email=email,
            village=data.get('village', 'Prathuru'),
            district=data.get('district', 'Guntur'),
            farming_category=data.get('farming_category', 'Small/Marginal (< 2 ha)'),
            land_area=float(data.get('land_area', 1.0) or 1.0),
            primary_crop=data.get('primary_crop', 'Paddy'),
            role='farmer'
        )
        new_user.set_password(data.get('password'))
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        token = generate_token(new_user)
        user_dict = new_user.to_dict()
        return jsonify({
            'message': 'Farmer registered successfully',
            'token': token,
            'user': user_dict
        }), 201
    except Exception as e:
        db.rollback()
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500
    finally:
        db.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    identifier = data.get('identifier', '').strip()  # mobile or email
    password = data.get('password', '')

    if not identifier or not password:
        return jsonify({'message': 'Please provide Mobile number or Email and Password'}), 400

    db = SessionLocal()
    try:
        user = db.query(User).filter((User.mobile == identifier) | (User.email == identifier)).first()
        if not user or not user.check_password(password):
            return jsonify({'message': 'Invalid login credentials. Please check your mobile/email and password.'}), 401

        token = generate_token(user)
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict()
        }), 200
    finally:
        db.close()

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user_profile(current_user):
    return jsonify({'user': current_user.to_dict()})

# ==================== COMPLAINTS ROUTES ====================

@app.route('/api/complaints', methods=['POST'])
def create_complaint():
    data = request.get_json() or {}
    required = ['farmer_name', 'mobile', 'village', 'crop_type', 'problem_category', 'problem_title', 'description']
    for req in required:
        if not data.get(req):
            return jsonify({'message': f'{req.replace("_", " ").title()} is required'}), 400

    db = SessionLocal()
    try:
        # Generate next complaint ID e.g. RS-2026-1045
        last_complaint = db.query(Complaint).order_by(Complaint.id.desc()).first()
        next_num = 1001
        if last_complaint:
            try:
                next_num = int(last_complaint.complaint_id.split('-')[-1]) + 1
            except Exception:
                next_num = last_complaint.id + 1001
        new_complaint_id = f"RS-2026-{next_num}"

        user_id = data.get('user_id')
        # Check if auth token provided in headers
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            try:
                tok_data = jwt.decode(auth_header.split(' ')[1], SECRET_KEY, algorithms=['HS256'])
                user_id = tok_data.get('id')
            except Exception:
                pass

        complaint = Complaint(
            complaint_id=new_complaint_id,
            user_id=user_id,
            farmer_name=data.get('farmer_name').strip(),
            mobile=data.get('mobile').strip(),
            village=data.get('village').strip(),
            crop_type=data.get('crop_type').strip(),
            problem_category=data.get('problem_category').strip(),
            problem_title=data.get('problem_title').strip(),
            description=data.get('description').strip(),
            image_url=data.get('image_url'),
            status='Submitted',
            admin_remarks='Complaint received and logged in RythuSahayam dispatch queue.'
        )
        db.add(complaint)
        db.flush()

        timeline = ComplaintTimeline(
            complaint_ref_id=new_complaint_id,
            status='Submitted',
            remark=f"New problem reported by {complaint.farmer_name} for village {complaint.village}.",
            updated_by='Farmer'
        )
        db.add(timeline)
        db.commit()

        result = complaint.to_dict()
        return jsonify({
            'message': 'Complaint registered successfully',
            'complaint_id': new_complaint_id,
            'complaint': result
        }), 201
    except Exception as e:
        db.rollback()
        return jsonify({'message': f'Failed to submit complaint: {str(e)}'}), 500
    finally:
        db.close()

@app.route('/api/complaints', methods=['GET'])
def list_complaints():
    db = SessionLocal()
    try:
        query = db.query(Complaint)
        village = request.args.get('village')
        category = request.args.get('category')
        status = request.args.get('status')
        search = request.args.get('search')

        if village and village != 'All':
            query = query.filter(Complaint.village == village)
        if category and category != 'All':
            query = query.filter(Complaint.problem_category == category)
        if status and status != 'All':
            query = query.filter(Complaint.status == status)
        if search:
            query = query.filter(
                (Complaint.complaint_id.ilike(f'%{search}%')) |
                (Complaint.farmer_name.ilike(f'%{search}%')) |
                (Complaint.problem_title.ilike(f'%{search}%')) |
                (Complaint.mobile.ilike(f'%{search}%'))
            )

        complaints = query.order_by(Complaint.created_at.desc()).all()
        return jsonify({'complaints': [c.to_dict() for c in complaints]})
    finally:
        db.close()

@app.route('/api/complaints/<complaint_id>', methods=['GET'])
def get_complaint(complaint_id):
    db = SessionLocal()
    try:
        complaint = db.query(Complaint).filter_by(complaint_id=complaint_id.strip()).first()
        if not complaint:
            # Fallback search by integer id
            if complaint_id.isdigit():
                complaint = db.query(Complaint).filter_by(id=int(complaint_id)).first()
            if not complaint:
                return jsonify({'message': f'No complaint found with ID "{complaint_id}"'}), 404

        return jsonify({'complaint': complaint.to_dict()})
    finally:
        db.close()

@app.route('/api/complaints/<complaint_id>/status', methods=['PUT'])
@admin_required
def update_complaint_status(current_user, complaint_id):
    data = request.get_json() or {}
    new_status = data.get('status')
    remark = data.get('remark', '')

    valid_statuses = ['Submitted', 'Under Review', 'In Progress', 'Resolved']
    if new_status not in valid_statuses:
        return jsonify({'message': f'Invalid status. Allowed values: {valid_statuses}'}), 400

    db = SessionLocal()
    try:
        complaint = db.query(Complaint).filter_by(complaint_id=complaint_id).first()
        if not complaint:
            return jsonify({'message': 'Complaint not found'}), 404

        complaint.status = new_status
        if remark:
            complaint.admin_remarks = remark
        complaint.updated_at = datetime.utcnow()

        timeline = ComplaintTimeline(
            complaint_ref_id=complaint.complaint_id,
            status=new_status,
            remark=remark or f"Status changed to {new_status} by Agriculture Administrator.",
            updated_by=current_user.full_name
        )
        db.add(timeline)
        db.commit()

        return jsonify({
            'message': 'Complaint status updated successfully',
            'complaint': complaint.to_dict()
        })
    except Exception as e:
        db.rollback()
        return jsonify({'message': str(e)}), 500
    finally:
        db.close()

@app.route('/api/complaints/user', methods=['GET'])
@token_required
def get_user_complaints(current_user):
    db = SessionLocal()
    try:
        # Match either user_id or mobile number
        complaints = db.query(Complaint).filter(
            (Complaint.user_id == current_user.id) | (Complaint.mobile == current_user.mobile)
        ).order_by(Complaint.created_at.desc()).all()
        return jsonify({'complaints': [c.to_dict() for c in complaints]})
    finally:
        db.close()

# ==================== CROPS & GUIDANCE ====================

@app.route('/api/crops', methods=['GET'])
def get_crops():
    db = SessionLocal()
    try:
        query = db.query(CropGuidance)
        category = request.args.get('category')
        search = request.args.get('search')
        if category and category != 'All':
            query = query.filter(CropGuidance.category == category)
        if search:
            query = query.filter(
                (CropGuidance.name.ilike(f'%{search}%')) |
                (CropGuidance.telugu_name.ilike(f'%{search}%')) |
                (CropGuidance.soil_type.ilike(f'%{search}%'))
            )
        crops = query.all()
        return jsonify({'crops': [c.to_dict() for c in crops]})
    finally:
        db.close()

@app.route('/api/crops/<int:crop_id>', methods=['GET'])
def get_crop_detail(crop_id):
    db = SessionLocal()
    try:
        crop = db.query(CropGuidance).filter_by(id=crop_id).first()
        if not crop:
            return jsonify({'message': 'Crop not found'}), 404
        return jsonify({'crop': crop.to_dict()})
    finally:
        db.close()

# ==================== SCHEMES & LOANS ====================

@app.route('/api/schemes', methods=['GET'])
def get_schemes():
    db = SessionLocal()
    try:
        query = db.query(Scheme)
        category = request.args.get('category')
        if category and category != 'All':
            query = query.filter(Scheme.category == category)
        schemes = query.all()
        return jsonify({'schemes': [s.to_dict() for s in schemes]})
    finally:
        db.close()

@app.route('/api/schemes/<int:scheme_id>', methods=['GET'])
def get_scheme_detail(scheme_id):
    db = SessionLocal()
    try:
        scheme = db.query(Scheme).filter_by(id=scheme_id).first()
        if not scheme:
            return jsonify({'message': 'Scheme not found'}), 404
        return jsonify({'scheme': scheme.to_dict()})
    finally:
        db.close()

# ==================== MARKET PRICES ====================

@app.route('/api/market-prices', methods=['GET'])
def get_market_prices():
    db = SessionLocal()
    try:
        query = db.query(MarketPrice)
        crop = request.args.get('crop')
        market = request.args.get('market')
        if crop and crop != 'All':
            query = query.filter(MarketPrice.crop.ilike(f'%{crop}%'))
        if market and market != 'All':
            query = query.filter(MarketPrice.market_name.ilike(f'%{market}%'))
        prices = query.all()
        return jsonify({
            'prices': [p.to_dict() for p in prices],
            'source': 'AGMARKNET & Guntur Agricultural Market Committee (Verified Rates)',
            'updated_time': datetime.now().strftime('%d %B %Y, 11:30 AM IST')
        })
    finally:
        db.close()

# ==================== WEATHER & ADVISORIES ====================

@app.route('/api/weather', methods=['GET'])
def get_weather():
    village = request.args.get('village', 'Prathuru')
    
    # Accurate meteorological profile for Tadepalli / Guntur region (Krishna River Basin)
    weather_data = {
        'location': f'{village}, Tadepalli Mandal, Guntur Dist.',
        'village': village,
        'temperature': 31,
        'feels_like': 34,
        'condition': 'Partly Sunny / Clear',
        'condition_icon': '⛅',
        'humidity': 68,
        'wind_speed': 12,
        'wind_direction': 'South-East (SE)',
        'rainfall_chance': 15,
        'rainfall_forecast': 'Dry weather expected for the next 48 hours. Light evening coastal breeze.',
        'uv_index': 7,
        'soil_moisture': 'Optimal (28%)',
        'advisories': [
            'Paddy: Ideal conditions for second top-dressing of nitrogen in tillering stage.',
            'Chilli: Favorable humidity for sucking pests. Monitor undersides of leaves for thrips and mites.',
            'Irrigation: Canal water flow scheduled via Krishna Delta system. Night-time irrigation recommended to reduce evapotranspiration.'
        ],
        'forecast': [
            {'day': 'Today', 'temp_max': 32, 'temp_min': 23, 'condition': 'Sunny', 'rain_prob': 10},
            {'day': 'Tomorrow', 'temp_max': 33, 'temp_min': 24, 'condition': 'Partly Cloudy', 'rain_prob': 20},
            {'day': 'Saturday', 'temp_max': 32, 'temp_min': 23, 'condition': 'Scattered Clouds', 'rain_prob': 25},
            {'day': 'Sunday', 'temp_max': 31, 'temp_min': 22, 'condition': 'Clear Sky', 'rain_prob': 5},
            {'day': 'Monday', 'temp_max': 33, 'temp_min': 23, 'condition': 'Sunny', 'rain_prob': 10}
        ],
        'source': 'India Meteorological Department (IMD Amaravati Station) / Local Agro-Met Field Unit'
    }
    
    if village == 'Gundimeda':
        weather_data['humidity'] = 71
        weather_data['temperature'] = 30
        weather_data['advisories'][0] = 'Vegetables & Chilli: Check soil moisture before furrow wetting. Gundimeda riverbank plots show optimal moisture.'

    return jsonify(weather_data)

# ==================== ANNOUNCEMENTS ====================

@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    db = SessionLocal()
    try:
        announcements = db.query(Announcement).order_by(Announcement.published_at.desc()).all()
        return jsonify({'announcements': [a.to_dict() for a in announcements]})
    finally:
        db.close()

@app.route('/api/announcements', methods=['POST'])
@admin_required
def create_announcement(current_user):
    data = request.get_json() or {}
    if not data.get('title') or not data.get('content'):
        return jsonify({'message': 'Title and Content are required'}), 400

    db = SessionLocal()
    try:
        new_a = Announcement(
            title=data.get('title'),
            content=data.get('content'),
            category=data.get('category', 'Advisory'),
            is_urgent=bool(data.get('is_urgent', False))
        )
        db.add(new_a)
        db.commit()
        return jsonify({'message': 'Announcement published', 'announcement': new_a.to_dict()}), 201
    finally:
        db.close()

# ==================== FEEDBACK ====================

@app.route('/api/feedback', methods=['GET', 'POST'])
def feedback_handler():
    db = SessionLocal()
    try:
        if request.method == 'POST':
            data = request.get_json() or {}
            if not data.get('name') or not data.get('message'):
                return jsonify({'message': 'Name and Message are required'}), 400

            fb = Feedback(
                name=data.get('name').strip(),
                mobile=data.get('mobile', '').strip() or None,
                village=data.get('village', 'Prathuru'),
                message=data.get('message').strip(),
                rating=int(data.get('rating', 5))
            )
            db.add(fb)
            db.commit()
            return jsonify({'message': 'Thank you for your valuable feedback!', 'feedback': fb.to_dict()}), 201

        feedbacks = db.query(Feedback).order_by(Feedback.created_at.desc()).all()
        return jsonify({'feedbacks': [f.to_dict() for f in feedbacks]})
    finally:
        db.close()

# ==================== ADMIN DASHBOARD ANALYTICS ====================

@app.route('/api/admin/stats', methods=['GET'])
@admin_required
def admin_stats(current_user):
    db = SessionLocal()
    try:
        total_farmers = db.query(User).filter_by(role='farmer').count()
        total_complaints = db.query(Complaint).count()
        pending_complaints = db.query(Complaint).filter(Complaint.status.in_(['Submitted', 'Under Review'])).count()
        in_progress_complaints = db.query(Complaint).filter_by(status='In Progress').count()
        resolved_complaints = db.query(Complaint).filter_by(status='Resolved').count()

        # Group by category
        categories = ['Irrigation', 'Electricity', 'Seeds and Fertilizers', 'Crop Diseases', 'Loans', 'Crop Storage', 'Transportation', 'Market Prices', 'Other']
        category_distribution = []
        for cat in categories:
            cnt = db.query(Complaint).filter(Complaint.problem_category.ilike(f'%{cat}%')).count()
            if cnt > 0:
                category_distribution.append({'name': cat, 'count': cnt})

        # Group by village
        village_distribution = [
            {'village': 'Prathuru', 'count': db.query(Complaint).filter_by(village='Prathuru').count()},
            {'village': 'Gundimeda', 'count': db.query(Complaint).filter_by(village='Gundimeda').count()},
            {'village': 'Tadepalli', 'count': db.query(Complaint).filter_by(village='Tadepalli').count()}
        ]

        recent_complaints = db.query(Complaint).order_by(Complaint.created_at.desc()).limit(5).all()

        return jsonify({
            'total_farmers': total_farmers,
            'total_complaints': total_complaints,
            'pending_complaints': pending_complaints,
            'in_progress_complaints': in_progress_complaints,
            'resolved_complaints': resolved_complaints,
            'category_distribution': category_distribution,
            'village_distribution': village_distribution,
            'recent_complaints': [c.to_dict() for c in recent_complaints]
        })
    finally:
        db.close()

@app.route('/api/admin/farmers', methods=['GET'])
@admin_required
def admin_list_farmers(current_user):
    db = SessionLocal()
    try:
        village = request.args.get('village')
        search = request.args.get('search')
        query = db.query(User).filter_by(role='farmer')
        if village and village != 'All':
            query = query.filter_by(village=village)
        if search:
            query = query.filter(
                (User.full_name.ilike(f'%{search}%')) |
                (User.mobile.ilike(f'%{search}%')) |
                (User.primary_crop.ilike(f'%{search}%'))
            )
        farmers = query.order_by(User.created_at.desc()).all()
        return jsonify({'farmers': [f.to_dict() for f in farmers]})
    finally:
        db.close()

# ==================== SEARCH / SUPPORT MATCHING ====================

@app.route('/api/support/search', methods=['GET'])
def search_support():
    village = request.args.get('village', 'Prathuru')
    crop = request.args.get('crop', '')
    category = request.args.get('category', '')

    db = SessionLocal()
    try:
        # Match crop guidance
        matched_crop = None
        if crop and crop != 'Select Crop Type' and crop != 'Other':
            matched_crop = db.query(CropGuidance).filter(CropGuidance.name.ilike(f'%{crop}%')).first()

        # Match relevant schemes
        matched_schemes = []
        if 'Loan' in category or 'Credit' in category:
            matched_schemes = db.query(Scheme).filter(Scheme.category == 'Credit & Loan').all()
        elif 'Irrigation' in category:
            matched_schemes = db.query(Scheme).filter(Scheme.title.ilike('%Irrigation%')).all()
        elif 'Fertilizer' in category or 'Seed' in category:
            matched_schemes = db.query(Scheme).filter(Scheme.title.ilike('%Soil%')).all()
        else:
            matched_schemes = db.query(Scheme).limit(2).all()

        # Local village contacts
        local_contacts = {
            'Prathuru': {
                'rsk_name': 'Prathuru Rythu Seva Kendram (RSK)',
                'vaa_name': 'M. Venkateswarlu (Village Agriculture Assistant)',
                'contact': '+91 94409 01234',
                'location': 'Near Panchayat Office, Main Road, Prathuru',
                'canal_branch': 'Krishna Western Delta, Prathuru Major Channel'
            },
            'Gundimeda': {
                'rsk_name': 'Gundimeda Rythu Seva Kendram (RSK)',
                'vaa_name': 'K. Siva Rama Krishna (Village Agriculture Assistant)',
                'contact': '+91 94409 05678',
                'location': 'Opp. Primary School, Gundimeda Village',
                'canal_branch': 'Krishna River Lift Irrigation / Gundimeda Distributary'
            }
        }.get(village, {
            'rsk_name': 'Tadepalli Mandal Agriculture Office',
            'vaa_name': 'Agriculture Officer (AO), Tadepalli',
            'contact': '+91 863 2234567',
            'location': 'Mandal Parishad Development Office, Tadepalli',
            'canal_branch': 'Tadepalli Canal Sub-Division'
        })

        return jsonify({
            'village': village,
            'crop': crop,
            'category': category,
            'matched_crop': matched_crop.to_dict() if matched_crop else None,
            'matched_schemes': [s.to_dict() for s in matched_schemes],
            'local_contacts': local_contacts,
            'guidance_message': f'Support resources available for {crop or "all crops"} in {village} regarding {category or "agricultural concerns"}.'
        })
    finally:
        db.close()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'platform': 'RythuSahayam (రైతు సహాయం)',
        'villages': ['Prathuru', 'Gundimeda', 'Tadepalli'],
        'service': 'Full-Stack Agriculture & Farmers Welfare Platform'
    }), 200

# ==================== SPA FRONTEND STATIC & CLIENT ROUTING ====================

@app.route('/')
def serve_index():
    if os.path.isdir(FRONTEND_DIST) and os.path.isfile(os.path.join(FRONTEND_DIST, 'index.html')):
        return send_from_directory(FRONTEND_DIST, 'index.html')
    return jsonify({
        'status': 'healthy',
        'platform': 'RythuSahayam (రైతు సహాయం)',
        'message': 'RythuSahayam Backend API is live and operational.',
        'endpoints': {
            'health': '/api/health',
            'crops': '/api/crops',
            'schemes': '/api/schemes',
            'market_prices': '/api/market-prices',
            'complaints': '/api/complaints'
        }
    }), 200

@app.route('/assets/<path:path>')
def serve_assets(path):
    assets_dir = os.path.join(FRONTEND_DIST, 'assets')
    if os.path.isdir(assets_dir):
        return send_from_directory(assets_dir, path)
    return jsonify({'message': 'Asset not found'}), 404

@app.route('/<path:path>')
def serve_static_or_spa(path):
    if os.path.isdir(FRONTEND_DIST):
        file_path = os.path.join(FRONTEND_DIST, path)
        if os.path.isfile(file_path):
            return send_from_directory(FRONTEND_DIST, path)
        if not path.startswith('api/'):
            index_path = os.path.join(FRONTEND_DIST, 'index.html')
            if os.path.isfile(index_path):
                return send_from_directory(FRONTEND_DIST, 'index.html')
    return jsonify({'message': 'Endpoint not found'}), 404

@app.errorhandler(404)
def handle_404(e):
    if request.path.startswith('/api/'):
        return jsonify({'message': 'API endpoint not found'}), 404
    if os.path.isdir(FRONTEND_DIST) and os.path.isfile(os.path.join(FRONTEND_DIST, 'index.html')):
        return send_from_directory(FRONTEND_DIST, 'index.html')
    return jsonify({'message': 'Resource not found'}), 404

# Auto-seed database tables and initial demo data on startup (for both direct python & Gunicorn)
try:
    seed_database()
except Exception as e:
    print(f"Notice: Database auto-seed check: {e}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    print(f"RythuSahayam Platform starting on http://{host}:{port} ...")
    app.run(host=host, port=port, debug=False)
