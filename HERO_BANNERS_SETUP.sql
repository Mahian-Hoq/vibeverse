-- ===================================================================
-- HERO BANNERS TABLE SETUP
-- Run these SQL commands in Supabase SQL Editor
-- ===================================================================

-- 1. CREATE TABLE
CREATE TABLE IF NOT EXISTS hero_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 2. CREATE INDEX for better query performance
CREATE INDEX IF NOT EXISTS idx_hero_banners_is_active ON hero_banners(is_active);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- 4. CREATE RLS POLICIES

-- Policy: Allow public to read active banners
CREATE POLICY "Allow public to read active banners" ON hero_banners
  FOR SELECT
  USING (is_active = true);

-- Policy: Allow authenticated admin users to perform all operations
-- Note: Update the email check to match your admin email(s)
CREATE POLICY "Allow admin full access" ON hero_banners
  FOR ALL
  USING (
    auth.jwt() ->> 'email' = 'mrdot1429@gmail.com'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'mrdot1429@gmail.com'
  );

-- 5. VERIFY SETUP
-- Run this to check the table was created:
-- SELECT * FROM hero_banners;

-- 6. TO ENABLE UPLOADS FOR TESTING
-- INSERT INTO hero_banners (image_url, is_active) 
-- VALUES ('https://example.com/image.jpg', true);
