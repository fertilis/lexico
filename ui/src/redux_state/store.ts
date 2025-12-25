import {configureStore} from '@reduxjs/toolkit'
import {enableMapSet} from 'immer'
import currentArticleReducer from './currentArticleSlice'

enableMapSet()

export const store = configureStore({
  reducer: {
    currentArticle: currentArticleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore the Map in currentArticles - it's handled by enableMapSet()
        ignoredPaths: ['currentArticle.currentArticles'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
