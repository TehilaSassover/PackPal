'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAlert } from "@/hooks/useAlert"; // <-- כאן
import AlertModal from "@/components/AlertModal";
import { createPortal } from "react-dom";

interface AddToMyListButtonProps {
  listId: string;
  onSuccess?: () => void;
  buttonClassName?: string;
  variant?: 'panel' | 'detail';
}

export default function AddToMyListButton({
  listId,
  onSuccess,
  buttonClassName,
  variant = 'detail',
}: AddToMyListButtonProps) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const { requireAuth, user } = useRequireAuth();
  const { showAlert, showConfirm, getAlertProps } = useAlert();

  const handleAddToMyLists = async () => {
    if (!user) {
      showAlert("You must log in to add lists.", "error");
      requireAuth(() => {}); // פותח את חלון ההרשמה
      return;
    }

    setAdding(true);

    try {
      const response = await fetch("/api/myLists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id || user.id,
          listId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add list.");
      }

      // הצלחה → הצגת הודעה
      showAlert("The list was added successfully!", "success");

      if (onSuccess) onSuccess();

      router.push("/my-pack/my-lists");

    } catch (err: any) {
      showAlert(err.message || "Error adding list.", "error");
    } finally {
      setAdding(false);
    }
  };

  const alertProps = getAlertProps();

  return (
    <>
      <button
        className={buttonClassName}
        onClick={handleAddToMyLists}
        disabled={adding}
      >
        {adding ? "Adding..." : "Add to My Lists"}
      </button>

      {/* חלון ההודעה */}
      {alertProps &&
        createPortal(<AlertModal {...alertProps} />, document.body)}
    </>
  );
}
