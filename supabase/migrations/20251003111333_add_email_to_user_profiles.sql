/*
  # Add email column to user_profiles

  1. Changes
    - Add `email` column to `user_profiles` table
    - Make `phone` column nullable (no longer required)
    - Add unique constraint on email
    - Add index for email lookups

  2. Notes
    - Supports both email and phone-based authentication
    - Existing phone-only profiles remain valid
*/

-- Add email column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN email text;
  END IF;
END $$;

-- Make phone nullable (support email-only auth)
DO $$
BEGIN
  ALTER TABLE user_profiles ALTER COLUMN phone DROP NOT NULL;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Add unique constraint on email
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_profiles_email_key'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_email_key UNIQUE (email);
  END IF;
END $$;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
