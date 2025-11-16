'use client';
import { useState } from "react";
import { signInWithPopup, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import styles from "@/styles/Login.module.css";
import { useUserStore } from "@/store/userStore";
import { z, ZodError } from "zod";

// Schema לבדיקה לפני Firebase
const loginSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").nonempty("Password is required"),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();

  const setUserStore = useUserStore((state) => state.setUser);
  const logoutStore = useUserStore((state) => state.logout);

  // פונקציה לבדוק אם המשתמש קיים במסד
  const verifyAndSetUser = async (firebaseUser: any) => {
    try {
      const res = await fetch("/api/users/checkUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: firebaseUser.uid, email: firebaseUser.email }),
      });
      const data = await res.json();

      if (data.status === "success") {
        setUser(data.user);        
        setUserStore(data.user);
        return true;
      } else {
        await signOut(auth);
        logoutStore();
        setErrors({ email: "User not found. Please register first." });
        return false;
      }
    } catch (err) {
      console.error("DB check error:", err);
      setErrors({ email: "Error checking user in DB" });
      return false;
    }
  };

  // Login עם Email + Password
  // const handleEmailLogin = async () => {
  //   setErrors({});
  //   try {
  //     loginSchema.parse({ email, password });

  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //     console.log(userCredential);
      
  //     await verifyAndSetUser(userCredential.user);

  //   } catch (err: unknown) {
  //     if (err instanceof ZodError) {
  //       const fieldErrors: { email?: string; password?: string } = {};
  //       err.issues.forEach(e => {
  //         if (e.path.includes("email")) fieldErrors.email = e.message;
  //         if (e.path.includes("password")) fieldErrors.password = e.message;
  //       });
  //       setErrors(fieldErrors);
  //     } else if (err instanceof Error) {
  //       const code = (err as any).code;
  //       if (code === "auth/user-not-found") setErrors({ email: "User not found. Please register first." });
  //       else if (code === "auth/wrong-password") setErrors({ password: "Incorrect password." });
  //       else setErrors({ email: err.message });
  //     }
  //   }
  // };

  // Login עם Google
  const handleGoogleLogin = async () => {
    setErrors({});
    try {
      const result = await signInWithPopup(auth, provider);
      await verifyAndSetUser(result.user);

    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") setErrors({ email: "Popup closed before completing sign in." });
      else setErrors({ email: err.message || "Google sign in failed" });
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    logoutStore();
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      {user ? (
        <>
          <p>Hello, {user.displayName || user.email}</p>
        <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          {/* <div>
            <input
              className={styles.inputField}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>

          <div>
            <input
              className={styles.inputField}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className={styles.errorText}>{errors.password}</p>}
          </div> */}

          {/* <button className={styles.button} onClick={handleEmailLogin}>Sign In</button> */}

          <button className={`${styles.button} ${styles.googleButton}`} onClick={handleGoogleLogin}>
            Continue with Google
          </button>

          {/* <p style={{ marginTop: "12px" }}>
            First time here?{" "}
            <span
              onClick={() => router.push("/register")}
              style={{ color: "#0070f3", cursor: "pointer", textDecoration: "underline" }}
            >
              Click here
            </span>
          </p> */}
        </>
      )}
    </div>
  );
}
