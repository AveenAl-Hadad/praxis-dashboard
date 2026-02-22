import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';
import { switchMap } from 'rxjs/operators';
/**
 * Service CRUD
 * 
 */
@Injectable({ providedIn: 'root' })
export class PatientsService {
  private readonly baseUrl = 'http://localhost:3000/patients';

  constructor(private http: HttpClient) {}

  list(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.baseUrl);
  }

   create(payload: Omit<Patient, 'id'>): Observable<Patient> {
  return this.list().pipe(
    switchMap(list => {
      const maxId = Math.max(...list.map(p => Number(p.id)), 0);
      return this.http.post<Patient>(this.baseUrl, {
        id: maxId + 1,
        ...payload
      });
    })
  );
}
 
}
