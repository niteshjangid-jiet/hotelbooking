-- =====================================================================================
-- HOTELBOOKINGSITE - COMPLETE MASTER SUPABASE DATABASE SCHEMA & SEED DATA
-- Run this entire script inside your Supabase Project's SQL Editor (https://app.supabase.com)
-- =====================================================================================

-- -------------------------------------------------------------------------------------
-- 1. DROP EXISTING TABLES & TRIGGERS IF NEEDED (CASCADE CLEANUP)
-- -------------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS public.wishlists CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.hotel_amenities CASCADE;
DROP TABLE IF EXISTS public.amenities CASCADE;
DROP TABLE IF EXISTS public.rooms CASCADE;
DROP TABLE IF EXISTS public.hotel_images CASCADE;
DROP TABLE IF EXISTS public.hotels CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- -------------------------------------------------------------------------------------
-- 2. USER PROFILES TABLE (Linked with Supabase Auth)
-- -------------------------------------------------------------------------------------
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(50),
    avatar_url TEXT,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to automatically create a profile record when a new user registers via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------------------------------------
-- 3. HOTELS TABLE
-- -------------------------------------------------------------------------------------
CREATE TABLE public.hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(3, 2) DEFAULT 4.50,
    review_count INTEGER DEFAULT 0,
    starting_price DECIMAL(10, 2) NOT NULL,
    property_type VARCHAR(50) NOT NULL DEFAULT 'Hotel', -- Hotel, Resort, Villa, Palace, Boutique
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------------------
-- 4. HOTEL IMAGES TABLE
-- -------------------------------------------------------------------------------------
CREATE TABLE public.hotel_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------------------
-- 5. ROOMS TABLE
-- -------------------------------------------------------------------------------------
CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
    room_name VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 2,
    price DECIMAL(10, 2) NOT NULL,
    available_rooms INTEGER DEFAULT 5,
    bed_type VARCHAR(50) DEFAULT 'King Bed',
    breakfast BOOLEAN DEFAULT TRUE,
    wifi BOOLEAN DEFAULT TRUE,
    air_conditioning BOOLEAN DEFAULT TRUE,
    free_cancellation BOOLEAN DEFAULT TRUE,
    room_size VARCHAR(50) DEFAULT '45 sq.m',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------------------
-- 6. AMENITIES TABLE & HOTEL_AMENITIES JUNCTION TABLE
-- -------------------------------------------------------------------------------------
CREATE TABLE public.amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(100) NOT NULL DEFAULT 'HiSparkles'
);

CREATE TABLE public.hotel_amenities (
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
    amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (hotel_id, amenity_id)
);

-- -------------------------------------------------------------------------------------
-- 7. BOOKINGS TABLE
-- -------------------------------------------------------------------------------------
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    hotel_id VARCHAR(100) NOT NULL,
    room_id VARCHAR(100) NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL DEFAULT 1,
    nights INTEGER NOT NULL DEFAULT 1,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    taxes NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    special_requests TEXT,
    booking_status VARCHAR(30) NOT NULL DEFAULT 'Confirmed', -- Confirmed, Completed, Cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------------------
-- 8. REVIEWS TABLE
-- -------------------------------------------------------------------------------------
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating DECIMAL(3, 2) NOT NULL,
    review TEXT NOT NULL, -- Holds review comment text or JSON payload with category breakdown
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------------------
-- 9. WISHLISTS / SAVED HOTELS TABLE
-- -------------------------------------------------------------------------------------
CREATE TABLE public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, hotel_id)
);

-- -------------------------------------------------------------------------------------
-- 10. HIGH-PERFORMANCE INDEXES
-- -------------------------------------------------------------------------------------
CREATE INDEX idx_hotels_city ON public.hotels(city);
CREATE INDEX idx_hotels_starting_price ON public.hotels(starting_price);
CREATE INDEX idx_hotels_rating ON public.hotels(rating);
CREATE INDEX idx_hotels_property_type ON public.hotels(property_type);
CREATE INDEX idx_hotels_featured ON public.hotels(featured);

CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_hotel_room ON public.bookings(hotel_id, room_id);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in, check_out);

CREATE INDEX idx_reviews_hotel_id ON public.reviews(hotel_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);

-- -------------------------------------------------------------------------------------
-- 11. SUPABASE STORAGE BUCKETS & POLICIES
-- -------------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hotel-images', 'hotel-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Read Access
CREATE POLICY "Public Access for Hotel Images" ON storage.objects
    FOR SELECT USING (bucket_id = 'hotel-images');

CREATE POLICY "Public Access for Avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

-- Authenticated User Upload Access for Avatars
CREATE POLICY "Authenticated Users Upload Avatars" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users Update Own Avatar" ON storage.objects
    FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- -------------------------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Hotels & Relational Data (Public Read)
CREATE POLICY "Allow public read access on hotels" ON public.hotels FOR SELECT USING (true);
CREATE POLICY "Allow public read access on hotel_images" ON public.hotel_images FOR SELECT USING (true);
CREATE POLICY "Allow public read access on rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Allow public read access on amenities" ON public.amenities FOR SELECT USING (true);
CREATE POLICY "Allow public read access on hotel_amenities" ON public.hotel_amenities FOR SELECT USING (true);
CREATE POLICY "Allow public read access on reviews" ON public.reviews FOR SELECT USING (true);

-- Reviews Write Policies
CREATE POLICY "Users can insert own review" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own review" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own review" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Bookings RLS Policies
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- Wishlists Policies
CREATE POLICY "Users can view own wishlists" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wishlist item" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own wishlist item" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- -------------------------------------------------------------------------------------
-- 13. SEED DATA - AMENITIES
-- -------------------------------------------------------------------------------------
INSERT INTO public.amenities (id, name, icon) VALUES
('11111111-1111-1111-1111-111111111101', 'Free WiFi', 'HiWifi'),
('11111111-1111-1111-1111-111111111102', 'Swimming Pool', 'HiPool'),
('11111111-1111-1111-1111-111111111103', 'Free Breakfast', 'HiCake'),
('11111111-1111-1111-1111-111111111104', 'Air Conditioning', 'HiSun'),
('11111111-1111-1111-1111-111111111105', 'Fitness Center / Gym', 'HiLightningBolt'),
('11111111-1111-1111-1111-111111111106', 'Luxury Spa & Wellness', 'HiHeart'),
('11111111-1111-1111-1111-111111111107', 'Free Parking', 'HiTruck'),
('11111111-1111-1111-1111-111111111108', 'Restaurant & Fine Dining', 'HiBadgeCheck'),
('11111111-1111-1111-1111-111111111109', 'Airport Transfer', 'HiPaperAirplane'),
('11111111-1111-1111-1111-111111111110', 'Bar & Cocktail Lounge', 'HiGlass');

