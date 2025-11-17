"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTrash, FaExternalLinkAlt, FaEdit } from "react-icons/fa";
import styles from "@/styles/MyLists.module.css";

interface Item {
  name: string;
  quantity: number;
  shopping: boolean;
  isPacked: boolean;
}

interface List {
  _id: string;
  title: string;
  description: string;
  dateOfTrip: string;
  items: Item[];
}

export default function MyLists() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [editedList, setEditedList] = useState<List | null>(null);

  // Fetch lists
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function fetchLists() {
      try {
        const res = await fetch(`/api/myLists?userId=${user._id}`);
        if (!res.ok) throw new Error("Failed to fetch lists");

        const data = await res.json();
        setLists(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLists();
  }, [user, router]);

  if (!user) return <div>Redirecting to login...</div>;
  if (loading) return <div>Loading your lists...</div>;
  if (error) return <div>Error: {error}</div>;

  // Save changes to MongoDB
  async function saveListChanges() {
    if (!editedList) return;

    const res = await fetch(`/api/lists/${editedList._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedList),
    });

    if (res.ok) {
      setLists((prev) =>
        prev.map((l) => (l._id === editedList._id ? editedList : l))
      );

      setSelectedList(null);
      setEditedList(null);
    } else {
      alert("Error saving list");
    }
  }

  return (
    <div className={styles.wrapper}>
      {lists.map((list) => (
        <div key={list._id} className={styles.card}>
          <div className={styles.header}>
            <span
              className={styles.titleTag}
              onClick={() => {
                setSelectedList(list);
                setEditedList(JSON.parse(JSON.stringify(list))); // deep copy
              }}
              style={{ cursor: "pointer" }}>
              {list.title}
            </span>
            <div className={styles.actions}>
              <button className={styles.iconBtn}><FaTrash /></button>
              <button className={styles.iconBtn}><FaExternalLinkAlt /></button>
              <button className={styles.iconBtn}><FaEdit /></button>
            </div>
          </div>
        </div>
      ))}
      {selectedList && editedList && (
        <div
          className={styles.modalBackdrop}
          onClick={() => {
            setSelectedList(null);
            setEditedList(null);
          }}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className={styles.modalTitle}>{editedList.title}</h1>

            <p className={styles.modalDate}>
              <strong>
                {new Date(editedList.dateOfTrip).toLocaleDateString()}
              </strong>
            </p>

            <p className={styles.modalDescription}>{editedList.description}</p>

            <h3 className={styles.itemsHeader}>Items:</h3>

            <ul className={styles.itemsList}>
              {editedList.items.map((item, index) => (
                <li key={index} className={styles.itemRow}>
                  
                  {/* REAL checkbox */}
                  <input
                    type="checkbox"
                    checked={item.isPacked}
                    onChange={() => {
                      const updated = { ...editedList };
                      updated.items[index].isPacked =
                        !updated.items[index].isPacked;
                      setEditedList(updated);
                    }}
                    className={styles.realCheckbox}
                  />

                  <span>{item.name}</span>

                  {/* cart bubble — only when NOT shopping */}
                  {!item.shopping && (
                    <div className={styles.cartIcon}>🛒</div>
                  )}
                </li>
              ))}
            </ul>
            <div className={styles.modalButtons}>
              <button className={styles.modalBtn}>Edit List</button>

              <button
                className={styles.modalBtn}
                onClick={saveListChanges}>
                Save List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
