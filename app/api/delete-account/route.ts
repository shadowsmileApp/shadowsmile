import { NextResponse } from "next/server";

import { createClient } from "../../../lib/supabase-server";
import { supabaseAdmin } from "../../../lib/supabase-admin";

export async function POST() {
  const supabase = await createClient();

const {
  data: { session },
} = await supabase.auth.getSession();

const {
  data: { user },
  error,
} = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user.id;

await supabaseAdmin
  .from("reactions")
  .delete()
  .eq("user_id", userId);

await supabaseAdmin
  .from("comments")
  .delete()
  .eq("user_id", userId);

await supabaseAdmin
  .from("posts")
  .delete()
  .eq("user_id", userId);

await supabaseAdmin
  .from("followers")
  .delete()
  .eq("follower_id", userId);

await supabaseAdmin
  .from("followers")
  .delete()
  .eq("following_id", userId);

await supabaseAdmin
  .from("conversation_members")
  .delete()
  .eq("user_id", userId);

await supabaseAdmin
  .from("direct_messages")
  .delete()
  .eq("sender_id", userId);

await supabaseAdmin
  .from("direct_messages")
  .delete()
  .eq("receiver_id", userId);

await supabaseAdmin
  .from("user_preferences")
  .delete()
  .eq("user_id", userId);

const profileDeleteResult =
  await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("id", userId)
    .select();

const { error: deleteAuthError } =
  await supabaseAdmin.auth.admin.deleteUser(userId);

if (deleteAuthError) {
  return NextResponse.json(
    {
      success: false,
      error: deleteAuthError.message,
    },
    {
      status: 500,
    }
  );
}

return NextResponse.json({
  success: true,
});
}
