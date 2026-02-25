import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import Chart from 'chart.js/auto';

import { MATERIAL } from '../../../shared/material';
import { PatientsService } from '../../../core/services/patients.service';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { Patient } from '../../../core/models/patient.model';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, ...MATERIAL],
  templateUrl: './dashboard-page.html',
  styleUrls: ['./dashboard-page.scss'],
})
export class DashboardPage implements OnInit, AfterViewInit, OnDestroy {
  loading = true;

  totalPatients = 0;
  totalAppointments = 0;
  avgAppointmentMinutes = 0;
  todayAppointments = 0;

  private patients: Patient[] = [];
  private appointments: Appointment[] = [];

  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef<HTMLCanvasElement>;

  private barChart?: Chart;
  private doughnutChart?: Chart;

  private viewReady = false;
  private dataReady = false;

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
        this.patients = patients;
        this.appointments = appointments;

        this.totalPatients = patients.length;
        this.totalAppointments = appointments.length;

        const minutes = appointments.map(a => this.diffMinutes(a.start, a.end));
        this.avgAppointmentMinutes = minutes.length
          ? Math.round(minutes.reduce((s, m) => s + m, 0) / minutes.length)
          : 0;

        const today = new Date().toISOString().slice(0, 10);
        this.todayAppointments = appointments.filter(a => a.start.slice(0, 10) === today).length;

        this.loading = false;

        this.dataReady = true;
        this.tryRenderCharts();
      },
      error: (err) => {
        console.error('DASHBOARD ERROR:', err);
        this.loading = false;
      },
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.tryRenderCharts();
  }

  ngOnDestroy(): void {
    this.barChart?.destroy();
    this.doughnutChart?.destroy();
  }

  private tryRenderCharts(): void {
    if (!this.viewReady || !this.dataReady) return;

    // sorgt dafür, dass Layout fertig ist
    requestAnimationFrame(() => this.renderCharts());
  }

  private renderCharts(): void {
    const barEl = this.barCanvas?.nativeElement;
    const doughnutEl = this.doughnutCanvas?.nativeElement;
    if (!barEl || !doughnutEl) return;

    // Alte Charts weg (z.B. bei HMR / Navigation)
    this.barChart?.destroy();
    this.doughnutChart?.destroy();

    // ----- Bar: Termine pro Tag (nächste 7 Tage) -----
    const days = this.nextDays(7);
    const barLabels = days.map(d => d.label);
    const barData = days.map(d => this.countAppointmentsForDay(d.key));

    this.barChart = new Chart(barEl, {
      type: 'bar',
      data: {
        labels: barLabels,
        datasets: [{ label: 'Appointments', data: barData }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    });

    // ----- Doughnut: Versicherung -----
    const insuranceMap = this.groupInsurance(this.patients);

    this.doughnutChart = new Chart(doughnutEl, {
      type: 'doughnut',
      data: {
        labels: Object.keys(insuranceMap),
        datasets: [{ label: 'Insurance', data: Object.values(insuranceMap) }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
      },
    });
  }

  // ---------- helpers ----------

  private diffMinutes(startIso: string, endIso: string): number {
    const s = new Date(startIso).getTime();
    const e = new Date(endIso).getTime();
    return Math.max(0, Math.round((e - s) / 60000));
  }

  private dateKey(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private nextDays(n: number): Array<{ key: string; label: string }> {
    const out: Array<{ key: string; label: string }> = [];
    const base = new Date();
    base.setHours(0, 0, 0, 0);

    for (let i = 0; i < n; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const key = this.dateKey(d);
      const label = d.toLocaleDateString(undefined, {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
      });
      out.push({ key, label });
    }
    return out;
  }

  private countAppointmentsForDay(dayKey: string): number {
    return this.appointments.filter(a => this.dateKey(new Date(a.start)) === dayKey).length;
  }

  private groupInsurance(patients: Patient[]): Record<string, number> {
    const map: Record<string, number> = {};
    for (const p of patients) {
      const key = (p.insurance || 'unknown').toLowerCase();
      map[key] = (map[key] ?? 0) + 1;
    }
    return map;
  }
}