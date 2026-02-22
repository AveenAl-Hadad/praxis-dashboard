import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientDialog } from './add-patient-dialog';

describe('AddPatientDialog', () => {
  let component: AddPatientDialog;
  let fixture: ComponentFixture<AddPatientDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPatientDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPatientDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
