'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from '@/styles/RightSideMenu.module.css';
import { useEffect, useState } from 'react';

export default function RightSideMenu() {
  const pathname = usePathname();
  const router = useRouter();


  const handleNavigate = (to: string) => {
    router.push(to);
  };

  return (
    <aside className={`${styles.panel}`}>
      <div className={styles.header}>
        <h3>My Pack</h3>
      </div>

      <nav className={styles.nav}>
        <ul>
          <li>
            <Link
              href="/my-pack/my-lists"
              className={`${styles.link} ${pathname === '/my-pack/my-lists' ? styles.active : ''}`}
            >
              My Lists
            </Link>
          </li>

          <li>
            <Link
              href="/my-pack/create-list"
              className={`${styles.link} ${pathname === '/my-pack/create-list' ? styles.active : ''}`}
            >
              Create List
            </Link>
          </li>

          <li>
            <Link
              href="/my-pack/shopping-lists"
              className={`${styles.link} ${pathname === '/my-pack/shopping-lists' ? styles.active : ''}`}
            >
              Shopping List
            </Link>
          </li>

          <li>
            <Link
              href="/my-pack/planner"
              className={`${styles.link} ${pathname === '/my-pack/planner' ? styles.active : ''}`}
            >
              My Planner
            </Link>
          </li>

        </ul>
      </nav>
    </aside>
  );
}
