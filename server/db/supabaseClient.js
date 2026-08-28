import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://mwhnntsojaxehyqoxapr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13aG5udHNvamF4ZWh5cW94YXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzA0MTkwNSwiZXhwIjoyMTAyNjE3OTA1fQ.V4516jMqExiguAlQ0qnLP9n9PPA1ngiJ-8S2kkjS3AM';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseReady = () => Boolean(supabaseUrl && supabaseKey);

