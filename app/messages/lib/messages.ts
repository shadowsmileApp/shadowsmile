import { supabase } from "../../../lib/supabase-browser";

export async function sendMessage(
  senderId: string,
  receiverId: string,
  body: string
) {
  return await supabase
    .from("direct_messages")
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      body,
    });
}

export async function getConversation(
  user1: string,
  user2: string
) {
  return await supabase
    .from("direct_messages")
    .select("*")
    .or(
      `and(sender_id.eq.${user1},receiver_id.eq.${user2}),and(sender_id.eq.${user2},receiver_id.eq.${user1})`
    )
    .order("created_at");
}

export async function getConversationPreview(
  currentUserId: string,
  otherUserId: string
) {
  return await supabase
    .from("direct_messages")
    .select("body, created_at")
    .or(
      `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`
  )
  .order("created_at", {
    ascending: false,
  })
  .limit(1);
}

export async function getConversations(
  userId: string
) {
  const { data, error } =
    await supabase
      .from("direct_messages")
      .select(
        "sender_id, receiver_id"
      )
      .or(
        `sender_id.eq.${userId},receiver_id.eq.${userId}`
      );

  if (error) {
    return {
      data: null,
      error,
    };
  }

  const otherUserIds =
    Array.from(
      new Set(
        (data || [])
          .map((message) => {
            if (
              message.sender_id === userId
            ) {
              return message.receiver_id;
            }

            return message.sender_id;
          })
          .filter(Boolean)
      )
    );

  if (otherUserIds.length === 0) {
    return {
      data: [],
      error: null,
    };
  }

  const {
    data: profiles,
    error: profileError,
  } =
    await supabase
      .from("profiles")
      .select(
        "id, first_name, last_name, handle, avatar_url"
      )
      .in(
        "id",
        otherUserIds
      );

  if (profileError) {
    return {
      data: null,
      error: profileError,
    };
  }

  return {
    data:
      (profiles || []).map(
        (profile) => ({
          id: profile.id,
          first_name:
            profile.first_name || "",
          last_name:
            profile.last_name || "",
          handle:
            profile.handle || "",
          avatar_url:
            profile.avatar_url,
        })
      ),
    error: null,
  };
}
