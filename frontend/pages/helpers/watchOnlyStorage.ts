import { WatchOnlyItem } from "@pages/login/components/WatchOnlyInput";

const WATCH_ONLY_SESSIONS = "watch-only-sessions";

export function getWatchOnlySessionsFromLocal(): WatchOnlyItem[] {
  const watchOnlyItems = localStorage.getItem(WATCH_ONLY_SESSIONS);
  return watchOnlyItems ? JSON.parse(watchOnlyItems) : [];
}

export function setWatchOnlySessionsToLocal(watchOnlyItems: WatchOnlyItem[]) {
  localStorage.setItem(WATCH_ONLY_SESSIONS, JSON.stringify(watchOnlyItems));
}

export function addWatchOnlySessionToLocal(newWatchOnlyItem: WatchOnlyItem) {
  const watchOnlyItems = getWatchOnlySessionsFromLocal();
  const isAlreadyAdded = watchOnlyItems.some((item) => item.principal === newWatchOnlyItem.principal);

  if (isAlreadyAdded) return;
  const updatedWatchOnlyItems = [...watchOnlyItems, newWatchOnlyItem];
  setWatchOnlySessionsToLocal(updatedWatchOnlyItems);
}

export function deleteWatchOnlySessionFromLocal(principal: string) {
  const watchOnlyItems = getWatchOnlySessionsFromLocal();
  const updatedWatchOnlyItems = watchOnlyItems.filter((item) => item.principal !== principal);
  setWatchOnlySessionsToLocal(updatedWatchOnlyItems);
}

export function updateWatchOnlySessionFromLocal(updatedWatchOnlyItem: WatchOnlyItem) {
  const watchOnlyItems = getWatchOnlySessionsFromLocal();
  const updatedWatchOnlyItems = watchOnlyItems.map((item) => {
    if (item.principal === updatedWatchOnlyItem.principal) {
      return updatedWatchOnlyItem;
    }
    return item;
  });

  setWatchOnlySessionsToLocal(updatedWatchOnlyItems);
}
