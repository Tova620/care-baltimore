import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurimComponent } from './purim.component';

describe('PurimComponent', () => {
  let component: PurimComponent;
  let fixture: ComponentFixture<PurimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurimComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
