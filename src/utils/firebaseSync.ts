import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from "firebase/firestore";
import { db, isFirebaseEnabled, getLocalData, saveLocalData, auth } from "../lib/firebase";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Generic class / set of helper functions to fetch and synchronize data between 
 * Firestore and local state, defaulting to LocalStorage fallback if Firebase is not enabled.
 */

// Save data in local state and LocalStorage as fallback
export const saveCollectionItem = async <T extends { id: string }>(
  collectionName: string,
  localKey: string,
  item: T,
  existingItems: T[]
): Promise<T[]> => {
  let updatedList = [...existingItems];
  const index = updatedList.findIndex(i => i.id === item.id);
  if (index >= 0) {
    updatedList[index] = item;
  } else {
    updatedList.push(item);
  }

  // Save to LocalStorage
  saveLocalData(localKey, updatedList);

  // If Firebase integrated, propogate to Firestore
  if (isFirebaseEnabled && db) {
    try {
      const docRef = doc(db, collectionName, item.id);
      await setDoc(docRef, item);
      console.log(`Saved item ${item.id} to Firestore collection ${collectionName}`);
    } catch (error) {
      console.error(`Error saving item ${item.id} to Firestore:`, error);
      handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${item.id}`);
    }
  }

  return updatedList;
};

// Delete data inside collections
export const deleteCollectionItem = async <T extends { id: string }>(
  collectionName: string,
  localKey: string,
  itemId: string,
  existingItems: T[]
): Promise<T[]> => {
  const updatedList = existingItems.filter(i => i.id !== itemId);
  
  // Save to LocalStorage
  saveLocalData(localKey, updatedList);

  // If Firebase integrated, send deletion request
  if (isFirebaseEnabled && db) {
    try {
      const docRef = doc(db, collectionName, itemId);
      await deleteDoc(docRef);
      console.log(`Deleted item ${itemId} from Firestore collection ${collectionName}`);
    } catch (error) {
      console.error(`Error deleting item ${itemId} from Firestore:`, error);
      handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${itemId}`);
    }
  }

  return updatedList;
};

// Fetch collection items on load, optionally syncing from Firestore if available
export const loadCollection = async <T extends { id: string }>(
  collectionName: string,
  localKey: string,
  defaultValues: T[]
): Promise<T[]> => {
  // Always get Local Storage cached data first
  const cached = getLocalData<T[]>(localKey, defaultValues);

  if (isFirebaseEnabled && db) {
    try {
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        const firestoreList: T[] = [];
        snapshot.forEach(docSnap => {
          firestoreList.push({ ...docSnap.data(), id: docSnap.id } as T);
        });
        
        // Update local storage with latest Firestore values
        saveLocalData(localKey, firestoreList);
        return firestoreList;
      } else {
        // If firestore is empty, seed it with our local cache or defaultValues
        console.info(`Firestore collection ${collectionName} is empty. Seeding with default dataset...`);
        for (const item of cached) {
          const stringId = String(item.id);
          const itemWithStrId = { ...item, id: stringId };
          await setDoc(doc(db, collectionName, stringId), itemWithStrId);
        }
      }
    } catch (error) {
      console.warn(`Could not sync Firestore collection ${collectionName} directly, returning local copy. Error:`, error);
      // Log the fallback but do not throw to keep the app fully functional offline
      try {
        const errInfo = {
          error: error instanceof Error ? error.message : String(error),
          operationType: OperationType.GET,
          path: collectionName
        };
        console.warn('Firestore fallback warning: ', JSON.stringify(errInfo));
      } catch (e) {}
    }
  }

  return cached;
};

// Add support for simple real-time updates when Firestore is wired
export const subscribeToCollection = <T extends { id: string }>(
  collectionName: string,
  localKey: string,
  onUpdate: (data: T[]) => void,
  defaultValues: T[]
) => {
  if (isFirebaseEnabled && db) {
    try {
      const colRef = collection(db, collectionName);
      return onSnapshot(colRef, (snapshot) => {
        const list: T[] = [];
        snapshot.forEach(docSnap => {
          list.push({ ...docSnap.data(), id: docSnap.id } as T);
        });
        saveLocalData(localKey, list);
        onUpdate(list);
      }, (error) => {
        console.warn(`Snapshot listen failed for ${collectionName}. Operating in offline standby with local storage:`, error);
      });
    } catch (error) {
      console.warn(`Failed to register snapshot listener for ${collectionName} (will use local storage):`, error);
    }
  }

  // Return a dry cleanup function if not enabled
  return () => {};
};
