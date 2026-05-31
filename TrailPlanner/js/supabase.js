const SUPABASE_URL =
  "https://gjmeodiwokfgbhbpuqqi.supabase.co";

const SUPABASE_KEY =
  "sb_publishable__DXiOWGkMwzJdxxxLNTjuw_QFOxtbnT";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );