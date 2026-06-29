"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase-browser";
import {
  Home,
  Search,
  Plus,
  MessageCircle,
  User,
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const [userId, setUserId] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUserId(
        session?.user?.id ?? null
      );
    }

    loadUser();
  }, []);

  const navItems = [
    {
      href: "/",
      icon: Home,
    },
    {
      href: "/search",
      icon: Search,
    },
    {
      href: "/create",
      icon: Plus,
      center: true,
    },
    {
      href: "/messages",
      icon: MessageCircle,
    },
    {
      href: userId
        ? `/profile/${userId}`
        : "/signin",
      icon: User,
    },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 18,
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 40px)",
        maxWidth: 520,
        height: 74,
        borderRadius: 999,
        background:
          "rgba(26,26,34,0.88)",
        display: "flex",
        justifyContent:
          "space-around",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter:
          "blur(14px)",
        WebkitBackdropFilter:
          "blur(14px)",
        border:
          "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.35)",
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;

        const active =
          pathname === item.href ||
          (item.href.includes(
            "/profile/"
          ) &&
            pathname.includes(
              "/profile/"
            ));

        // CENTER BUTTON
        if (item.center) {
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#7B2FFF,#39FF88)",
                color: "#0A0A0F",
                display: "flex",
                justifyContent:
                  "center",
                alignItems:
                  "center",
                marginTop: -18,
                boxShadow:
                  "0 10px 25px rgba(123,47,255,0.35)",
                transition:
                  "0.2s ease",
              }}
            >
              <Icon
                size={24}
                strokeWidth={2.5}
              />
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              background:
                "transparent",
              border: "none",
              color: active
                ? "#39FF88"
                : "#EAEAF0",
              transition:
                "0.2s ease",
              display: "flex",
              justifyContent:
                "center",
              alignItems:
                "center",
            }}
          >
            <Icon
              size={22}
              strokeWidth={2.2}
            />
          </Link>
        );
      })}
    </nav>
  );
}
