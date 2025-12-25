"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useInitializeState, useReinitializeState} from "@/hooks/useInitializeState";
import {isStateInitialized} from "@/domain/utils";
import commonStyles from "@/components/Common.module.css";
import styles from "./page.module.css";

export default function DictionaryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const initializeState = useInitializeState();
  const reinitializeState = useReinitializeState();
  const [isInitialized, setIsInitialized] = useState(isStateInitialized());

  useEffect(() => {
    setIsInitialized(isStateInitialized());
  }, []);

  const handleInitialize = async () => {
    setIsLoading(true);
    try {
      await initializeState();
      setIsInitialized(isStateInitialized());
      router.push("/");
    } catch (error) {
      console.error("Failed to load database:", error);
      setIsLoading(false);
    }
  };

  const handleReinitialize = async () => {
    setIsLoading(true);
    try {
      await reinitializeState();
      setIsInitialized(isStateInitialized());
      router.push("/");
    } catch (error) {
      console.error("Failed to reload database:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.dictionary_container}>
        <div className={commonStyles.message}>Loading database...</div>
      </div>
    );
  }

  return (
    <div className={styles.dictionary_container}>
      <div className={styles.welcome_text}>
        Welcome to Lexico!
      </div>
      {isInitialized ? (
        <>
          <button
            onClick={handleReinitialize}
            className={`${commonStyles.button} ${commonStyles.boxed_button}`}
          >
            Reload database
          </button>
          <button
            onClick={() => router.push("/menu")}
            className={`${commonStyles.button} ${commonStyles.boxed_button}`}
          >
            Menu
          </button>
        </>
      ) : (
        <button
          onClick={handleInitialize}
          className={`${commonStyles.button} ${commonStyles.boxed_button}`}
        >
          Load database
        </button>
      )}
    </div>
  );
}

