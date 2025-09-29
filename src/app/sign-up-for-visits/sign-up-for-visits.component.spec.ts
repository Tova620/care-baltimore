import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpForVisitsComponent } from './sign-up-for-visits.component';

describe('SignUpForVisitsComponent', () => {
  let component: SignUpForVisitsComponent;
  let fixture: ComponentFixture<SignUpForVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpForVisitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpForVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
