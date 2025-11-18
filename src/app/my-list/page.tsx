"use client";

import { useState } from "react";
import styles from "@/styles/MyList.module.css";

interface Item {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
}

export default function MyListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [quantityValue, setQuantityValue] = useState(1);

  const handleAddItem = () => {
    if (inputValue.trim() === "") return;

    const newItem: Item = {
      id: Date.now().toString(),
      name: inputValue,
      quantity: quantityValue,
      checked: false,
    };

    setItems([...items, newItem]);
    setInputValue("");
    setQuantityValue(1);
  };

  const handleToggleItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleClearCompleted = () => {
    setItems(items.filter((item) => !item.checked));
  };

  const completedCount = items.filter((item) => item.checked).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Shopping List</h1>
        <p className={styles.subtitle}>
          {items.length} items • {completedCount} completed
        </p>
      </div>

      <div className={styles.inputSection}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Add item..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleAddItem();
            }}
            className={styles.input}
          />
          <input
            type="number"
            min="1"
            value={quantityValue}
            onChange={(e) => setQuantityValue(parseInt(e.target.value) || 1)}
            className={styles.quantityInput}
          />
          <button onClick={handleAddItem} className={styles.addButton}>
            Add
          </button>
        </div>
      </div>

      <div className={styles.itemsSection}>
        {items.length === 0 ? (
          <p className={styles.emptyMessage}>Your list is empty. Start adding items!</p>
        ) : (
          <ul className={styles.itemsList}>
            {items.map((item) => (
              <li key={item.id} className={styles.item}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggleItem(item.id)}
                  className={styles.checkbox}
                />
                <span className={`${styles.itemName} ${item.checked ? styles.completed : ""}`}>
                  {item.name}
                </span>
                <span className={styles.quantity}>{item.quantity}x</span>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && completedCount > 0 && (
        <div className={styles.footerSection}>
          <button onClick={handleClearCompleted} className={styles.clearButton}>
            Clear Completed ({completedCount})
          </button>
        </div>
      )}
    </div>
  );
}
