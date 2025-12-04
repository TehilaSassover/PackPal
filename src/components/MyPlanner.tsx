"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { getUserLists } from "@/services/myLists";
import { PackList } from "@/app/types/lists";
import styles from "@/styles/MyPlanner.module.css";

export default function MyPlanner() {
    const user = useUserStore((state) => state.user);
    const router = useRouter();

    const [lists, setLists] = useState<PackList[]>([]);
    const [loading, setLoading] = useState(true);

    // ⭐ Today
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getUserLists(user._id);
                setLists(data);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (!user) return <div>Redirecting...</div>;
    if (loading) return <div>Loading calendar...</div>;

    // ⭐ Map dates
    const calendarMap: Record<string, PackList[]> = {};
    lists.forEach((list) => {
        if (!list.dateOfTrip) return;
        const date = new Date(list.dateOfTrip);
        if (isNaN(date.getTime())) return;

        const dateKey = date.toISOString().split("T")[0];
        if (!calendarMap[dateKey]) calendarMap[dateKey] = [];
        calendarMap[dateKey].push(list);
    });

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    // ⭐ Build cells
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);

    for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
            2,
            "0"
        )}-${String(d).padStart(2, "0")}`;

        cells.push({
            day: d,
            dateKey,
            lists: calendarMap[dateKey] || [],
            isToday: dateKey === todayKey
        });
    }

    // ⭐ Month navigation
    const goToPrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((prev) => prev - 1);
        } else {
            setCurrentMonth((prev) => prev - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((prev) => prev + 1);
        } else {
            setCurrentMonth((prev) => prev + 1);
        }
    };

    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    return (
        <div className={styles.calendarWrapper}>

            {/* ⭐ Month Header */}
            <div className={styles.monthNav}>
                <button onClick={goToPrevMonth} className={styles.navBtn}>←</button>
                <h2 className={styles.monthLabel}>
                    {monthNames[currentMonth]} {currentYear}
                </h2>
                <button onClick={goToNextMonth} className={styles.navBtn}>→</button>
            </div>

            {/* ⭐ Grid */}
            <div className={styles.grid}>
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                    <div key={d} className={styles.weekday}>{d}</div>
                ))}

                {cells.map((cell, i) =>
                    !cell ? (
                        <div key={i} className={styles.empty}></div>
                    ) : (
                        <div
                            key={i}
                            className={`
                                ${styles.dayCell}
                                ${cell.lists.length ? styles.hasEvent : ""}
                                ${cell.isToday ? styles.today : ""}
                            `}
                        >
                            <span className={styles.dateNum}>{cell.day}</span>

                            {cell.lists.length > 0 && (
                                <div className={styles.eventsList}>
                                    {cell.lists.map((trip) => (
                                        <div
                                            key={trip._id}
                                            className={styles.eventItem}
                                            onClick={() =>
                                                router.push(`/my-pack/my-lists/${trip._id}`)
                                            }
                                        >
                                            {trip.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
