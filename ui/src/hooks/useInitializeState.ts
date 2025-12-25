import {useDispatch} from "react-redux";
import {AppDispatch} from "@/redux_state/store";
import {Dictionary} from "@/domain/Dictionary";
import {Queues} from "@/domain/Queues";
import {isStateInitialized} from "@/domain/utils";
import {setAllCurrentArticles, setCurrentQueueType} from "@/redux_state/currentArticleSlice";

export function useInitializeState() {
  const dispatch = useDispatch<AppDispatch>();
  return async () => {
    if (isStateInitialized()) {
      return;
    }
    await Dictionary.instance.init();
    await Queues.instance.init();
    dispatch(setAllCurrentArticles());
    const loadedQueueType = Queues.instance.getCurrentQueueType();
    dispatch(setCurrentQueueType(loadedQueueType));
  };
}

export function useReinitializeState() {
  const dispatch = useDispatch<AppDispatch>();

  return async () => {
    await Dictionary.instance.reinit();
    Queues.instance.reinit();
    dispatch(setAllCurrentArticles());
    dispatch(setCurrentQueueType(null));
  };
}

