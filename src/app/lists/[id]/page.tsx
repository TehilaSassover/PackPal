'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '@/styles/ListDetail.module.css';

interface Item {
  name: string;
  quantity: number;
}

interface List {
  _id: string;
  name: string;
  defaultItems: Item[];
}

export default function ListDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;

    const listId = Array.isArray(id) ? id[0] : id;

    fetch(`/api/lists/${listId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch list: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setList(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToMyLists = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading)
    return <div className={styles.container}>Loading...</div>;
  if (error)
    return <div className={styles.container}>Error: {error}</div>;
  if (!list)
    return <div className={styles.container}>List not found</div>;

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => router.back()}>
        ← Back
      </button>

      <div className={styles.content}>
        <h1 className={styles.title}>{list.name}</h1>

        <div className={styles.itemsSection}>
          <h2>Items ({list.defaultItems.length})</h2>
          {list.defaultItems.length === 0 ? (
            <p className={styles.emptyMessage}>No items in this list</p>
          ) : (
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {list.defaultItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td className={styles.quantity}>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.actionSection}>
          <button
            className={`${styles.addButton} ${added ? styles.added : ''}`}
            onClick={handleAddToMyLists}
            disabled={added}
          >
            {added ? '✓ Added to My Lists' : 'Add to My Lists'}
          </button>
        </div>
      </div>
    </div>
  );
}
