"use client";
import { useState } from "react";
import { PackItem } from "@/app/types/lists";
import styles from "@/styles/MyLists.module.css";
import { FaTrash, FaPen, FaCheck, FaTimes } from "react-icons/fa";

interface Props {
  items: PackItem[];
  setItems: (items: PackItem[]) => void;
  mode: "view" | "edit";
}

interface Change {
  name: string;
  quantity: number;
  isPacked: boolean;
  shopping: boolean;
}

export function PackItemsEditor({ items, setItems, mode }: Props) {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [changes, setChanges] = useState<Change[]>([]);

  const saveChange = (index: number) => {
    const updated = [...items];
    updated[index].name = editName;
    setItems(updated);
    trackChange(updated[index]);
    setEditIndex(null);
  };

  const trackChange = (item: PackItem) => {
    setChanges((prev) => {
      const filtered = prev.filter((c) => c.name !== item.name); // לא לשכפל
      return [...filtered, { name: item.name, quantity: item.quantity, isPacked: item.isPacked, shopping: item.shopping }];
    });
  };

  const togglePacked = (index: number) => {
    const updated = [...items];
    updated[index].isPacked = !updated[index].isPacked;
    setItems(updated);
    trackChange(updated[index]);
  };

  const toggleShopping = (index: number) => {
    const updated = [...items];
    updated[index].shopping = !updated[index].shopping;
    setItems(updated);
    trackChange(updated[index]);
  };

  const deleteItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    setChanges((prev) => prev.filter((_, i) => i !== index));
  };

  const startEdit = (index: number, name: string) => {
    setEditIndex(index);
    setEditName(name);
  };

  const cancelEdit = () => {
    setEditIndex(null);
  };

  const addItem = () => {
    if (!newItemName.trim()) return;
    const newItem: PackItem = { name: newItemName, isPacked: false, shopping: false, quantity: 1 };
    setItems([...items, newItem]);
    setNewItemName("");
    trackChange(newItem);
  };

  const handleSaveAll = () => {
    if (changes.length > 0) {
      const message = changes
        .map((c) => `${c.name} - Qty: ${c.quantity}, Packed: ${c.isPacked}, Shopping: ${c.shopping}`)
        .join("\n");
      alert("Changes:\n" + message);
      
    } else {
      alert("No changes made");
    }
  };

  return (
    <div>
      <h3 className={styles.itemsHeader}>Items:</h3>
      <ul className={styles.itemsList}>
        {items.map((item, index) => (
          <li key={index} className={styles.itemRow}>
            <input
              type="checkbox"
              className={styles.realCheckbox}
              checked={item.isPacked}
              onChange={() => togglePacked(index)}
            />
            {editIndex === index ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={styles.editInput}
                  autoFocus
                />
                <FaCheck className={styles.iconBtnSmall} onClick={() => saveChange(index)} />
                <FaTimes className={styles.iconBtnSmall} onClick={cancelEdit} />
              </>
            ) : (
              <>
                <span className={styles.itemName}>{item.name}</span>
                {mode === "edit" && (
                  <>
                    <FaPen className={styles.iconBtnSmall} onClick={() => startEdit(index, item.name)} />
                    <FaTrash className={styles.iconBtnSmall} onClick={() => deleteItem(index)} />
                  </>
                )}
              </>
            )}
            <button className={styles.cartIcon} onClick={() => toggleShopping(index)}>
              {item.shopping ? "❌" : "🛒"}
            </button>
          </li>
        ))}
      </ul>

      {mode === "edit" && (
        <div className={styles.addRow}>
          <input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="New item"
            className={styles.addInput}
          />
          <button onClick={addItem} className={styles.addBtn}>+</button>
        </div>
      )}
    </div>
  );
}
