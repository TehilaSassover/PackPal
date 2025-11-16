'use client';
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import styles from "../styles/Header.module.css";
import { useUserStore } from "@/store/userStore";
export default function Header() {
  const pathname = usePathname();
  const userStore = useUserStore((state) => state.user);
  console.log(userStore);
const logout = useUserStore((state) => state.logout);

const handleLogout = () => {
  logout(); 
};

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/"><img src="/logo.png" alt="Ludo Logo" className={styles.logoImg} /></Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/"
          className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}>Home
        </Link>
        <Link href="/lists"
          className={`${styles.link} ${pathname === "/list-page" ? styles.active : ""}`}>Lists
        </Link>
        <Link href="/my-list"
          className={`${styles.link} ${pathname === "/my-list" ? styles.active : ""}`}>My List
          </Link>
        <Link href="/community-list"
          className={`${styles.link} ${pathname === "/community-list" ? styles.active : ""}`}>Community List
        </Link>
      </nav>
       <div className={styles.loginContainer}>
        {userStore ? (<button className={styles.logoutButton} onClick={handleLogout}>Logout</button> ):
       ( <Link href="/login" className={styles.loginButton}>Login</Link>)}
      </div>
    </header>
  );
}
