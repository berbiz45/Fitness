import { createClient } from '@supabase/supabase-js';

// Claves públicas de tu proyecto Supabase (seguras de exponer en el frontend,
// la seguridad real la da Row Level Security en la base de datos)
const SUPABASE_URL = 'https://ksvxndsvokqluzaxugly.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzdnhuZHN2b2txbHV6YXh1Z2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NDI2ODMsImV4cCI6MjA5NzUxODY4M30.3MnCK1Taagmex42uw91kTACRYRdn97A__FjkwgdZ0v8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
