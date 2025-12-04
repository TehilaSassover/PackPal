'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/RightSideMenu.module.css';

export default function RightSideMenu() {
  const pathname = usePathname();

  // Define all menu items in one array
  const menuItems = [
    { href: '/my-pack/my-lists', label: 'My Lists' },
    { href: '/my-pack/create-list', label: 'Create List' },
    { href: '/my-pack/shopping-lists', label: 'Shopping List' },
    { href: '/my-pack/planner', label: 'My Planner' },
  ];

  // Function to check if the menu item is active
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <h3>My Pack</h3>
      </div>

      <nav className={styles.nav}>
        <ul>
          {menuItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.link} ${isActive(item.href) ? styles.active : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
