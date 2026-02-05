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
  passwordPlaceholder = 'Enter your password';
  passwordLabel = 'Password';
  isCreatingPassword = false;

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

  async checkEmail() {
    const email = this.signInForm.get('email')?.value;
    this.emailErrorMessage = '';
    
    if (email && this.signInForm.get('email')?.valid) {
      console.log('Checking email:', email);
      const hasPassword = await this.authService.checkIfUserHasPassword(email);
      console.log('Has password result:', hasPassword);
      
      if (hasPassword === null) {
        this.emailErrorMessage = 'Email not registered. Try a different one or sign up as a volunteer.';
      } else if (hasPassword === false) {
        this.passwordPlaceholder = 'Create your password';
        this.passwordLabel = 'Create Password';
        this.isCreatingPassword = true;
      } else {
        this.passwordPlaceholder = 'Enter your password';
        this.passwordLabel = 'Password';
        this.isCreatingPassword = false;
      }
    }
  }

  async onSubmit() {
    if (this.signInForm.valid) {
      const { email, password } = this.signInForm.value;
      
      // First try to sign in
      const signInResult = await this.authService.signIn(email, password);
      
      if (signInResult.success) {
        this.router.navigate(['/visit-log']);
      } else if (signInResult.error?.message?.includes('not registered')) {
        this.errorMessage = signInResult.error.message;
      } else {
        // If sign in fails, try to create account
        const createResult = await this.authService.createPasswordForExistingUser(email, password);
        if (createResult.success) {
          this.router.navigate(['/visit-log']);
        } else {
          this.errorMessage = 'Invalid email or password';
        }
      }
    }
  }
}
