"use client";
import { PackShare } from "@/app/types/lists";
import styles from "../styles/PackShare.module.css";
export default function Share({ share }: { share: PackShare }) {
  return (
    <div className={styles.card}>
      {/* תאריך בצד שמאל למעלה */}
      <div className={styles.date}>
        {new Date(share.date).toLocaleDateString()}
      </div>

      {/* תוכן במרכז */}
      <div className={styles.content}>
        {share.content}
      </div>

      {/* שם למטה */}
      <div className={styles.author}>
        {share.firstName} {share.lastName}
      </div>
    </div>
  );
}
