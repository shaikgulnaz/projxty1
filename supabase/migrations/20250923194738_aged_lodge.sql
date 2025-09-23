/*
  # Create blog posts table

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text, not null) 
      - `excerpt` (text, not null)
      - `image` (text, not null)
      - `category` (text, not null)
      - `tags` (text array, default empty array)
      - `author` (text, not null)
      - `publish_date` (date, not null)
      - `published` (boolean, default true)
      - `read_time` (integer, default 5)
      - `views` (integer, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policy for public read access to published posts
    - Add policy for authenticated users to manage posts

  3. Indexes
    - Index on publish_date for sorting
    - Index on published status for filtering
    - Index on category for filtering
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  image text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  author text NOT NULL,
  publish_date date NOT NULL,
  published boolean DEFAULT true,
  read_time integer DEFAULT 5,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access to published posts
CREATE POLICY "Allow public read access to published blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (published = true);

-- Authenticated users can manage all posts
CREATE POLICY "Allow authenticated users to manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON blog_posts(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();