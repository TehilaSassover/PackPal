"use client";
import { useState } from "react";
import { PackShare } from "@/app/types/lists";
import styles from "../styles/PackShare.module.css";
import { updatReactionsPackShareAPI } from "@/services/packShare";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface ShareProps {
  share: PackShare;
}

export default function Share({ share }: ShareProps) {
  const [likes, setLikes] = useState(share.like?.length || 0);
  const [dislikes, setDislikes] = useState(share.dislike?.length || 0);
  const [error, setError] = useState("");

  const { requireAuth, user } = useRequireAuth(); // ✅ hooks כאן ברמת הקומפוננטה

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(""), 5000);
  };

  const handleReactions = (type: "like" | "dislike") => {
    requireAuth(async () => { // ✅ רק משתמש מחובר מגיע לפנים
      try {
        const userEmail = user!.email; // ✅ לא hook כאן
        const result = await updatReactionsPackShareAPI(
          share._id!.toString(),
          userEmail,
          type
        );
        if (result.modifiedCount > 0) {
          type === "like" ? setLikes(likes + 1) : setDislikes(dislikes + 1);
        } else {
          showError("You already reacted. Thank you!");
        }
      } catch (err: any) {
        showError(err.message || "Error updating reaction");
      }
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.date}>
          {new Date(share.date).toLocaleDateString()}
        </div>
        <div className={styles.content}>{share.content}</div>
        <div className={styles.author}>
          {share.firstName} {share.lastName}
        </div>
      </div>

      <div className={styles.reactionsOutside}>
        <button className={styles.icon} onClick={() => handleReactions("like")}>
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
