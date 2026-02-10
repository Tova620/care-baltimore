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
  lastCheckedEmail = '';

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

    const result = await this.authService.resetPassword(email);
    
    if (result.success) {
      this.successMessage = 'If an account exists with this email, a password reset link will be sent. Check your inbox and spam folder.';
      this.errorMessage = '';
    } else {
      this.errorMessage = result.error?.message || 'Failed to send reset email';
      this.successMessage = '';
    }
  }
}
