'use client';
import { useState } from "react";
import ListCard from "../../components/ListCard";
import styles from "../../styles/List.module.css"
export default function ListsPage() {
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

  const defaultLists = ["Sample 1", "Sample 2", "Sample 3"];

  // state של הקטגוריה שנבחרה
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // מה להציג ברשימות
  const displayLists = selectedCategory ? [selectedCategory] : defaultLists;

  return (
    <div className={styles.container}>
      {/* כפתורי קטגוריות */}
      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.categoryButton} ${
              selectedCategory === category ? styles.selected : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* רשימות */}
      <div className={styles.listsContainer}>
        {displayLists.map((list) => (
          <ListCard key={list} category={list} />
        ))}
      </div>
    </div>
  );
}
