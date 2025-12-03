"use client";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTrash, FaExternalLinkAlt, FaEdit } from "react-icons/fa";
import styles from "@/styles/MyLists.module.css";
import { getUserLists, updateList } from "@/services/myLists";
import { PackList } from "@/app/types/lists";
import { PackItemsEditor } from "@/components/PackItemsEditor";

export default function MyLists() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [lists, setLists] = useState<PackList[]>([]);
  const [selectedList, setSelectedList] = useState<PackList | null>(null);
  const [editedList, setEditedList] = useState<PackList | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserLists(user._id).then(setLists);
  }, []);

  async function saveListChanges() {
    if (!editedList) return;
    await updateList(editedList._id, editedList);
    setLists((prev) => prev.map((l) => (l._id === editedList._id ? editedList : l)));
    setSelectedList(null);
    setEditedList(null);
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
        <div className={styles.modalBackdrop} onClick={() => setSelectedList(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h1 className={styles.modalTitle}>{editedList.title}</h1>
            <p className={styles.modalDate}>{new Date(editedList.dateOfTrip).toLocaleDateString()}</p>
            <PackItemsEditor
              items={editedList.items}
              setItems={(items) => setEditedList({ ...editedList, items })}
              mode="view"
            />

            <div className={styles.modalButtons}>
              <button className={styles.modalBtn} onClick={saveListChanges}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
