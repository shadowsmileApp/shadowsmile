"use client";

import { useEffect } from "react";
import { supabase } from "../../lib/supabase-browser";

export default function AuthListener() {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {

      if (event === "SIGNED_OUT") {
        window.location.replace("/signin");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
