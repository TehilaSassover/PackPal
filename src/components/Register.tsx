'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, provider } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { useUserStore } from "@/store/userStore";
import styles from "@/styles/Register.module.css";

export default function Register() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const setUserStore = useUserStore((state) => state.setUser);
  // 🔹 שמירה גם בזוסטנד וגם בלוקל
  const saveUser = (userData: any) => {
    setUserStore(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  // 🔹 בדיקה אוטומטית אם המשתמש כבר מחובר
  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (user || localUser) {
      router.push("/");
    }
  }, [user, router]);
  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });
      const res = await fetch("/api/users/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          firstName,
          lastName,
        }),
      });

      const data = await res.json();

      const newUser = data.user || { uid: user.uid, email: user.email, firstName, lastName };
      saveUser(newUser);

      alert("Registration successful!");
      router.push("/");
    } catch (error: any) {
      console.error(error);
      alert("Registration failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await fetch("/api/users/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
        }),
      });
      const newUser = (await res.json()).user || {
        uid: user.uid,
        email: user.email,
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ")[1] || "",
      };
      saveUser(newUser);
      alert("Signed up successfully with Google!");
      router.push("/");
    } catch (error: any) {
      console.error(error);
      alert("Google registration failed: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create an Account</h2>

      <input
        className={styles.inputField}
        type="text"
        placeholder="First Name *"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        className={styles.inputField}
        type="text"
        placeholder="Last Name *"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <input
        className={styles.inputField}
        type="email"
        placeholder="Email *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className={styles.inputField}
        type="password"
        placeholder="Password *"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button className={styles.button} onClick={handleRegister} disabled={loading}>
        {loading ? "Registering..." : "Sign Up"}
      </button>

      <div className={styles.divider}>OR</div>

      <button className={`${styles.button} ${styles.googleButton}`} onClick={handleGoogleRegister}>
        Continue with Google
      </button>

      <p className={styles.footerText}>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
}
