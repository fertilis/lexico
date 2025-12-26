import {Dictionary} from "./Dictionary";
import {Queues} from "./Queues";
import {isTauriInitialized} from "./storages";

export function isStateInitialized(): boolean {
  if (!isTauriInitialized()) {
    return false;
  }
  if (!Dictionary.instance.isInitialized()) {
    return false;
  }
  if (!Queues.instance.isInitialized()) {
    return false;
  }
  return true;
}
