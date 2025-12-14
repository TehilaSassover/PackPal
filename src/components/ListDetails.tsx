'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AddToMyListButton from '@/components/AddToMyListButton';
import styles from '@/styles/ListDetail.module.css';
import { getListById } from '@/services/lists';
import { List } from '@/app/types/lists';
import { openListAloneApi } from '@/services/myLists';
interface ListDetailsProps {
    listId: string;
    source?: 'list' | 'my-lists';
}
export default function ListDetails({ listId, source }: ListDetailsProps) {
    const router = useRouter();
    const [list, setList] = useState<List | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (!listId) return;
        const fetchList = async () => {
            try {
                let data: List;
                if (source === 'list') {
                    data = await getListById(listId);
                }
                else {
                    data = await openListAloneApi(listId);
                    data.items = data.items?.map((item: any) => ({
                        ...item,
                        qty: item.quantity,
                    }));
                }
                setList(data);
                console.log("Fetched list data:", data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchList();
    }, []);

    if (loading) return <div className={styles.container}>Loading...</div>;
    if (error) return <div className={styles.container}>Error: {error}</div>;
    if (!list) return <div className={styles.container}>List not found</div>;
    const itemsToShow = (list.items?.length ? list.items : list.defaultItems) ?? [];
    console.log("Items to show:", itemsToShow);
    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={() => router.back()}>
                ← Back
            </button>

            <div className={styles.content}>
                <h1 className={styles.title}>{list.name}</h1>

                <div className={styles.itemsSection}>
                    <h2>Items ({itemsToShow.length})</h2>

                    {(itemsToShow.length === 0) ? (
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
                                {itemsToShow.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td className={styles.quantity}>{item.qty}</td>
                                    </tr>
                                ))}
                            </tbody>
                            </table>)}
                </div>
                {source === 'list' && (
                    <div className={styles.actionSection}>
                        <AddToMyListButton
                            listId={list._id}
                            buttonClassName={styles.addButton}
                            errorClassName={styles.errorMessage}
                            variant="detail"/>
                    </div>
                )}
            </div>
        </div>);
}