-- -------------------------------------------------------------------------------------
-- 14. SEED DATA - 40 LUXURY HOTELS ACROSS 10 CITIES
-- -------------------------------------------------------------------------------------
INSERT INTO public.hotels (id, hotel_name, slug, description, city, state, address, rating, review_count, starting_price, property_type, featured) VALUES
-- UDAIPUR
('a0000000-0000-0000-0000-000000000001', 'Taj Lake Palace', 'taj-lake-palace-udaipur', 'Floating on the serene waters of Lake Pichola, Taj Lake Palace is an 18th-century marble marvel featuring opulent regal suites, royal dining, and breathtaking sunset lake views.', 'Udaipur', 'Rajasthan', 'Lake Pichola, Udaipur, Rajasthan 313001', 4.95, 342, 48500.00, 'Palace', true),
('a0000000-0000-0000-0000-000000000002', 'The Oberoi Udaivilas', 'the-oberoi-udaivilas-udaipur', 'Spread over 50 acres on the banks of Lake Pichola, featuring grand domes, intricate corridors, reflection pools, and private butler service.', 'Udaipur', 'Rajasthan', 'Badi-Gorela-Mulla Talai Rd, Haridas Ji Ki Magri, Udaipur 313001', 4.98, 412, 56000.00, 'Palace', true),
('a0000000-0000-0000-0000-000000000003', 'The Leela Palace Udaipur', 'the-leela-palace-udaipur', 'A modern royal sanctuary overlooking Lake Pichola with majestic Aravalli mountain views, private boat transfers, and fine dining.', 'Udaipur', 'Rajasthan', 'Lake Pichola, Udaipur, Rajasthan 313001', 4.90, 289, 42000.00, 'Resort', false),
('a0000000-0000-0000-0000-000000000004', 'Trident Udaipur', 'trident-udaipur', 'Set in 43 acres of lush gardens along Lake Pichola, offering heritage-inspired architecture, kid friendly activities, and wellness treatments.', 'Udaipur', 'Rajasthan', 'Mulla Talai, Udaipur, Rajasthan 313001', 4.70, 195, 14500.00, 'Hotel', false),

-- JAIPUR
('a0000000-0000-0000-0000-000000000005', 'Rambagh Palace', 'rambagh-palace-jaipur', 'The Jewel of Jaipur. Formerly the residence of the Maharaja of Jaipur, featuring lavish peacock-dotted gardens, regal dining rooms, and heritage suites.', 'Jaipur', 'Rajasthan', 'Bhawani Singh Rd, Jaipur, Rajasthan 302005', 4.96, 520, 52000.00, 'Palace', true),
('a0000000-0000-0000-0000-000000000006', 'Fairmont Jaipur', 'fairmont-jaipur', 'A grand Mughal & Rajput architectural masterpiece nestled in the Aravalli hills, offering authentic cultural performances and luxury spa treatments.', 'Jaipur', 'Rajasthan', '2 Riico, Kukas, Jaipur, Rajasthan 302028', 4.82, 310, 18500.00, 'Resort', true),
('a0000000-0000-0000-0000-000000000007', 'The Leela Palace Jaipur', 'the-leela-palace-jaipur', 'Surrounded by idyllic landscapes, combining royal Rajasthani heritage with ultra-modern luxury villas and private plunge pools.', 'Jaipur', 'Rajasthan', 'Jaipur-Delhi Highway, Kukas, Jaipur 302028', 4.88, 178, 24000.00, 'Villa', false),
('a0000000-0000-0000-0000-000000000008', 'Jai Mahal Palace', 'jai-mahal-palace-jaipur', 'A 270-year-old Indo-Saracenic architectural masterpiece set amidst 18 acres of landscaped Mughal gardens in the heart of the Pink City.', 'Jaipur', 'Rajasthan', 'Jacob Road, Civil Lines, Jaipur 302006', 4.75, 230, 21000.00, 'Palace', false),

