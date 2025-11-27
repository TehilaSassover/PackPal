"use client";
import { useState } from "react";
import { PackShare } from "@/app/types/lists";
import styles from "../styles/PackShare.module.css";
import { useUserStore } from "@/store/userStore";
import { updatReactionsPackShareAPI } from "@/services/packShare";

export default function Share({ share }: { share: PackShare }) {
  const [likes, setLikes] = useState(share.like?.length || 0);
  const [dislikes, setDislikes] = useState(share.dislike?.length || 0);
  const [error, setError] = useState("");
const showError = (msg: string) => {
  setError(msg);
  setTimeout(() => {
    setError("");
  }, 5000); // ✅ נעלם אחרי 5 שניות
};

  const handleReactions = async (type: "like" | "dislike") => {
    const userEmail = useUserStore.getState().user.email;
    try {
      const result = await updatReactionsPackShareAPI(
        share._id!.toString(),
        userEmail,
        type
      );
      if (result.modifiedCount > 0) {
        if (type === "like") setLikes(likes + 1);
        else setDislikes(dislikes + 1);
        setError("");
      } else {
showError ("You already reacted. Thank you!")    }
    } catch (err: any) {
      showError(err.message || "Error updating reaction");
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* ✅ הכרטיס עצמו */}
      <div className={styles.card}>
        <div className={styles.date}>
          {new Date(share.date).toLocaleDateString()}
        </div>

        <div className={styles.content}>{share.content}</div>

        <div className={styles.author}>
          {share.firstName} {share.lastName}
        </div>
      </div>

      {/* ✅ האייקונים מחוץ למסגרת */}
      <div className={styles.reactionsOutside}>
        <button
          className={styles.icon}
          onClick={() => handleReactions("like")}
        >
          👍 {likes}
        </button>

        <button
          className={styles.icon}
          onClick={() => handleReactions("dislike")}
        >
          👎 {dislikes}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
