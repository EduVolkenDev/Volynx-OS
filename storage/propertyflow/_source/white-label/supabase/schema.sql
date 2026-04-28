-- PropertyFlow Professional — Supabase schema
--
-- Run this once against your project (Dashboard → SQL editor → paste → run).
-- Then copy the values from supabase/seed.sql to bootstrap with the demo set.
--
-- All policies are conservative: anyone (anon) can READ active listings (so
-- the public catalogue renders), only authenticated users can write (the
-- admin page expects the buyer to be logged in via Supabase Auth).

CREATE TABLE IF NOT EXISTS public.properties (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en     text NOT NULL,
  title_pt     text,
  city_en      text NOT NULL,
  city_pt      text,
  country_en   text NOT NULL DEFAULT 'Portugal',
  country_pt   text,
  category     text NOT NULL CHECK (category IN ('luxury','premium','rental','commercial')),
  type_en      text NOT NULL,
  type_pt      text,
  beds         integer NOT NULL DEFAULT 0,
  baths        integer NOT NULL DEFAULT 0,
  area_m2      integer NOT NULL DEFAULT 0,
  price_eur    numeric(12,2) NOT NULL,
  currency     text NOT NULL DEFAULT 'EUR',
  status       text NOT NULL CHECK (status IN ('for-sale','for-rent','sold','rented','draft')),
  image        text,
  summary_en   text,
  summary_pt   text,
  tags_en      text[] DEFAULT '{}',
  tags_pt      text[] DEFAULT '{}',
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_properties_active ON public.properties (is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_category ON public.properties (category);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties (status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties (city_en);

-- updated_at maintenance
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_properties_updated ON public.properties;
CREATE TRIGGER trg_properties_updated
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "properties_public_read" ON public.properties;
CREATE POLICY "properties_public_read"
  ON public.properties FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "properties_auth_write" ON public.properties;
CREATE POLICY "properties_auth_write"
  ON public.properties FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Optional: enquiries table (used by Pro+ enquiry forms)
CREATE TABLE IF NOT EXISTS public.enquiries (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id  uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  name         text NOT NULL,
  email        text NOT NULL,
  phone        text,
  message      text,
  locale       text DEFAULT 'en',
  status       text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_property ON public.enquiries (property_id, created_at DESC);

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "enquiries_anon_insert" ON public.enquiries;
CREATE POLICY "enquiries_anon_insert"
  ON public.enquiries FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "enquiries_auth_all" ON public.enquiries;
CREATE POLICY "enquiries_auth_all"
  ON public.enquiries FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

GRANT SELECT ON public.properties TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, UPDATE ON public.enquiries TO authenticated;
