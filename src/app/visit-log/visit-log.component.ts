import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { FirebaseService } from '../firebase.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-visit-log',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './visit-log.component.html',
  styleUrls: ['./visit-log.component.scss']
})
export class VisitLogComponent implements OnInit {
  visitLogForm!: FormGroup;
  volunteerData: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) {
    this.visitLogForm = this.fb.group({
      email: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }],
      visitedPerson: ['', Validators.required],
      visitDate: ['', Validators.required],
      notes: ['']
    });
  }

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user?.email) {
      this.volunteerData = await this.authService.getVolunteerData(user.email);
      this.visitLogForm.patchValue({
        email: user.email,
        name: this.volunteerData?.fullName || ''
      });
    }
  }

  async onSubmit() {
    if (this.visitLogForm.valid) {
      const formData = this.visitLogForm.getRawValue();
      const result = await this.firebaseService.submitVisitLog(formData);

      if (result.success) {
        alert('Visit log submitted successfully!');
        this.visitLogForm.patchValue({
          visitedPerson: '',
          visitDate: '',
          notes: ''
        });
      } else {
        alert('Failed to submit visit log. Please try again.');
      }
    }
  }
}
