"use client";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { FaTrash, FaExternalLinkAlt, FaEdit } from "react-icons/fa";
import styles from "@/styles/MyLists.module.css";
import { getUserLists, updateList } from "@/services/myLists";
import { PackList } from "@/app/types/lists";
import EditList from "./EditList";

export default function MyLists() {
  const user = useUserStore((state) => state.user);
  const [lists, setLists] = useState<PackList[]>([]);
  const [selectedList, setSelectedList] = useState<PackList | null>(null);
  const [editedList, setEditedList] = useState<PackList | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserLists(user._id).then(setLists);
  }, [user]);

  async function saveListChanges() {
    if (!editedList) return;
    try {
      await updateList(editedList._id, editedList);
      setLists((prev) =>
        prev.map((l) => (l._id === editedList._id ? editedList : l))
      );
      // סוגרים את המודאל
      setSelectedList(null);
      setEditedList(null);
    } catch (error) {
      console.error("Error saving list:", error);
      alert("There was an error saving the list. Please try again.");
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
              }}
            >
              {list.title}
            </span>
            <div className={styles.actions}>
              <button type="button" className={styles.iconBtn}>
                <FaTrash />
              </button>
              <button type="button" className={styles.iconBtn}>
                <FaExternalLinkAlt />
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => {
                  setSelectedList(list);
                  setEditedList(structuredClone(list));
                }}
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
          }}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <EditList
              initialList={editedList}
              mode="edit"
              onClose={() => {
                setSelectedList(null);
                setEditedList(null);
              }}
            />
            <div className={styles.modalButtons}>
              <button
                className={styles.modalBtn}
                type="button"
                onClick={saveListChanges}
              >
                Save
              </button>
              <button
                className={styles.modalBtn}
                type="button"
                onClick={() => {
                  setSelectedList(null);
                  setEditedList(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
