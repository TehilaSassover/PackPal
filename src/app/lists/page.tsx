"use client";

import { useEffect, useState } from "react";
import ListCard from "@/components/ListCard";
import ListSidePanel from "@/components/ListSidePanel";
import styles from "@/styles/List.module.css";

interface Item {
  name: string;
  quantity: number;
}

interface List {
  _id: string;
  name: string;
  defaultItems: Item[];
}

export default function ListsPage() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [addedToMyLists, setAddedToMyLists] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/lists")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch lists");
        return res.json();
      })
      .then((data) => {
        setLists(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const selectedList = lists.find((list) => list._id === selectedListId) || null;

  const handleSelectList = (listId: string) => {
    if (selectedListId !== listId) {
      setSelectedListId(listId);
      setIsPanelOpen(true);
    } else if (!isPanelOpen) {
      setIsPanelOpen(true);
    }
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedListId(null);
  };

  const handleAddToMyLists = (listId: string) => {
    setAddedToMyLists((prev) => {
      const updated = new Set(prev);
      updated.add(listId);
      return updated;
    });
  };

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (error)
    return <div className={styles.container}>Error: {error}</div>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <h1>Lists</h1>
        <div className={styles.listGrid}>
          {lists.map((list) => (
            <ListCard
              key={list._id}
              id={list._id}
              name={list.name}
              itemCount={list.defaultItems.length}
              isSelected={selectedListId === list._id}
              onSelect={() => handleSelectList(list._id)}
            />
          ))}
        </div>
      </div>

      <ListSidePanel
        list={selectedList}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onAddToMyLists={handleAddToMyLists}
      />
    </div>
  );
}
