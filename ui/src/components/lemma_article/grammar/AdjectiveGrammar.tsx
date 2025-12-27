"use client";

import {Lemma, Annotation} from "@/domain/Dictionary";
import {Gender, Ptosi, Number_, Degree} from "@/domain/StoredDictionary";
import {getDefiniteArticle} from "./utils";
import styles from "./AdjectiveGrammar.module.css";
import commonStyles from "@/components/Common.module.css";

interface AdjectiveGrammarProps {
  lemma: Lemma;
}

export default function AdjectiveGrammar({lemma}: AdjectiveGrammarProps) {
  const ptoi = [Ptosi.Nom, Ptosi.Gen, Ptosi.Acc];
  const genders = [Gender.Masc, Gender.Fem, Gender.Neut];

  const genderLabels: Record<Gender, string> = {
    [Gender.Masc]: "Masculine",
    [Gender.Fem]: "Feminine",
    [Gender.Neut]: "Neuter",
  };

  return (
    <div className={styles.adjective_grammar}>
      {genders.map((gender) => {
        const formItems = ptoi.flatMap((ptosi) => {
          const singAnnotations = {gender, ptosi, number: Number_.Sing, degree: undefined};
          const plurAnnotations = {gender, ptosi, number: Number_.Plur, degree: undefined};
          const singWord = lemma.getWord(singAnnotations);
          const plurWord = lemma.getWord(plurAnnotations);
          const singArticle = getDefiniteArticle(gender, ptosi, Number_.Sing);
          const plurArticle = getDefiniteArticle(gender, ptosi, Number_.Plur);
          const singForm = singWord?.stored.form || "-";
          const plurForm = plurWord?.stored.form || "-";
          return [
            {key: `${gender}-${ptosi}-${Number_.Sing}`, content: `${singArticle} ${singForm}`},
            {key: `${gender}-${ptosi}-${Number_.Plur}`, content: `${plurArticle} ${plurForm}`},
          ];
        });

        return (
          <div key={gender}>
            <div className={`${commonStyles.annotation} ${styles.gender_label}`}>{genderLabels[gender]}</div>
            <div className={styles.adjective_forms}>
              {formItems.map((item) => (
                <div key={item.key}>
                  {item.content}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
