import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { 
  Appointment, 
  CreateAppointmentRequest, 
  UpdateAppointmentRequest, 
  AppointmentWithStatus, 
  AppointmentStatus 
} from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly apiUrl = this.getApiUrl();
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  private getApiUrl(): string {
    // Check if running in Docker (nginx proxy) or locally
    const isDocker = window.location.port === '8081' || window.location.hostname !== 'localhost';
    return isDocker ? '/api/appointments' : 'http://localhost:5184/api/appointments';
  }

  getAppointments(): Observable<AppointmentWithStatus[]> {
    return this.http.get<Appointment[]>(this.apiUrl, this.httpOptions).pipe(
      map(appointments => appointments.map(appointment => this.addStatusToAppointment(appointment))),
      catchError(this.handleError)
    );
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createAppointment(appointment: CreateAppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateAppointment(id: number, appointment: UpdateAppointmentRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, appointment, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private addStatusToAppointment(appointment: Appointment): AppointmentWithStatus {
    const startTime = new Date(appointment.startTime);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const appointmentDate = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());

    let status: AppointmentStatus;
    let statusLabel: string;
    let statusColor: string;

    if (appointmentDate.getTime() === today.getTime()) {
      status = AppointmentStatus.TODAY;
      statusLabel = 'Today';
      statusColor = 'warn';
    } else if (startTime < now) {
      status = AppointmentStatus.PAST;
      statusLabel = 'Past';
      statusColor = 'basic';
    } else {
      status = AppointmentStatus.UPCOMING;
      statusLabel = 'Upcoming';
      statusColor = 'primary';
    }

    return {
      ...appointment,
      status,
      statusLabel,
      statusColor
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please make sure the backend API is running.';
      } else if (error.status >= 400 && error.status < 500) {
        errorMessage = error.error || `Client error: ${error.status}`;
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    }

    console.error('AppointmentService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
