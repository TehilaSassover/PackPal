'use client';
import { useRouter } from "next/navigation";
import styles from "../../styles/List.module.css"

export default function ListsPage() {
  const router = useRouter();

  const categories = [
    "Day trip",
    "Overnight trip",
    "Weekend trip",
    "Long trip",
    "Dry trip",
    "Wet trip",
    "Mixed terrain trip",
    "Camping / tent trip",
    "Walking / hiking trip",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category}
            className={styles.categoryButton}
            onClick={() => router.push(`/lists/${encodeURIComponent(category)}`)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
