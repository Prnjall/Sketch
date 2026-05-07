-- 1. Create the storage bucket and make it public
INSERT INTO storage.buckets (id, name, public)
VALUES ('sketches', 'sketches', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow public access to read files in the storage bucket
CREATE POLICY "Public Read Access" ON storage.objects
FOR SELECT USING (bucket_id = 'sketches');

-- 3. Allow public access to upload files to the storage bucket
CREATE POLICY "Public Upload Access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'sketches');

-- 4. Allow public access to delete files in the storage bucket
CREATE POLICY "Public Delete Access" ON storage.objects
FOR DELETE USING (bucket_id = 'sketches');

-- 5. Make sure the database table allows inserts as well
DROP POLICY IF EXISTS "Allow public read access" ON sketches;
DROP POLICY IF EXISTS "Allow authenticated insert" ON sketches;
DROP POLICY IF EXISTS "Allow authenticated delete" ON sketches;

CREATE POLICY "Allow public read access" ON sketches FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON sketches FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON sketches FOR DELETE USING (true);
