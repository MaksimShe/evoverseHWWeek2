import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cteioxsgdkvuupdforyc.supabase.co';
const supabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZWlveHNnZGt2dXVwZGZvcnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDQ1NTksImV4cCI6MjA3OTk4MDU1OX0.l_NEVxNas7gp35OnwDLEBMNFE6uJZYMxAvL7f8p_1bc';

export const supabase = createClient(
  supabaseUrl, supabaseAnon
)
