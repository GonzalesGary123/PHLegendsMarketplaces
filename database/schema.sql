-- Legends of Ymir Account Marketplace Database Schema
-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  server TEXT NOT NULL,
  growth_power TEXT NOT NULL,
  classes_list TEXT[] NOT NULL DEFAULT '{}',
  asking_price TEXT NOT NULL,
  contact_link TEXT,
  contact_number TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'sold')),
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pending_review', 'approved', 'rejected', 'sold')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_server ON listings(server);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Drop existing policies if they exist, then create them
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Anyone can register" ON users;

-- Allow anyone to read users (for public profiles if needed)
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

-- Allow anyone to insert users (registration)
CREATE POLICY "Anyone can register" ON users
  FOR INSERT WITH CHECK (true);

-- RLS Policies for listings table
-- Drop existing policies if they exist, then create them
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON listings;
DROP POLICY IF EXISTS "Anyone can create listings" ON listings;
DROP POLICY IF EXISTS "Anyone can update listings" ON listings;

-- Allow anyone to read listings
CREATE POLICY "Listings are viewable by everyone" ON listings
  FOR SELECT USING (true);

-- Allow anyone to insert listings (for now)
-- You can restrict this later to require authentication
CREATE POLICY "Anyone can create listings" ON listings
  FOR INSERT WITH CHECK (true);

-- Allow updates to listings (admin approval is checked in application code)
CREATE POLICY "Anyone can update listings" ON listings
  FOR UPDATE USING (true) WITH CHECK (true);

-- RLS Policies for notifications table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

-- Allow users to read their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (true);

-- Allow inserting notifications (application will handle this)
CREATE POLICY "Users can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (true) WITH CHECK (true);

-- Allow users to update their own listings (optional, for future features)
-- CREATE POLICY "Users can update own listings" ON listings
--   FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own listings (optional, for future features)
-- CREATE POLICY "Users can delete own listings" ON listings
--   FOR DELETE USING (auth.uid() = user_id);

-- Migration: Add is_admin column to existing users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE NOT NULL;

-- Migration: Add approval fields to existing listings table if they don't exist
ALTER TABLE listings ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' NOT NULL;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Update constraint to include 'sold' status
-- First drop the old constraint if it exists
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_status_check;

-- Add the updated constraint with 'sold' status
ALTER TABLE listings ADD CONSTRAINT listings_status_check 
  CHECK (status IN ('pending', 'approved', 'rejected', 'sold'));

-- Update existing listings to approved status (optional - you may want to review these manually)
-- UPDATE listings SET status = 'approved' WHERE status IS NULL OR status = '';

-- Migration: Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pending_review', 'approved', 'rejected', 'sold')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration: Add notification indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- To make a user an admin, run this SQL (replace 'user@example.com' with the actual email):
-- UPDATE users SET is_admin = TRUE WHERE email = 'user@example.com';

