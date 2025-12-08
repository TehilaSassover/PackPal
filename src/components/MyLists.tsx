"use client";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { FaTrash, FaExternalLinkAlt, FaEdit } from "react-icons/fa";
import styles from "@/styles/MyLists.module.css";
import { deleteListByIdAPI, getUserLists } from "@/services/myLists";
import { PackList } from "@/app/types/lists";
import EditList from "./EditList";
export default function MyLists() {
  const user = useUserStore((state) => state.user);
  const [lists, setLists] = useState<PackList[]>([]);
  const [selectedList, setSelectedList] = useState<PackList | null>(null);
  const [editedList, setEditedList] = useState<PackList | null>(null);
  const [mode, setMode] = useState<"view" | "edit">("view");
  useEffect(() => {
    if (!user) return;
    getUserLists(user._id).then(setLists);
  }, []);
  const saveListChanges = (updatedList: PackList) => {
    setLists((prev) =>
      prev.map((l) => (l._id === updatedList._id ? updatedList : l))
    );
    setSelectedList(null);
    setEditedList(null);
  };
  const deleteList = (listId:string) => {
    alert(`Delete list with id: ${listId} (functionality not implemented)`);
    deleteListByIdAPI(listId).then(() => {
      setLists((prev) => prev.filter((l) => l._id !== listId));
    }).catch
    (error => {
      console.error("Failed to delete list:", error);
    });
  };
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
                setMode("view");
              }}>
              {list.title}
            </span>
            <div className={styles.actions}>
              <button type="button" className={styles.iconBtn} onClick={() => deleteList(list._id)}
>
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
                  setMode("edit");
                }}>
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
          }}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}>
            <EditList
              initialList={editedList}
              mode={mode}
              onClose={() => {
                setSelectedList(null);
                setEditedList(null);
              }}
              onSave={saveListChanges}/>
          </div>
        </div>
      )}
    </div>
  );
}
