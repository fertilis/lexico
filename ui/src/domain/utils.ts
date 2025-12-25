import {Dictionary} from "./Dictionary";
import {Queues} from "./Queues";

export function isStateInitialized(): boolean {
  if (!Dictionary.instance.isInitialized()) {
    return false;
  }
  if (!Queues.instance.isInitialized()) {
    return false;
  }
  return true;
}
