const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || '/api';

function getAuthHeader() {
  const token = localStorage.getItem('rs_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Fallback demo data in case backend server is paused
const FALLBACK_CROPS = [
  {
    id: 1,
    name: 'Paddy (Rice)',
    telugu_name: 'వరి (Paddy)',
    category: 'Cereals',
    season: 'Kharif / Rabi',
    duration: '125 - 150 Days',
    soil_type: 'Heavy clayey or alluvial soils with high water holding capacity. Ideal pH 6.0 - 7.5.',
    sowing_time: 'Kharif: June-July nursery raising. Rabi: Nov-Dec sowing.',
    water_requirement: 'Continuous shallow water depth (2-5 cm) from panicle initiation to grain dough stage. Total 1200-1400 mm.',
    fertilizer_info: 'NPK 120:60:40 kg/ha. Apply full P & K as basal; N in three equal splits.',
    pest_disease_info: 'Stem Borer: Cartap Hydrochloride 4G. BPH: Triflumezopyrim 10% SC. Blast: Tricyclazole 75 WP.',
    harvesting_info: 'Harvest when 80-85% grains turn golden straw yellow. Dry to 12-14% moisture.',
    yield_per_acre: '30 - 38 Bags (22 - 28 Quintals/Acre)',
    icon: '🌾'
  },
  {
    id: 2,
    name: 'Chilli (Mirchi)',
    telugu_name: 'మిరప (Mirchi)',
    category: 'Spices & Cash Crop',
    season: 'Kharif & Early Rabi',
    duration: '180 - 210 Days',
    soil_type: 'Well-drained black clay soils or fertile red sandy loams. Soil pH 6.5 - 7.5.',
    sowing_time: 'Nursery in July-August; field transplanting in August-September after 40-45 days.',
    water_requirement: 'Critical stages: Flowering and fruit development. Drip irrigation saves 35% water.',
    fertilizer_info: 'NPK 150:60:120 kg/ha. Organic compost 10 tonnes/acre. Micronutrient spray (Boron + Zinc).',
    pest_disease_info: 'Black Thrips: Yellow/blue sticky traps; spray Spinetoram. Die-back: Azoxystrobin + Difenoconazole.',
    harvesting_info: 'Pick red ripe pods for dry chilli; sun dry on clean poly-tarpaulins.',
    yield_per_acre: '25 - 35 Quintals/Acre',
    icon: '🌶️'
  },
  {
    id: 3,
    name: 'Cotton (Kapas)',
    telugu_name: 'ప్రత్తి (Cotton)',
    category: 'Commercial Cash Crop',
    season: 'Kharif (June - Jan)',
    duration: '150 - 180 Days',
    soil_type: 'Deep black cotton soils (regur) with good internal drainage and moisture retention.',
    sowing_time: 'June to mid-July with onset of monsoon using ridge and furrow spacing.',
    water_requirement: 'Deep watering at boll formation and boll opening. Avoid water stagnation.',
    fertilizer_info: 'NPK 120:60:60 kg/ha with split nitrogen during square formation and flowering.',
    pest_disease_info: 'Pink Bollworm: Pheromone traps. Sucking pests: Flonicamid 50 WG.',
    harvesting_info: 'Pick clean bolls in early morning after dew dries.',
    yield_per_acre: '12 - 18 Quintals/Acre',
    icon: '🌱'
  },
  {
    id: 4,
    name: 'Maize (Corn)',
    telugu_name: 'మొక్కజొన్న (Maize)',
    category: 'Cereals / Feed',
    season: 'Rabi / Kharif',
    duration: '105 - 120 Days',
    soil_type: 'Rich loamy soils with neutral pH and excellent aeration.',
    sowing_time: 'Rabi sowing in Guntur/Tadepalli region (Oct 15 - Nov 15) gives peak yields.',
    water_requirement: 'Irrigate at knee-high, tasseling, silking, and milk stages.',
    fertilizer_info: 'NPK 180:80:60 kg/ha. Zinc Sulphate 25 kg/ha at land preparation.',
    pest_disease_info: 'Fall Armyworm (FAW): Chlorantraniliprole 18.5 SC into leaf whorls.',
    harvesting_info: 'Harvest when outer husks dry and black layer forms at grain base.',
    yield_per_acre: '35 - 45 Quintals/Acre',
    icon: '🌽'
  },
  {
    id: 5,
    name: 'Vegetables (Tomato, Brinjal, Bhendi)',
    telugu_name: 'కూరగాయలు (Vegetables)',
    category: 'Horticulture',
    season: 'Year-round',
    duration: '75 - 120 Days',
    soil_type: 'Fertile sandy loams to clay loams rich in organic manure.',
    sowing_time: 'Raised beds with drip irrigation and silver-black plastic mulch.',
    water_requirement: 'Regular light watering every 4-5 days.',
    fertilizer_info: 'Farmyard manure 10-15 tonnes/acre. Fertigation with 19-19-19.',
    pest_disease_info: 'Fruit & Shoot borer: Pheromone traps; neem oil 10000 ppm.',
    harvesting_info: 'Pick tomatoes at breaker/pink stage for distant mandis.',
    yield_per_acre: '150 - 220 Quintals/Acre',
    icon: '🍅'
  }
];

const FALLBACK_PRICES = [
  { id: 1, crop: 'Paddy (Common)', variety: 'MTU 1010', market_name: 'Tadepalli Local Market', district: 'Guntur', min_price: 2203, max_price: 2320, modal_price: 2260, unit: 'Rs / Quintal', trend: 'up', last_updated: '13 Nov 2026' },
  { id: 2, crop: 'Paddy (Fine)', variety: 'BPT 5204 Samba', market_name: 'Tenali Market Yard', district: 'Guntur', min_price: 2450, max_price: 2780, modal_price: 2620, unit: 'Rs / Quintal', trend: 'up', last_updated: '13 Nov 2026' },
  { id: 3, crop: 'Chilli (Teja)', variety: 'Red Hot Dry', market_name: 'Guntur Agricultural Market Yard', district: 'Guntur', min_price: 17500, max_price: 23500, modal_price: 20500, unit: 'Rs / Quintal', trend: 'up', last_updated: '13 Nov 2026' },
  { id: 4, crop: 'Chilli (Sannam)', variety: 'Grade-1 Dry', market_name: 'Guntur Agricultural Market Yard', district: 'Guntur', min_price: 16000, max_price: 21000, modal_price: 18500, unit: 'Rs / Quintal', trend: 'stable', last_updated: '13 Nov 2026' },
  { id: 5, crop: 'Cotton', variety: 'Medium Staple', market_name: 'Guntur Yard', district: 'Guntur', min_price: 7121, max_price: 7650, modal_price: 7420, unit: 'Rs / Quintal', trend: 'stable', last_updated: '13 Nov 2026' },
  { id: 6, crop: 'Maize (Corn)', variety: 'Hybrid Yellow', market_name: 'Vijayawada Regulated Market', district: 'NTR', min_price: 2090, max_price: 2340, modal_price: 2210, unit: 'Rs / Quintal', trend: 'down', last_updated: '13 Nov 2026' },
  { id: 7, crop: 'Tomato', variety: 'Hybrid Round', market_name: 'Tadepalli Vegetable Sub-Market', district: 'Guntur', min_price: 1600, max_price: 2400, modal_price: 2000, unit: 'Rs / Quintal', trend: 'up', last_updated: '13 Nov 2026' }
];

const FALLBACK_SCHEMES = [
  {
    id: 1,
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'Central Govt',
    ministry_state: 'Ministry of Agriculture & Farmers Welfare, GoI',
    description: 'Central sector scheme providing income support of ₹6,000 per year in three equal 4-monthly installments of ₹2,000 directly into the bank accounts of farmer families.',
    benefits: 'Direct Benefit Transfer (DBT) of ₹6,000/year in 3 installments. Zero middleman deduction.',
    eligibility: 'All landholding farmer families who have cultivable landholding in their names.',
    documents_needed: 'Aadhaar Card, Land Revenue Records (Pattadar Passbook / 1B), Bank Account linked to Aadhaar.',
    application_steps: '1. Visit official PM-KISAN portal or local Rythu Seva Kendram (RSK). 2. Submit e-KYC. 3. Enter Land Registration Details.',
    portal_url: 'https://pmkisan.gov.in',
    helpline: '155261'
  },
  {
    id: 2,
    title: 'YSR Rythu Bharosa - PM KISAN (Andhra Pradesh)',
    category: 'AP State Govt',
    ministry_state: 'Department of Agriculture, Govt of Andhra Pradesh',
    description: 'Flagship financial assistance scheme delivering ₹13,500 per year per farmer family, including tenant farmers (CCRC holders).',
    benefits: 'Total ₹13,500/year disbursed before Kharif sowing, crop harvest, and Sankranti season.',
    eligibility: 'Resident farmers of Andhra Pradesh cultivating land, including registered tenant farmers.',
    documents_needed: 'Aadhaar Card, Rice Card, Webland 1B Record or CCRC Agreement, Bank Passbook.',
    application_steps: '1. Register at Village Secretariats / RSK in Prathuru or Gundimeda. 2. Verification of e-Crop booking.',
    portal_url: 'https://ysrrythubharosa.ap.gov.in',
    helpline: '1902'
  },
  {
    id: 3,
    title: 'Kisan Credit Card (KCC) Scheme',
    category: 'Credit & Loan',
    ministry_state: 'Reserve Bank of India & NABARD',
    description: 'Adequate and timely credit support from banks for crop cultivation, post-harvest expenses, and farm inputs.',
    benefits: 'Subsidized crop loans up to ₹3,00,000 at effective 4% interest per annum with prompt repayment.',
    eligibility: 'All farmers, tenant farmers, oral lessees, and Self Help Groups in Prathuru and Gundimeda.',
    documents_needed: 'Duly filled KCC application, Two photos, Aadhaar, Landholding Pattadar Passbook.',
    application_steps: '1. Collect form from Tadepalli SBI / APGVB Bank. 2. Attach Pattadar Passbook. 3. Sanction within 14 days.',
    portal_url: 'https://www.nabard.org',
    helpline: '1800-180-1551'
  },
  {
    id: 4,
    title: 'APMIP Micro Irrigation (Drip & Sprinkler) Subsidy',
    category: 'Subsidy',
    ministry_state: 'AP Micro Irrigation Project (APMIP)',
    description: 'Subsidies up to 90% for installing micro-irrigation systems to economize water usage in Guntur district.',
    benefits: '90% subsidy for SC/ST farmers, 70% for Small/Marginal farmers. Saves 60% water and 40% electricity.',
    eligibility: 'Farmers owning land with a functional borewell or canal/well water source.',
    documents_needed: 'Aadhaar Card, 1B & Adangal, Water test report, Electricity connection passbook.',
    application_steps: '1. Register at RSK / MeeSeva. 2. Field survey by Technical Officer. 3. Vendor installation and inspection.',
    portal_url: 'https://apmip.ap.gov.in',
    helpline: '0863-2211444'
  }
];

export async function fetchCrops(category = '', search = '') {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/crops?${params.toString()}`);
    if (!res.ok) throw new Error('Network response failed');
    return await res.json();
  } catch (err) {
    return { crops: FALLBACK_CROPS };
  }
}

export async function fetchSchemes(category = '') {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    const res = await fetch(`${API_BASE}/schemes?${params.toString()}`);
    if (!res.ok) throw new Error('Network response failed');
    return await res.json();
  } catch (err) {
    return { schemes: FALLBACK_SCHEMES };
  }
}

export async function fetchMarketPrices(crop = '', market = '') {
  try {
    const params = new URLSearchParams();
    if (crop) params.append('crop', crop);
    if (market) params.append('market', market);
    const res = await fetch(`${API_BASE}/market-prices?${params.toString()}`);
    if (!res.ok) throw new Error('Network response failed');
    return await res.json();
  } catch (err) {
    return { prices: FALLBACK_PRICES, source: 'AGMARKNET (Demonstration Cache)', updated_time: '13 Nov 2026, 11:30 AM' };
  }
}

export async function fetchWeather(village = 'Prathuru') {
  try {
    const res = await fetch(`${API_BASE}/weather?village=${encodeURIComponent(village)}`);
    if (!res.ok) throw new Error('Network response failed');
    return await res.json();
  } catch (err) {
    return {
      location: `${village}, Tadepalli Mandal, Guntur Dist.`,
      village: village,
      temperature: 31,
      feels_like: 34,
      condition: 'Partly Sunny / Clear',
      condition_icon: '⛅',
      humidity: 68,
      wind_speed: 12,
      rainfall_chance: 15,
      rainfall_forecast: 'Dry weather expected for the next 48 hours. Light evening coastal breeze.',
      advisories: [
        'Paddy: Ideal conditions for second top-dressing of nitrogen in tillering stage.',
        'Chilli: Favorable humidity for sucking pests. Monitor leaf undersides for thrips.',
        'Irrigation: Canal water flow scheduled via Krishna Delta system. Night-time irrigation recommended.'
      ],
      forecast: [
        { day: 'Today', temp_max: 32, temp_min: 23, condition: 'Sunny' },
        { day: 'Tomorrow', temp_max: 33, temp_min: 24, condition: 'Partly Cloudy' },
        { day: 'Saturday', temp_max: 32, temp_min: 23, condition: 'Scattered Clouds' },
        { day: 'Sunday', temp_max: 31, temp_min: 22, condition: 'Clear Sky' }
      ]
    };
  }
}

export async function fetchAnnouncements() {
  try {
    const res = await fetch(`${API_BASE}/announcements`);
    if (!res.ok) throw new Error('Network response failed');
    return await res.json();
  } catch (err) {
    return {
      announcements: [
        {
          id: 1,
          title: 'Krishna Western Delta Canal Water Schedule Released',
          content: 'Prathuru and Gundimeda distributary channels will maintain continuous discharge till month-end. Please schedule transplanting accordingly.',
          category: 'Water Schedule',
          is_urgent: true,
          published_at: '12 Nov 2026'
        },
        {
          id: 2,
          title: 'Free Soil Testing Camp at Prathuru Rythu Seva Kendram',
          content: 'Free soil test camp on Saturday at 9 AM. Bring dry soil samples from 6 inches depth.',
          category: 'Camp',
          is_urgent: false,
          published_at: '11 Nov 2026'
        }
      ]
    };
  }
}

export async function submitComplaint(data) {
  const headers = { 'Content-Type': 'application/json', ...getAuthHeader() };
  const res = await fetch(`${API_BASE}/complaints`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function fetchComplaintTracking(complaintId) {
  const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(complaintId)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Complaint not found');
  }
  return await res.json();
}

export async function fetchComplaints(filters = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${API_BASE}/complaints?${params.toString()}`);
  return await res.json();
}

export async function fetchUserComplaints() {
  const res = await fetch(`${API_BASE}/complaints/user`, {
    headers: { ...getAuthHeader() }
  });
  return await res.json();
}

export async function updateComplaintStatus(complaintId, status, remark) {
  const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(complaintId)}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ status, remark })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Update failed');
  }
  return await res.json();
}

export async function loginFarmer(identifier, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function registerFarmer(userData) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error('Unauthorized');
  return await res.json();
}

export async function searchSupport(village, crop, category) {
  try {
    const params = new URLSearchParams({ village, crop, category });
    const res = await fetch(`${API_BASE}/support/search?${params.toString()}`);
    if (!res.ok) throw new Error('Search failed');
    return await res.json();
  } catch (err) {
    return {
      village,
      crop,
      category,
      matched_crop: FALLBACK_CROPS[0],
      matched_schemes: FALLBACK_SCHEMES.slice(0, 2),
      local_contacts: {
        rsk_name: `${village} Rythu Seva Kendram`,
        vaa_name: 'Village Agriculture Assistant (VAA)',
        contact: '+91 94409 01234',
        location: `Main Road, ${village} Gram Panchayat`
      },
      guidance_message: `Identified local assistance for ${crop || 'farming'} in ${village}.`
    };
  }
}

export async function fetchAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error('Failed to load admin stats');
  return await res.json();
}

export async function fetchAdminFarmers(filters = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${API_BASE}/admin/farmers?${params.toString()}`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error('Failed to load farmers');
  return await res.json();
}

export async function submitFeedback(data) {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}
