from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, Float, Boolean, DateTime, ForeignKey

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = 'users'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    mobile: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default='farmer')  # 'farmer' or 'admin'
    village: Mapped[str] = mapped_column(String(80), default='Prathuru')
    district: Mapped[str] = mapped_column(String(80), default='Guntur')
    farming_category: Mapped[str] = mapped_column(String(80), default='Small/Marginal (< 2 ha)')
    land_area: Mapped[float] = mapped_column(Float, default=1.0)  # in acres
    primary_crop: Mapped[str] = mapped_column(String(80), default='Paddy')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    complaints = relationship('Complaint', back_populates='farmer_user', cascade='all, delete-orphan')

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'mobile': self.mobile,
            'email': self.email,
            'role': self.role,
            'village': self.village,
            'district': self.district,
            'farming_category': self.farming_category,
            'land_area': self.land_area,
            'primary_crop': self.primary_crop,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }

class Complaint(Base):
    __tablename__ = 'complaints'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    complaint_id: Mapped[str] = mapped_column(String(30), unique=True, index=True, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=True)
    farmer_name: Mapped[str] = mapped_column(String(120), nullable=False)
    mobile: Mapped[str] = mapped_column(String(20), nullable=False)
    village: Mapped[str] = mapped_column(String(80), nullable=False)
    crop_type: Mapped[str] = mapped_column(String(80), nullable=False)
    problem_category: Mapped[str] = mapped_column(String(80), nullable=False)
    problem_title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[str] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(30), default='Submitted')  # Submitted, Under Review, In Progress, Resolved
    admin_remarks: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    farmer_user = relationship('User', back_populates='complaints')
    timeline = relationship('ComplaintTimeline', back_populates='complaint', cascade='all, delete-orphan', order_by='ComplaintTimeline.created_at')

    def to_dict(self):
        return {
            'id': self.id,
            'complaint_id': self.complaint_id,
            'user_id': self.user_id,
            'farmer_name': self.farmer_name,
            'mobile': self.mobile,
            'village': self.village,
            'crop_type': self.crop_type,
            'problem_category': self.problem_category,
            'problem_title': self.problem_title,
            'description': self.description,
            'image_url': self.image_url,
            'status': self.status,
            'admin_remarks': self.admin_remarks,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else None,
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M') if self.updated_at else None,
            'timeline': [t.to_dict() for t in self.timeline]
        }

class ComplaintTimeline(Base):
    __tablename__ = 'complaint_timeline'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    complaint_ref_id: Mapped[str] = mapped_column(String(30), ForeignKey('complaints.complaint_id'), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False)
    remark: Mapped[str] = mapped_column(Text, nullable=False)
    updated_by: Mapped[str] = mapped_column(String(80), default='System')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    complaint = relationship('Complaint', back_populates='timeline')

    def to_dict(self):
        return {
            'id': self.id,
            'complaint_ref_id': self.complaint_ref_id,
            'status': self.status,
            'remark': self.remark,
            'updated_by': self.updated_by,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else None
        }

class CropGuidance(Base):
    __tablename__ = 'crop_guidance'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    telugu_name: Mapped[str] = mapped_column(String(100), nullable=True)
    category: Mapped[str] = mapped_column(String(50), default='Field Crop')  # Cereals, Cash Crop, Spices, Vegetables
    season: Mapped[str] = mapped_column(String(100), default='Kharif / Rabi')
    duration: Mapped[str] = mapped_column(String(50), default='120-150 Days')
    soil_type: Mapped[str] = mapped_column(Text, nullable=False)
    sowing_time: Mapped[str] = mapped_column(Text, nullable=False)
    water_requirement: Mapped[str] = mapped_column(Text, nullable=False)
    fertilizer_info: Mapped[str] = mapped_column(Text, nullable=False)
    pest_disease_info: Mapped[str] = mapped_column(Text, nullable=False)
    harvesting_info: Mapped[str] = mapped_column(Text, nullable=False)
    yield_per_acre: Mapped[str] = mapped_column(String(100), default='25-35 Quintals')
    icon: Mapped[str] = mapped_column(String(20), default='🌾')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'telugu_name': self.telugu_name,
            'category': self.category,
            'season': self.season,
            'duration': self.duration,
            'soil_type': self.soil_type,
            'sowing_time': self.sowing_time,
            'water_requirement': self.water_requirement,
            'fertilizer_info': self.fertilizer_info,
            'pest_disease_info': self.pest_disease_info,
            'harvesting_info': self.harvesting_info,
            'yield_per_acre': self.yield_per_acre,
            'icon': self.icon
        }

