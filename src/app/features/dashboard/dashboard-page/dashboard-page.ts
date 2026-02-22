import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientsService } from '../../../core/services/patients.service';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { Patient } from '../../../core/models/patient.model';
import { Appointment } from '../../../core/models/appointment.model';


@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-page.html',
})
export class DashboardPage implements OnInit {
  loading = true;
  totalPatients = 0;
  totalAppointments = 0;
  avgAppointmentMinutes = 0;
  todayAppointments = 0;

  patients: Patient[] = [];
  appointments: Appointment[] = [];

    // Simple “today” stat
  constructor(
    private patientsService: PatientsService,
    private appointmentsService: AppointmentsService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;

    this.patientsService.list().subscribe({
      next: (p) => {
        this.patients = p;
        this.totalPatients = p.length;
        this.finishIfReady();
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    });

    this.appointmentsService.list().subscribe({
      next: (a) => {
        this.appointments = a;
        this.totalAppointments = a.length;

        const minutes = a.map(x => this.diffMinutes(x.start, x.end));
        this.avgAppointmentMinutes = minutes.length
          ? Math.round(minutes.reduce((s, m) => s + m, 0) / minutes.length)
          : 0;

        const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
        this.todayAppointments = a.filter(x => x.start.slice(0, 10) === today).length;

        this.finishIfReady();
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    });
  }

  private finishIfReady(): void {
    // Wenn beide Arrays geladen wurden
    if (this.patients.length >= 0 && this.appointments.length >= 0) {
      this.loading = false;
    }
  }

  private diffMinutes(startIso: string, endIso: string): number {
    const s = new Date(startIso).getTime();
    const e = new Date(endIso).getTime();
    return Math.max(0, Math.round((e - s) / 60000));
  }
}