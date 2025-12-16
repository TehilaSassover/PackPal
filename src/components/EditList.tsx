"use client";
import { useState } from "react";
import { PackItem, PackList } from "@/app/types/lists";
import {
  FaTrash,
  FaPen,
  FaCheck,
  FaTimes,
  FaShoppingCart,
} from "react-icons/fa";
import { updateList } from "@/services/myLists";
import { useUserStore } from "@/store/userStore";
import {
  addShoppingListAPI,
  deleteShoppingListAPI,
} from "@/services/shoppingLists";
import styles from "@/styles/EditList.module.css";

interface PackListManagerProps {
  initialList: PackList;
  mode: "view" | "edit";
  onClose?: () => void;
  onSave?: (updatedList: PackList) => void;
}

export default function EditList({
  initialList,
  mode,
  onClose,
  onSave,
}: PackListManagerProps) {
  const [list, setList] = useState({ ...initialList, items: initialList.items });
  const [shoppingList, setShoppingList] = useState<
    { name: string; quantity: number; value: boolean }[]
  >([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const userId = useUserStore((state) => state.user?._id);

  const handleFieldChange = (
    field: "title" | "dateOfTrip" | "description",
    value: string
  ) => {
    if (mode === "edit") setList({ ...list, [field]: value });
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...list.items];
    newItems[index] = { ...newItems[index], name: value };
    setList({ ...list, items: newItems });
  };

  const handleQuantityChange = (index: number, value: number) => {
    const qty = value < 1 ? 1 : value;
    const newItems = [...list.items];
    newItems[index] = { ...newItems[index], quantity: qty };
    setList({ ...list, items: newItems });

    setShoppingList((prev) =>
      prev.map((p) =>
        p.name === newItems[index].name ? { ...p, quantity: qty } : p
      )
    );
  };

  const togglePacked = (index: number) => {
    const newItems = [...list.items];
    newItems[index] = {
      ...newItems[index],
      isPacked: !newItems[index].isPacked,
    };
    setList({ ...list, items: newItems });
  };

  const toggleShopping = (index: number) => {
    const newItems = [...list.items];
    const item = newItems[index];
    const exists = shoppingList.find((p) => p.name === item.name);

    if (exists) {
      setShoppingList((prev) => prev.filter((p) => p.name !== item.name));
    } else {
      setShoppingList((prev) => [
        ...prev,
        { name: item.name, quantity: item.quantity, value: true },
      ]);
    }

    newItems[index] = { ...item, shopping: !item.shopping };
    setList({ ...list, items: newItems });
  };

  const deleteItem = (index: number) => {
    if (mode === "edit") {
      setList({
        ...list,
        items: list.items.filter((_, i) => i !== index),
      });
    }
  };

  const addItem = () => {
    if (mode !== "edit" || !newItemName.trim()) return;
    const newItem: PackItem = {
      name: newItemName,
      quantity: newItemQty,
      isPacked: false,
      shopping: false,
    };
    setList({ ...list, items: [...list.items, newItem] });
    setNewItemName("");
    setNewItemQty(1);
  };

  const handleSave = async () => {
    try {
      const listId = list._id;
      const now = new Date();

      const addItems = shoppingList
        .filter((i) => i.value)
        .map(({ name, quantity }) => ({
          name,
          quantity,
          userId,
          listId,
          createdAt: now,
        }));

      const deleteItems = shoppingList
        .filter((i) => !i.value)
        .map(({ name, quantity }) => ({
          name,
          quantity,
          userId,
          listId,
          createdAt: now,
        }));

      await addShoppingListAPI(addItems);
      await deleteShoppingListAPI(deleteItems);
      await updateList(list._id, list);

      onSave?.(list);
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("There was an error saving the list");
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* ===== כותרת ===== */}
      <div className={styles.titleRow}>
        {isEditingTitle && mode === "edit" ? (
          <>
            <input
              value={list.title}
              onChange={(e) =>
                handleFieldChange("title", e.target.value)
              }
              autoFocus
              className={styles.titleInput}
            />
            <FaCheck
              className={styles.icon}
              onClick={() => setIsEditingTitle(false)}
            />
            <FaTimes
              className={styles.icon}
              onClick={() => setIsEditingTitle(false)}
            />
          </>
        ) : (
          <>
            <h2 className={styles.title}>{list.title}</h2>
            {mode === "edit" && (
              <FaPen
                className={styles.icon}
                onClick={() => setIsEditingTitle(true)}
              />
            )}
          </>
        )}
      </div>

      {/* ===== תאריך ===== */}
      <div className={styles.dateRow}>
        {isEditingDate && mode === "edit" ? (
          <>
            <input
              type="date"
              value={list.dateOfTrip || ""}
              onChange={(e) =>
                handleFieldChange("dateOfTrip", e.target.value)
              }
              className={styles.dateInput}
              autoFocus
            />
            <FaCheck
              className={styles.icon}
              onClick={() => setIsEditingDate(false)}
            />
            <FaTimes
              className={styles.icon}
              onClick={() => setIsEditingDate(false)}
            />
          </>
        ) : (
          <>
            <span>{list.dateOfTrip || "No date"}</span>
            {mode === "edit" && (
              <FaPen
                className={styles.icon}
                onClick={() => setIsEditingDate(true)}
              />
            )}
          </>
        )}
      </div>

      {/* ===== תיאור ===== */}
      <div className={styles.descriptionRow}>
        {isEditingDescription && mode === "edit" ? (
          <>
            <textarea
              value={list.description}
              onChange={(e) =>
                handleFieldChange("description", e.target.value)
              }
              rows={3}
              autoFocus
              className={styles.textareaField}
            />
            <FaCheck
              className={styles.icon}
              onClick={() => setIsEditingDescription(false)}
            />
            <FaTimes
              className={styles.icon}
              onClick={() => setIsEditingDescription(false)}
            />
          </>
        ) : (
          <>
            <p>{list.description || "No description"}</p>
            {mode === "edit" && (
              <FaPen
                className={styles.icon}
                onClick={() => setIsEditingDescription(true)}
              />
            )}
          </>
        )}
      </div>

      {/* ===== כותרת עמודות ===== */}
      <div className={styles.listHeader}>
        <div className={styles.itemCol}>Items</div>
        <div className={styles.qtyCol}>Qty</div>
        <div style={{ width: "40px" }} />
      </div>

      {/* ===== פריטים ===== */}
      <ul className={styles.itemsList}>
        {list.items.map((item, index) => (
          <li key={index} className={styles.item}>
            <div className={styles.itemCol}>
              <button onClick={() => togglePacked(index)}>
                <FaCheck color={item.isPacked ? "red" : "gray"} />
              </button>

              {editIndex === index && mode === "edit" ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                    className={styles.inputField}
                  />
                  <FaCheck
                    className={styles.icon}
                    onClick={() => {
                      handleItemChange(index, editName);
                      setEditIndex(null);
                    }}
                  />
                  <FaTimes
                    className={styles.icon}
                    onClick={() => setEditIndex(null)}
                  />
                </>
              ) : (
                <>
                  <span>{item.name}</span>
                  {mode === "edit" && (
                    <>
                      <FaPen
                        className={styles.icon}
                        onClick={() => {
                          setEditIndex(index);
                          setEditName(item.name);
                        }}
                      />
                      <FaTrash
                        className={styles.icon}
                        onClick={() => deleteItem(index)}
                      />
                    </>
                  )}
                </>
              )}
            </div>

            <div className={styles.qtyCol}>
              {mode === "edit" ? (
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(index, Number(e.target.value))
                  }
                  className={styles.numberInput}
                />
              ) : (
                <span>{item.quantity}</span>
              )}
            </div>

            <button onClick={() => toggleShopping(index)}>
              <FaShoppingCart color={item.shopping ? "red" : undefined} />
            </button>
          </li>
        ))}
      </ul>

      {mode === "edit" && (
        <div className={styles.addItem}>
          <input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="New item"
            className={styles.inputField}
          />
          <input
            type="number"
            min={1}
            value={newItemQty}
            onChange={(e) => setNewItemQty(Number(e.target.value))}
            className={styles.numberInput}
          />
          <button onClick={addItem}>+</button>
        </div>
      )}

      <button className={styles.saveButton} onClick={handleSave}>
        Save
      </button>
    </div>
  );
}
