import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-sign-up-for-visits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatCheckboxModule],
  templateUrl: './sign-up-for-visits.component.html',
  styleUrls: ['./sign-up-for-visits.component.scss']
})
export class SignUpForVisitsComponent implements OnInit {
  visitForm!: FormGroup;
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Shabbos', 'Sunday', 'Any'];
  selectedDays: string[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.visitForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      pointOfContact: ['', Validators.required],
      relationship: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      preferredDays: [[]],
      waiver: [''],
      agree: [false, Validators.requiredTrue]
    });

    // Show "relationship" only when "Other" is selected
    this.visitForm.get('pointOfContact')?.valueChanges.subscribe((value) => {
      const relControl = this.visitForm.get('relationship');
      if (value === 'Other') {
        relControl?.setValidators(Validators.required);
      } else {
        relControl?.clearValidators();
        relControl?.setValue('');
      }
      relControl?.updateValueAndValidity();
    });
  }

  toggleDaySelection(day: string, event: any) {
    const selected = this.selectedDays;
    if (event.checked) {
      if (!selected.includes(day)) selected.push(day);
    } else {
      const index = selected.indexOf(day);
      if (index >= 0) selected.splice(index, 1);
    }
    this.visitForm.get('preferredDays')?.setValue([...selected]);
  }

  onSubmit() {
    if (this.visitForm.valid) {
      // Convert selectedDays array to comma-separated string
      const preferredDaysString = this.selectedDays.join(', ');

      // Set that string into the form control before submission
      this.visitForm.patchValue({
        preferredDays: preferredDaysString
      });

      const formData = this.visitForm.value;

      this.http.post('https://carebaltimore.org/send-to-sheet.php', {
        fullName: formData.fullName,
        address: formData.address,
        pointOfContact: formData.pointOfContact,
        relationship: formData.relationship,
        phone: formData.phone,
        email: formData.email,
        gender: formData.gender,
        preferredDays: formData.preferredDays,
        waiver: formData.waiver,
        agree: formData.agree
      }).subscribe({
        next: (res) => console.log('Success:', res),
        error: (err) => console.error('Error:', err),
      });
    } else {
      console.log('Form is invalid');
    }
  }

}
