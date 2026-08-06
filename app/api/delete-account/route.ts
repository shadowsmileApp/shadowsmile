import { NextResponse } from "next/server";

import { createClient } from "../../../lib/supabase-server";
import { supabaseAdmin } from "../../../lib/supabase-admin";

export async function POST() {
  const supabase = await createClient();

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

const { error: reactionsError } =
  await supabaseAdmin
    .from("reactions")
    .delete()
    .eq("user_id", userId);

if (reactionsError) {
  console.error("REACTIONS ERROR:", reactionsError);

  return NextResponse.json(
    {
      success: false,
      error: reactionsError.message,
    },
    {
      status: 500,
    }
  );
}

const { error: commentsError } =
  await supabaseAdmin
    .from("comments")
    .delete()
    .eq("user_id", userId);

if (commentsError) {
  console.error("COMMENTS ERROR:", commentsError);

  return NextResponse.json(
    {
      success: false,
      error: commentsError.message,
    },
    {
      status: 500,
    }
  );
}

const { error: postsError } =
  await supabaseAdmin
    .from("posts")
    .delete()
    .eq("user_id", userId);

if (postsError) {
  return NextResponse.json(
    {
      success: false,
      error: postsError.message,
    },
    {
      status: 500,
    }
  );
}

const { error: followersError } =
  await supabaseAdmin
    .from("followers")
    .delete()
    .or(`follower_id.eq.${userId},following_id.eq.${userId}`);

if (followersError) {
  return NextResponse.json(
    {
      success: false,
      error: followersError.message,
    },
    {
      status: 500,
    }
  );
}

const { error: conversationMembersError } =
  await supabaseAdmin
    .from("conversation_members")
    .delete()
    .eq("user_id", userId);

if (conversationMembersError) {
  return NextResponse.json(
    {
      success: false,
      error: conversationMembersError.message,
    },
    {
      status: 500,
    }
  );
}

const { error: directMessagesError } =
  await supabaseAdmin
    .from("direct_messages")
    .delete()
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

if (directMessagesError) {
  return NextResponse.json(
    {
      success: false,
      error: directMessagesError.message,
    },
    {
      status: 500,
    }
  );
}

const { error: userPreferencesError } =
  await supabaseAdmin
    .from("user_preferences")
    .delete()
    .eq("user_id", userId);

if (userPreferencesError) {
  return NextResponse.json(
    {
      success: false,
      error: userPreferencesError.message,
    },
    {
      status: 500,
    }
  );
}

const { error: profileError } =
  await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("id", userId);

if (profileError) {
  return NextResponse.json(
    {
      success: false,
      error: profileError.message,
    },
    {
      status: 500,
    }
  );
}

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
