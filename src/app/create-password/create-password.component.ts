import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss']
})
export class CreatePasswordComponent {
  createPasswordForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Clear error messages when form values change
    this.createPasswordForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
      this.successMessage = '';
    });
  }

  async onSubmit() {
    if (this.createPasswordForm.valid) {
      const { email, password } = this.createPasswordForm.value;

      const result = await this.authService.createPasswordForExistingUser(email, password);
      
      if (result.success) {
        this.successMessage = 'Password created successfully! Redirecting to sign in...';
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/sign-in']);
        }, 2000);
      } else {
        this.errorMessage = result.error?.message || 'Failed to create password';
        this.successMessage = '';
      }
    }
  }

  goToSignIn() {
    this.router.navigate(['/sign-in']);
  }
}
