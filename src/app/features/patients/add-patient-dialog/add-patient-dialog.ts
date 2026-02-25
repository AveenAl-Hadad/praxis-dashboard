import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../../../shared/material';

@Component({
  selector: 'app-add-patient-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL],
  templateUrl: './add-patient-dialog.html',
  styleUrls: ['./add-patient-dialog.scss']
})
export class AddPatientDialog {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<AddPatientDialog>
  ) {
    // ✅ WICHTIG: Zuweisung an this.form
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: [null, Validators.required], // Datepicker gibt Date oder null
      insurance: ['gesetzlich', Validators.required],
    });
  }

  cancel(): void {
    this.ref.close();
  }

  save(): void {
    if (this.form.invalid) return;

    const v = this.form.value as any;

    this.ref.close({
      firstName: v.firstName,
      lastName: v.lastName,
      birthDate: (v.birthDate as Date).toISOString().slice(0, 10),
      insurance: v.insurance,
    });
  }
}