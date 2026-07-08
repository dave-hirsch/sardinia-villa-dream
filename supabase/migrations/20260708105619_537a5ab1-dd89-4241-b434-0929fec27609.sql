
DROP POLICY IF EXISTS "anyone can submit enquiries" ON public.enquiries;
CREATE POLICY "anyone can submit enquiries" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (
  length(name) BETWEEN 1 AND 200
  AND length(email) BETWEEN 3 AND 320
  AND position('@' IN email) > 1
  AND (message IS NULL OR length(message) <= 4000)
);
