/**
 * Initializes and exports the Supabase client.
 * This file centralizes the Supabase connection details.
 */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://eswxamxcrrxkkmmbbhvt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzd3hhbXhjcnJ4a2ttbWJiaHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2Mjc1NjAsImV4cCI6MjA5OTIwMzU2MH0.4N9Wbb3UKQwL5uL0w8OQFpPPLe0nks8NxJLWxh6T1PY';

export const supabase = createClient(supabaseUrl, supabaseKey);