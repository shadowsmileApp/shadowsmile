"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase-browser";

type UserContextType = {
  user: any;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export function useUser() {
  return useContext(UserContext);
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    setUser(null);
    setLoading(false);
    return;
  }

  setUser(data.user);
  setLoading(false);
}

  useEffect(() => {
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {

  if (event === "SIGNED_OUT") {
    setUser(null);
  }

  if (event === "SIGNED_IN") {
    setUser(session?.user || null);
  }
}
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}
