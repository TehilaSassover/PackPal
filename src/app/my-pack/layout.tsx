"use client";

import AuthModal from "@/components/AuthModal";
import RightSideMenu from "@/components/RightSideMenu";

export default function MyPackLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthModal>
      <RightSideMenu />
      {children}
    </AuthModal>
  );
}
