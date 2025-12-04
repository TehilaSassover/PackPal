"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useMenuStore } from "@/store/menuStore";
import SimulationBackground from "./UsagePreview";

interface AuthModalProps {
  children: React.ReactNode;
}

export default function AuthModal({ children }: AuthModalProps) {
  const storeUser = useUserStore((state) => state.user);
  const setUserStore = useUserStore((state) => state.setUser);
  const openMenu = useMenuStore((state) => state.open);
  const closeMenu = useMenuStore((state) => state.close);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let savedUser = storeUser;

    if (!storeUser && typeof window !== "undefined") {
      const local = localStorage.getItem("user");
      if (local) savedUser = JSON.parse(local);
    }

    setUser(savedUser);
    if (savedUser) setUserStore(savedUser);
  }, [storeUser, setUserStore]);

  useEffect(() => {
    if (!user) {
      openMenu();
    } else {
      closeMenu(); // סוגר אוטומטית אחרי שהמשתמש נכנס
    }
  }, [user, openMenu, closeMenu]);

  if (!user) return <SimulationBackground />;
  return <>{children}</>;
}
