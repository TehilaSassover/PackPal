"use client";

import RightSideMenu from '@/components/RightSideMenu';
import styles from '@/styles/MyPackLayout.module.css';

export default function MyPackLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <RightSideMenu />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
