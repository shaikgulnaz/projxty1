/*
  # Fix Blog Posts Required Fields

  ## Overview
  This migration makes non-essential fields nullable or adds default values
  to allow simple blog uploads with just title and HTML content.

  ## Changes
  - Make `excerpt` nullable (can be empty)
  - Make `image` nullable (can be empty) 
  - Make `category` nullable or default to 'General'
  - Ensure `html_content` exists and is the primary content field

  ## Security
  - No changes to RLS policies
*/

-- Make excerpt nullable
ALTER TABLE blog_posts ALTER COLUMN excerpt DROP NOT NULL;

-- Make image nullable
ALTER TABLE blog_posts ALTER COLUMN image DROP NOT NULL;

-- Make category nullable or set default
ALTER TABLE blog_posts ALTER COLUMN category DROP NOT NULL;
ALTER TABLE blog_posts ALTER COLUMN category SET DEFAULT 'General';

-- Make author default to 'Admin' if not provided
ALTER TABLE blog_posts ALTER COLUMN author SET DEFAULT 'Admin';

-- Update existing rows with empty values
UPDATE blog_posts SET excerpt = '' WHERE excerpt IS NULL;
UPDATE blog_posts SET image = '' WHERE image IS NULL;
UPDATE blog_posts SET category = 'General' WHERE category IS NULL;