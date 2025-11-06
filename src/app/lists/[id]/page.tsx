'use client';
import ListCard from "@/components/ListCard";
import { useParams, useRouter } from "next/navigation";

export default function CategoryPage() {
  const router = useRouter(); // מוסיף את ההוק לניווט
  const { id } = useParams();
  const decodedId = decodeURIComponent(id as string);
  return (
    <div style={{ padding: "20px" }}>
      <h1>Category: {decodedId}</h1>   
      {/* כאן תציגי את הרשימות של אותה קטגוריה */}
      <button
        onClick={() => router.back()} // ← יחזור דף אחד אחורה
        style={{
          marginTop: "20px",
          padding: "8px 16px",
          borderRadius: "8px",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ccc",
          cursor: "pointer"
        }}
      >
        ←back
      </button>
      <ListCard category={decodedId}/>
    </div>
  );
}
