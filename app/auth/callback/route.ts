import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase-server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    await supabase.auth.exchangeCodeForSession(code);

    await supabase.auth.getSession();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(
        new URL("/signin", requestUrl.origin)
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_complete")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.onboarding_complete) {
      return NextResponse.redirect(
        new URL("/", requestUrl.origin)
      );
    }

    return NextResponse.redirect(
      new URL("/onboarding", requestUrl.origin)
    );
  }

  return NextResponse.redirect(
    new URL("/signin", requestUrl.origin)
  );
}
