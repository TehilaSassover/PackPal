import { auth, provider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

// פונקציה לבדוק אם המשתמש קיים במסד
export const verifyAndSetUser = async (
  firebaseUser: any,
  setUser: (u: any) => void,
  setUserStore: (u: any) => void,
  logoutStore: () => void,
  setErrors: (e: any) => void
) => {
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

// Login עם Google
export const handleGoogleLogin = async (
  verifyFn: (firebaseUser: any) => Promise<boolean>,
  setErrors: (e: any) => void
) => {
  setErrors({});
  try {
    const result = await signInWithPopup(auth, provider);
    await verifyFn(result.user);
  } catch (err: any) {
    if (err.code === "auth/popup-closed-by-user")
      setErrors({ email: "Popup closed before completing sign in." });
    else setErrors({ email: err.message || "Google sign in failed" });
  }
};

// Logout
export const handleLogout = async (
  setUser: (u: any) => void,
  logoutStore: () => void,
  router: any
) => {
  await signOut(auth);
  setUser(null);
  logoutStore();
  router.push("/login");
};
