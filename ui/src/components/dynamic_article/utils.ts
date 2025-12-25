import {QueueType} from "@/domain/Queues";
import {WordArticleDisplayStage} from "@/components/word_article/WordArticleDisplayStage";

export function getMaxStage(queueType: QueueType): number {
  if (queueType === QueueType.WordsCards) {
    return WordArticleDisplayStage.EnglishPhrase;
  }
  return 0;
}
