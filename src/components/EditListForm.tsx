'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackItem } from "@/app/types/lists";
import styles from "../styles/EditListForm.module.css";
import { FaTrash, FaPen, FaShoppingCart, FaCheck, FaTimes } from "react-icons/fa";
import { updateList } from "@/services/myLists"; // ודאי שהשירות קיים

interface EditListFormProps {
  initialList: {
    _id: string;
    title: string;
    dateOfTrip?: string | Date;
    items?: PackItem[];
    description?: string;
  };
  onSave?: (updatedList: any) => void; // אופציונלי למקרה שה-parent צריך לדעת
}
export function EditListForm({ initialList, onSave }: EditListFormProps) {
  const router = useRouter();
  const [editedList, setEditedList] = useState({
    ...initialList,
    items: initialList.items || [],
    dateOfTrip: initialList.dateOfTrip
      ? new Date(initialList.dateOfTrip).toISOString().split("T")[0]
      : "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editItemName, setEditItemName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);
  const [editTitle, setEditTitle] = useState(false);
  // שינוי כותרת
  const handleTitleChange = (e: any) => {
    setEditedList({ ...editedList, title: e.target.value });
  };
  // שינוי תאריך
  const handleDateChange = (e: any) => {
    setEditedList({ ...editedList, dateOfTrip: e.target.value });
  };
  // שינוי פריט קיים
  const handleItemChange = (index: number, value: string) => {
    if (!editedList.items) return;
    const newItems = [...editedList.items];
    newItems[index] = { ...newItems[index], name: value };
    setEditedList({ ...editedList, items: newItems });
  };

  // הוספת פריט חדש
  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const newItem: PackItem = {
      name: newItemName,
      quantity: newItemQty,
      isPacked: false,
      shopping: false,
    };
    setEditedList({
      ...editedList,
      items: [...(editedList.items || []), newItem],
    });
    setNewItemName("");
    setNewItemQty(1);
  };

  // שמירה כללית + ניווט חזרה
  const handleSave = async () => {
    try {
      await updateList(editedList._id, editedList);
      alert("Changes saved successfully")
      router.push("/my-pack/my-lists"); // ניווט חזרה לדף הרשימות
    } catch (err) {
      console.error(err);
      alert("Error saving list");
    }
  };

  // התחלת עריכת פריט
  const startEditing = (index: number, currentName: string) => {
    setEditIndex(index);
    setEditItemName(currentName);
  };

  // שמירה של עריכת פריט
  const saveEdit = (index: number) => {
    handleItemChange(index, editItemName);
    setEditIndex(null);
  };

  // ביטול עריכת פריט
  const cancelEdit = () => {
    setEditIndex(null);
  };

  // מחיקת פריט
  const handleDeleteItem = (index: number) => {
    if (!editedList.items) return;
    const newItems = editedList.items.filter((_, i) => i !== index);
    setEditedList({ ...editedList, items: newItems });
  };

  return (
    <div className={styles.card}>
      {/* TITLE */}
      <div className={styles.titleRow}>
        {editTitle ? (
          <input
            className={styles.titleInput}
            value={editedList.title}
            onChange={handleTitleChange}
            autoFocus
          />
        ) : (
          <span>{editedList.title}</span>
        )}
        <FaPen
          className={styles.icon}
          onClick={() => setEditTitle(!editTitle)}
        />
      </div>

      {/* DATE */}
      <div className={styles.dateRow}>
        <label>Date:</label>
        <input
          type="date"
          className={styles.dateInput}
          value={editedList.dateOfTrip || ""}
          onChange={handleDateChange}
        />
      </div>

      <h3 className={styles.subtitle}>Items:</h3>

      <ul className={styles.itemsList}>
        {(editedList.items || []).map((item: PackItem, index: number) => (
          <li key={index} className={styles.listItem}>
            {editIndex === index ? (
              <>
                <input
                  value={editItemName}
                  onChange={(e) => setEditItemName(e.target.value)}
                  className={styles.editInput}
                  autoFocus
                />
                <FaCheck
                  className={styles.smallIcon}
                  onClick={() => saveEdit(index)}
                  title="Save"
                />
                <FaTimes
                  className={styles.smallIcon}
                  onClick={cancelEdit}
                  title="Cancel"
                />
              </>
            ) : (
              <>
                {/* אייקון עגלה או הסרה מהעגלה */}
                {item.shopping ? (
                  <FaTimes
                    className={styles.cartIcon}
                    onClick={() => {
                      const newItems = [...editedList.items];
                      newItems[index] = { ...item, shopping: false };
                      setEditedList({ ...editedList, items: newItems });
                    }}
                    title="Remove from cart"
                  />
                ) : (
                  <FaShoppingCart
                    className={styles.cartIcon}
                    onClick={() => {
                      const newItems = [...editedList.items];
                      newItems[index] = { ...item, shopping: true };
                      setEditedList({ ...editedList, items: newItems });
                    }}
                    title="Add to cart"
                  />
                )}

                <span>{item.name}</span>

                <FaPen
                  className={styles.smallIcon}
                  onClick={() => startEditing(index, item.name)}
                />
                <FaTrash
                  className={styles.smallIcon}
                  onClick={() => handleDeleteItem(index)}
                />
              </>
            )}
          </li>
        ))}
      </ul>

      {/* הוספת פריט חדש */}
      <div className={styles.addRow}>
        <input
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Item"
          className={styles.addInput}
        />
        <input
          type="number"
          value={newItemQty}
          onChange={(e) => setNewItemQty(Number(e.target.value))}
          className={styles.qtyInput}
        />
        <button onClick={handleAddItem} className={styles.addBtn}>
          +
        </button>
      </div>

      <button onClick={handleSave} className={styles.saveBtn}>
        SAVE
      </button>
    </div>
  );
}
