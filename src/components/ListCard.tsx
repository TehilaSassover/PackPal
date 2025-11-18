'use client';
import styles from "../styles/ListCard.module.css";

interface ListCardProps {
  id: string;
  name: string;
  itemCount: number;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ListCard({
  id,
  name,
  itemCount,
  isSelected,
  onSelect,
}: ListCardProps) {
  return (
    // <button
    //   className={`${styles.card} ${isSelected ? styles.selected : ""}`}
    //   onClick={onSelect}
    // >
    //   <h3>{name}</h3>
    //   <p className={styles.itemCount}>{itemCount} items</p>
    // </button>
    <button className={`${styles.card} ${isSelected ? styles.selected : ""}`} onClick={onSelect}>
      <div className={styles.topButton}>{name}</div>
      <div className={styles.dots}>...</div>
    </button>

  );
}

