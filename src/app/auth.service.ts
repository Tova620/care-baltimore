import { Injectable } from '@angular/core';
import { getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth(getApp());
  private db = getFirestore(getApp());
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: any }> {
    try {
      // Check if user is a volunteer
      const volunteersRef = collection(this.db, 'volunteers');
      const q = query(volunteersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, error: { message: 'Email not registered as a volunteer' } };
      }

      await signInWithEmailAndPassword(this.auth, email, password);
      return { success: true };
    } catch (error: any) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        return { success: false, error: { message: 'Invalid email or password' } };
      }
      return { success: false, error };
    }
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  async getVolunteerData(email: string): Promise<any> {
    const volunteersRef = collection(this.db, 'volunteers');
    const q = query(volunteersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  }

  async checkIfUserHasPassword(email: string): Promise<boolean | null> {
    try {
      const volunteersRef = collection(this.db, 'volunteers');
      const q = query(volunteersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null; // Email not registered
      }

      // Check the hasPassword field in Firestore
      const volunteerData = querySnapshot.docs[0].data();
      
      // If hasPassword field exists, use it
      if (volunteerData['hasPassword'] !== undefined) {
        return volunteerData['hasPassword'] === true;
      }
      
      // Fallback: try signing in with dummy password to check
      try {
        await signInWithEmailAndPassword(this.auth, email, '__test__invalid__');
        return true;
      } catch (authError: any) {
        // If we get invalid-login-credentials, account exists
        if (authError.code === 'auth/invalid-login-credentials' || 
            authError.code === 'auth/wrong-password' ||
            authError.code === 'auth/invalid-credential') {
          // Update Firestore with hasPassword flag
          const volunteerDoc = querySnapshot.docs[0];
          await updateDoc(doc(this.db, 'volunteers', volunteerDoc.id), {
            hasPassword: true
          });
          return true;
        }
        return false;
      }
    } catch (error) {
      console.log('Error in checkIfUserHasPassword:', error);
      return null;
    }
  }

  async createPasswordForExistingUser(email: string, password: string): Promise<{ success: boolean; error?: any }> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Update Firestore to mark that user has password
      const volunteersRef = collection(this.db, 'volunteers');
      const q = query(volunteersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const volunteerDoc = querySnapshot.docs[0];
        await updateDoc(doc(this.db, 'volunteers', volunteerDoc.id), {
          hasPassword: true
        });
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: { message: error.message } };
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; error?: any }> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: { message: error.message } };
    }
  }
}
