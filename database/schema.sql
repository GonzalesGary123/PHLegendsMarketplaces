-- Legends of Ymir Account Marketplace Database Schema
-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_server ON listings(server);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Allow anyone to read users (for public profiles if needed)
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

-- Allow anyone to insert users (registration)
CREATE POLICY "Anyone can register" ON users
  FOR INSERT WITH CHECK (true);

-- RLS Policies for listings table
-- Allow anyone to read listings
CREATE POLICY "Listings are viewable by everyone" ON listings
  FOR SELECT USING (true);

-- Allow anyone to insert listings (for now)
-- You can restrict this later to require authentication
CREATE POLICY "Anyone can create listings" ON listings
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own listings (optional, for future features)
-- CREATE POLICY "Users can update own listings" ON listings
--   FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own listings (optional, for future features)
-- CREATE POLICY "Users can delete own listings" ON listings
--   FOR DELETE USING (auth.uid() = user_id);

