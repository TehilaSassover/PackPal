'use client';
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import styles from "../styles/Header.module.css";
export default function Header() {
  const pathname = usePathname();
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/"><img src="/logo.png" alt="Ludo Logo" className={styles.logoImg} /></Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/"
          className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}>Home
        </Link>
        <Link href="/create-list"
          className={`${styles.link} ${pathname === "/create-list" ? styles.active : ""}`}>Create List
        </Link>
        <Link href="/my-list"
          className={`${styles.link} ${pathname === "/my-list" ? styles.active : ""}`}>My List
          </Link>
        <Link href="/community-list"
          className={`${styles.link} ${pathname === "/community-list" ? styles.active : ""}`}>Community List
        </Link>
      </nav>
       <div className={styles.loginContainer}>
        <Link href="/login" className={styles.loginButton}>Login</Link>
      </div>
    </header>
  );
}
