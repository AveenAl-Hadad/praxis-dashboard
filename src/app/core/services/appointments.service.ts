import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  private baseUrl = 'http://localhost:3000/appointments';

  constructor(private http: HttpClient) {}

  list(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseUrl);
  }
  create(payload: Omit<Appointment, 'id'>): Observable<Appointment> {
    return this.http.post<Appointment>(this.baseUrl, payload);
  }
}