import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase-server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

console.log("CALLBACK URL:", request.url);

console.log(
  "ALL SEARCH PARAMS:",
  [...requestUrl.searchParams.entries()]
);

  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    const { data, error } =
  await supabase.auth.exchangeCodeForSession(code);

console.log("EXCHANGE ERROR:", error);

console.log("SESSION:", data.session);

console.log("USER:", data.user);

return NextResponse.redirect(
  new URL("/signin", requestUrl.origin)
);
  }

  return NextResponse.redirect(
    new URL("/signin", requestUrl.origin)
  );
}
