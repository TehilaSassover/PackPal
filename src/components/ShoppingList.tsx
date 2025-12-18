"use client";

import { useEffect, useState } from "react";
import { getAllShoppingListAPI } from "@/services/shoppingLists";
import { useUserStore } from "@/store/userStore";
import { ShoppingList } from "@/app/types/lists";
import styles from "@/styles/ShoppingList.module.css";
export default function ShoppingLists() {
  const userId = useUserStore(state => state.user?._id);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);

  useEffect(() => {
    if (!userId) return;

    getAllShoppingListAPI(userId)
      .then((data: ShoppingList[]) => setShoppingLists(data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Shopping Lists{shoppingLists.length > 0 ? ` (${shoppingLists.length})` : ''}</h1>

        {shoppingLists.length === 0 ? (
          <p className={styles.emptyMessage}>אין פריטים להצגה</p>
        ) : (
          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
              </tr>
            </thead>

            <tbody>
              {shoppingLists.map(item => (
                <tr key={item._id.toString()}>
                  <td>{item.name}</td>
                  <td className={styles.quantity}>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
