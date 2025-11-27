// import { auth } from "@/lib/firebase";
// import { signInWithPopup, signOut } from "firebase/auth";

// // בדיקה מול ה-API והגדרת המשתמש ב-Zustand + localStorage
// export const verifyAndSetUser = async (
//   firebaseUser: any,
//   setLocalUser: (u: any) => void,
//   setUserStore: (u: any) => void,
//   logoutStore: () => void,
//   setErrors: (e: any) => void
// ) => {
//   try {
//     const res = await fetch("/api/users/checkOrCreateUser", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         uid: firebaseUser.uid,
//         email: firebaseUser.email,
//         displayName: firebaseUser.displayName,
//         photoURL: firebaseUser.photoURL,
//       }),
//     });
//     const data = await res.json();

//     if (data.status === "success") {
//       setLocalUser(data.user);
//       setUserStore(data.user);
//       return true;
//     } else {
//       await signOut(auth);
//       logoutStore();
//       setErrors({ email: "User not found. Please register first." });
//       return false;
//     }
//   } catch (err) {
//     console.error("DB check error:", err);
//     setErrors({ email: "Error checking user in DB" });
//     return false;
//   }
// };

// // Logout
// export const handleLogout = async (
//   setLocalUser: (u: any) => void,
//   logoutStore: () => void
// ) => {
//   await signOut(auth);
//   setLocalUser(null);
//   logoutStore();
// };
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

// בדיקה או יצירה של המשתמש ב־DB + עדכון Zustend/localStorage
export const verifyAndSetUser = async (
  firebaseUser: any,
  setUser: (u: any) => void,
  setUserStore: (u: any) => void,
  logoutStore: () => void,
  setErrors: (e: any) => void
) => {
  try {
    const res = await fetch("/api/users/checkOrCreateUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
      }),
    });
    const data = await res.json();

    if (data.status === "success") {
      // מוסיפים displayName ו-photoURL מה-Firebase
      const userWithPhoto = {
        ...data.user,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      };
      setUser(userWithPhoto);
      setUserStore(userWithPhoto);
      localStorage.setItem("user", JSON.stringify(userWithPhoto));
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

// Logout
export const handleLogout = async (
  setUser: (u: any) => void,
  logoutStore: () => void
) => {
  await signOut(auth);
  setUser(null);
  logoutStore();
  localStorage.removeItem("user");
};
