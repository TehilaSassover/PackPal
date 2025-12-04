'use client';
import styles from "../styles/ListCard.module.css";
import { ListCardProps } from "@/app/types/lists";

export default function ListCard({
  id,
  name,
  itemCount,
  isSelected,
  onSelect,
}: ListCardProps) {
  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      onClick={onSelect}
    >
      <div className={styles.topButton}>{name}</div>

    </div>
  );
}
