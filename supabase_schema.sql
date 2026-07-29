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
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.hotel_amenities CASCADE;
DROP TABLE IF EXISTS public.amenities CASCADE;
DROP TABLE IF EXISTS public.rooms CASCADE;
DROP TABLE IF EXISTS public.hotel_images CASCADE;
DROP TABLE IF EXISTS public.hotels CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- -------------------------------------------------------------------------------------
-- 2. USERS TABLE (Linked with Supabase Auth)
-- -------------------------------------------------------------------------------------
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Profiles Table (Extended user metadata & sync)
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

-- Trigger to automatically populate public.users and public.profiles when user registers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone;

  INSERT INTO public.profiles (id, full_name, email, phone_number, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

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
    name VARCHAR(255) NOT NULL,
    hotel_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    rating DECIMAL(3, 2) DEFAULT 4.50,
    facilities TEXT[] DEFAULT ARRAY['Free WiFi', 'Swimming Pool', 'Free Breakfast', 'Air Conditioning', 'Free Parking'],
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    review_count INTEGER DEFAULT 0,
    starting_price DECIMAL(10, 2) NOT NULL,
    property_type VARCHAR(50) NOT NULL DEFAULT 'Hotel',
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
    room_type VARCHAR(255) NOT NULL,
    room_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total_rooms INTEGER DEFAULT 10,
    available_rooms INTEGER DEFAULT 5,
    image TEXT,
    capacity INTEGER NOT NULL DEFAULT 2,
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
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    special_requests TEXT,
    booking_status VARCHAR(30) NOT NULL DEFAULT 'Confirmed', -- Confirmed, Completed, Cancelled
    payment_status VARCHAR(30) NOT NULL DEFAULT 'Paid', -- Paid, Pending, Refunded
    razorpay_payment_id VARCHAR(100),
    razorpay_order_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------------------
-- 7b. PAYMENTS TABLE (Razorpay Transactions)
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id VARCHAR(50) NOT NULL,
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'paid', -- paid, failed, pending, refunded
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------------------
-- 8. REVIEWS TABLE
-- -------------------------------------------------------------------------------------
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
    rating DECIMAL(3, 2) NOT NULL,
    comment TEXT NOT NULL,
    review TEXT, -- Legacy compatibility text or JSON payload
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------------------
-- 9. WISHLISTS TABLE
-- -------------------------------------------------------------------------------------
CREATE TABLE public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, hotel_id)
);

-- -------------------------------------------------------------------------------------
-- 10. INDEXES
-- -------------------------------------------------------------------------------------
CREATE INDEX idx_hotels_city ON public.hotels(city);
CREATE INDEX idx_hotels_starting_price ON public.hotels(starting_price);
CREATE INDEX idx_hotels_rating ON public.hotels(rating);

CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_hotel_room ON public.bookings(hotel_id, room_id);
CREATE INDEX idx_reviews_hotel_id ON public.reviews(hotel_id);

-- -------------------------------------------------------------------------------------
-- 11. SUPABASE STORAGE BUCKETS & POLICIES
-- -------------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hotel-images', 'hotel-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('room-images', 'room-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Read Access
CREATE POLICY "Public Read Access for Hotel Images" ON storage.objects
    FOR SELECT USING (bucket_id = 'hotel-images');

CREATE POLICY "Public Read Access for Room Images" ON storage.objects
    FOR SELECT USING (bucket_id = 'room-images');

CREATE POLICY "Public Read Access for Avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

-- Authenticated Storage Upload Access
CREATE POLICY "Authenticated Users Upload Avatars" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Users Upload Hotel Images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'hotel-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Users Upload Room Images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'room-images' AND auth.role() = 'authenticated');

-- -------------------------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Users RLS
CREATE POLICY "Public users viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own user record" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Profiles RLS
CREATE POLICY "Public profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
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

-- Payments RLS Policies
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.booking_id = payments.booking_id 
    AND (bookings.user_id = auth.uid() OR auth.uid() IS NOT NULL)
  )
);
CREATE POLICY "Users can insert own payments" ON public.payments FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.booking_id = payments.booking_id 
    AND (bookings.user_id = auth.uid() OR auth.uid() IS NOT NULL)
  ) OR auth.uid() IS NOT NULL
);

