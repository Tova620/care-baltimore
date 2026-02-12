import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  signInForm: FormGroup;
  errorMessage = '';
  emailErrorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  goToCreatePassword() {
    this.router.navigate(['/create-password']);
  }

  async onSubmit() {
    if (this.signInForm.valid) {
      const { email, password } = this.signInForm.value;

      const signInResult = await this.authService.signIn(email, password);

      if (signInResult.success) {
        this.router.navigate(['/visit-log']);
      } else {
        this.errorMessage = signInResult.error?.message || 'Invalid email or password';
      }
    }
  }

  async onForgotPassword() {
    const email = this.signInForm.get('email')?.value;
    
    if (!email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    // Check if user has a password first
    const hasPassword = await this.authService.checkIfUserHasPassword(email);
    
    if (hasPassword === null) {
      this.errorMessage = 'Email not registered as a volunteer';
      this.successMessage = '';
      return;
    }
    
    if (!hasPassword) {
      this.errorMessage = 'You need to create a password first. Please contact the administrator.';
      this.successMessage = '';
      return;
    }

    const result = await this.authService.resetPassword(email);
    
    if (result.success) {
      this.successMessage = 'Password reset link sent. Check your inbox and spam folder.';
      this.errorMessage = '';
    } else {
      this.errorMessage = result.error?.message || 'Failed to send reset email';
      this.successMessage = '';
    }
  }
}
