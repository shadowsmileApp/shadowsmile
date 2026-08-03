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

export async function sharePost(postId: string) {
  const link =
    `${window.location.origin}/post/${postId}`;

  try {
    await navigator.clipboard.writeText(link);
    console.log("Link copied");
  } catch {
    prompt("Copy this link:", link);
  }
}

export async function toggleLike(
  postId: string,
  userId: string
) {

  const {
    data: existingLike,
    error: likeCheckError,
  } = await supabase
    .from("reactions")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .eq("type", "like")
    .maybeSingle();

  if (likeCheckError) {
    throw likeCheckError;
  }

if (existingLike) {
  const { error } = await supabase
    .from("reactions")
    .delete()
    .eq("id", existingLike.id);

  if (error) {
    throw error;
  }

  return;
}

const { error } = await supabase
  .from("reactions")
  .insert({
    post_id: postId,
    user_id: userId,
    type: "like",
  });

if (error) {
  throw error;
}
}

export async function addComment(
  postId: string,
  userId: string,
  content: string
) {
  const { error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: userId,
      content,
    });

  if (error) {
    throw error;
  }
}

export async function loadComments(
  postIds?: string[]
) {
  let query = supabase
    .from("comments")
    .select(`
      *,
      profiles:user_id (
        id,
        handle,
        avatar_url
      )
    `)
    .order("created_at", {
      ascending: true,
    });

  if (postIds?.length) {
    query = query.in("post_id", postIds);
  }

  const { data, error } = await query;

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
