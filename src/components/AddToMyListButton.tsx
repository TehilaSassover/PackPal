'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/store/userStore";

interface AddToMyListButtonProps {
  listId: string;
  onSuccess?: () => void;
  buttonClassName?: string;
  errorClassName?: string;
  variant?: 'panel' | 'detail'; // 'panel' for side panel, 'detail' for detail page
}

export default function AddToMyListButton({
  listId,
  onSuccess,
  buttonClassName,
  errorClassName,
  variant = 'detail',
}: AddToMyListButtonProps) {
  const router = useRouter();
  const { user } = useUserStore();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToMyLists = async () => {
    // בדיקה האם המשתמש מחובר
    if (!user) {
      setError("Please log in first to add lists");
      setTimeout(() => setError(null), 3000);
      // הפנה ללוגין
      router.push("/login");
      return;
    }

    setAdding(true);
    setError(null);

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
        throw new Error("Failed to add list");
      }

      // קריאה callback אם הוגדר
      if (onSuccess) {
        onSuccess();
      }

      // הפנה לעמוד האישי (עם עיכוב קטן כדי שהמשתמש יראה את ההודעה)
      setTimeout(() => {
        router.push("/my-list");
      }, 500);
    } catch (err: any) {
      setError(err.message || "Error adding list");
      setAdding(false);
    }
  };

  return (
    <>
      <button
        className={buttonClassName}
        onClick={handleAddToMyLists}
        disabled={adding}
      >
        {adding ? 'Adding...' : 'Add to My Lists'}
      </button>
      {error && (
        <p className={errorClassName} style={{ color: "red" }}>
          {error}
        </p>
      )}
    </>
  );
}
