import { supabase } from "../../../lib/supabase";

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
