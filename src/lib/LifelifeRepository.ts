import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, signInWithPopup } from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
} from "firebase/firestore";
import {
  collection,
  onSnapshot,
  doc,
  getDocs,
  CollectionReference,
  WithFieldValue,
  QueryDocumentSnapshot,
  SnapshotOptions,
  setDoc,
  deleteDoc,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  LifeEvent,
  toSerializableObject,
  fromSerializableObject,
  SerializableLifeEvent,
} from "./LifeEvent";
import { GoogleAuthProvider, Unsubscribe, User } from "firebase/auth";
import { LifelineError } from "./Errors";

const lifeEventConverter = {
  toFirestore(puzzle: WithFieldValue<LifeEvent>): SerializableLifeEvent {
    return toSerializableObject(puzzle as LifeEvent);
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): LifeEvent {
    const data = snapshot.data(options) as SerializableLifeEvent;
    return fromSerializableObject(data);
  },
};

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6Wvyid5gqzPC4JWZBoYHvivI7vPGybTk",
  authDomain: "lifeline-dwmkerr.firebaseapp.com",
  // databaseURL:
  //   "https://lifeline-dwmkerr-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lifeline-dwmkerr",
  storageBucket: "lifeline-dwmkerr.appspot.com",
  messagingSenderId: "43519542082",
  appId: "1:43519542082:web:4506c47c35dbb914963edb",
};

export class LifelineRepository {
  private static instance: LifelineRepository;
  public app: FirebaseApp;
  public auth: Auth;
  public db: Firestore;
  private lifeEventsCollection: CollectionReference<
    LifeEvent,
    SerializableLifeEvent
  >;

  private constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth();
    this.db = getFirestore();
    connectFirestoreEmulator(this.db, "127.0.0.1", 8080);
    this.lifeEventsCollection = collection(this.db, "lifeevents").withConverter(
      lifeEventConverter,
    );
  }

  public static getInstance(): LifelineRepository {
    if (!LifelineRepository.instance) {
      LifelineRepository.instance = new LifelineRepository();
    }

    return LifelineRepository.instance;
  }

  async load(): Promise<LifeEvent[]> {
    const querySnapshot = await getDocs(this.lifeEventsCollection);
    const puzzles = querySnapshot.docs.map((doc) => doc.data());
    return puzzles;
  }

  subscribeToLifeEvents(
    onLifeEvents: (lifeEvents: LifeEvent[]) => void,
  ): Unsubscribe {
    const q = query(this.lifeEventsCollection);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lifeEvents = querySnapshot.docs.map((doc) => doc.data());
      onLifeEvents(lifeEvents);
    });
    return unsubscribe;
  }

  subscribeToChanges(
    id: string,
    onChange: (lifeEvent: LifeEvent) => void,
  ): Unsubscribe {
    return onSnapshot(doc(this.lifeEventsCollection, id), (doc) => {
      const lifeEvent = doc.data();
      if (lifeEvent) {
        onChange(lifeEvent);
      }
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.lifeEventsCollection, id);
    await deleteDoc(docRef);
  }

  async create(
    lifeEventWithoutId: Omit<LifeEvent, "id" | "userId">,
  ): Promise<LifeEvent> {
    const uid = this.getUser()?.uid;
    if (!uid) {
      throw new LifelineError(
        "Create Event Error",
        "uid is null, cannot save to db",
      );
    }
    const newDocumentReference = doc(this.lifeEventsCollection);
    const lifeEvent: LifeEvent = {
      ...lifeEventWithoutId,
      id: newDocumentReference.id,
      userId: uid,
    };

    //  Store in firebase and we're done.
    await setDoc(newDocumentReference, lifeEvent);
    return lifeEvent;
  }

  async save(lifeEvent: LifeEvent): Promise<void> {
    await setDoc(doc(this.lifeEventsCollection, lifeEvent.id), lifeEvent);
  }

  async update(
    id: string,
    fields: Partial<SerializableLifeEvent>,
  ): Promise<void> {
    const docRef = doc(this.lifeEventsCollection, id);
    await updateDoc(docRef, fields);
  }

  async restore(backupJson: string, userId: string): Promise<void> {
    const records = JSON.parse(backupJson) as SerializableLifeEvent[];
    const lifeEvents = records.map(fromSerializableObject);

    //  Now write the records to firebase. Some might have an id, some might
    //  not.
    const promises = lifeEvents.map(async (lifeEvent) => {
      if (!lifeEvent.id) {
        const newDocumentReference = doc(this.lifeEventsCollection);
        lifeEvent.id = newDocumentReference.id;
      }

      //  Load the puzzles into the database, but always set the user id.
      return await setDoc(doc(this.lifeEventsCollection, lifeEvent.id), {
        ...lifeEvent,
        userId,
      });
    });
    await Promise.all(promises);
  }

  async backup(): Promise<string> {
    const lifeEvents = await this.load();
    const records = lifeEvents.map(toSerializableObject);
    const backupJson = JSON.stringify(records, null, 2);
    return backupJson;
  }

  getAuth(): Auth {
    return this.auth;
  }

  getUser(): User | null {
    return this.auth.currentUser;
  }

  async waitForUser(): Promise<User | null> {
    //  Wait for any cached credentials to be used to load the current user.
    await this.auth.authStateReady();
    return this.auth.currentUser;
  }

  async signInWithGoogle(): Promise<User | null> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      if (!token) {
        throw new Error("credential.token undefined on sign in");
      }
      return result.user;
    } catch (err) {
      throw LifelineError.fromError("Sign In Error", err);
    }
  }

  async signOut() {
    this.auth.signOut();
  }
}
