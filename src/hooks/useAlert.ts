import { useState, useCallback } from "react";
import type { AlertModalProps } from "@/components/AlertModal";

type AlertType = "success" | "error" | "confirm";

interface AlertOptions {
  type: AlertType;
  message: string;
  onConfirm?: () => void;
  onClose?: () => void;
}

/**
 * Hook to show alert messages
 * Usage: const { showAlert, showConfirm, getAlertProps } = useAlert();
 */
export function useAlert() {
  const [alert, setAlert] = useState<AlertOptions | null>(null);

  // Show simple success/error alert
  // const showAlert = useCallback((message: string, type: "success" | "error" = "success") => {
  //   setAlert({ message, type });
  // }, []);

  const showAlert = useCallback(
    (
      message: string,
      type: "success" | "error" = "success",
      onClose?: () => void
    ) => {
      setAlert({
        message,
        type,
        onClose,
      });
    },
    []
  );


  // Show confirm alert
  const showConfirm = useCallback((message: string, onConfirm: () => void) => {
    setAlert({ message, type: "confirm", onConfirm });
  }, []);

  // Close the alert
  const closeAlert = useCallback(() => setAlert(null), []);

  /**
   * Returns props to pass into AlertModal component
   * AlertModal stays in JSX (.tsx), hook remains .ts
   */
  // const getAlertProps = (): AlertModalProps | null => {
  //   if (!alert) return null;
  //   return {
  //     type: alert.type,
  //     message: alert.message,
  //     onClose: closeAlert,
  //     onConfirm: alert.onConfirm,
  //   };
  // };

  const getAlertProps = (): AlertModalProps | null => {
    if (!alert) return null;

    return {
      type: alert.type,
      message: alert.message,
      onClose: () => {
        alert.onClose?.(); // 👈 מפעיל המשך אם יש
        closeAlert();
      },
      onConfirm: alert.onConfirm,
    };
  };


  return { showAlert, showConfirm, closeAlert, getAlertProps };
}
