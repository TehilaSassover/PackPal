'use client';
import styles from "../styles/ListCard.module.css";
export default function ListCard({ category }: { category: string }) {
  return (
    <button className={styles.cardButton}>
      {category}
    </button>
  );
}
