import { supabase } from "../../../lib/supabase-browser";

export async function loadComments(
  postIds: string[]
) {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profiles:user_id (
        id,
        handle,
        avatar_url
      )
    `)
    .in("post_id", postIds)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data || []).map((comment) => ({
    ...comment,
    profiles: comment.profiles ?? {
      id: comment.user_id,
      handle: "unknown",
      avatar_url: null,
    },
  }));
}
