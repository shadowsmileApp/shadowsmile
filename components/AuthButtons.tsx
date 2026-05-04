"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <button onClick={() => signIn("google")}>Login</button>;
  }

  return <button onClick={() => signOut()}>Logout</button>;
}
