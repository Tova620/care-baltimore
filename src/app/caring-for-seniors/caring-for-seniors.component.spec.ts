import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaringForSeniorsComponent } from './caring-for-seniors.component';

describe('CaringForSeniorsComponent', () => {
  let component: CaringForSeniorsComponent;
  let fixture: ComponentFixture<CaringForSeniorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaringForSeniorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaringForSeniorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
