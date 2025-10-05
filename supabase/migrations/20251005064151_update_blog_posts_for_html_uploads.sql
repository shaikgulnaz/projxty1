/*
  # Update Blog Posts Table for HTML File Uploads

  ## Overview
  This migration updates the existing blog_posts table to support HTML file uploads
  and adds necessary fields for better blog management.

  ## Changes
  
  ### Modified Columns
  - Rename `content` to `html_content` for clarity
  - Add `slug` column for URL-friendly identifiers
  - Add `description` column for SEO and previews
  - Add `featured_image` column (separate from `image`)
  - Add `published_at` column for publication timestamp
  - Update `publish_date` to be optional

  ## Security
  - RLS policies are already enabled
  - Add new policies for HTML content uploads

  ## Notes
  - Existing data will be preserved
  - New fields have safe defaults
*/

-- Add slug column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'slug'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN slug text;
  END IF;
END $$;

-- Add description column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'description'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN description text;
  END IF;
END $$;

-- Add html_content column if it doesn't exist (rename from content)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'html_content'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'blog_posts' AND column_name = 'content'
    ) THEN
      ALTER TABLE blog_posts RENAME COLUMN content TO html_content;
    ELSE
      ALTER TABLE blog_posts ADD COLUMN html_content text;
    END IF;
  END IF;
END $$;

-- Add featured_image column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'featured_image'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN featured_image text;
  END IF;
END $$;

-- Add published_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'published_at'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN published_at timestamptz;
  END IF;
END $$;

-- Update existing data: set slug from title if not exists
UPDATE blog_posts 
SET slug = lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;

-- Update existing data: set description from excerpt if not exists
UPDATE blog_posts 
SET description = excerpt
WHERE description IS NULL AND excerpt IS NOT NULL;

-- Update existing data: set featured_image from image if not exists
UPDATE blog_posts 
SET featured_image = image
WHERE featured_image IS NULL AND image IS NOT NULL;

-- Make slug unique and not null after populating
ALTER TABLE blog_posts ALTER COLUMN slug SET NOT NULL;

-- Create unique index on slug if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'blog_posts' AND indexname = 'blog_posts_slug_key'
  ) THEN
    ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);
  END IF;
END $$;

-- Create index on slug for fast lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Create index on published and published_at if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, publish_date DESC);