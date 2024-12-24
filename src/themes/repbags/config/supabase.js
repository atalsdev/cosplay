import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://llxmkewdfaqtyjrwegpz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseG1rZXdkZmFxdHlqcndlZ3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNjQ4MzYsImV4cCI6MjA0Njc0MDgzNn0.E14d0jzqZNyTIIGyVM8fD1wlHEIERBCMO8N8WId1gp8';

export const supabase = createClient(supabaseUrl, supabaseKey); 