-- JODHPUR
('a0000000-0000-0000-0000-000000000009', 'Umaid Bhawan Palace', 'umaid-bhawan-palace-jodhpur', 'One of the world''s largest private residences, crafted in golden yellow sandstone. Perched above the Blue City of Jodhpur with art deco elegance.', 'Jodhpur', 'Rajasthan', 'Circuit House Rd, Jodhpur, Rajasthan 342006', 4.97, 480, 58000.00, 'Palace', true),
('a0000000-0000-0000-0000-000000000010', 'RAAS Jodhpur', 'raas-jodhpur', 'A boutique heritage hotel situated at the foot of Mehrangarh Fort, blending 18th-century Haveli architecture with contemporary luxury.', 'Jodhpur', 'Rajasthan', 'Tunwar ji ka Jhalra, Makrana Mohalla, Jodhpur 342001', 4.85, 164, 19500.00, 'Boutique', false),
('a0000000-0000-0000-0000-000000000011', 'Ajit Bhawan Palace', 'ajit-bhawan-palace-jodhpur', 'India''s first heritage hotel, offering royal suites, vintage car drives, and desert safari experiences in Jodhpur.', 'Jodhpur', 'Rajasthan', 'Near Circuit House, Jodhpur, Rajasthan 342006', 4.65, 142, 12500.00, 'Hotel', false),
('a0000000-0000-0000-0000-000000000012', 'Indana Palace Jodhpur', 'indana-palace-jodhpur', 'Echoing the royal Marwar heritage with carved archways, courtyard pools, and traditional folk music evenings.', 'Jodhpur', 'Rajasthan', 'Opposite Airport, Shikargarh, Jodhpur 342011', 4.60, 128, 9800.00, 'Resort', false),

-- GOA
('a0000000-0000-0000-0000-000000000013', 'Taj Exotica Resort & Spa Goa', 'taj-exotica-goa', 'Embraced by the Arabian Sea in Benaulim, offering Mediterranean-style villas, lush golf greens, seafood beach dining, and private cabanas.', 'Goa', 'Goa', 'Calwaddo, Benaulim, Goa 403716', 4.91, 560, 26000.00, 'Resort', true),
('a0000000-0000-0000-0000-000000000014', 'W Goa', 'w-goa', 'Located on Vagator Beach, featuring vibrant party vibes, infinity pools overlooking the ocean, Rock Pool sunsets, and sleek modern design.', 'Goa', 'Goa', 'Vagator Beach, Bardez, Goa 403509', 4.78, 380, 22500.00, 'Resort', true),
('a0000000-0000-0000-0000-000000000015', 'The St. Regis Goa Resort', 'the-st-regis-goa-resort', 'Nestled between the Arabian Sea and Sal River in South Goa, featuring 75 acres of tropical lagoons, golf course, and St. Regis Butler Service.', 'Goa', 'Goa', 'Mobor Beach, Cavelossim, Goa 403731', 4.89, 290, 29000.00, 'Resort', false),
('a0000000-0000-0000-0000-000000000016', 'Ahilya By The Sea', 'ahilya-by-the-sea-goa', 'An intimate boutique hideaway in Nerul, tucked away in a quiet corner of Dolphin Bay with tropical gardens and two infinity pools.', 'Goa', 'Goa', 'Coco Shade, Nerul, Goa 403109', 4.84, 98, 18000.00, 'Villa', false),

-- DELHI
('a0000000-0000-0000-0000-000000000017', 'The Imperial New Delhi', 'the-imperial-new-delhi', 'An iconic heritage hotel in Janpath, combining Victorian and Colonial elegance with legendary dining, art galleries, and lush gardens.', 'Delhi', 'Delhi', 'Janpath, Connaught Place, New Delhi 110001', 4.90, 420, 21000.00, 'Hotel', true),
('a0000000-0000-0000-0000-000000000018', 'The Leela Palace New Delhi', 'the-leela-palace-new-delhi', 'Located in Chanakyapuri Diplomatic Enclave, featuring a rooftop infinity pool overlooking Delhi skyline and Michelin-caliber dining.', 'Delhi', 'Delhi', 'Diplomatic Enclave, Chanakyapuri, New Delhi 110023', 4.93, 395, 24500.00, 'Hotel', true),
('a0000000-0000-0000-0000-000000000019', 'ITC Maurya Delhi', 'itc-maurya-delhi', 'Renowned for hosting global leaders and presidents, featuring iconic restaurants Bukhara & Dum Pukht in Diplomatic Enclave.', 'Delhi', 'Delhi', 'Diplomatic Enclave, Sardar Patel Marg, New Delhi 110021', 4.82, 450, 16500.00, 'Hotel', false),
('a0000000-0000-0000-0000-000000000020', 'Andaz Delhi - Aerocity', 'andaz-delhi-aerocity', 'A trendy lifestyle hotel near Indira Gandhi International Airport featuring modern regional art installations and open kitchen dining.', 'Delhi', 'Delhi', 'Asset No. 1, Aerocity, New Delhi 110037', 4.70, 310, 11500.00, 'Boutique', false),

