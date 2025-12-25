"use client";

import Link from "next/link";
import {QueueType} from "@/domain/Queues";
import styles from "./page.module.css";
import commonStyles from "@/components/Common.module.css";

export default function MenuPage() {
  const menuItems = [
    {label: "Dictionary", href: "/dictionary", queueType: null},
    {label: "Words", href: `/article/${QueueType.WordsCards}`, queueType: QueueType.WordsCards},
    {label: "Lemmas", href: `/article/${QueueType.Lemmas}`, queueType: QueueType.Lemmas},
    {label: "Verbs", href: `/article/${QueueType.Verbs}`, queueType: QueueType.Verbs},
    {label: "Nouns", href: `/article/${QueueType.Nouns}`, queueType: QueueType.Nouns},
    {label: "Adjectives", href: `/article/${QueueType.Adjectives}`, queueType: QueueType.Adjectives},
    {label: "Adverbs", href: `/article/${QueueType.Adverbs}`, queueType: QueueType.Adverbs},
    {label: "Other", href: `/article/${QueueType.Other}`, queueType: QueueType.Other},
  ];

  return (
    <nav className={styles.menu_container}>
      {menuItems.map((item, index) => (
        <div key={item.href} className={styles.menu_item_wrapper}>
          <Link href={item.href} className={`${commonStyles.button} ${styles.menu_item}`}>
            {item.label}
          </Link>
          {index < menuItems.length - 1 && <div className={styles.menu_divider} />}
        </div>
      ))}
    </nav>
  );
}

