'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { handleGoogleLogin, handleLogout, verifyAndSetUser } from "@/services/login";
import styles from "@/styles/Login.module.css";

export default function Login() {
  const [user, setUser] = useState<any>(null);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const router = useRouter();

  const setUserStore = useUserStore((state) => state.setUser);
  const logoutStore = useUserStore((state) => state.logout);

  return (
    <div className={styles.container}>
      {user ? (
        <>
          <p>Hello, {user.displayName || user.email}</p>
          <button
            className={styles.logoutButton}
            onClick={() => handleLogout(setUser, logoutStore, router)}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          <button
            className={`${styles.button} ${styles.googleButton}`}
            onClick={() =>
              handleGoogleLogin(
                (firebaseUser) =>
                  verifyAndSetUser(firebaseUser, setUser, setUserStore, logoutStore, setErrors),
                setErrors
              )
            }
          >
            Continue with Google
          </button>
        </>
      )}
    </div>
  );
}
