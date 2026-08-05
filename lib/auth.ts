import { supabase } from "./supabase-browser";

export async function getEmailFromLogin(
  login: string
) {
  const trimmed =
    login.trim().toLowerCase();

  // Already an email
  if (trimmed.includes("@")) {
    return {
      email: trimmed,
      error: null,
    };
  }

  const {
    data: profile,
    error,
  } = await supabase
    .from("profiles")
    .select("email")
    .eq("handle", trimmed)
    .maybeSingle();

  if (error) {
    return {
      email: null,
      error,
    };
  }

  return {
    email: profile?.email ?? null,
    error: null,
  };
}
