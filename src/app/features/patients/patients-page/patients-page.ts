import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MATERIAL } from '../../../shared/material';
import { PatientsService } from '../../../core/services/patients.service';
import { Patient } from '../../../core/models/patient.model';
import { AddPatientDialog } from '../add-patient-dialog/add-patient-dialog';

@Component({
  selector: 'app-patients-page',
  standalone: true,
  imports: [CommonModule, ...MATERIAL],
  templateUrl: './patients-page.html',
})
export class PatientsPage implements OnInit {
  loading = false;
  patients: Patient[] = [];
  displayedColumns = ['id', 'name', 'birthDate', 'insurance'];

  constructor(private svc: PatientsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    if (this.loading) return;
    this.loading = true;

    this.svc.list().subscribe({
      next: (data) => (this.patients = data),
      error: (e) => console.error(e),
      complete: () => (this.loading = false),
    });
  }

  openAdd(): void {
    this.dialog.open(AddPatientDialog, { width: '720px' })
      .afterClosed()
      .subscribe(payload => {
        if (!payload) return;

        this.svc.create(payload).subscribe({
          next: (created) => {
            this.patients = [...this.patients, created]; // ✅ sofort sichtbar
          },
          error: (e) => console.error(e),
        });
      });
  }

  trackById(i: number, p: Patient) {
    return p.id;
  }
}