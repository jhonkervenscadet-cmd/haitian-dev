/**
 * Browser IndexedDB client-side file storage utility.
 * Allows storing large PDF documents or assets locally without bloating LocalStorage or Firestore documents,
 * and seamlessly resolving them into downloadable/viewable object URLs.
 */

const DB_NAME = "HaitianDevLocalFiles";
const STORE_NAME = "files";

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Stores a PDF file or blob in IndexedDB.
 * Returns a virtual URL in the format "local-db://{id}"
 */
export async function storeLocalFile(id: string, file: File | Blob): Promise<string> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(file, id);
    request.onsuccess = () => resolve(`local-db://${id}`);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieves a file blob from IndexedDB by its unique ID.
 */
export async function getLocalFile(id: string): Promise<Blob | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Deletes a file blob from IndexedDB.
 */
export async function deleteLocalFile(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Checks if a given URL is a local IndexedDB reference, and if so,
 * loads it and downloads or opens it. Otherwise triggers normal download.
 */
export async function openOrDownloadDocument(url: string, title: string) {
  if (!url) {
    alert("Aucun document n'est rattaché.");
    return;
  }

  if (url.startsWith("local-db://")) {
    const fileId = url.replace("local-db://", "");
    try {
      const blob = await getLocalFile(fileId);
      if (blob) {
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 15000);
      } else {
        alert("Ce document PDF est stocké localement sur l'appareil d'origine et n'est pas encore disponible en cache sur cet appareil. Pour le rendre disponible partout, assurez-vous d'avoir configuré Firebase Storage.");
      }
    } catch (err) {
      console.error("Error reading local document from IndexedDB:", err);
      alert("Erreur lors de la lecture locale du fichier PDF.");
    }
  } else {
    // Normal Web URL, trigger secure download or target tab opening
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
