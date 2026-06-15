import { createClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL missing"
  );
}

if (!key) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY missing"
  );
}

export const supabase =
  createClient(url, key);
