const SUPABASE_URL = "https://awapebbdectaxxfwumyp.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3YXBlYmJkZWN0YXh4Znd1bXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MzE2MTMsImV4cCI6MjEwNjEwNzYxM30.66jOjYDHlE7wsZrLIfMaGow-kMxXpGsh4droDhP5IpE";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);