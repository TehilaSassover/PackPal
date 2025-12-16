// 'use client';

// import styles from "@/styles/AlertModal.module.css";

// export interface AlertModalProps {
//   type: "success" | "error" | "confirm";
//   message: string;
//   onClose: () => void;
//   onConfirm?: () => void;
// }

// export default function AlertModal({ type, message, onClose, onConfirm }: AlertModalProps) {
//   return (
//     <div className={styles.overlay}>
//       <div className={`${styles.modal} 
//           ${type === "success" ? styles.success :
//             type === "error" ? styles.error : styles.confirm}`}>
//         <p className={styles.message}>{message}</p>

//         <div className={styles.buttons}>
//           {type !== "confirm" && (
//             <button onClick={onClose} className={styles.closeBtn}>OK</button>
//           )}

//           {type === "confirm" && (
//             <>
//               <button onClick={onConfirm} className={styles.confirmBtn}>Yes</button>
//               <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from "react";
import styles from "@/styles/AlertModal.module.css";

export interface AlertModalProps {
  type: "success" | "error" | "confirm";
  message: string;
  onClose?: () => void;
  onConfirm?: () => void;
  // פונקציה שמחזירה Promise כדי להמתין ללחיצה
  resolvePromise?: (value: boolean) => void;
}

export default function AlertModal({ type, message, onClose, onConfirm, resolvePromise }: AlertModalProps) {
  const handleClose = () => {
    if (onClose) onClose();
    if (resolvePromise) resolvePromise(false); // false = user closed
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    if (resolvePromise) resolvePromise(true); // true = user confirmed
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} 
          ${type === "success" ? styles.success :
            type === "error" ? styles.error : styles.confirm}`}>
        <p className={styles.message}>{message}</p>

        <div className={styles.buttons}>
          {type !== "confirm" && (
            <button onClick={handleClose} className={styles.closeBtn}>OK</button>
          )}

          {type === "confirm" && (
            <>
              <button onClick={handleConfirm} className={styles.confirmBtn}>Yes</button>
              <button onClick={handleClose} className={styles.cancelBtn}>Cancel</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

