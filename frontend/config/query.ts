import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({});

export const persister = createSyncStoragePersister({
  storage: window.localStorage,
});
