/*
  # Remove Blog Feature

  ## Overview
  This migration removes all blog-related database objects:
  
  1. **Tables Removed**
     - blog_posts table and all associated data
  
  2. **Functions Removed**
     - update_blog_posts_updated_at trigger function
  
  ## Changes
  - Drop blog_posts table cascade (removes all policies, triggers, indexes automatically)
  - Drop associated trigger function
*/

-- Drop the blog_posts table and all associated objects
DROP TABLE IF EXISTS blog_posts CASCADE;

-- Drop the associated trigger function
DROP FUNCTION IF EXISTS update_blog_posts_updated_at() CASCADE;