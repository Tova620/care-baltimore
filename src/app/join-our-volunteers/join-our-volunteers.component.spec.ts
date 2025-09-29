import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinOurVolunteersComponent } from './join-our-volunteers.component';

describe('JoinOurVolunteersComponent', () => {
  let component: JoinOurVolunteersComponent;
  let fixture: ComponentFixture<JoinOurVolunteersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinOurVolunteersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinOurVolunteersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
