import {QueueType} from "@/domain/Queues";
import {WordArticleDisplayStage} from "@/components/word_article/WordArticleDisplayStage";
import {LemmaArticleDisplayStage} from "@/components/lemma_article/LemmaArticleDisplayStage";
import {PhraseSentenceDisplayStage} from "@/components/phrase_article/PhraseSentenceDisplayStage";

export function getMaxStage(queueType: QueueType): number {
  if (queueType === QueueType.WordsCards) {
    return WordArticleDisplayStage.EnglishPhrase;
  }
  if (queueType === QueueType.Phrases) {
    return PhraseSentenceDisplayStage.WithGreek;
  }
  return LemmaArticleDisplayStage.Grammar;
}
