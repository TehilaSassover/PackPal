'use client';

import styles from "@/styles/AlertModal.module.css";

interface AlertModalProps {
  type: "success" | "error" | "confirm";
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function AlertModal({ type, message, onClose, onConfirm }: AlertModalProps) {
  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} 
          ${type === "success" ? styles.success :
            type === "error" ? styles.error : styles.confirm}`}>
        <p className={styles.message}>{message}</p>

        <div className={styles.buttons}>
          {type !== "confirm" && (
            <button onClick={onClose} className={styles.closeBtn}>OK</button>
          )}

          {type === "confirm" && (
            <>
              <button onClick={onConfirm} className={styles.confirmBtn}>Yes</button>
              <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
