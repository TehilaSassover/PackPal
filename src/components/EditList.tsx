"use client";
import { useState } from "react";
import { PackItem, PackList } from "@/app/types/lists";
import { FaTrash, FaPen, FaCheck, FaTimes } from "react-icons/fa";
import { updateList } from "@/services/myLists";
import { useUserStore } from "@/store/userStore";
import { addShoppingListAPI, deleteShoppingListAPI } from "@/services/shoppingLists";
import styles from "@/styles/EditList.module.css";
interface PackListManagerProps {
  initialList: PackList;
  mode: "view" | "edit";
  onClose?: () => void;
  onSave?: (updatedList: PackList) => void; // ✅ callback להורה

}
export default function EditList({ initialList, mode, onClose,onSave }: PackListManagerProps) {
  const [list, setList] = useState({ ...initialList, items: initialList.items, });
  const [shoppingList, setShoppingList] = useState<{ name: string; quantity: number, value: boolean }[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);
  const userId = useUserStore((state) => state.user?._id);
  const handleFieldChange = (field: "title" | "dateOfTrip" | "description", value: string) => {
    if (mode === "edit") { setList({ ...list, [field]: value }); }
  };
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...list.items];
    newItems[index] = { ...newItems[index], name: value };
    setList({ ...list, items: newItems });
  };
  const handleQuantityChange = (index: number, value: number) => {
    const newQty = value < 1 ? 1 : value;
    const newItems = [...list.items];
    newItems[index] = { ...newItems[index], quantity: newQty, };
    setList({ ...list, items: newItems });
    setShoppingList((prev) =>
      prev.map((p) => p.name === newItems[index].name ? { ...p, quantity: newQty } : p)
    );
  };
  const togglePacked = (index: number) => {
    const newItems = [...list.items];
    newItems[index] = { ...newItems[index], isPacked: !newItems[index].isPacked, };
    setList({ ...list, items: newItems });
  };
  const toggleShopping = (index: number) => {
    const newItems = [...list.items];
    const item = newItems[index];
    const exists = shoppingList.find((p) => p.name === item.name);
    if (exists) { setShoppingList((prev) => prev.filter((p) => p.name !== item.name)); }
    else {
      setShoppingList((prev) => [...prev, { name: item.name, quantity: item.quantity, value: !item.shopping }]);
    }
    newItems[index] = { ...item, shopping: !item.shopping, };
    setList({ ...list, items: newItems });
  };
  const deleteItem = (index: number) => {
    if (mode === "edit") {
      const newItems = list.items.filter((_, i) => i !== index);
      setList({ ...list, items: newItems });
    }
  };
  const addItem = () => {
    if (mode !== "edit" || !newItemName.trim()) return;
    const newItem: PackItem = { name: newItemName, isPacked: false, shopping: false, quantity: newItemQty, };
    setList({ ...list, items: [...list.items, newItem] });
    setNewItemName("");
    setNewItemQty(1);
  };
  const handleSave = async () => {
    try {
      const listId = list._id;
      const now = new Date();
      const deleteItemForShopping = shoppingList
        .filter(item => !item.value)
        .map(({ name, quantity }) => ({ name, quantity, userId, listId, createdAt: now, }));
      const addShoppingList = shoppingList
        .filter(item => item.value)
        .map(({ name, quantity }) => ({ name, quantity, userId, listId, createdAt: now, }));
      await addShoppingListAPI(addShoppingList);
      await deleteShoppingListAPI(deleteItemForShopping);
      await updateList(list._id, list);
  if (onSave) onSave(list); // שולחים את הרשימה המעודכנת להורה

      console.log("Shopping list updated successfully.");
      if (onClose) onClose();
    } catch (error) {
      console.error("Error preparing shopping list:", error);
      alert("There was an error saving the list. Please try again.");
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        {mode === "edit" ? (
          <> <input type="text" value={list.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            placeholder="Title"
            className={styles.inputField} />
            <input type="date" value={list.dateOfTrip || ""}
              onChange={(e) => handleFieldChange("dateOfTrip", e.target.value)}
              className={styles.inputField} />
            <textarea value={list.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Description"
              rows={3}
              className={styles.textareaField} />
          </>
        ) : (<>
          <h2>{list.title}</h2>
          <p>{list.dateOfTrip}</p>
          <p>{list.description}</p></>
        )}
      </div>
      <h3>Items:</h3>
      <ul className={styles.itemsList}>
        {list.items.map((item, index) => (
          <li key={index} className={styles.item}>
            <input type="checkbox" checked={item.isPacked} onChange={() => togglePacked(index)} />
            {editIndex === index && mode === "edit" ? (
              <>
                <input value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                    handleItemChange(index, e.target.value);
                  }}
                  autoFocus
                  className={styles.inputField} />
                <FaCheck style={{ cursor: "pointer" }} />
                <FaTimes style={{ cursor: "pointer" }} />
              </>
            ) : (
              <>
                <span>{item.name}</span>
                {mode === "edit" && (
                  <>
                    <FaPen onClick={() => { setEditIndex(index); setEditName(item.name); }} style={{ cursor: "pointer" }} />
                    <FaTrash onClick={() => deleteItem(index)} style={{ cursor: "pointer" }} />
                  </>
                )}
              </>
            )}
            {mode === "edit" ? (
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                className={styles.numberInput}
              />
            ) : (
              <span>Qty: {item.quantity}</span>
            )}
            <button onClick={() => toggleShopping(index)}>{item.shopping ? "❌" : "🛒"}</button>
          </li>
        ))}
      </ul>
      {mode === "edit" && (
        <div className={styles.addItem}>
          <input value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="New item"
            className={styles.inputField} />
          <input type="number"
            min={1}
            value={newItemQty}
            onChange={(e) => setNewItemQty(Number(e.target.value))}
            className={styles.numberInput} />
          <button onClick={addItem}>+</button>
        </div>
      )}
      <button className={styles.saveButton} onClick={handleSave}>Save</button>
    </div>
  );
}
