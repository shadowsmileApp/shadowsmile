"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { supabase }
  from "../../lib/supabase";

export default function SearchPage() {
  const router =
    useRouter();

  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  /* ================= LOAD USER ================= */

  useEffect(() => {
    async function loadUser() {
      try {
        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        setUser(
          session?.user ?? null
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(() => {
        loadUser();
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /* ================= AUTH WALL ================= */

  useEffect(() => {
    if (
      !loading &&
      !user
    ) {
      router.push("/signin");
    }
  }, [
    loading,
    user,
    router,
  ]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#0A0A0F",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Loading...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A0A0F",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 24,
        fontWeight: 700,
      }}
    >
      Search coming soon
    </main>
  );
}
