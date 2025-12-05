
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  collection, 
  updateDoc, 
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  getDocs
} from "firebase/firestore";
import { 
  getMessaging, 
  getToken, 
  onMessage 
} from "firebase/messaging";
import { RelapseManual, UserProfile } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyDIjNlfgFzT3ytEI3dEmqG5fDfeFuCMONg",
  authDomain: "acencas-prevencio-activa-apa.firebaseapp.com",
  projectId: "acencas-prevencio-activa-apa",
  storageBucket: "acencas-prevencio-activa-apa.firebasestorage.app",
  messagingSenderId: "96053706134",
  appId: "1:96053706134:web:1fcab6e95897b51163b1b7",
  measurementId: "G-3885EB9T7L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);

// --- HELPER FUNCTIONS ---

export const createInitialUser = async (user: FirebaseUser) => {
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);
  
  if (!userDoc.exists()) {
    // Create first manual
    const newManualRef = await addDoc(collection(db, `users/${user.uid}/manuals`), {
      createdAt: serverTimestamp(),
      motivations: [],
      values: { selected: [], details: {} },
      triggers: [],
      trapThoughts: [],
      selfCarePlan: {},
      supportNetwork: [],
      crisisPlan: { signal: '', action: '', contact: '', value: '' },
      weeklyReview: '',
      gratitudeJournal: []
    });

    // Create user profile
    await setDoc(userDocRef, {
      email: user.email,
      name: '',
      surname: '',
      phone: '',
      activeManualId: newManualRef.id,
      lastConsumptionDate: null,
      createdAt: serverTimestamp(),
      // Initialize new fields
      type: 'adult',
      streak: 0,
      currency: 0,
      level: 1
    });
  }
};

export const createNewManual = async (uid: string) => {
  const newManualRef = await addDoc(collection(db, `users/${uid}/manuals`), {
    createdAt: serverTimestamp(),
    motivations: [],
    values: { selected: [], details: {} },
    triggers: [],
    trapThoughts: [],
    selfCarePlan: {},
    supportNetwork: [],
    crisisPlan: { signal: '', action: '', contact: '', value: '' },
    weeklyReview: '',
    gratitudeJournal: []
  });
  
  await updateDoc(doc(db, "users", uid), { activeManualId: newManualRef.id });
  return newManualRef.id;
};

export const archiveManual = async (uid: string) => {
    return await createNewManual(uid);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) return { id: snap.id, ...snap.data() } as UserProfile;
    return null;
}

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  doc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  addDoc,
  collection,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  getDocs,
  getToken,
  onMessage
};
