import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanukahComponent } from './chanukah.component';

describe('ChanukahComponent', () => {
  let component: ChanukahComponent;
  let fixture: ComponentFixture<ChanukahComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChanukahComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChanukahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
