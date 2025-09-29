import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoshHashanaComponent } from './rosh-hashana.component';

describe('RoshHashanaComponent', () => {
  let component: RoshHashanaComponent;
  let fixture: ComponentFixture<RoshHashanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoshHashanaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoshHashanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
