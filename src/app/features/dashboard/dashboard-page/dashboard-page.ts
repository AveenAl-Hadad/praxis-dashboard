import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MATERIAL } from '../../../shared/material';
import { PatientsService } from '../../../core/services/patients.service';
import { AppointmentsService } from '../../../core/services/appointments.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, ...MATERIAL],
  templateUrl: './dashboard-page.html',
})
export class DashboardPage implements OnInit {
  loading = true;

  totalPatients = 0;
  totalAppointments = 0;
  avgAppointmentMinutes = 0;
  todayAppointments = 0;

  constructor(
    private patientsService: PatientsService,
    private appointmentsService: AppointmentsService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    forkJoin({
      patients: this.patientsService.list(),
      appointments: this.appointmentsService.list(),
    }).subscribe({
      next: ({ patients, appointments }) => {
        this.totalPatients = patients.length;
        this.totalAppointments = appointments.length;

        const minutes = appointments.map(a => this.diffMinutes(a.start, a.end));
        this.avgAppointmentMinutes = minutes.length
          ? Math.round(minutes.reduce((s, m) => s + m, 0) / minutes.length)
          : 0;

        const today = new Date().toISOString().slice(0, 10);
        this.todayAppointments = appointments.filter(a => a.start?.slice(0, 10) === today).length;

        this.loading = false;
      },
      error: (err) => {
        console.error('DASHBOARD ERROR:', err);
        this.loading = false;
      }
    });
  }

  private diffMinutes(startIso: string, endIso: string): number {
    const s = new Date(startIso).getTime();
    const e = new Date(endIso).getTime();
    return Math.max(0, Math.round((e - s) / 60000));
  }
}