import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../../../shared/material';
import { Patient } from '../../../core/models/patient.model';

@Component({
  selector: 'app-add-appointment-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL],
  templateUrl: './add-appointment-dialog.html',
  styleUrls: ['./add-appointment-dialog.scss'],
})
export class AddAppointmentDialog {
  form: FormGroup;
  patients: Patient[] = [];
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<AddAppointmentDialog>
  ) {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      reason: ['', Validators.required],
    });
  }

  setPatients(p: Patient[]) {
    this.patients = p;
  }

  cancel() {
    this.ref.close();
  }

  save() {
    if (this.form.invalid) {
      this.error = 'Bitte alle Felder ausfüllen';
      return;
    }

    const v = this.form.value;

    this.ref.close({
      patientId: v.patientId,
      start: v.start,
      end: v.end,
      reason: v.reason,
    });
  }
}