class Scheme(Base):
    __tablename__ = 'schemes'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(50), default='Central Govt')  # Central Govt, AP State Govt, Credit/Loan, Subsidy
    ministry_state: Mapped[str] = mapped_column(String(150), default='Ministry of Agriculture & Farmers Welfare')
    description: Mapped[str] = mapped_column(Text, nullable=False)
    benefits: Mapped[str] = mapped_column(Text, nullable=False)
    eligibility: Mapped[str] = mapped_column(Text, nullable=False)
    documents_needed: Mapped[str] = mapped_column(Text, nullable=False)
    application_steps: Mapped[str] = mapped_column(Text, nullable=False)
    portal_url: Mapped[str] = mapped_column(String(255), nullable=True)
    helpline: Mapped[str] = mapped_column(String(100), default='1800-180-1551')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'ministry_state': self.ministry_state,
            'description': self.description,
            'benefits': self.benefits,
            'eligibility': self.eligibility,
            'documents_needed': self.documents_needed,
            'application_steps': self.application_steps,
            'portal_url': self.portal_url,
            'helpline': self.helpline
        }

class MarketPrice(Base):
    __tablename__ = 'market_prices'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    crop: Mapped[str] = mapped_column(String(80), nullable=False)
    variety: Mapped[str] = mapped_column(String(80), default='Common')
    market_name: Mapped[str] = mapped_column(String(100), default='Guntur Agricultural Market Yard')
    district: Mapped[str] = mapped_column(String(80), default='Guntur')
    state: Mapped[str] = mapped_column(String(80), default='Andhra Pradesh')
    min_price: Mapped[float] = mapped_column(Float, nullable=False)
    max_price: Mapped[float] = mapped_column(Float, nullable=False)
    modal_price: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(String(30), default='Rs / Quintal')
    trend: Mapped[str] = mapped_column(String(20), default='up')  # up, down, stable
    last_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'crop': self.crop,
            'variety': self.variety,
            'market_name': self.market_name,
            'district': self.district,
            'state': self.state,
            'min_price': self.min_price,
            'max_price': self.max_price,
            'modal_price': self.modal_price,
            'unit': self.unit,
            'trend': self.trend,
            'last_updated': self.last_updated.strftime('%d %b %Y, %I:%M %p') if self.last_updated else None
        }

class Announcement(Base):
    __tablename__ = 'announcements'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), default='Advisory')  # Advisory, Weather, Subsidy, Camp
    is_urgent: Mapped[bool] = mapped_column(Boolean, default=False)
    published_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'category': self.category,
            'is_urgent': self.is_urgent,
            'published_at': self.published_at.strftime('%d %b %Y') if self.published_at else None
        }

class Feedback(Base):
    __tablename__ = 'feedback'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    mobile: Mapped[str] = mapped_column(String(20), nullable=True)
    village: Mapped[str] = mapped_column(String(80), default='Prathuru')
    message: Mapped[str] = mapped_column(Text, nullable=False)
    rating: Mapped[int] = mapped_column(Integer, default=5)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'mobile': self.mobile,
            'village': self.village,
            'message': self.message,
            'rating': self.rating,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else None
        }
