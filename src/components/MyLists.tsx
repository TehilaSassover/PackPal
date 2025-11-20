"use client";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTrash, FaExternalLinkAlt, FaEdit } from "react-icons/fa";
import styles from "@/styles/MyLists.module.css";
import { getUserLists, updateList } from "@/services/myLists";
import { PackList } from "@/app/types/lists";


export default function MyLists() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const [lists, setLists] = useState<PackList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedList, setSelectedList] = useState<PackList | null>(null);
  const [editedList, setEditedList] = useState<PackList | null>(null);
  const [mode, setMode] = useState<"view" | "edit" | null>(null);

  // Fetch lists
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function fetchLists() {
      try {
        const data = await getUserLists(user._id);
        console.log(data);

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

    try {
      await updateList(editedList._id, editedList);

      setLists((prev) =>
        prev.map((l) => (l._id === editedList._id ? editedList : l))
      );

      setSelectedList(null);
      setEditedList(null);
      setMode(null);
    } catch (err) {
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
                setEditedList(structuredClone(list));
                setMode("view"); // מצב סימון בלבד
              }}
              style={{ cursor: "pointer" }}
            >
              {list.title}
            </span>
            <div className={styles.actions}>
              <button className={styles.iconBtn}><FaTrash /></button>
              <button className={styles.iconBtn}><FaExternalLinkAlt /></button>
              <button
                className={styles.iconBtn}
                onClick={() => router.push(`/my-pack/my-lists/edit/${list._id}`)}
              >
                <FaEdit />
              </button>
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
            setMode(null);
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
                  {/* Checkbox */}
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

                  {/* עגלת קניות */}
                  <button
                    onClick={() => {
                      const updated = { ...editedList };
                      updated.items[index].shopping = !updated.items[index].shopping;
                      setEditedList(updated);
                    }}
                    style={{
                      marginLeft: "auto",
                      fontSize: "18px",
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                    }}
                  >
                    {item.shopping ? "❌" : "🛒"}
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.modalButtons}>
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