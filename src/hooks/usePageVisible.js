import { useSyncExternalStore } from "react";

const subscribe = (callback) => {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
};

// true while the browser tab is in the background. Used to pause autoplay.
export default function useTabHidden() {
  return useSyncExternalStore(
    subscribe,
    () => document.hidden,
    () => false
  );
}