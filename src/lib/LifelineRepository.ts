import { FirebaseApp, FirebaseError, initializeApp } from "firebase/app";
import { Auth, getAuth, signInWithPopup } from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
  getDoc,
  Timestamp,
  addDoc,
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
  orderBy,
  OrderByDirection,
} from "firebase/firestore";
import {
  LifeEvent,
  toSerializableObject,
  fromSerializableObject,
  SerializableLifeEvent,
} from "./LifeEvent";
import { GoogleAuthProvider, Unsubscribe, User } from "firebase/auth";
import { LifelineError } from "./Errors";
import { SerializableUserSettings, UserSettings } from "./UserSettings";
import { Feedback } from "./Feedback";

const lifeEventConverter = {
  toFirestore(lifeEvent: WithFieldValue<LifeEvent>): SerializableLifeEvent {
    return toSerializableObject(lifeEvent as LifeEvent);
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): LifeEvent {
    const data = snapshot.data(options) as SerializableLifeEvent;
    return fromSerializableObject(data);
  },
};
const userSettingsConverter = {
  toFirestore(
    userSettings: WithFieldValue<UserSettings>,
  ): SerializableUserSettings {
    const settings = userSettings as UserSettings;
    return {
      ...settings,
      dateOfBirth: settings.dateOfBirth
        ? settings.dateOfBirth && Timestamp.fromDate(settings.dateOfBirth)
        : null,
    } as SerializableUserSettings;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): UserSettings {
    const data = snapshot.data(options) as SerializableUserSettings;
    return {
      ...data,
      dateOfBirth: data.dateOfBirth?.toDate(),
    };
  },
};
const feedbackConverter = {
  toFirestore(feedback: WithFieldValue<Feedback>): Feedback {
    const feedbackData = feedback as Feedback;
    return {
      ...feedbackData,
    } as Feedback;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Feedback {
    const data = snapshot.data(options) as Feedback;
    return {
      ...data,
    };
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
  private feedbackCollection: CollectionReference<Feedback, Feedback>;

  private constructor(emulator: boolean) {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth();
    this.db = getFirestore();
    if (emulator) {
      connectFirestoreEmulator(this.db, "127.0.0.1", 8080);
    }
    this.feedbackCollection = collection(this.db, "feedback").withConverter(
      feedbackConverter,
    );
  }

  public static getInstance(): LifelineRepository {
    if (!LifelineRepository.instance) {
      LifelineRepository.instance = new LifelineRepository(false);
    }

    return LifelineRepository.instance;
  }

  public userLifeEventsCollection() {
    const uid = this.requireUserId();
    return collection(this.db, "users", uid, "lifeevents").withConverter(
      lifeEventConverter,
    );
  }

  public userSettingsCollection() {
    const uid = this.requireUserId();
    return collection(this.db, "users", uid, "settings").withConverter(
      userSettingsConverter,
    );
  }

  public requireUserId(): string {
    const uid = this.getUser()?.uid;
    if (!uid) {
      throw new LifelineError(
        "Database Error",
        "User must be logged in to access events",
      );
    }
    return uid;
  }

  async load(): Promise<LifeEvent[]> {
    const querySnapshot = await getDocs(this.userLifeEventsCollection());
    const puzzles = querySnapshot.docs.map((doc) => doc.data());
    return puzzles;
  }

  subscribeToLifeEvents(
    orderDirection: OrderByDirection,
    onLifeEvents: (lifeEvents: LifeEvent[]) => void,
    onError: (error: FirebaseError) => void,
  ): Unsubscribe {
    const q = query(
      this.userLifeEventsCollection(),
      orderBy("year", orderDirection),
      orderBy("month", orderDirection),
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const lifeEvents = querySnapshot.docs.map((doc) => doc.data());
        onLifeEvents(lifeEvents);
      },
      onError,
    );
    return unsubscribe;
  }

  subscribeToChanges(
    id: string,
    onChange: (lifeEvent: LifeEvent) => void,
  ): Unsubscribe {
    const docReference = doc(this.userLifeEventsCollection(), id);
    return onSnapshot(docReference, (doc) => {
      const lifeEvent = doc.data();
      if (lifeEvent) {
        onChange(lifeEvent);
      }
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.userLifeEventsCollection(), id);
    await deleteDoc(docRef);
  }

  async create(
    lifeEventWithoutId: Omit<LifeEvent, "id" | "userId" | "date">,
  ): Promise<LifeEvent> {
    const uid = this.requireUserId();
    const newDocumentReference = doc(this.userLifeEventsCollection());
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
    await setDoc(doc(this.userLifeEventsCollection(), lifeEvent.id), lifeEvent);
  }

  async update(
    id: string,
    fields: Partial<SerializableLifeEvent>,
  ): Promise<void> {
    const docRef = doc(this.userLifeEventsCollection(), id);
    await updateDoc(docRef, fields);
  }

  async restore(
    restorableLifeEvents: Omit<LifeEvent, "id" | "userId">[],
    deleteExistingEvents: boolean,
  ): Promise<void> {
    //  If we don't have a user, we are going to have to fail.
    const uid = this.requireUserId();

    //  If we are deleting events, delete them all.
    if (deleteExistingEvents) {
      const querySnapshot = await getDocs(this.userLifeEventsCollection());
      const deletePromises = querySnapshot.docs.map(async (doc) =>
        deleteDoc(doc.ref),
      );
      await Promise.all(deletePromises);
    }

    const promises = restorableLifeEvents.map(async (lifeEvent) => {
      const newDocumentReference = doc(this.userLifeEventsCollection());

      //  Load the puzzles into the database, but always set the user id.
      return await setDoc(
        doc(this.userLifeEventsCollection(), newDocumentReference.id),
        {
          ...lifeEvent,
          userId: uid,
          id: newDocumentReference.id,
        },
      );
    });
    await Promise.all(promises);
  }

  async backup(): Promise<LifeEvent[]> {
    const lifeEvents = await this.load();
    return lifeEvents;
  }

  async getUserSettings(): Promise<UserSettings> {
    const uid = this.requireUserId();
    const docRef = doc(this.userSettingsCollection(), "settings");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return {
        userId: uid,
        dateOfBirth: undefined,
        showAgeOnTimeline: false,
      };
    }
  }

  subscribeToUserSettings(
    onChange: (userSettings: UserSettings) => void,
  ): Unsubscribe {
    const uid = this.requireUserId();
    const docRef = doc(this.userSettingsCollection(), "settings");
    return onSnapshot(docRef, (doc) => {
      const userSettings = doc.data();
      if (userSettings) {
        onChange(userSettings);
      } else {
        //  Return default settings.
        onChange({ userId: uid, showAgeOnTimeline: false });
      }
    });
  }

  async saveUserSettings(userSettings: UserSettings): Promise<void> {
    const docRef = doc(this.userSettingsCollection(), "settings");
    await setDoc(docRef, userSettings);
  }

  async saveFeedback(feedback: Omit<Feedback, "userId">): Promise<void> {
    await addDoc(this.feedbackCollection, {
      ...feedback,
      userId: this.getUser()?.uid,
    });
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
