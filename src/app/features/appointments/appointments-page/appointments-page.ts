// Angular Core-Module importieren
import { Component, OnInit } from '@angular/core';

// Basisfunktionen wie *ngIf, *ngFor usw.
import { CommonModule } from '@angular/common';

// Angular Material Dialog (Popup-Fenster)
import { MatDialog } from '@angular/material/dialog';

// RxJS Operator → wird ausgeführt wenn Observable fertig ist (success oder error)
import { finalize } from 'rxjs';

// Eigene Material-Sammeldatei (wahrscheinlich mit allen verwendeten Material-Komponenten)
import { MATERIAL } from '../../../shared/material';

// Datenmodelle
import { Appointment } from '../../../core/models/appointment.model';
import { Patient } from '../../../core/models/patient.model';

// Services für API-Kommunikation
import { AppointmentsService } from '../../../core/services/appointments.service';
import { PatientsService } from '../../../core/services/patients.service';

// Dialog-Komponente zum Hinzufügen eines Termins
import { AddAppointmentDialog } from '../add-appointment-dialog/add-appointment-dialog';


@Component({
  selector: 'app-appointments-page',   // HTML-Tag für diese Komponente
  standalone: true,                    // Standalone Component (kein NgModule nötig)
  imports: [CommonModule, ...MATERIAL], // Module die diese Komponente braucht
  templateUrl: './appointments-page.html', // HTML Template
})
export class AppointmentsPage implements OnInit {

  // Zeigt an, ob gerade Daten geladen werden
  loading = false;

  // Speichert geladene Patienten
  patients: Patient[] = [];

  // Speichert geladene Termine
  appointments: Appointment[] = [];

  // Spalten für eine Material-Tabelle
  displayedColumns = ['start', 'end', 'patient', 'reason'];

  constructor(
    private appointmentsService: AppointmentsService, // Termin-Service
    private patientsService: PatientsService,         // Patienten-Service
    private dialog: MatDialog                         // Dialog-Service
  ) {}

  // Lifecycle-Hook → wird beim Start der Komponente ausgeführt
  ngOnInit(): void {
    this.loadAll();
  }

  // Lädt Patienten und Termine
  loadAll(): void {
    // Verhindert mehrfaches Laden
    if (this.loading) return;

    this.loading = true;

    // Patienten laden (parallel)
    this.patientsService.list().subscribe({
      next: (p) => (this.patients = p), // Ergebnis speichern
      error: console.error,             // Fehler loggen
    });

    // Termine laden
    this.appointmentsService.list()
      .pipe(
        // Wird IMMER ausgeführt (egal ob success oder error)
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (a) => (this.appointments = a), // Termine speichern
        error: (e) => console.error(e),
      });
  }

  // Öffnet das Dialogfenster zum Hinzufügen eines Termins
  openAdd(): void {

    // Dialog öffnen
    const ref = this.dialog.open(AddAppointmentDialog, { width: '780px' });

    // Patientenliste an Dialog übergeben
    ref.componentInstance.setPatients(this.patients);

    // Wird ausgeführt wenn Dialog geschlossen wird
    ref.afterClosed().subscribe((payload: Omit<Appointment, 'id'> | undefined) => {

      // Wenn Dialog abgebrochen wurde → nichts tun
      if (!payload) return;

      // ✅ Kollisionsprüfung (überlappende Termine)
      const conflict = this.appointments.find(a => this.overlaps(a, payload));

      if (conflict) {
        alert(`Kollision mit Termin #${conflict.id}\n${conflict.start} – ${conflict.end}`);
        return;
      }

      // Termin an Backend senden
      this.appointmentsService.create(payload).subscribe({
        next: (created) => {

          // ✅ Optimistic Update:
          // Neuer Termin wird direkt lokal hinzugefügt
          // danach sortieren wir nach Startzeit
          this.appointments = [...this.appointments, created].sort(
            (x, y) =>
              new Date(x.start).getTime() -
              new Date(y.start).getTime()
          );
        },
        error: (e) => console.error(e),
      });
    });
  }

  // Gibt den vollständigen Namen eines Patienten anhand der ID zurück
  patientName(id: string): string {
    const p = this.patients.find(x => x.id === id);

    return p
      ? `${p.firstName} ${p.lastName}`
      : `Patient #${id}`; // Fallback falls Patient nicht gefunden wird
  }

  // Performance-Optimierung für *ngFor
  // Angular erkennt dadurch Elemente über ihre ID
  trackById(i: number, a: any) {
    return a.id;
  }

  // Prüft ob sich zwei Termine zeitlich überschneiden
  private overlaps(
    existing: Appointment,
    incoming: Omit<Appointment, 'id'>
  ): boolean {

    const aStart = new Date(existing.start).getTime();
    const aEnd   = new Date(existing.end).getTime();

    const bStart = new Date(incoming.start).getTime();
    const bEnd   = new Date(incoming.end).getTime();

    // Zwei Zeiträume überlappen wenn:
    // Start A < Ende B  UND  Start B < Ende A
    return aStart < bEnd && bStart < aEnd;
  }
}