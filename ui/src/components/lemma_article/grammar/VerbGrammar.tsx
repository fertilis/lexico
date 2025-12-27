"use client";

import {Lemma} from "@/domain/Dictionary";
import {
  PartOfSpeechGreek,
  Person,
  Number_,
  Voice,
  Mood,
} from "@/domain/StoredDictionary";
import styles from "./VerbGrammar.module.css";
import commonStyles from "@/components/Common.module.css";

interface VerbGrammarProps {
  lemma: Lemma;
}

export enum DisplayTense {
  Present = "Present",
  Aorist = "Aorist",
  Future = "Future",
  Imperfect = "Imperfect",
}

/**
 * Maps greek_pos to DisplayTense
 * Returns null if the pos_el doesn't match any of the display tenses
 */
export function getDisplayTense(greek_pos: PartOfSpeechGreek | null): DisplayTense | null {
  if (!greek_pos) {
    return null;
  }

  const pos_str = greek_pos.toString();

  if (pos_str.startsWith("ENEST")) {
    return DisplayTense.Present;
  } else if (pos_str.startsWith("AOR_YPOT")) {
    return DisplayTense.Future;
  } else if (pos_str.startsWith("AOR")) {
    return DisplayTense.Aorist;
  } else if (pos_str.startsWith("PARATATIKOS")) {
    return DisplayTense.Imperfect;
  }

  return null;
}

/**
 * Checks if the lemma has active voice forms within displayed tenses
 */
export function hasActiveVoice(lemma: Lemma): boolean {
  const words = lemma.getWords();
  return words.some(
    (word) =>
      word.stored.voice === Voice.Act && getDisplayTense(word.stored.pos_el) !== null
  );
}

/**
 * Checks if the lemma has passive voice forms within displayed tenses
 */
export function hasPassiveVoice(lemma: Lemma): boolean {
  const words = lemma.getWords();
  return words.some(
    (word) =>
      word.stored.voice === Voice.Pass && getDisplayTense(word.stored.pos_el) !== null
  );
}

interface ConjugationTableProps {
  lemma: Lemma;
  tense: DisplayTense;
  voice: Voice;
}

function ConjugationTable({lemma, tense, voice}: ConjugationTableProps) {
  const persons = [Person.First, Person.Second, Person.Third];
  const numbers = [Number_.Sing, Number_.Plur];

  const getWordForCell = (person: Person, number: Number_): string => {
    // Find word that matches the tense pattern
    const words = lemma.getWords();
    for (const word of words) {
      const stored = word.stored;
      if (
        stored.voice === voice &&
        stored.mood === Mood.Ind &&
        stored.person === person &&
        stored.number === number
      ) {
        const wordTense = getDisplayTense(stored.pos_el);
        if (wordTense === tense) {
          return stored.form;
        }
      }
    }
    return "-";
  };

  const formItems = persons.flatMap((person) => {
    return numbers.map((number) => {
      const form = getWordForCell(person, number);
      const displayForm = tense === DisplayTense.Future && form !== "-" 
        ? `θα ${form}` 
        : form;
      return {
        key: `${person}-${number}`,
        form: displayForm,
      };
    });
  });

  return (
    <div className={styles.conjugation_table}>
      {formItems.map((item) => (
        <div key={item.key}>{item.form}</div>
      ))}
    </div>
  );
}

function ImperativeForms({lemma}: {lemma: Lemma}) {
  const getImperativeForm = (number: Number_): string => {
    const words = lemma.getWords();
    for (const word of words) {
      const stored = word.stored;
      if (number  === Number_.Sing &&
        stored.pos_el === PartOfSpeechGreek.PROST_AOR_B_ENIKO
        && stored.voice === Voice.Act
      ) {
          return stored.form;
      } else if (number === Number_.Plur &&
        stored.pos_el === PartOfSpeechGreek.PROST_AOR_B_PL
        && stored.voice === Voice.Act
      ) {
          return stored.form;
      }
    }
    return "-";
  };

  const singForm = getImperativeForm(Number_.Sing);
  const plurForm = getImperativeForm(Number_.Plur);

  return (
    <div className={styles.imperative_forms}>
      <div>{singForm}</div>
      <div>{plurForm}</div>
    </div>
  );
}

export default function VerbGrammar({lemma}: VerbGrammarProps) {
  const hasActive = hasActiveVoice(lemma);
  const hasPassive = hasPassiveVoice(lemma);

  const tenses = [
    DisplayTense.Present,
    DisplayTense.Aorist,
    DisplayTense.Future,
    DisplayTense.Imperfect,
  ];

  const tenseLabels: Record<DisplayTense, string> = {
    [DisplayTense.Present]: "Present",
    [DisplayTense.Aorist]: "Aorist",
    [DisplayTense.Future]: "Future",
    [DisplayTense.Imperfect]: "Imperfect",
  };

  return (
    <div className={styles.verb_grammar}>
      {hasActive && (
        <div className={styles.voice_section}>
          <div className={`${commonStyles.annotation} ${styles.voice_heading}`}>
            Active
          </div>
          {tenses.map((tense) => (
            <div key={tense} className={styles.tense_section}>
              <div className={`${commonStyles.annotation} ${styles.tense_heading}`}>
                {tenseLabels[tense]}
              </div>
              <ConjugationTable lemma={lemma} tense={tense} voice={Voice.Act} />
            </div>
          ))}
        </div>
      )}

      {hasPassive && (
        <div className={styles.voice_section}>
          <div className={`${commonStyles.annotation} ${styles.voice_heading}`}>
            Passive
          </div>
          {tenses.map((tense) => (
            <div key={tense} className={styles.tense_section}>
              <div className={`${commonStyles.annotation} ${styles.tense_heading}`}>
                {tenseLabels[tense]}
              </div>
              <ConjugationTable lemma={lemma} tense={tense} voice={Voice.Pass} />
            </div>
          ))}
        </div>
      )}

      <div className={styles.imperative_section}>
        <div className={`${commonStyles.annotation} ${styles.imperative_heading}`}>
          Imperative
        </div>
        <ImperativeForms lemma={lemma} />
      </div>
    </div>
  );
}
