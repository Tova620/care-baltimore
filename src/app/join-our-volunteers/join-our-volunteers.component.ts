import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";

@Component({
  selector: 'app-join-our-volunteers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './join-our-volunteers.component.html',
  styleUrls: ['./join-our-volunteers.component.scss']
})
export class JoinOurVolunteersComponent implements OnInit {
  volunteerForm!: FormGroup;
  preferences: string[] = ['Rosh Hashana', 'Chanukah', 'Purim', 'Bi-weekly visits'];
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Shabbos', 'Any'];
  selectedDays: string[] = [];


  constructor(private fb: FormBuilder,
              private http: HttpClient) {}

  ngOnInit(): void {
    this.volunteerForm = this.fb.group({
      fullName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      isStudent: [false],
      school: [''],
      volunteerPreference: [[], Validators.required],  // New preference field with default empty array
      waiver: [''],
      agree: [false, Validators.requiredTrue]  // Agreement is mandatory
    });

    this.toggleSchoolValidation();
  }

  toggleSchoolValidation() {

    // Handle the conditional validation for 'school' based on 'isStudent'
    this.volunteerForm.get('isStudent')?.valueChanges.subscribe((isStudent: boolean) => {
      if (isStudent) {
        this.volunteerForm.get('school')?.setValidators(Validators.required);  // Make school required if student
      } else {
        this.volunteerForm.get('school')?.clearValidators();  // Remove required validator if not student
      }
      this.volunteerForm.get('school')?.updateValueAndValidity();
    });

    // Ensure the correct validator is applied when the form is first loaded
    if (!this.volunteerForm.get('isStudent')?.value) {
      this.volunteerForm.get('school')?.clearValidators();
      this.volunteerForm.get('school')?.updateValueAndValidity();
    }
  }

  // Method to check if the preference is selected
  isPreferenceSelected(preference: string): boolean {
    const preferences = this.volunteerForm.get('volunteerPreference')?.value || [];
    return preferences.indexOf(preference) !== -1;
  }

  // Update preferences when a checkbox is clicked
  onPreferenceChange(event: any, preference: string): void {
    const preferences = this.volunteerForm.get('volunteerPreference')?.value;

    if (event.checked) {
      // If checked, add to the array if not already there
      if (!preferences.includes(preference)) {
        preferences.push(preference);
      }
    } else {
      // If unchecked, remove from the array
      const index = preferences.indexOf(preference);
      if (index >= 0) {
        preferences.splice(index, 1);
      }
    }

    // Update the form control with the modified preferences array
    this.volunteerForm.get('volunteerPreference')?.setValue([...preferences]);
  }

  toggleDaySelection(day: string, event: any): void {
    if (event.checked) {
      this.selectedDays.push(day);
    } else {
      this.selectedDays = this.selectedDays.filter(d => d !== day);
    }
  }

  onSubmit() {
    if (this.volunteerForm.valid) {
      const formData = this.volunteerForm.value;

      const data = {
        fullName: formData.fullName,
        age: formData.age,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        isStudent: formData.isStudent,
        school: formData.school,
        volunteerPreference: formData.volunteerPreference,
        preferredDays: this.selectedDays,  // if you're capturing days for "Bi-weekly"
        waiver: formData.waiver,
        agree: formData.agree
      };

      // 🔗 PLACE YOUR DEPLOYED SCRIPT URL HERE
      const url = 'https://script.google.com/macros/s/AKfycbx0sLk5JR_PVyHVraHnh_dQ4JKxLCOnY1lsq3D4O5sGuKF0aSIZjqYOkBMDhn1wJlfE/exec';

      this.http.post(url, data).subscribe({
        next: (res) => {
          console.log('Success:', res);
          this.volunteerForm.reset();
          this.selectedDays = [];  // Clear selected days if used
        },
        error: (err) => {
          console.error('Failed:', err);
        }
      });

    } else {
      console.log('Form is invalid');
    }
  }

}
