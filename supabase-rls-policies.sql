-- Enable Row Level Security
ALTER TABLE public.sketches ENABLE ROW LEVEL SECURITY;

-- 1. Allow public read access (anyone can view sketches)
CREATE POLICY "Public profiles are viewable by everyone."
ON public.sketches FOR SELECT
USING ( true );

-- 2. Allow authenticated users (Admin) to insert
CREATE POLICY "Authenticated users can insert sketches."
ON public.sketches FOR INSERT
WITH CHECK ( auth.role() = 'authenticated' );

-- 3. Allow authenticated users (Admin) to update
CREATE POLICY "Authenticated users can update sketches."
ON public.sketches FOR UPDATE
USING ( auth.role() = 'authenticated' );

-- 4. Allow authenticated users (Admin) to delete
CREATE POLICY "Authenticated users can delete sketches."
ON public.sketches FOR DELETE
USING ( auth.role() = 'authenticated' );


-- Storage Bucket Policies (Assuming bucket name is 'sketches')
-- Note: You may need to create the bucket first if it doesn't exist.

-- 1. Allow public read access to images
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'sketches' );

-- 2. Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'sketches' AND auth.role() = 'authenticated' );

-- 3. Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete files"
ON storage.objects FOR DELETE
USING ( bucket_id = 'sketches' AND auth.role() = 'authenticated' );