-- MUMBAI
('a0000000-0000-0000-0000-000000000021', 'The Taj Mahal Palace Mumbai', 'taj-mahal-palace-mumbai', 'India''s premier flagship hotel overlooking the Gateway of India and Arabian Sea, offering unmatched historical grandeur and hospitality since 1903.', 'Mumbai', 'Maharashtra', 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001', 4.98, 890, 32000.00, 'Palace', true),
('a0000000-0000-0000-0000-000000000022', 'The St. Regis Mumbai', 'the-st-regis-mumbai', 'India''s tallest hotel tower in Lower Parel, offering panoramic city views, butler service, rooftop lounges, and luxury shopping access.', 'Mumbai', 'Maharashtra', '462, Senapati Bapat Marg, Lower Parel, Mumbai 400013', 4.88, 510, 21500.00, 'Hotel', true),
('a0000000-0000-0000-0000-000000000023', 'The Oberoi Mumbai', 'the-oberoi-mumbai', 'Located on Marine Drive with sweeping views of the Queen''s Necklace and Arabian Sea, offering understated luxury and quiet sophistication.', 'Mumbai', 'Maharashtra', 'Nariman Point, Mumbai, Maharashtra 400021', 4.92, 430, 27500.00, 'Hotel', false),
('a0000000-0000-0000-0000-000000000024', 'JW Marriott Mumbai Juhu', 'jw-marriott-mumbai-juhu', 'A favorite oceanfront retreat in Juhu Beach frequented by Bollywood celebrities, featuring saltwater pools and beachside dining.', 'Mumbai', 'Maharashtra', 'Juhu Tara Rd, Juhu, Mumbai, Maharashtra 400049', 4.76, 620, 17500.00, 'Resort', false),

-- BENGALURU
('a0000000-0000-0000-0000-000000000025', 'The Leela Palace Bengaluru', 'the-leela-palace-bengaluru', 'Inspired by the Royal Palace of Mysore, set in nine acres of lush gardens with grand archways, cascading waterfalls, and luxury spas.', 'Bengaluru', 'Karnataka', '23, HAL Old Airport Rd, Kodihalli, Bengaluru 560008', 4.94, 610, 19500.00, 'Palace', true),
('a0000000-0000-0000-0000-000000000026', 'ITC Gardenia Bengaluru', 'itc-gardenia-bengaluru', 'A luxury eco-hotel in Central Bengaluru featuring wind-cooled open-air lobbies, vertical gardens, and award-winning dining.', 'Bengaluru', 'Karnataka', '1, Residency Rd, Ashok Nagar, Bengaluru 560001', 4.82, 380, 14000.00, 'Hotel', false),
('a0000000-0000-0000-0000-000000000027', 'Four Seasons Hotel Bengaluru', 'four-seasons-bengaluru', 'Located in Embassy ONE, offering sleek contemporary design, rooftop lounges, garden terrace dining, and outdoor pool sanctuary.', 'Bengaluru', 'Karnataka', '8, Bellary Rd, Ganganagar, Bengaluru 560032', 4.86, 210, 16500.00, 'Hotel', false),
('a0000000-0000-0000-0000-000000000028', 'Taj West End Bengaluru', 'taj-west-end-bengaluru', 'Nestled amidst 20 acres of flora and heritage trees in the city center, offering colonial heritage rooms and fine dining under canopy trees.', 'Bengaluru', 'Karnataka', 'Race Course Rd, High Grounds, Bengaluru 560001', 4.80, 290, 15500.00, 'Hotel', false),

-- CHENNAI
('a0000000-0000-0000-0000-000000000029', 'ITC Grand Chola Chennai', 'itc-grand-chola-chennai', 'A tribute to the Southern Chola dynasty architecture, featuring carved temple columns, marble staircases, and 10 dining destinations.', 'Chennai', 'Tamil Nadu', '63, Mount Rd, Guindy, Chennai, Tamil Nadu 600032', 4.91, 740, 13500.00, 'Palace', true),
('a0000000-0000-0000-0000-000000000030', 'Taj Connemara Chennai', 'taj-connemara-chennai', 'South India''s oldest heritage hotel, blending colonial charm, Art Deco elements, and modern South Indian hospitality.', 'Chennai', 'Tamil Nadu', 'Binny Rd, Anna Salai, Chennai, Tamil Nadu 600002', 4.75, 230, 10500.00, 'Hotel', false),
('a0000000-0000-0000-0000-000000000031', 'The Leela Palace Chennai', 'the-leela-palace-chennai', 'Chennai''s only sea-facing palace hotel, overlooking the Bay of Bengal with Chettinad architecture and seafront dining.', 'Chennai', 'Tamil Nadu', 'Adyar Seaface, MRC Nagar, Chennai 600028', 4.88, 320, 16000.00, 'Resort', false),
('a0000000-0000-0000-0000-000000000032', 'InterContinental Chennai Mahabalipuram', 'intercontinental-chennai', 'Set on the Coromandel coast near UNESCO Mahabalipuram temples, featuring private beach frontages and temple spa therapies.', 'Chennai', 'Tamil Nadu', 'Post, Perur, No. 212 East Coast Rd, Nemmeli, Chennai 603104', 4.78, 190, 14500.00, 'Resort', false),

-- HYDERABAD
('a0000000-0000-0000-0000-000000000033', 'Taj Falaknuma Palace', 'taj-falaknuma-palace-hyderabad', 'Perched 2,000 feet above Hyderabad, the former palace of the Nizam features horse-drawn carriage arrivals, Venetian chandeliers, and royal banquets.', 'Hyderabad', 'Telangana', 'Engine Bowli, Falaknuma, Hyderabad, Telangana 500053', 4.97, 540, 49000.00, 'Palace', true),
('a0000000-0000-0000-0000-000000000034', 'ITC Kohenur Hyderabad', 'itc-kohenur-hyderabad', 'Overlooking Durgam Cheruvu Lake in HITEC City, inspired by the legendary Koh-i-Noor diamond with state-of-the-art tech luxury.', 'Hyderabad', 'Telangana', 'Plot No. 5, Survey No. 83/1, HITEC City, Hyderabad 500081', 4.85, 340, 14000.00, 'Hotel', false),
('a0000000-0000-0000-0000-000000000035', 'Park Hyatt Hyderabad', 'park-hyatt-hyderabad', 'An architectural icon in Banjara Hills, featuring a dramatic 8-story atrium, artwork collection, and private spa suites.', 'Hyderabad', 'Telangana', 'Road No. 2, Banjara Hills, Hyderabad, Telangana 500034', 4.79, 260, 12500.00, 'Hotel', false),
('a0000000-0000-0000-0000-000000000036', 'The Westin Hyderabad Mindspace', 'the-westin-hyderabad-mindspace', 'Located in the heart of HITEC City, offering Heavenly Beds, wellness centers, and poolside lounge bars.', 'Hyderabad', 'Telangana', 'Raheja IT Park, Hitec City, Madhapur, Hyderabad 500081', 4.72, 310, 11000.00, 'Hotel', false),

-- SHIMLA
('a0000000-0000-0000-0000-000000000037', 'Wildflower Hall An Oberoi Resort Shimla', 'wildflower-hall-shimla', 'Situated at 8,250 feet amidst cedar forests, the former residence of Lord Kitchener features a heated outdoor infinity spa pool facing the Himalayas.', 'Shimla', 'Himachal Pradesh', 'Chharabra, Shimla, Himachal Pradesh 171012', 4.96, 410, 36000.00, 'Resort', true),
('a0000000-0000-0000-0000-000000000038', 'The Oberoi Cecil Shimla', 'the-oberoi-cecil-shimla', 'A grand heritage hotel built in 1884 at the quiet end of the Mall Road, offering mountain views, wooden fireplaces, and indoor heated pool.', 'Shimla', 'Himachal Pradesh', 'Chaura Maidan, Shimla, Himachal Pradesh 171004', 4.87, 280, 19500.00, 'Hotel', false),
('a0000000-0000-0000-0000-000000000039', 'Taj The Trees Shimla', 'taj-the-trees-shimla', 'Perched on a forested hill slope, offering contemporary mountain luxury, glass-front dining over pine valleys, and cozy fireplace lounges.', 'Shimla', 'Himachal Pradesh', 'Koti, Chotta Shimla, Shimla 171009', 4.80, 140, 17000.00, 'Resort', false),
('a0000000-0000-0000-0000-000000000040', 'Suryavilas Luxury Resort Shimla', 'suryavilas-resort-shimla', 'Spread over 15 acres of pine trees, featuring private infinity pools, mud spa therapies, and panoramic sunset valley views.', 'Shimla', 'Himachal Pradesh', 'Gandhigram, Solan-Shimla Highway, Shimla 173229', 4.68, 115, 11500.00, 'Villa', false);

-- -------------------------------------------------------------------------------------
-- 15. SEED DATA - HOTEL GALLERY IMAGES
-- -------------------------------------------------------------------------------------
INSERT INTO public.hotel_images (hotel_id, image_url, display_order) VALUES
('a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', 2),
('a0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000017', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000018', 'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000019', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000020', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000021', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000022', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000023', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000024', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000025', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000026', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000027', 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000028', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000029', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000030', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000031', 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000032', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000033', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000034', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000035', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000036', 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000037', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000038', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000039', 'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1200&q=80', 1),
('a0000000-0000-0000-0000-000000000040', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80', 1);

-- -------------------------------------------------------------------------------------
-- 16. SEED DATA - ROOM TYPES
-- -------------------------------------------------------------------------------------
INSERT INTO public.rooms (hotel_id, room_name, capacity, price, bed_type, breakfast, wifi, free_cancellation) VALUES
('a0000000-0000-0000-0000-000000000001', 'Luxury Lake View Room', 2, 48500.00, 'King Bed', true, true, true),
('a0000000-0000-0000-0000-000000000001', 'Royal Palace Suite', 3, 85000.00, 'Super King Bed', true, true, true),
('a0000000-0000-0000-0000-000000000005', 'Palace Garden Room', 2, 52000.00, 'King Bed', true, true, true),
('a0000000-0000-0000-0000-000000000013', 'Oceanfront Villa with Private Pool', 4, 38000.00, 'King Bed', true, true, true);

-- -------------------------------------------------------------------------------------
-- 17. LINK AMENITIES TO ALL HOTELS
-- -------------------------------------------------------------------------------------
INSERT INTO public.hotel_amenities (hotel_id, amenity_id)
SELECT h.id, a.id FROM public.hotels h CROSS JOIN public.amenities a
WHERE (h.starting_price > 20000.00 AND a.name IN ('Free WiFi', 'Swimming Pool', 'Free Breakfast', 'Luxury Spa & Wellness', 'Air Conditioning', 'Free Parking'))
   OR (h.starting_price <= 20000.00 AND a.name IN ('Free WiFi', 'Air Conditioning', 'Free Breakfast', 'Free Parking'))
ON CONFLICT DO NOTHING;

-- =====================================================================================
-- END OF SCHEMA & SEED DATA
-- =====================================================================================
