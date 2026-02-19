import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientsService } from '../../../core/services/patients.service';
import { Patient } from '../../../core/models/patient.model';

@Component({
  selector: 'app-patients-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patients-page.html'
})
export class PatientsPage implements OnInit {

  loading = true;
  patients: Patient[] = [];

  constructor(private patientsService: PatientsService) {}

  ngOnInit(): void {
    this.refresh();
  }

refresh(): void {
  this.loading = true;

  this.patientsService.list().subscribe({
    next: data => {
      this.patients = data;
      this.loading = false;
    },
    error: err => {
      console.error('API error:', err);
      this.loading = false;   // <- wichtig
      alert('API Fehler: ' + (err?.message ?? 'unknown'));
    }
  });
}

}
