import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientsService {
  private readonly baseUrl = 'http://localhost:3000/patients';

  constructor(private http: HttpClient) {}

  list(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.baseUrl);
  }

  get(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/${id}`);
  }

  create(payload: Omit<Patient, 'id'>): Observable<Patient> {
    return this.http.post<Patient>(this.baseUrl, payload);
  }

  update(id: number, payload: Omit<Patient, 'id'>): Observable<Patient> {
    return this.http.put<Patient>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
