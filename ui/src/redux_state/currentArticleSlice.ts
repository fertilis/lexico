import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";
import {RootState} from "./store";
import {Queues, QueueType} from "@/domain/Queues";

export type CurrentArticleIndex = number | null;

export interface CurrentArticleState {
  currentArticles: Map<QueueType, CurrentArticleIndex>;
  currentQueueType: QueueType | null;
}

const initialState: CurrentArticleState = {
  currentArticles: new Map<QueueType, CurrentArticleIndex>,
  currentQueueType: null,
};

const currentArticleSlice = createSlice({
  name: "currentArticle",
  initialState,
  reducers: {
    setCurrentQueueType: (state, action: PayloadAction<QueueType | null>) => {
      const queueType = action.payload;
      state.currentQueueType = queueType;
      Queues.instance.setCurrentQueueType(queueType);
    },
    setCurrentArticle: (state, action: PayloadAction<QueueType>) => {
      const queueType = action.payload;
      state.currentArticles.set(queueType, Queues.instance.getFront(queueType));
    },
    setAllCurrentArticles: (state) => {
      for (const queueType of Object.values(QueueType)) {
        state.currentArticles.set(queueType, Queues.instance.getFront(queueType));
      }
    },
    setCurrentArticleIndex: (state, action: PayloadAction<{queueType: QueueType, articleIndex: number}>) => {
      const {queueType, articleIndex} = action.payload;
      state.currentArticles.set(queueType, articleIndex);
    },
  },
});

export const {
  setCurrentQueueType,
  setCurrentArticle,
  setAllCurrentArticles,
  setCurrentArticleIndex,
} = currentArticleSlice.actions;


export const useGetCurrentQueueType = (): QueueType | null => {
  return useSelector((state: RootState): QueueType | null => {
    return state.currentArticle.currentQueueType;
  });
};

export const useGetCurrentArticleIndex = (queueType: QueueType | null): CurrentArticleIndex => {
  const map = useSelector((state: RootState) => state.currentArticle.currentArticles);
  if (queueType === null) {
    return null;
  }
  const value = map.get(queueType);
  return value ?? null;
};

export default currentArticleSlice.reducer;
