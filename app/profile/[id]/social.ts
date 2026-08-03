import { supabase } from "../../../lib/supabase-browser";

export async function loadFollowers(profileId: string) {
  const { data, error } = await supabase
    .from("followers")
    .select(`
      follower_id,
      profiles:follower_id (
        id,
        handle,
        display_name,
        avatar_url
      )
    `)
    .eq("following_id", profileId);

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export async function loadFollowing(profileId: string) {
  const { data, error } = await supabase
    .from("followers")
    .select(`
      following_id,
      profiles:following_id (
        id,
        handle,
        display_name,
        avatar_url
      )
    `)
    .eq("follower_id", profileId);

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}
