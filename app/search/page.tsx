"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { supabase }
  from "../../lib/supabase-browser";

export default function SearchPage() {
  const router =
    useRouter();

  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
     useState("");

  const [results, setResults] =
  useState<any[]>([]);

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

/* ================= USER SEARCH ================= */

useEffect(() => {
  async function searchUsers() {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const { data, error } =
      await supabase
        .from("profiles")
        .select(
          "id, handle, first_name, last_name"
        )
        .or(
          `handle.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`
        )
        .limit(20);

    if (error) {
      console.error(error);
      return;
    }

    setResults(data || []);
  }

  searchUsers();
}, [searchTerm]);

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
      padding: 16,
    }}
  >
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: 28,
          fontWeight: 800,
          marginBottom: 16,
        }}
      >
        Search
      </h1>

      <input
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(
            e.target.value
          )
        }
        placeholder="Search posts, users, and more..."
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 16,
          border: "1px solid #222",
          background: "#111118",
          color: "#fff",
          marginBottom: 20,
          boxSizing: "border-box",
        }}
      />

      {!searchTerm ? (
        <div
          style={{
            color: "#888",
            textAlign: "center",
            marginTop: 40,
          }}
        >
          Start typing to search through BlackMaltra
        </div>
      ) : (
        <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 12,
  }}
>
  {results.map((profile) => (
    <div
      key={profile.id}
      onClick={() =>
        router.push(
          `/profile/${profile.id}`
        )
      }
      style={{
        background: "#111118",
        border: "1px solid #222",
        borderRadius: 16,
        padding: 16,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          fontWeight: 700,
        }}
      >
        {`${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "BlackMaltra Member"}
      </div>

      <div
        style={{
          color: "#888",
          marginTop: 4,
        }}
      >
        @{profile.handle}
      </div>
    </div>
  ))}
</div>
      )}
    </div>
  </main>
);
}
