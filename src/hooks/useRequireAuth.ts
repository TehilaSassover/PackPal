// /hooks/useRequireAuth.ts
import { useUserStore } from "@/store/userStore";
import { useMenuStore } from "@/store/menuStore";

export function useRequireAuth() {
  const user = useUserStore((state) => state.user);
  const openMenu = useMenuStore((state) => state.open);

  const requireAuth = (callback: () => void) => {
    if (user) {
      callback();
    } else {
      openMenu(); // פותח את חלון ההרשמה
    }
  };

  return { requireAuth, user };
}
