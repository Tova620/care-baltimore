import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyVisitsComponent } from './weekly-visits.component';

describe('WeeklyVisitsComponent', () => {
  let component: WeeklyVisitsComponent;
  let fixture: ComponentFixture<WeeklyVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyVisitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
