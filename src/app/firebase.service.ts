import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);

  async submitVolunteerForm(data: any) {
    try {
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
}