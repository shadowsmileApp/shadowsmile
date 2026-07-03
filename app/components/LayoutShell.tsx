"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BottomNav from "./BottomNav";


export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [hideMessagesNav, setHideMessagesNav] =
  useState(false);

  useEffect(() => {
  const check = () => {
    setHideMessagesNav(
      document.body.classList.contains(
        "messages-chat-open"
      )
    );
  };

  check();

  const observer =
    new MutationObserver(check);

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () =>
    observer.disconnect();
}, []);

  const showBottomNav =
  pathname === "/" ||
  pathname === "/search" ||
  pathname === "/create" ||
  pathname === "/messages" ||
  pathname.startsWith("/profile/");

const hideNav =
  !showBottomNav || hideMessagesNav;

  return (
    <>
      <main
        style={{
          paddingBottom: hideNav
            ? "0px"
            : "90px",
        }}
      >
        {children}
      </main>

      {!hideNav && <BottomNav />}
    </>
  );
}
