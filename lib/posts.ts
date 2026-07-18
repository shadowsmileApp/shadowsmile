import { supabase } from "./supabase-browser";

export async function getPosts(userId?: string) {
  let query = supabase
    .from("posts")
    .select(`
      *,
      profiles(handle, is_private)
    `)
    .order("created_at", {
      ascending: false,
    });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data: postsData, error } = await query;

  if (error) {
    throw error;
  }

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  const { data: reactionsData } = await supabase
  .from("reactions")
  .select("post_id, user_id, type");

  return (postsData || []).map((post: any) => {
    const likes =
      reactionsData?.filter(
        (reaction) =>
          reaction.post_id === post.id &&
          reaction.type === "like"
      ).length || 0;

     return {
       ...post,
       like_count: likes,

       liked_by_user:
         reactionsData?.some(
           (reaction) =>
             reaction.post_id === post.id &&
             reaction.type === "like" &&
             reaction.user_id === user?.id
         ) || false,
      };
  });
}
