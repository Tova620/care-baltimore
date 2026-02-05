import { Injectable } from '@angular/core';
import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { environment } from '../environments/environment';

let firebaseApp: FirebaseApp;

try {
  firebaseApp = getApp();
} catch {
  firebaseApp = initializeApp(environment.firebase);
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = firebaseApp;
  private db = getFirestore(this.app);
  private auth = getAuth(this.app);

  async submitVolunteerForm(data: any) {
    try {
      // Create Firebase Auth user
      await createUserWithEmailAndPassword(this.auth, data.email, data.password);
      
      const docRef = await addDoc(collection(this.db, 'volunteers'), {
        fullName: data.fullName,
        age: data.age,
        gender: data.gender,
        phone: data.phone,
        email: data.email,
        isStudent: data.isStudent,
        school: data.school || '',
        volunteerPreferences: data.volunteerPreference,
        preferredDays: data.preferredDays || [],
        agree: data.agree,
        submittedAt: new Date()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error };
    }
  }

  async submitVisitRequest(data: any) {
    try {
      const docRef = await addDoc(collection(this.db, 'visitRequests'), {
        fullName: data.fullName,
        address: data.address,
        pointOfContact: data.pointOfContact,
        gender: data.gender,
        relationship: data.relationship || '',
        phone: data.phone,
        email: data.email,
        preferredDays: data.preferredDays || [],
        agree: data.agree,
        submittedAt: new Date()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error };
    }
  }

  async submitVisitLog(data: any) {
    try {
      const docRef = await addDoc(collection(this.db, 'visitLogs'), {
        email: data.email,
        name: data.name,
        visitedPerson: data.visitedPerson,
        visitDate: data.visitDate,
        notes: data.notes || '',
        submittedAt: new Date()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error };
    }
  }
}