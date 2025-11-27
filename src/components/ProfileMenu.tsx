"use client";

import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/store/userStore";
import { useMenuStore } from "@/store/menuStore";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { verifyAndSetUser, handleLogout } from "@/services/login";
import styles from "@/styles/ProfileMenu.module.css";

export default function ProfileMenu() {
  // Zustand user store
  const storeUser = useUserStore((state) => state.user);
  const setUserStore = useUserStore((state) => state.setUser);
  const logoutStore = useUserStore((state) => state.logout);

  // Local fallback user from localStorage
  const [storedUser, setStoredUser] = useState<any>(null);

  // Zustand menu store
  const menuOpen = useMenuStore((state) => state.isOpen);
  const toggleMenu = useMenuStore((state) => state.toggle);
  const closeMenu = useMenuStore((state) => state.close);

  const menuRef = useRef<HTMLDivElement>(null);

  // Current effective user
  const currentUser = storeUser || storedUser;

  // Load user from localStorage if not in store
  useEffect(() => {
    if (!storeUser && typeof window !== "undefined") {
      const local = localStorage.getItem("user");
      if (local) {
        const parsed = JSON.parse(local);
        setStoredUser(parsed);
        setUserStore(parsed);
      } else {
        setStoredUser(null);
      }
    }
  }, [storeUser, setUserStore]);

  // Close menu if click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, closeMenu]);

  // Google login
  const [errors, setErrors] = useState<{ email?: string }>({});
  async function handleGoogleLogin() {
    setErrors({});
    try {
      const result = await signInWithPopup(auth, provider);
      await verifyAndSetUser(result.user, setStoredUser, setUserStore, logoutStore, setErrors);
      closeMenu();
    } catch (error) {
      setErrors({ email: "Google login failed" });
    }
  }

  // ===== Internal small components for clarity =====
  const ProfileIcon = () => (
    <div className={styles.profileIconContainer} onClick={toggleMenu}>
      {currentUser?.photoURL ? (
        <img src={currentUser.photoURL} className={styles.profileIcon} />
      ) : (
        <GuestPlaceholder />
      )}
    </div>
  );

  const GuestPlaceholder = () => (
    <div className={styles.profilePlaceholder}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className={styles.profileSvg}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5.121 17.804A15.042 15.042 0 0112 15c2.998 0 5.78 1.084 7.879 2.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </div>
  );

  // ===== Render =====
  return (
    <>
      <div className={styles.profileWrapper}>
        <ProfileIcon />
        <p className={currentUser?.displayName ? styles.userMiniName : styles.userMiniNameGuest}>
          {currentUser?.displayName || "Guest"}
        </p>
      </div>

      {menuOpen && (
        <>
          <div className={styles.overlay}></div>
          <div className={styles.menu} ref={menuRef}>
            {currentUser ? (
              <>
                <h3 className={styles.title}>Welcome 👋</h3>
                <div className={styles.userInfo}>
                  <p className={styles.userName}>{currentUser.displayName || "User"}</p>
                  <p className={styles.userEmail}>{currentUser.email}</p>
                </div>
                <button className={styles.logoutButton} onClick={() => handleLogout(setStoredUser, logoutStore)}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <h3 className={styles.title}>Join us 🎒</h3>
                <p className={styles.subText}>
                  Sign in to manage your personal area, save checklists, and enjoy a tailored packing experience.
                </p>
                {errors.email && <p className={styles.errorText}>{errors.email}</p>}
                <button className={styles.loginButton} onClick={handleGoogleLogin}>
                  Continue with Google
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
