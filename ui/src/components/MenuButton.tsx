"use client";

import {usePathname, useRouter} from "next/navigation";
import styles from "./MenuButton.module.css";
import commonStyles from "./Common.module.css";

export default function MenuButton() {
  const pathname = usePathname();
  const router = useRouter();
  const isMenuOpen = pathname === "/menu";

  const handleClick = () => {
    if (isMenuOpen) {
      // If menu is open, go back to previous page or home
      router.back();
    } else {
      // Navigate to menu
      router.push("/menu");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${commonStyles.button} ${styles.menu_button}`}
      aria-label="Toggle menu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
        className={commonStyles.button_icon}
      >
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
      </svg>
    </button>
  );
}

