"use client";

import { useState, useEffect } from "react";
import { useMenuStore } from "@/store/menuStore";

export default function UsagePreview() {
  const images = ["/demo1.png", "/demo2.png", "/demo3.png"];
  const [index, setIndex] = useState(0);

  const openMenu = useMenuStore((state) => state.open); // 👈 מוסיפים את זה

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <img
        src={images[index]}
        style={{ width: "100%", cursor: "pointer" }}
        onClick={openMenu} // 👈 קריאה לפתיחה כמו שאת רוצה
      />
    </div>
  );
}
