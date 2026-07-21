-- Swiss Motorsports: deals ordering + application documents
-- Run this in the Supabase SQL Editor (idempotent where practical).

-- ---------------------------------------------------------------------------
-- 1) deals.sort_order
-- ---------------------------------------------------------------------------
ALTER TABLE public.deals
  ADD COLUMN IF NOT EXISTS sort_order integer;

-- Backfill existing rows by created_at (oldest = lowest order)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS rn
  FROM public.deals
  WHERE sort_order IS NULL
)
UPDATE public.deals d
SET sort_order = ranked.rn
FROM ranked
WHERE d.id = ranked.id;

UPDATE public.deals
SET sort_order = 0
WHERE sort_order IS NULL;

ALTER TABLE public.deals
  ALTER COLUMN sort_order SET DEFAULT 0;

ALTER TABLE public.deals
  ALTER COLUMN sort_order SET NOT NULL;

CREATE INDEX IF NOT EXISTS deals_sort_order_idx
  ON public.deals (sort_order ASC, created_at DESC);

-- ---------------------------------------------------------------------------
-- 2) applications document paths + idempotency key
-- ---------------------------------------------------------------------------
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS drivers_license_path text;

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS insurance_card_path text;

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS submission_id text;

CREATE UNIQUE INDEX IF NOT EXISTS applications_submission_id_uidx
  ON public.applications (submission_id)
  WHERE submission_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 3) RLS reminders (adjust if your policies already exist)
-- Public must NOT select/update/delete applications.
-- Public inserts should only happen via the service-role server action.
-- ---------------------------------------------------------------------------
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Authenticated admins can manage deals
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'deals' AND policyname = 'Authenticated manage deals'
  ) THEN
    CREATE POLICY "Authenticated manage deals"
      ON public.deals
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Public can read active deals (for lease specials)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'deals' AND policyname = 'Public read active deals'
  ) THEN
    CREATE POLICY "Public read active deals"
      ON public.deals
      FOR SELECT
      TO anon, authenticated
      USING (status = 'active');
  END IF;
END $$;

-- Authenticated admins can manage applications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'applications' AND policyname = 'Authenticated manage applications'
  ) THEN
    CREATE POLICY "Authenticated manage applications"
      ON public.applications
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 4) Private storage bucket for application documents
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'application-documents',
  'application-documents',
  false,
  10485760,
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/heic',
    'image/heif'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE
SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- No public (anon) storage policies — uploads/downloads use the service role
-- (server actions) or short-lived signed URLs generated for authenticated admins.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated read application documents'
  ) THEN
    CREATE POLICY "Authenticated read application documents"
      ON storage.objects
      FOR SELECT
      TO authenticated
      USING (bucket_id = 'application-documents');
  END IF;
END $$;
