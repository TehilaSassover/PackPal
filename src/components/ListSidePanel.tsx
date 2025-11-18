'use client';
import { useRouter } from "next/navigation";
import styles from "../styles/ListSidePanel.module.css";

interface Item {
  name: string;
  quantity: number;
}

interface List {
  _id: string;
  name: string;
  defaultItems: Item[];
}

interface ListSidePanelProps {
  list: List | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToMyLists: (listId: string) => void;
}

export default function ListSidePanel({
  list,
  isOpen,
  onClose,
  onAddToMyLists,
}: ListSidePanelProps) {
  const router = useRouter();

  if (!list) return null;

  const handleNavigateToList = () => {
    router.push(`/lists/${list._id}`);
  };

  const handleAddToMyLists = () => {
    onAddToMyLists(list._id);
  };

  return (
    <div className={`${styles.panel} ${isOpen ? styles.open : ""}`}>
      <div className={styles.topBar}>
        <h2 className={styles.title}>{list.name}</h2>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>


      {/* אזור הגלילה */}
      <div className={styles.itemsScrollArea}>
        <div className={styles.itemsList}>
          <h4>Items ({list.defaultItems.length})</h4>
          <ul>
            {list.defaultItems.map((item, index) => (
              <li key={index}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemQty}>qty: {item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.actionsSticky}>
        <button className={styles.addButton} onClick={handleAddToMyLists}>
          Add to My Lists
        </button>

        <button className={styles.viewButton} onClick={handleNavigateToList}>
          View Full List
        </button>
      </div>
    </div>
  );
}
