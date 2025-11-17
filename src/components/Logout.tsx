'use client';
import { useUserStore } from "@/store/userStore"; // ההנחה שהקמת את ה-store
import { useRouter } from "next/navigation";
export default function LogoutButton() {
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();
  const handleLogout = () => {
    logout();          // מנקה את המשתמש מה-store וגם מה-localStorage
    router.push("/");  // מפנה לדף ראשי, אפשר לשנות ל-login
  };
  return (
    <button onClick={handleLogout}>
      logout
    </button>
  );
}
