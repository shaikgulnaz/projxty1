/*
  # Create user profiles table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `phone` (text, unique)
      - `name` (text)
      - `role` (text, default 'user')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for users to read/update their own profiles
    - Add policy for admins to manage all profiles
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Users can insert their own profile during signup
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

-- Create index for phone lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);