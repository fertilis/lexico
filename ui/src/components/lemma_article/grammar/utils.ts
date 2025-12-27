import {Gender, Ptosi, Number_} from "@/domain/StoredDictionary";

/**
 * Maps (Gender, Ptosi, Number_) to the definite article in Greek
 */
export function getDefiniteArticle(
  gender: Gender,
  ptosi: Ptosi,
  number: Number_
): string {
  if (gender === Gender.Masc) {
    if (number === Number_.Sing) {
      switch (ptosi) {
        case Ptosi.Nom:
          return "ο";
        case Ptosi.Gen:
          return "του";
        case Ptosi.Acc:
          return "τον";
        default:
          return "";
      }
    } else {
      // Plur
      switch (ptosi) {
        case Ptosi.Nom:
          return "οι";
        case Ptosi.Gen:
          return "των";
        case Ptosi.Acc:
          return "τους";
        default:
          return "";
      }
    }
  } else if (gender === Gender.Fem) {
    if (number === Number_.Sing) {
      switch (ptosi) {
        case Ptosi.Nom:
          return "η";
        case Ptosi.Gen:
          return "της";
        case Ptosi.Acc:
          return "την";
        default:
          return "";
      }
    } else {
      // Plur
      switch (ptosi) {
        case Ptosi.Nom:
          return "οι";
        case Ptosi.Gen:
          return "των";
        case Ptosi.Acc:
          return "τις";
        default:
          return "";
      }
    }
  } else if (gender === Gender.Neut) {
    if (number === Number_.Sing) {
      switch (ptosi) {
        case Ptosi.Nom:
          return "το";
        case Ptosi.Gen:
          return "του";
        case Ptosi.Acc:
          return "το";
        default:
          return "";
      }
    } else {
      // Plur
      switch (ptosi) {
        case Ptosi.Nom:
          return "τα";
        case Ptosi.Gen:
          return "των";
        case Ptosi.Acc:
          return "τα";
        default:
          return "";
      }
    }
  }
  return "";
}

