import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-sign-up-for-visits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCheckboxModule, MatTooltipModule],
  templateUrl: './sign-up-for-visits.component.html',
  styleUrls: ['./sign-up-for-visits.component.scss']
})
export class SignUpForVisitsComponent implements OnInit {
  visitForm!: FormGroup;
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Shabbos', 'Sunday', 'Any', 'Chanukah only'];
  selectedDays: string[] = [];

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    const waiverText = `CARE (Connecting and Reaching Elderly) – Elder Participant Consent and Agreement

This Consent and Agreement Form ("Agreement") is entered into by the undersigned individual ("Participant") or their authorized representative, and CARE ("CARE," "we," "us," or "our") in connection with CARE's community-based volunteer visitation program.

1. Purpose of Participation
CARE is a nonprofit organization that coordinates volunteer visits to elderly individuals in the community to foster social connection, reduce loneliness, and promote emotional well-being.

By signing this agreement, the Participant (or their legal representative) agrees to receive visits or participation from volunteers under the CARE program.

2. Voluntary Participation
Participation in the CARE program is entirely voluntary. The Participant understands that they may choose to end participation at any time by notifying a CARE coordinator.

3. Assumption of Risk and Release of Liability
By signing this agreement, the Participant (or authorized representative) acknowledges and agrees to the following:

While CARE volunteers are expected to act respectfully and responsibly, CARE cannot guarantee the behavior or actions of volunteers.

CARE does not provide medical, emergency, or licensed caregiving services.

CARE is not responsible for any personal injury, illness, emotional distress, or property damage that may occur during or as a result of volunteer visits or participation in CARE activities.

Accordingly, the Participant or their representative hereby releases CARE, its officers, staff, volunteers, and affiliates from all liability, claims, or damages arising from:

Personal or emotional injury;
Property loss or damage;
Any incident occurring during or after a CARE-related visit.

4. Photo and Media Release
By participating in the CARE program, the Participant (or their representative) grants CARE and its affiliates the unconditional and irrevocable right to photograph, record, and use the Participant's image, likeness, voice, and any related recordings for promotional, educational, and fundraising purposes.`;

    this.visitForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      pointOfContact: ['', Validators.required],
      relationship: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      preferredDays: [[]],

      waiver: [waiverText],
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
    if (event.target.checked) {
      if (!this.selectedDays.includes(day)) {
        this.selectedDays.push(day);
      }
    } else {
      const index = this.selectedDays.indexOf(day);
      if (index >= 0) {
        this.selectedDays.splice(index, 1);
      }
    }
    this.visitForm.get('preferredDays')?.setValue([...this.selectedDays]);
  }

  getSubmitTooltip(): string {
    if (this.visitForm.valid) {
      return 'Click to submit your visit request';
    }
    
    const missingFields: string[] = [];
    
    if (this.visitForm.get('fullName')?.invalid) missingFields.push('Full Name');
    if (this.visitForm.get('address')?.invalid) missingFields.push('Address');
    if (this.visitForm.get('pointOfContact')?.invalid) missingFields.push('Point of Contact');
    if (this.visitForm.get('gender')?.invalid) missingFields.push('Gender');
    if (this.visitForm.get('phone')?.invalid) missingFields.push('Phone');
    if (this.visitForm.get('email')?.invalid) missingFields.push('Email');
    if (this.visitForm.get('relationship')?.invalid) missingFields.push('Relationship');
    if (this.visitForm.get('agree')?.invalid) missingFields.push('Terms Agreement');
    
    return `Please complete: ${missingFields.join(', ')}`;
  }

  async onSubmit() {
    if (this.visitForm.valid) {
      const formData = this.visitForm.value;

      const data = {
        fullName: formData.fullName,
        address: formData.address,
        pointOfContact: formData.pointOfContact,
        relationship: formData.relationship,
        phone: formData.phone,
        email: formData.email,
        gender: formData.gender,
        preferredDays: formData.preferredDays || this.selectedDays,
        agree: formData.agree
      };

      const result = await this.firebaseService.submitVisitRequest(data);

      if (result.success) {
        alert('Thank you! Your visit request has been submitted. We will contact you soon.');
        this.visitForm.reset();
        this.selectedDays = [];
        // Reset form to initial state
        const waiverText = `CARE (Connecting and Reaching Elderly) – Elder Participant Consent and Agreement

This Consent and Agreement Form ("Agreement") is entered into by the undersigned individual ("Participant") or their authorized representative, and CARE ("CARE," "we," "us," or "our") in connection with CARE's community-based volunteer visitation program.

1. Purpose of Participation
CARE is a nonprofit organization that coordinates volunteer visits to elderly individuals in the community to foster social connection, reduce loneliness, and promote emotional well-being.

By signing this agreement, the Participant (or their legal representative) agrees to receive visits or participation from volunteers under the CARE program.

2. Voluntary Participation
Participation in the CARE program is entirely voluntary. The Participant understands that they may choose to end participation at any time by notifying a CARE coordinator.

3. Assumption of Risk and Release of Liability
By signing this agreement, the Participant (or authorized representative) acknowledges and agrees to the following:

While CARE volunteers are expected to act respectfully and responsibly, CARE cannot guarantee the behavior or actions of volunteers.

CARE does not provide medical, emergency, or licensed caregiving services.

CARE is not responsible for any personal injury, illness, emotional distress, or property damage that may occur during or as a result of volunteer visits or participation in CARE activities.

Accordingly, the Participant or their representative hereby releases CARE, its officers, staff, volunteers, and affiliates from all liability, claims, or damages arising from:

Personal or emotional injury;
Property loss or damage;
Any incident occurring during or after a CARE-related visit.

4. Photo and Media Release
By participating in the CARE program, the Participant (or their representative) grants CARE and its affiliates the unconditional and irrevocable right to photograph, record, and use the Participant's image, likeness, voice, and any related recordings for promotional, educational, and fundraising purposes.`;
        this.visitForm.patchValue({
          fullName: '',
          address: '',
          pointOfContact: '',
          relationship: '',
          phone: '',
          email: '',
          gender: '',
          preferredDays: [],
          waiver: waiverText,
          agree: false
        });
      } else {
        alert('There was an error submitting your request. Please try again.');
        console.error('Firebase error:', result.error);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.visitForm.controls).forEach(key => {
        this.visitForm.get(key)?.markAsTouched();
      });
    }
  }

}
