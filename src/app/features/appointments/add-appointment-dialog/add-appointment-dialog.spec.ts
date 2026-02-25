import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppointmentDialog } from './add-appointment-dialog';

describe('AddAppointmentDialog', () => {
  let component: AddAppointmentDialog;
  let fixture: ComponentFixture<AddAppointmentDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAppointmentDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAppointmentDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
