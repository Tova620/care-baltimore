import { Injectable } from '@angular/core';
import { getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
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

      // Check if user has Firebase Auth account
      try {
        const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);
        console.log('Sign in methods for', email, ':', signInMethods);
        return signInMethods.length > 0;
      } catch (authError: any) {
        console.log('Auth error:', authError);
        // If fetchSignInMethodsForEmail fails, assume they need to create password
        if (authError.code === 'auth/invalid-email') {
          return null;
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
      return { success: true };
    } catch (error: any) {
      return { success: false, error: { message: error.message } };
    }
  }
}
