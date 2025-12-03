"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackItem } from "@/app/types/lists";
import styles from "@/styles/MyLists.module.css";
import { PackItemsEditor } from "@/components/PackItemsEditor";
import { updateList } from "@/services/myLists";


interface EditListFormProps {
  initialList: {
    _id: string;
    title: string;
    dateOfTrip?: string | Date;
    description?: string;
    items?: PackItem[];
  };
  onClose?: () => void;
}

export function EditListForm({ initialList, onClose }: EditListFormProps) {
  const router = useRouter();
  const [editedList, setEditedList] = useState({
    ...initialList,
    items: initialList.items || [],
    dateOfTrip: initialList.dateOfTrip
      ? new Date(initialList.dateOfTrip).toISOString().split("T")[0]
      : "",
    description: initialList.description || "",
  });

  const handleSave = async () => {
    await updateList(editedList._id, editedList);
    if (onClose) onClose();
    else router.push("/my-pack/my-lists");
  };

  return (
    <div className={styles.modalBackdrop} onClick={() => onClose && onClose()}>
      <div className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>Title:</label>
          <input
            type="text"
            value={editedList.title}
            onChange={(e) => setEditedList({ ...editedList, title: e.target.value })}
            style={{ width: "100%", margin: "6px 0", padding: "6px", fontSize: "16px" }}
          />
        </div>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontWeight: "bold", fontSize: "18px" }}>Date:</label>
          <input
            type="date"
            value={editedList.dateOfTrip || ""}
            onChange={(e) => setEditedList({ ...editedList, dateOfTrip: e.target.value })}
            style={{ width: "100%", margin: "6px 0", padding: "6px", fontSize: "16px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontWeight: "bold", fontSize: "18px" }}>Description:</label>
          <textarea
            value={editedList.description}
            onChange={(e) => setEditedList({ ...editedList, description: e.target.value })}
            style={{ width: "100%", margin: "6px 0", padding: "6px", fontSize: "16px" }}
            rows={3}
          />
        </div>

        <PackItemsEditor
          items={editedList.items}
          setItems={(items) => setEditedList({ ...editedList, items })}
          mode="edit"
        />

        <div className={styles.modalButtons} style={{ marginTop: "20px" }}>
          <button className={styles.modalBtn} onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
