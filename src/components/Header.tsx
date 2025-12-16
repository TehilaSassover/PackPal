'use client';
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import styles from "../styles/Header.module.css";
import { useUserStore } from "@/store/userStore";
import ProfileMenu from "./ProfileMenu";  // Import ProfileMenu here

export default function Header() {
  const pathname = usePathname();
  const userStore = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const tabs = [
    { href: "/", label: "Home", match: "/" },
    { href: "/lists", label: "Lists", match: "/lists" },
    { href: "/my-pack/my-lists", label: "My Pack", match: "/my-pack" },
    { href: "/community", label: "Community List", match: "/community" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/"> <img src="/logo.webp" alt="Ludo Logo" className={styles.logoImg} /></Link>
      </div>
      <nav className={styles.nav}>
        {tabs.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`${styles.link} ${(tab.match === "/" ? pathname === "/" : pathname.startsWith(tab.match))
              ? styles.active
              : ""
              }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <div className={styles.loginContainer}>
        <ProfileMenu />
      </div>
    </header>

  );
}
