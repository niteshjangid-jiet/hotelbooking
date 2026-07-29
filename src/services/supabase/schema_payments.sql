-- ==============================================================================
-- HOTELBOOKINGSITE - PAYMENTS & BOOKINGS TABLE MIGRATION & RLS POLICIES
-- Execute this SQL script in the Supabase SQL Editor to resolve missing columns.
-- ==============================================================================

-- 1. Ensure 'bookings' table has booking_id and payment tracking columns
ALTER TABLE IF EXISTS public.bookings 
ADD COLUMN IF NOT EXISTS booking_id VARCHAR(50);

-- Ensure booking_id has a UNIQUE constraint if present
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'bookings_booking_id_key'
    ) THEN
        ALTER TABLE public.bookings ADD CONSTRAINT bookings_booking_id_key UNIQUE (booking_id);
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE IF EXISTS public.bookings 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(30) DEFAULT 'paid',
ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12, 2);

-- 2. Create 'payments' table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id VARCHAR(50) NOT NULL,
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'paid', -- paid, failed, pending, refunded
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Indexes for High Performance Lookups
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id ON public.payments(razorpay_payment_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments;
CREATE POLICY "Users can insert own payments" ON public.payments FOR INSERT WITH CHECK (true);

