
-- Storage RLS: public read + admin-only write for villa-photos and content-photos
CREATE POLICY "villa-photos public read"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'villa-photos');
CREATE POLICY "villa-photos admin insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'villa-photos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "villa-photos admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'villa-photos' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'villa-photos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "villa-photos admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'villa-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "content-photos public read"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'content-photos');
CREATE POLICY "content-photos admin insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'content-photos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "content-photos admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'content-photos' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'content-photos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "content-photos admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'content-photos' AND public.has_role(auth.uid(), 'admin'));
