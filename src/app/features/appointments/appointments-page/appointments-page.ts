import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { MATERIAL } from '../../../shared/material';

import { Appointment } from '../../../core/models/appointment.model';
import { Patient } from '../../../core/models/patient.model';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { PatientsService } from '../../../core/services/patients.service';
import { AddAppointmentDialog } from '../add-appointment-dialog/add-appointment-dialog';

@Component({
  selector: 'app-appointments-page',
  standalone: true,
  imports: [CommonModule, ...MATERIAL],
  templateUrl: './appointments-page.html',
})
export class AppointmentsPage implements OnInit {
  loading = false;

  patients: Patient[] = [];
  appointments: Appointment[] = [];

  displayedColumns = ['start', 'end', 'patient', 'reason'];

  constructor(
    private appointmentsService: AppointmentsService,
    private patientsService: PatientsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    if (this.loading) return;
    this.loading = true;

    // patients & appointments parallel laden
    this.patientsService.list().subscribe({
      next: (p) => (this.patients = p),
      error: console.error,
    });

    this.appointmentsService.list()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (a) => (this.appointments = a),
        error: (e) => console.error(e),
      });
  }

  openAdd(): void {
    const ref = this.dialog.open(AddAppointmentDialog, { width: '780px' });
    ref.componentInstance.setPatients(this.patients);

    ref.afterClosed().subscribe((payload: Omit<Appointment, 'id'> | undefined) => {
      if (!payload) return;

      // ✅ Collision check
      const conflict = this.appointments.find(a => this.overlaps(a, payload));
      if (conflict) {
        alert(`Kollision mit Termin #${conflict.id}\n${conflict.start} – ${conflict.end}`);
        return;
      }

      this.appointmentsService.create(payload).subscribe({
        next: (created) => {
          // ✅ Optimistic update
          this.appointments = [...this.appointments, created].sort(
            (x, y) => new Date(x.start).getTime() - new Date(y.start).getTime()
          );
        },
        error: (e) => console.error(e),
      });
    });
  }

  patientName(id: string): string {
    const p = this.patients.find(x => x.id === id);
    return p ? `${p.firstName} ${p.lastName}` : `Patient #${id}`;
  }

  trackById(i: number, a: Appointment) {
    return a.id;
  }

  private overlaps(existing: Appointment, incoming: Omit<Appointment, 'id'>): boolean {
    const aStart = new Date(existing.start).getTime();
    const aEnd = new Date(existing.end).getTime();
    const bStart = new Date(incoming.start).getTime();
    const bEnd = new Date(incoming.end).getTime();
    return aStart < bEnd && bStart < aEnd;
  }
}