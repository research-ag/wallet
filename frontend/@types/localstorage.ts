import { z } from "zod";

export const LocalStorageKeyEnum = z.enum(["language", "theme", "network_type", "dbLocation", "customDbCanisterId"]);

export type LocalStorageKey = z.infer<typeof LocalStorageKeyEnum>;
