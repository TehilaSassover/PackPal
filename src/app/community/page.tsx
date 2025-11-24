"use client";
import { useEffect, useState } from "react";
import { getAllPackSharesAPI, sendPackShareAPI } from "@/services/packShare"; // נניח שיש פונקציה לשליחת טיפ
import { PackShare } from "@/app/types/lists";
import Share from "@/components/Share";
import styles from "@/styles/PackSharesCommponent.module.css";
import { useUserStore } from "@/store/userStore";

export default function PackShareComponent() {
  const [shares, setShares] = useState<PackShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTip, setNewTip] = useState(""); // הטיפ שהמשתמש מקליד
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function fetchShares() {
      try {
        const data = await getAllPackSharesAPI();
        setShares(data);
      } catch (err: any) {
        console.error("Error fetching pack shares:", err);
        setError(err.message || "Failed to fetch pack shares");
      } finally {
        setLoading(false);
      }
    }
    fetchShares();
  }, []);

  const handleSendTip = async () => {
    if (!newTip.trim()) return;
    setSending(true);
    try {
      const user=useUserStore.getState().user;
      const tipData = {
        firstName: user.firstName, 
        lastName: user.lastName,
        email: user.email,
        content: newTip,
        date: new Date(),
      };
      const savedTip = await sendPackShareAPI(tipData);
      setShares([savedTip, ...shares]); 
      setNewTip("");
    } catch (err: any) {
      console.error(err);
      alert("Failed to send tip");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p>Loading pack shares...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Community Posts</h2>

      {shares.length === 0 ? (
        <p>No pack shares found.</p>
      ) : (
        <div className={styles.sharesGrid}>
          {shares.map((share) => (
            <Share key={`${share.email}-${share.date}`} share={share} />
          ))}
        </div>
      )}

      {/* טופס להוספת טיפ */}
      <div className={styles.tipForm}>
        <textarea
          placeholder="Before you start, share with us: what helps you pack better?"
          value={newTip}
          onChange={(e) => setNewTip(e.target.value)}
          className={styles.textarea}
        />
        <button onClick={handleSendTip} disabled={sending} className={styles.sendButton}>
          {sending ? "Sending..." : "Send Tip"}
        </button>
      </div>
    </div>
  );
}
