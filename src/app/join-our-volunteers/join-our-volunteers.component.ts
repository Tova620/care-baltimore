import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FirebaseService} from '../firebase.service';

@Component({
  selector: 'app-join-our-volunteers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatTooltipModule],
  templateUrl: './join-our-volunteers.component.html',
  styleUrls: ['./join-our-volunteers.component.scss']
})
export class JoinOurVolunteersComponent implements OnInit {
  volunteerForm!: FormGroup;
  preferences: string[] = ['Rosh Hashana', 'Chanukah', 'Purim', 'Home visits'];
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Shabbos', 'Any'];
  selectedDays: string[] = [];


  constructor(private fb: FormBuilder,
              private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    const waiverText = `CARE (Connecting and Reaching Elderly) – Volunteer Consent and Agreement

This Consent and Agreement Form ("Agreement") is entered into by the undersigned individual ("Volunteer") and CARE ("CARE," "we," "us," or "our") in connection with CARE's community-based volunteer visitation program.

1. Purpose of Volunteering
CARE is a nonprofit organization that coordinates volunteer visits to elderly individuals in the community to foster social connection, reduce loneliness, and promote emotional well-being.

By signing this agreement, the Volunteer agrees to participate in CARE's volunteer program and visit elderly participants as coordinated by CARE.

2. Voluntary Participation
Volunteering with CARE is entirely voluntary. The Volunteer understands that they may choose to end their volunteer service at any time by notifying a CARE coordinator.

3. Assumption of Risk and Release of Liability
By signing this agreement, the Volunteer acknowledges and agrees to the following:

While CARE participants are expected to be respectful, CARE cannot guarantee the behavior or actions of participants.

CARE does not provide medical, emergency, or licensed caregiving services, and volunteers are not expected to provide such services.

CARE is not responsible for any personal injury, illness, emotional distress, or property damage that may occur during or as a result of volunteer visits or participation in CARE activities.

Accordingly, the Volunteer hereby releases CARE, its officers, staff, other volunteers, and affiliates from all liability, claims, or damages arising from:

Personal or emotional injury;
Property loss or damage;
Any incident occurring during or after a CARE-related visit.

4. Photo and Media Release
By volunteering with CARE, the Volunteer grants CARE and its affiliates the unconditional and irrevocable right to photograph, record, and use the Volunteer's image, likeness, voice, and any related recordings for promotional, educational, and fundraising purposes.`;

    this.volunteerForm = this.fb.group({
      fullName: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      isStudent: [false],
      school: [''],
      volunteerPreference: [[], Validators.required],  // New preference field with default empty array

      waiver: [waiverText],
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
    const isChecked = event.target.checked;

    if (isChecked) {
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
    if (event.target.checked) {
      if (!this.selectedDays.includes(day)) {
        this.selectedDays.push(day);
      }
    } else {
      this.selectedDays = this.selectedDays.filter(d => d !== day);
    }
  }

  getSubmitTooltip(): string {
    if (this.volunteerForm.valid) {
      return 'Click to submit your volunteer application';
    }

    const missingFields: string[] = [];

    if (this.volunteerForm.get('fullName')?.invalid) missingFields.push('Full Name');
    if (this.volunteerForm.get('age')?.invalid) missingFields.push('Age');
    if (this.volunteerForm.get('gender')?.invalid) missingFields.push('Gender');
    if (this.volunteerForm.get('phone')?.invalid) missingFields.push('Phone');
    if (this.volunteerForm.get('email')?.invalid) missingFields.push('Email');
    if (this.volunteerForm.get('school')?.invalid) missingFields.push('School');
    if (this.volunteerForm.get('volunteerPreference')?.invalid) missingFields.push('Volunteer Preferences');
    if (this.volunteerForm.get('agree')?.invalid) missingFields.push('Terms Agreement');

    return `Please complete: ${missingFields.join(', ')}`;
  }

  async onSubmit() {
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
        preferredDays: this.selectedDays,
        agree: formData.agree
      };

      const result = await this.firebaseService.submitVolunteerForm(data);

      if (result.success) {
        alert('Thank you! Your volunteer application has been submitted.');
        this.volunteerForm.reset();
        this.selectedDays = [];
        // Reset form to initial state
        const waiverText = `CARE (Connecting and Reaching Elderly) – Volunteer Terms and Agreement

This Volunteer Terms and Agreement ("Agreement") is made between CARE (Connecting and Reaching Elderly) ("CARE," "we," "us," or "our") and the undersigned volunteer ("Volunteer," "you," or "your"). By participating in any volunteer activity with CARE, you agree to the terms below.

1. Purpose of the Program
CARE is a community initiative connecting volunteers of all ages with elderly citizens to promote companionship, engagement, and emotional well-being through visits and community support.

2. Assumption of Risk and Release of Liability
By signing this agreement and participating in CARE activities, you acknowledge and agree to the following:

You understand that visiting elderly citizens in their homes, traveling to and from visit locations, or participating in any CARE-sponsored or affiliated activities involves certain risks, including but not limited to injury, property damage, illness, accidents, or unforeseen incidents.

You voluntarily assume all risks associated with volunteering, including transportation (whether by private vehicle, public transit, or other means), personal interaction, and all activities related to or performed on behalf of CARE.

You hereby release, waive, and discharge CARE, its officers, directors, coordinators, staff, affiliates, and partners from any and all liability, claims, demands, causes of action, or expenses (including attorney's fees) arising out of or related to:

Any personal injury, illness, or death;
Any damage or loss to personal property;
Any accident or incident occurring during or as a result of volunteering, including driving to and from volunteer assignments.

3. Insurance Disclaimer
CARE does not provide health, medical, automobile, or liability insurance for volunteers. Volunteers are encouraged to maintain their own insurance coverage.

4. Volunteer Conduct and Responsibility
Volunteers are expected to:

Treat all elderly individuals and their environments with respect and dignity.
Maintain confidentiality regarding any personal or sensitive information.
Not offer medical advice, perform physical assistance (e.g., lifting or moving individuals), or provide personal care services unless specifically trained and authorized to do so.
Follow all instructions, safety guidelines, and local laws while participating in CARE activities.

CARE reserves the right to remove or disqualify any volunteer whose behavior is deemed unsafe, inappropriate, or inconsistent with CARE's mission and values.

5. Photo and Media Release
By participating as a volunteer, you grant CARE and its affiliates the irrevocable right to take and use photographs, video, and/or audio recordings of you in connection with CARE activities for promotional, educational, and fundraising purposes. This includes use in print, digital, and social media platforms.

You waive the right to inspect or approve the finished product wherein your likeness appears, and you release CARE from any claims related to the use of your image or voice, including any compensation or royalties.

If you do not wish to be photographed or recorded, you must notify CARE in writing prior to participation.

6. Acknowledgment and Acceptance
By signing or electronically agreeing to this Agreement, you acknowledge that:

You have read and understood this document in its entirety.
You agree to abide by all CARE policies and expectations.
You are participating voluntarily and at your own risk.
You are either over the age of 18 or have obtained permission from a parent/guardian if under 18.`;
        this.volunteerForm.patchValue({
          fullName: '',
          age: '',
          gender: '',
          phone: '',
          email: '',
          isStudent: false,
          school: '',
          volunteerPreference: [],
          waiver: waiverText,
          agree: false
        });
      } else {
        alert('There was an error submitting your application. Please try again.');
        console.error('Firebase error:', result.error);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.volunteerForm.controls).forEach(key => {
        this.volunteerForm.get(key)?.markAsTouched();
      });
    }
  }

}
