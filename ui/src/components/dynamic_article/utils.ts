import {QueueType} from "@/domain/Queues";
import {WordArticleDisplayStage} from "@/components/word_article/WordArticleDisplayStage";
import {LemmaArticleDisplayStage} from "@/components/lemma_article/LemmaArticleDisplayStage";

export function getMaxStage(queueType: QueueType): number {
  if (queueType === QueueType.WordsCards) {
    return WordArticleDisplayStage.EnglishPhrase;
  }
  return LemmaArticleDisplayStage.Grammar;
}
