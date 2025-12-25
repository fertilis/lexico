"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {QueueType} from "@/domain/Queues";
import {setCurrentQueueType} from "@/redux_state/currentArticleSlice";
import styles from "./page.module.css";
import commonStyles from "@/components/Common.module.css";

export default function MenuPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const menuItems = [
    {label: "Dictionary", href: "/dictionary", queueType: null},
    {label: "Words", queueType: QueueType.WordsCards},
    {label: "Lemmas", queueType: QueueType.Lemmas},
    {label: "Verbs", queueType: QueueType.Verbs},
    {label: "Nouns", queueType: QueueType.Nouns},
    {label: "Adjectives", queueType: QueueType.Adjectives},
    {label: "Adverbs", queueType: QueueType.Adverbs},
    {label: "Other", queueType: QueueType.Other},
  ];

  const handleQueueTypeClick = (queueType: QueueType) => {
    dispatch(setCurrentQueueType(queueType));
    router.push("/article");
  };

  return (
    <nav className={styles.menu_container}>
      {menuItems.map((item, index) => (
        <div key={item.label} className={styles.menu_item_wrapper}>
          {item.queueType === null ? (
            <Link href={item.href!} className={`${commonStyles.button} ${styles.menu_item}`}>
              {item.label}
            </Link>
          ) : (
            <button
              onClick={() => handleQueueTypeClick(item.queueType!)}
              className={`${commonStyles.button} ${styles.menu_item}`}
            >
              {item.label}
            </button>
          )}
          {index < menuItems.length - 1 && <div className={styles.menu_divider} />}
        </div>
      ))}
    </nav>
  );
}

