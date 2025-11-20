'use client';

import { useState } from "react";
import { PackItem } from "@/app/types/lists";
import styles from "../styles/EditListForm.module.css";
import { FaTrash, FaPen, FaShoppingCart } from "react-icons/fa";

export function EditListForm({ initialList }: any) {
  const [editedList, setEditedList] = useState(initialList);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);

  const handleTitleChange = (e: any) => {
    setEditedList({ ...editedList, title: e.target.value });
  };

  const handleItemChange = (index: number, field: keyof PackItem, value: any) => {
    const newItems = [...editedList.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditedList({ ...editedList, items: newItems });
  };

  const handleSave = async () => {
    alert("Saved!");
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;

    const newItem: PackItem = {
      name: newItemName,
      quantity: newItemQty,
      isPacked: false,
      shopping: false, // ⬅️ הוספנו
    };


    setEditedList({
      ...editedList,
      items: [...editedList.items, newItem],
    });

    setNewItemName("");
    setNewItemQty(1);
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>
        {editedList.title} <FaPen className={styles.icon} />
      </h1>

      <p className={styles.dateRow}>
        Date <FaPen className={styles.icon} />
      </p>

      <h3 className={styles.subtitle}>Add Items:</h3>

      <ul className={styles.itemsList}>
        {editedList.items.map((item: PackItem, index: number) => (
          <li key={index} className={styles.listItem}>
            <FaShoppingCart className={styles.cartIcon} />

            {editIndex === index ? (
              <input
                value={item.name}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
                className={styles.editInput}
              />
            ) : (
              <span>{item.name}</span>
            )}

            <FaPen
              className={styles.smallIcon}
              onClick={() => setEditIndex(index)}
            />
            <FaTrash
              className={styles.smallIcon}
              onClick={() => {
                const newItems = editedList.items.filter((item: PackItem, i: number) => i !== index);
                setEditedList({ ...editedList, items: newItems });
              }}
            />
          </li>
        ))}
      </ul>

      {/* Add item section */}
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
