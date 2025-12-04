"use client";
import { useEffect, useState } from "react";
import { getAllShoppingListAPI } from "@/services/shoppingLists";
import { useUserStore } from "@/store/userStore";
import ShoppingItem from "@/components/ShoppingItem";
import {ShoppingList } from "@/app/types/lists";

export default function ShoppingListsPage() {
  const userId = useUserStore(state => state.user?._id);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);

  useEffect(() => {
    if (!userId) return;

    getAllShoppingListAPI(userId)
      .then((data:ShoppingList[]) => {setShoppingLists(data);})
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Shopping Lists</h1>
      {shoppingLists.map(list => (
        <ShoppingItem key={list._id.toString()} name={list.name} quantity={list.quantity} />
      ))}
    </div>
  );
}
