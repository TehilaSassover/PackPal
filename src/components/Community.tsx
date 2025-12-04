"use client";
import { useEffect, useState } from "react";
import { getAllPackSharesAPI, sendPackShareAPI } from "@/services/packShare";
import { PackShare } from "@/app/types/lists";
import Share from "@/components/Share";
import styles from "@/styles/PackSharesCommponent.module.css";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function PackShareComponent() {
  const [shares, setShares] = useState<PackShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTip, setNewTip] = useState("");
  const [sending, setSending] = useState(false);
  const [tipError, setTipError] = useState<string | null>(null);

  const { requireAuth, user } = useRequireAuth();

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

  const handleSendTip = () => {
    requireAuth(async () => {
      const trimmedTip = newTip.trim();
      const wordCount = trimmedTip.split(/\s+/).filter(Boolean).length;
      if (!trimmedTip) {
        setTipError("Tip cannot be empty!");
        return;
      }
      if (wordCount < 2) {
        setTipError("Tip must contain at least 2 words!");
        return;
      }

      setTipError(null);
      setSending(true);
      try {
        const tipData = {
          firstName: user!.firstName,
          lastName: user!.lastName,
          email: user!.email,
          content: trimmedTip,
          date: new Date(),
          like: [],
          dislike: [],
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
    });
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

      <div className="tipFormWrapper">
        <div className={styles.tipForm}>
          <textarea
            placeholder="Before you start, share with us: what helps you pack better?"
            value={newTip}
            onChange={(e) => setNewTip(e.target.value)}
            className={styles.textarea}
          />
          {tipError && <p className={styles.error}>{tipError}</p>}
        </div>
        <button
          onClick={handleSendTip}
          disabled={sending}
          className={styles.sendButton}
        >
          {sending ? "Sending..." : "Send Tip"}
        </button>
      </div>
    </div>
  );
}
