import { lastOfArray, RxCollection } from "rxdb";
import { replicateRxCollection, RxReplicationState } from "rxdb/plugins/replication";
import { BehaviorSubject } from "rxjs";
import logger from "@/common/utils/logger";

const pushing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
const pulling$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

/**
 * Create a sync process between the FE database and the BE database.
 * @param collection Collection to replicate
 * @param replicationIdentifier ID name for the replica
 * @param primaryKey Name of the property that will be the primary key
 * @param pushFunc Handler function to execute when doing a push procress
 * @param pullFunc Handler function to execute when doing a pull process
 * @returns List of handy functions to control the replication process
 */
export const setupReplication: <T extends { updatedAt: number; deleted: boolean }, PK>(
  collection: RxCollection<T> | null,
  replicationIdentifier: string,
  primaryKey: keyof T,
  pushFunc: (items: T[]) => Promise<T[]>,
  pullFunc: (minTimestamp: number, lastId: PK | null, batchSize: number) => Promise<T[]>,
) => Promise<[RxReplicationState<any, any>, any, BehaviorSubject<boolean>, BehaviorSubject<boolean>]> = async <
  T extends { updatedAt: number; deleted: boolean },
  PK,
>(
  collection: RxCollection<T> | null,
  replicationIdentifier: string,
  primaryKey: keyof T,
  pushFunc: (items: T[]) => Promise<T[]>,
  pullFunc: (minTimestamp: number, lastId: PK | null, batchSize: number) => Promise<T[]>,
) => {
  const replicationState = replicateRxCollection({
    collection,
    replicationIdentifier,
    deletedField: "deleted",
    autoStart: false,
    push: {
      handler: async (docs: any): Promise<any> => {
        pushing$.next(true);
        const store: T[] = docs.map((x: any) => x.newDocumentState) as any;

        try {
          const documentsPushed = await pushFunc(store);
          pushing$.next(false);
          return documentsPushed;
        } catch (err) {
          pushing$.next(false);
          logger.debug("RxDb Push", err);
          throw err;
        }
      },
      batchSize: 100,
    },
    pull: {
      handler: async (lastCheckpoint: any, batchSize: any): Promise<any> => {
        pulling$.next(true);

        try {
          let documentsFromRemote = await pullFunc(lastCheckpoint?.updatedAt || 0, lastCheckpoint?.id || "", batchSize);

          if (!documentsFromRemote) documentsFromRemote = [];
          pulling$.next(false);

          return {
            documents: documentsFromRemote,
            checkpoint:
              documentsFromRemote.length === 0
                ? lastCheckpoint
                : {
                    id: lastOfArray(documentsFromRemote)![primaryKey],
                    updatedAt: lastOfArray(documentsFromRemote)!.updatedAt,
                  },
          };
        } catch (err) {
          pulling$.next(false);
          logger.debug("RxDb Pull", err);
          throw err;
        }
      },
      batchSize: 1000,
    },
  });

  await replicationState.start();

  return [replicationState, setInterval(() => replicationState.reSync(), 15000), pushing$, pulling$];
};

export const extractValueFromArray = (possibleArray: string[] | string = ""): string => {
  if (Array.isArray(possibleArray)) {
    if (possibleArray.length > 0) {
      return possibleArray[0];
    }

    return "";
  }

  return possibleArray;
};
