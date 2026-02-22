import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-appointments-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments-page.html',
})
export class AppointmentsPage implements OnInit {
  loading = true;
  appointments: Appointment[] = [];
  collisions: Array<[Appointment, Appointment]> = [];

  constructor(private appointmentsService: AppointmentsService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.appointmentsService.list().subscribe({
      next: (data) => {
        this.appointments = data;
        this.collisions = this.findCollisions(data);
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    });
  }

  // Algorithmus: Overlap prüfen (startA < endB && startB < endA)
  private findCollisions(list: Appointment[]): Array<[Appointment, Appointment]> {
    const sorted = [...list].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    const res: Array<[Appointment, Appointment]> = [];

    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        // Optimierung: wenn nächster Start nach Ende ist -> break
        if (new Date(sorted[j].start).getTime() >= new Date(sorted[i].end).getTime()) break;

        if (this.overlaps(sorted[i], sorted[j])) {
          res.push([sorted[i], sorted[j]]);
        }
      }
    }
    return res;
  }

  private overlaps(a: Appointment, b: Appointment): boolean {
    const aStart = new Date(a.start).getTime();
    const aEnd = new Date(a.end).getTime();
    const bStart = new Date(b.start).getTime();
    const bEnd = new Date(b.end).getTime();
    return aStart < bEnd && bStart < aEnd;
  }
}