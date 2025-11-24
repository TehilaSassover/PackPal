'use client';
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import styles from "../styles/Header.module.css";
import { useUserStore } from "@/store/userStore";
export default function Header() {
  const pathname = usePathname();
  const userStore = useUserStore((state) => state.user);
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
          className={`${styles.link} ${pathname === "/lists" ? styles.active : ""}`}>Lists
        </Link>
        <Link href="/my-pack/my-lists"
          className={`${styles.link} ${(pathname && pathname.startsWith('/my-pack')) || pathname === "/my-lists" ? styles.active : ""}`}>My Pack
        </Link>
        <Link href="/community"
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
