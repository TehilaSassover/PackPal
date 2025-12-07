"use client";

import { useEffect } from "react";
import RightSideMenu from "@/components/RightSideMenu";
import UsagePreview from "@/components/UsagePreview";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface MyPackLayoutProps {
  children: React.ReactNode;
}

export default function MyPackLayout({ children }: MyPackLayoutProps) {
  const { user, requireAuth } = useRequireAuth();

  useEffect(() => {
    if (!user) {
      requireAuth(() => {}); 
    }
  }, [user, requireAuth]);

  if (!user) return <UsagePreview />;

  return (
    <>
      {children}
      <RightSideMenu />
    </>
  );
}
