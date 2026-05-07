-- Create sketches table
CREATE TABLE IF NOT EXISTS sketches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  tags text[],
  storage_path text NOT NULL,
  public_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_sketches_created_at ON sketches(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE sketches ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON sketches
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON sketches
  FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON sketches
  FOR DELETE USING (true);
