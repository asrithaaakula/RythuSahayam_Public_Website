from datetime import datetime, timedelta
from database import SessionLocal, init_db
from models import User, Complaint, ComplaintTimeline, CropGuidance, Scheme, MarketPrice, Announcement, Feedback

def seed_database():
    init_db()
    db = SessionLocal()
    
    # Check if admin exists
    admin = db.query(User).filter_by(role='admin').first()
    if not admin:
        admin_user = User(
            full_name='Agriculture Officer Tadepalli',
            mobile='9876543210',
            email='admin@rythusahayam.ap.gov.in',
            role='admin',
            village='Tadepalli',
            district='Guntur',
            farming_category='Administration',
            land_area=0,
            primary_crop='None'
        )
        admin_user.set_password('Admin@12345')
        db.add(admin_user)
        
        # Sample Demo Farmer
        demo_farmer = User(
            full_name='Rami Reddy Venkata',
            mobile='9988776655',
            email='ramireddy@farmer.ap.gov.in',
            role='farmer',
            village='Prathuru',
            district='Guntur',
            farming_category='Small/Marginal (< 2 ha)',
            land_area=3.5,
            primary_crop='Paddy'
        )
        demo_farmer.set_password('Farmer@123')
        db.add(demo_farmer)
        
        demo_farmer2 = User(
            full_name='Srinivasa Rao Kotha',
            mobile='9848012345',
            email='srinivas.k@farmer.ap.gov.in',
            role='farmer',
            village='Gundimeda',
            district='Guntur',
            farming_category='Medium (2-10 ha)',
            land_area=6.0,
            primary_crop='Chilli'
        )
        demo_farmer2.set_password('Farmer@123')
        db.add(demo_farmer2)
        
        db.commit()

    # Check complaints
    if db.query(Complaint).count() == 0:
        c1 = Complaint(
            complaint_id='RS-2026-1001',
            user_id=2,
            farmer_name='Rami Reddy Venkata',
            mobile='9988776655',
            village='Prathuru',
            crop_type='Paddy',
            problem_category='Irrigation',
            problem_title='Low water pressure at Tail-End Canal Branch',
            description='Water flow in the Prathuru distributary channel has been insufficient for the past 4 days. Nursery saplings are showing signs of moisture stress.',
            image_url=None,
            status='In Progress',
            admin_remarks='Irrigation AE inspected the sluice gate. Sub-channel silt clearance scheduled for Friday morning.',
            created_at=datetime.utcnow() - timedelta(days=3),
            updated_at=datetime.utcnow() - timedelta(hours=6)
        )
        db.add(c1)
        db.flush()
        
        db.add(ComplaintTimeline(
            complaint_ref_id=c1.complaint_id,
            status='Submitted',
            remark='Complaint received through RythuSahayam web portal.',
            updated_by='System',
            created_at=datetime.utcnow() - timedelta(days=3)
        ))
        db.add(ComplaintTimeline(
            complaint_ref_id=c1.complaint_id,
            status='Under Review',
            remark='Forwarded to Tadepalli Irrigation Assistant Executive Engineer (AEE).',
            updated_by='Admin AO',
            created_at=datetime.utcnow() - timedelta(days=2)
        ))
        db.add(ComplaintTimeline(
            complaint_ref_id=c1.complaint_id,
            status='In Progress',
            remark='Inspection completed. Silt clearance machinery dispatched to Prathuru tail-end.',
            updated_by='Admin AO',
            created_at=datetime.utcnow() - timedelta(hours=6)
        ))

        c2 = Complaint(
            complaint_id='RS-2026-1002',
            user_id=3,
            farmer_name='Srinivasa Rao Kotha',
            mobile='9848012345',
            village='Gundimeda',
            crop_type='Chilli',
            problem_category='Crop Diseases',
            problem_title='Black Thrips infestation in chilli fields',
            description='Leaves are curling upwards and flower drop is observed across 2 acres of Byadgi variety chilli. Need urgent pesticide dosage advisory.',
            image_url=None,
            status='Resolved',
            admin_remarks='Agricultural Officer provided advisory: Recommended spraying Fipronil 5% SC @ 2ml/L or Spinetoram 11.7% SC @ 1ml/L during evening hours. Issue verified resolved.',
            created_at=datetime.utcnow() - timedelta(days=7),
            updated_at=datetime.utcnow() - timedelta(days=1)
        )
        db.add(c2)
        db.flush()

        db.add(ComplaintTimeline(
            complaint_ref_id=c2.complaint_id,
            status='Submitted',
            remark='Gundimeda farmer submitted pest alert with leaf symptoms.',
            updated_by='System',
            created_at=datetime.utcnow() - timedelta(days=7)
        ))
        db.add(ComplaintTimeline(
            complaint_ref_id=c2.complaint_id,
            status='In Progress',
            remark='Local Village Agriculture Assistant (VAA) visited plot in Gundimeda.',
            updated_by='VAA Officer',
            created_at=datetime.utcnow() - timedelta(days=5)
        ))
        db.add(ComplaintTimeline(
            complaint_ref_id=c2.complaint_id,
            status='Resolved',
            remark='Prescribed IPM measures adopted. Leaf curl controlled; complaint closed.',
            updated_by='Admin AO',
            created_at=datetime.utcnow() - timedelta(days=1)
        ))

        c3 = Complaint(
            complaint_id='RS-2026-1003',
            user_id=2,
            farmer_name='Rami Reddy Venkata',
            mobile='9988776655',
            village='Prathuru',
            crop_type='Paddy',
            problem_category='Seeds and Fertilizers',
            problem_title='Shortage of Urea bags at local Rythu Seva Kendram',
            description='Second top dressing required for MTU 1010 paddy. Stock was reported exhausted at Prathuru RSK.',
            image_url=None,
            status='Under Review',
            admin_remarks='Verified with Markfed Godown, Mangalagiri. New buffer consignment of 200 bags arriving tomorrow.',
            created_at=datetime.utcnow() - timedelta(hours=14),
            updated_at=datetime.utcnow() - timedelta(hours=2)
        )
        db.add(c3)
        db.flush()

        db.add(ComplaintTimeline(
            complaint_ref_id=c3.complaint_id,
            status='Submitted',
            remark='Fertilizer supply issue logged.',
            updated_by='System',
            created_at=datetime.utcnow() - timedelta(hours=14)
        ))
        db.add(ComplaintTimeline(
            complaint_ref_id=c3.complaint_id,
            status='Under Review',
            remark='Inquired with District Agriculture Office and PACS Tadepalli.',
            updated_by='Admin AO',
            created_at=datetime.utcnow() - timedelta(hours=2)
        ))

        db.commit()

    # Seed Crop Guidance
    if db.query(CropGuidance).count() == 0:
        crops = [
            CropGuidance(
                name='Paddy (Rice)',
                telugu_name='వరి (Paddy)',
                category='Cereals',
                season='Kharif (June-Nov) / Rabi (Nov-April)',
                duration='125 - 150 Days',
                soil_type='Heavy clayey or alluvial soils with high water holding capacity. Ideal pH 6.0 - 7.5.',
                sowing_time='Kharif: June-July nursery raising, July-August transplanting. Rabi: Nov-Dec sowing.',
                water_requirement='Continuous shallow water depth (2-5 cm) from panicle initiation to grain dough stage. Total 1200-1400 mm.',
                fertilizer_info='NPK 120:60:40 kg/ha. Apply full P & K as basal; N in three equal splits (basal, tillering, panicle initiation). Zinc sulphate 50 kg/ha once in 3 seasons.',
                pest_disease_info='Stem Borer: Cartap Hydrochloride 4G @ 10kg/acre. Brown Planthopper (BPH): Triflumezopyrim 10% SC. Blast disease: Tricyclazole 75 WP @ 0.6g/L.',
                harvesting_info='Harvest when 80-85% grains in panicle turn golden straw yellow. Thresh immediately and dry to 12-14% moisture.',
                yield_per_acre='30 - 38 Bags (22 - 28 Quintals/Acre)',
                icon='🌾'
            ),
            CropGuidance(
                name='Chilli (Mirchi)',
                telugu_name='మిరప (Mirchi)',
                category='Spices & Cash Crop',
                season='Kharif & Early Rabi (July - March)',
                duration='180 - 210 Days',
                soil_type='Well-drained black clay soils or fertile red sandy loams. Soil pH 6.5 - 7.5.',
                sowing_time='Nursery in July-August; field transplanting in August-September after 40-45 days.',
                water_requirement='Critical stages: Flowering and fruit development. Drip irrigation with fertigation increases yield by 35% and saves water.',
                fertilizer_info='NPK 150:60:120 kg/ha. Organic compost 10 tonnes/acre. Micronutrient spray (Boron + Zinc) during bloom.',
                pest_disease_info='Black Thrips & Whitefly: Blue and yellow sticky traps (15-20/acre); spray Neem oil 3000ppm or Spinetoram. Die-back / Anthracnose: Azoxystrobin + Difenoconazole @ 1ml/L.',
                harvesting_info='Pick red ripe pods for dry chilli; harvest at 15-day intervals. Sun dry on clean poly-tarpaulins to retain natural shine.',
                yield_per_acre='25 - 35 Quintals/Acre (Dry Chilli)',
                icon='🌶️'
            ),
            CropGuidance(
                name='Cotton (Kapas)',
                telugu_name='ప్రత్తి (Cotton)',
                category='Commercial Cash Crop',
                season='Kharif (June - January)',
                duration='150 - 180 Days',
                soil_type='Deep black cotton soils (regur) with good internal drainage and moisture retention.',
                sowing_time='Onset of South-West Monsoon (June to mid-July) using ridge and furrow method.',
                water_requirement='Deep watering at boll formation and boll opening. Avoid waterlogging at seedling stage.',
                fertilizer_info='NPK 120:60:60 kg/ha. Split nitrogen application at square formation, flowering, and peak boll setting.',
                pest_disease_info='Pink Bollworm: Pheromone traps (5/acre for monitoring, 16/acre for mass trapping). Sucking pests: Flonicamid 50 WG @ 0.3g/L.',
                harvesting_info='Pick clean bolls in early morning after dew dries. Keep cotton free of dry bracts and leaves.',
                yield_per_acre='12 - 18 Quintals/Acre',
                icon='🌱'
            ),
            CropGuidance(
                name='Maize (Corn)',
                telugu_name='మొక్కజొన్న (Maize)',
                category='Cereals / Feed',
                season='Rabi (Oct-Nov) and Kharif (June-July)',
                duration='105 - 120 Days',
                soil_type='Rich loamy soils with neutral pH. Highly responsive to good soil aeration and organic matter.',
                sowing_time='Rabi sowing gives record yields in coastal Guntur-Krishna delta (October 15 to November 15).',
                water_requirement='Irrigation at knee-high stage, tasseling, silking, and milk stage. Water deficit at silking causes severe yield drop.',
                fertilizer_info='NPK 180:80:60 kg/ha. Apply Zinc Sulphate 25 kg/ha at land preparation.',
                pest_disease_info='Fall Armyworm (FAW): Chlorantraniliprole 18.5 SC @ 0.4 ml/L or Emamectin Benzoate 5 SG @ 0.4 g/L into whorls.',
                harvesting_info='Harvest when outer cob husks turn dry and brown, and black layer forms at base of kernel.',
                yield_per_acre='35 - 45 Quintals/Acre (High Rabi Yield)',
                icon='🌽'
            ),
            CropGuidance(
                name='Vegetables (Tomato, Brinjal, Bhendi)',
                telugu_name='కూరగాయలు (Vegetables)',
                category='Horticulture',
                season='Year-round (Aug-Nov & Dec-Feb optimal)',
                duration='75 - 120 Days',
                soil_type='Fertile sandy loams to clay loams rich in organic manure with excellent drainage.',
                sowing_time='Raised beds for monsoon; flat ridges in winter season.',
                water_requirement='Regular light irrigations every 4-6 days. Drip irrigation with plastic mulch recommended.',
                fertilizer_info='Farmyard manure 10-15 tonnes/acre. Water soluble fertilizers (19-19-19) via drip fertigation.',
                pest_disease_info='Fruit & Shoot Borer: Pheromone traps; neem oil 10000 ppm. Bacterial Wilt: Bleaching powder drenching.',
                harvesting_info='Harvest at breaker/pink stage for distant marketing, full red for local sale.',
                yield_per_acre='150 - 220 Quintals/Acre',
                icon='🍅'
            )
        ]
        for c in crops:
            db.add(c)
        db.commit()

    # Seed Schemes
    if db.query(Scheme).count() == 0:
        schemes = [
            Scheme(
                title='PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
                category='Central Govt',
                ministry_state='Ministry of Agriculture & Farmers Welfare, GoI',
                description='Central sector scheme providing income support of ₹6,000 per year in three equal 4-monthly installments of ₹2,000 directly into the bank accounts of farmer families.',
                benefits='Direct Benefit Transfer (DBT) of ₹6,000/year in 3 installments (April-July, August-November, December-March). Zero middleman deduction.',
                eligibility='All landholding farmer families who have cultivable landholding in their names. Subject to exclusion criteria (institutional landowners, income tax payers).',
                documents_needed='Aadhaar Card, Land Revenue Records (Pattadar Passbook / 1B / Adangal), Bank Account details linked to Aadhaar, Active Mobile Number.',
                application_steps='1. Visit official PM-KISAN portal or local Rythu Seva Kendram (RSK). 2. Submit e-KYC using Aadhaar OTP. 3. Enter Land Registration Details. 4. Verification by Village Revenue Officer (VRO).',
                portal_url='https://pmkisan.gov.in',
                helpline='155261 / 1800-115-526'
            ),
            Scheme(
                title='YSR Rythu Bharosa - PM KISAN (Andhra Pradesh)',
                category='AP State Govt',
                ministry_state='Department of Agriculture, Govt of Andhra Pradesh',
                description='Andhra Pradesh flagship farmer financial assistance scheme delivering ₹13,500 per year per farmer family, including tenant farmers (CCRC holders) and ROFR patta holders.',
                benefits='Total ₹13,500/year (combining state contribution and PM-KISAN) delivered before Kharif sowing, crop harvest, and Sankranti festive season.',
                eligibility='Resident farmers of Andhra Pradesh cultivating land. Tenant farmers possessing Crop Cultivator Rights Card (CCRC) are also eligible.',
                documents_needed='Aadhaar Card, Rice Card / Ration Card, Webland 1B Record or CCRC Agreement for tenant farmers, Bank Passbook.',
                application_steps='1. Register at Village Secretariats / Rythu Seva Kendram (RSK) in Prathuru or Gundimeda. 2. Verification of e-Crop booking. 3. Social audit list displayed at Grama Sachivalayam.',
                portal_url='https://ysrrythubharosa.ap.gov.in',
                helpline='1902 (AP CM Grievance)'
            ),
            Scheme(
                title='Kisan Credit Card (KCC) Scheme',
                category='Credit & Loan',
                ministry_state='Reserve Bank of India & NABARD',
                description='Provides adequate and timely credit support from the banking system to farmers for their cultivation expenses, post-harvest expenses, and working capital needs.',
                benefits='Subsidized short-term crop loans up to ₹3,00,000 at an effective interest rate of only 4% per annum (with prompt repayment 3% subvention). No collateral needed up to ₹1.60 Lakh.',
                eligibility='All farmers, individual/joint borrowers, tenant farmers, oral lessees, and Self Help Groups (SHGs) of farmers in Prathuru and Gundimeda.',
                documents_needed='Duly filled KCC application, Two passport photos, ID & Address Proof (Aadhaar/Voter ID), Landholding documents certified by revenue authority.',
                application_steps='1. Download form from bank or collect at Tadepalli SBI / Andhra Pragathi Grameena Bank. 2. Attach copy of Pattadar Passbook and Adangal. 3. Bank sanctions loan limit within 14 days.',
                portal_url='https://www.nabard.org',
                helpline='1800-180-1551'
            ),
            Scheme(
                title='Pradhan Mantri Fasal Bima Yojana (PMFBY / AP Free Crop Insurance)',
                category='Insurance',
                ministry_state='Dept of Agriculture, Andhra Pradesh & GoI',
                description='Comprehensive crop insurance covering non-preventable natural risks like drought, dry spells, flood, cyclone, pests, and unseasonal rains.',
                benefits='AP State Govt pays the farmers share of premium for notified crops booked under e-Crop. 100% loss compensation assessed transparently via Crop Cutting Experiments (CCEs).',
                eligibility='All farmers who have enrolled their crops in the government e-Panta / e-Crop booking system through the local VAA in Prathuru or Gundimeda.',
                documents_needed='e-Crop Booking Acknowledgement, Aadhaar Card, Bank account linked to NPCI for direct claims payout.',
                application_steps='1. Ensure your sown crop is geo-tagged and photographed by Village Agriculture Assistant during e-Crop survey. 2. Verify your name in the social audit list at Rythu Seva Kendram.',
                portal_url='https://pmfby.gov.in',
                helpline='14447'
            ),
            Scheme(
                title='APMIP Drip & Sprinkler Irrigation Subsidy',
                category='Subsidy',
                ministry_state='AP Micro Irrigation Project (APMIP)',
                description='Massive subsidies for installing micro-irrigation systems to economize water usage in commercial and horticultural crops in Andhra Pradesh.',
                benefits='90% subsidy for SC/ST farmers, 70% subsidy for Small & Marginal farmers, and 50% subsidy for other categories (up to 5 acres). Saves up to 60% water and 40% power.',
                eligibility='Farmers owning cultivable land with a functional borewell or open well water source in Guntur district.',
                documents_needed='Aadhaar Card, 1B & Adangal copy, Soil & Water test report, Electricity connection passbook / bills.',
                application_steps='1. Submit online application at APMIP portal or through MeeSeva / RSK. 2. Field survey by Technical Officer. 3. Selection of approved drip vendor (Jain, Netafim, etc.). 4. Installation and field inspection.',
                portal_url='https://apmip.ap.gov.in',
                helpline='0863-2211444'
            ),
            Scheme(
                title='Soil Health Card Scheme',
                category='Soil & Quality',
                ministry_state='Ministry of Agriculture & Farmers Welfare',
                description='Provides soil test-based nutrient reports for farm plots every 2 years, recommending balanced dose of fertilizers (N-P-K) and secondary/micronutrients (Zinc, Iron, Boron).',
                benefits='Improves soil fertility, cuts unnecessary fertilizer expenditures by 20-25%, and prevents soil salinity build-up.',
                eligibility='Open to all landholder farmers in Prathuru, Gundimeda, and surrounding villages.',
                documents_needed='Aadhaar Card, Survey Number / Khata Number of the field.',
                application_steps='1. Soil sample collected by VAA from 4-8 spots in grid. 2. Sample sent to Guntur District Soil Testing Lab. 3. Printed Soil Health Card delivered to farmer.',
                portal_url='https://soilhealth.dac.gov.in',
                helpline='1800-180-1551'
            )
        ]
        for s in schemes:
            db.add(s)
        db.commit()

    # Seed Market Prices
    if db.query(MarketPrice).count() == 0:
        prices = [
            MarketPrice(crop='Paddy (Common)', variety='MTU 1010', market_name='Tadepalli Local Market', district='Guntur', min_price=2203, max_price=2320, modal_price=2260, unit='Rs / Quintal', trend='up'),
            MarketPrice(crop='Paddy (Fine)', variety='BPT 5204 Samba', market_name='Tenali Market Yard', district='Guntur', min_price=2450, max_price=2780, modal_price=2620, unit='Rs / Quintal', trend='up'),
            MarketPrice(crop='Chilli (Teja)', variety='Red Hot Dry', market_name='Guntur Agricultural Market Yard', district='Guntur', min_price=17500, max_price=23500, modal_price=20500, unit='Rs / Quintal', trend='up'),
            MarketPrice(crop='Chilli (Guntur Sannam)', variety='Grade-1 Dry', market_name='Guntur Agricultural Market Yard', district='Guntur', min_price=16000, max_price=21000, modal_price=18500, unit='Rs / Quintal', trend='stable'),
            MarketPrice(crop='Cotton', variety='Medium Staple', market_name='Guntur Yard', district='Guntur', min_price=7121, max_price=7650, modal_price=7420, unit='Rs / Quintal', trend='stable'),
            MarketPrice(crop='Maize (Corn)', variety='Hybrid Yellow', market_name='Vijayawada Regulated Market', district='NTR', min_price=2090, max_price=2340, modal_price=2210, unit='Rs / Quintal', trend='down'),
            MarketPrice(crop='Tomato', variety='Hybrid Round', market_name='Tadepalli Vegetable Sub-Market', district='Guntur', min_price=1600, max_price=2400, modal_price=2000, unit='Rs / Quintal', trend='up'),
            MarketPrice(crop='Brinjal', variety='Green Round', market_name='Vijayawada Wholesale Mandi', district='NTR', min_price=1400, max_price=2200, modal_price=1800, unit='Rs / Quintal', trend='stable')
        ]
        for p in prices:
            db.add(p)
        db.commit()

    # Seed Announcements
    if db.query(Announcement).count() == 0:
        announcements = [
            Announcement(
                title='Krishna Western Delta Canal Water Schedule Released',
                content='Krishna Western Delta main canal and Prathuru distributary channel will maintain full flow till next month for Kharif second wetting. Farmers are advised to plan nursery transplanting accordingly.',
                category='Water Schedule',
                is_urgent=True,
                published_at=datetime.utcnow() - timedelta(days=1)
            ),
            Announcement(
                title='Free Soil Testing Camp at Prathuru Rythu Seva Kendram',
                content='The Department of Agriculture is organizing a free soil testing camp on Saturday from 9:00 AM at Prathuru RSK. Farmers are requested to bring dry soil samples from 6 inches depth.',
                category='Camp',
                is_urgent=False,
                published_at=datetime.utcnow() - timedelta(days=2)
            ),
            Announcement(
                title='Subsidy Bio-Fertilizers & Zinc Sulphate Available',
                content='Subsidized Rhizobium, Azotobacter packets and Zinc Sulphate bags are now in stock at Tadepalli and Gundimeda RSK centres. Please carry your Aadhaar card for Biometric issue.',
                category='Subsidy Alert',
                is_urgent=False,
                published_at=datetime.utcnow() - timedelta(days=4)
            )
        ]
        for a in announcements:
            db.add(a)
        db.commit()

    # Seed Sample Feedback
    if db.query(Feedback).count() == 0:
        feedbacks = [
            Feedback(name='Narasimha Rao', mobile='9876112233', village='Prathuru', message='The canal water alert helped me prepare nursery beds right in time. Very helpful portal!', rating=5),
            Feedback(name='K. Subbalakshmi', mobile='9849223344', village='Gundimeda', message='Checked Chilli market prices before visiting Guntur Yard. Sold for better price.', rating=5)
        ]
        for f in feedbacks:
            db.add(f)
        db.commit()

    db.close()
    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed_database()
