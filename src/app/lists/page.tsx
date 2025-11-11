"use client";

import { useEffect, useState } from "react";

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Lists</h1>
      {lists.map((list) => (
        <div key={list._id} style={{ marginBottom: "2rem" }}>
          <h2>{list.name}</h2>
          <ul>
            {list.defaultItems.map((item, index) => (
              <li key={index}>
                {item.name} (Quantity: {item.quantity})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
