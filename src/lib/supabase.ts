import { createClient } from '@supabase/supabase-js';

const url = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const anon = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

// With no env vars the app runs in local demo mode (data stays in the browser).
export const supabase = url && anon ? createClient(url, anon) : null;
export const CLOUD = !!supabase;
