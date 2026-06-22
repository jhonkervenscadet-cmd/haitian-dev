import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore, doc, getDocFromServer, enableMultiTabIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import firebaseAppletConfig from "../../firebase-applet-config.json";

// Firebase Client Configuration
// It will try to load from environment variables populated via AI Studio or custom setup, or fallback to config file.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId || "",
  firestoreDatabaseId: firebaseAppletConfig.firestoreDatabaseId || ""
};

// Check if we have at least a projectId to initialize Firebase
const isFirebaseConfigured = !!(
  firebaseConfig.projectId && 
  firebaseConfig.apiKey
);

let app;
let db: ReturnType<typeof getFirestore>;
let auth: ReturnType<typeof getAuth>;
let storage: ReturnType<typeof getStorage>;
let isFirebaseEnabled = false;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    // Initialize Firestore using custom database ID if available, forcing long polling for stable container connection
    const firestoreSettings = { 
      experimentalForceLongPolling: true
    };
    
    db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)"
      ? initializeFirestore(app, firestoreSettings, firebaseConfig.firestoreDatabaseId)
      : initializeFirestore(app, firestoreSettings);
      
    // Enable offline persistence for robust use on unstable internet connections
    enableMultiTabIndexedDbPersistence(db).catch((err) => {
      if (err.code == 'failed-precondition') {
         console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
      } else if (err.code == 'unimplemented') {
         console.warn('The current browser does not support all of the features required to enable persistence');
      }
    });

    console.log(`Firebase initialized for project: ${firebaseConfig.projectId}, database: ${firebaseConfig.firestoreDatabaseId || "(default)"}`);
    auth = getAuth(app);
    storage = getStorage(app);
    isFirebaseEnabled = true;

    // Validate Connection to Firestore on startup as mandated by security skill
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, "test", "connection"));
        console.log("Firebase initialized and successfully connected to Firestore.");
      } catch (error) {
        if (error instanceof Error && error.message.includes("the client is offline")) {
          console.warn("Firebase client is initialized but offline. Please check your cloud connection.");
        } else {
          console.info("Firestore connected (initial test complete).");
        }
      }
    };
    testConnection();
  } catch (error) {
    console.error("Failed to initialize Firebase with configured credentials:", error);
  }
} else {
  console.info(
    "Firebase is not yet configured on the client side. " +
    "Please populate the VITE_FIREBASE_* environment variables in your settings. " +
    "The application will automatically use LocalStorage fallback mode to remain functional."
  );
}

// Fallback functions for LocalStorage when firebase is offline or unconfigured
const getLocalData = <T>(key: string, defaultValue: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) return defaultValue;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
};

const saveLocalData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export { 
  app, 
  db, 
  auth, 
  storage,
  isFirebaseEnabled, 
  firebaseConfig,
  getLocalData,
  saveLocalData
};
