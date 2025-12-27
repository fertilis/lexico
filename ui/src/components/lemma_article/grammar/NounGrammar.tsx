"use client";

import {Lemma, Annotation} from "@/domain/Dictionary";
import {Gender, Ptosi, Number_} from "@/domain/StoredDictionary";
import {getDefiniteArticle} from "./utils";
import styles from "./NounGrammar.module.css";

interface NounGrammarProps {
  lemma: Lemma;
}

export default function NounGrammar({lemma}: NounGrammarProps) {
  // Get gender from the first word that has a gender
  const words = lemma.getWords();
  const gender = words.find((w) => w.stored.gender !== null)?.stored.gender;
  
  if (!gender) {
    return <div>No gender information available</div>;
  }

  const ptoi = [Ptosi.Nom, Ptosi.Gen, Ptosi.Acc];

  const formItems = ptoi.flatMap((ptosi) => {
    const singAnnotations: Annotation[] = [gender, ptosi, Number_.Sing];
    const plurAnnotations: Annotation[] = [gender, ptosi, Number_.Plur];
    const singWord = lemma.getWord(singAnnotations);
    const plurWord = lemma.getWord(plurAnnotations);
    const singArticle = getDefiniteArticle(gender, ptosi, Number_.Sing);
    const plurArticle = getDefiniteArticle(gender, ptosi, Number_.Plur);
    const singForm = singWord?.stored.form || "-";
    const plurForm = plurWord?.stored.form || "-";
    return [
      {key: `${ptosi}-${Number_.Sing}`, content: `${singArticle} ${singForm}`},
      {key: `${ptosi}-${Number_.Plur}`, content: `${plurArticle} ${plurForm}`},
    ];
  });

  return (
    <div className={styles.noun_forms}>
      {formItems.map((item) => (
        <div key={item.key}>
          {item.content}
        </div>
      ))}
    </div>
  );
}