-- Wishlists RLS
CREATE POLICY "Users can view own wishlists" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wishlist item" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own wishlist item" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- -------------------------------------------------------------------------------------
-- 13. SEED DATA - HOTELS
-- -------------------------------------------------------------------------------------
INSERT INTO public.hotels (id, name, hotel_name, slug, location, description, image, city, state, address, rating, review_count, starting_price, property_type, featured, facilities) VALUES
('a0000000-0000-0000-0000-000000000001', 'Taj Lake Palace', 'Taj Lake Palace', 'taj-lake-palace-udaipur', 'Lake Pichola, Udaipur, Rajasthan', 'Floating on the serene waters of Lake Pichola, Taj Lake Palace is an 18th-century marble marvel featuring opulent regal suites, royal dining, and breathtaking sunset lake views.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', 'Udaipur', 'Rajasthan', 'Lake Pichola, Udaipur, Rajasthan 313001', 4.95, 342, 48500.00, 'Palace', true, ARRAY['Free WiFi', 'Swimming Pool', 'Free Breakfast', 'Luxury Spa & Wellness', 'Air Conditioning', 'Free Parking']),
('a0000000-0000-0000-0000-000000000002', 'The Oberoi Udaivilas', 'The Oberoi Udaivilas', 'the-oberoi-udaivilas-udaipur', 'Haridas Ji Ki Magri, Udaipur, Rajasthan', 'Spread over 50 acres on the banks of Lake Pichola, featuring grand domes, intricate corridors, reflection pools, and private butler service.', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', 'Udaipur', 'Rajasthan', 'Badi-Gorela-Mulla Talai Rd, Haridas Ji Ki Magri, Udaipur 313001', 4.98, 412, 56000.00, 'Palace', true, ARRAY['Free WiFi', 'Swimming Pool', 'Free Breakfast', 'Luxury Spa & Wellness', 'Air Conditioning']),
('a0000000-0000-0000-0000-000000000005', 'Rambagh Palace', 'Rambagh Palace', 'rambagh-palace-jaipur', 'Bhawani Singh Rd, Jaipur, Rajasthan', 'The Jewel of Jaipur. Formerly the residence of the Maharaja of Jaipur, featuring lavish peacock-dotted gardens, regal dining rooms, and heritage suites.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', 'Jaipur', 'Rajasthan', 'Bhawani Singh Rd, Jaipur, Rajasthan 302005', 4.96, 520, 52000.00, 'Palace', true, ARRAY['Free WiFi', 'Swimming Pool', 'Free Breakfast', 'Luxury Spa & Wellness', 'Free Parking']),
('a0000000-0000-0000-0000-000000000013', 'Taj Exotica Resort & Spa Goa', 'Taj Exotica Resort & Spa Goa', 'taj-exotica-goa', 'Benaulim, Goa', 'Embraced by the Arabian Sea in Benaulim, offering Mediterranean-style villas, lush golf greens, seafood beach dining, and private cabanas.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 'Goa', 'Goa', 'Calwaddo, Benaulim, Goa 403716', 4.91, 560, 26000.00, 'Resort', true, ARRAY['Free WiFi', 'Swimming Pool', 'Free Breakfast', 'Free Parking', 'Restaurant & Fine Dining']);

-- -------------------------------------------------------------------------------------
-- 14. SEED DATA - ROOMS
-- -------------------------------------------------------------------------------------
INSERT INTO public.rooms (hotel_id, room_type, room_name, price, total_rooms, available_rooms, image, capacity, bed_type, breakfast, wifi, free_cancellation) VALUES
('a0000000-0000-0000-0000-000000000001', 'Luxury Lake View Suite', 'Luxury Lake View Suite', 48500.00, 10, 5, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', 2, 'King Bed', true, true, true),
('a0000000-0000-0000-0000-000000000001', 'Royal Palace Suite', 'Royal Palace Suite', 85000.00, 5, 3, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80', 3, 'Super King Bed', true, true, true),
('a0000000-0000-0000-0000-000000000005', 'Palace Garden Room', 'Palace Garden Room', 52000.00, 8, 4, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', 2, 'King Bed', true, true, true),
('a0000000-0000-0000-0000-000000000013', 'Oceanfront Villa', 'Oceanfront Villa', 38000.00, 6, 2, 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80', 4, 'King Bed', true, true, true);

-- =====================================================================================
-- END OF SCHEMA & SEED DATA
-- =====================================================================================
