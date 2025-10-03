import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AppointmentService } from '../../services/appointment.service';
import { AppointmentWithStatus } from '../../models/appointment.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="modern-dashboard">
      <!-- Dashboard Header -->
      <div class="dashboard-header fade-in">
        <div class="header-content">
          <div class="header-title">
            <h1 class="dashboard-title">
              <mat-icon class="title-icon">dashboard</mat-icon>
              Dashboard
            </h1>
            <p class="dashboard-subtitle">Manage your appointments efficiently</p>
          </div>
          <div class="header-actions d-none d-md-block">
            <button mat-raised-button color="primary" routerLink="/appointments/new" class="btn-modern-primary">
              <mat-icon class="me-1">add_circle</mat-icon>
              New Appointment
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid slide-up" *ngIf="!loading && appointments.length > 0">
        <div class="stat-card">
          <div class="stat-icon stat-total">
            <mat-icon>event</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ appointments.length }}</div>
            <div class="stat-label">Total Appointments</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-today">
            <mat-icon>today</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ getTodayAppointments() }}</div>
            <div class="stat-label">Today's Appointments</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-upcoming">
            <mat-icon>schedule</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ getUpcomingAppointments() }}</div>
            <div class="stat-label">Upcoming</div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <div class="loading-spinner">
          <mat-spinner diameter="60"></mat-spinner>
          <h3 class="loading-text">Loading your appointments...</h3>
          <p class="loading-subtext">Please wait while we fetch your data</p>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && appointments.length === 0" class="empty-state scale-in">
        <div class="empty-state-content">
          <div class="empty-state-icon">
            <mat-icon>calendar_month</mat-icon>
          </div>
          <h2 class="empty-state-title">No appointments yet</h2>
          <p class="empty-state-description">
            Start managing your healthcare by booking your first appointment. 
            It's quick and easy!
          </p>
          <button mat-raised-button color="primary" routerLink="/appointments/new" class="btn-modern-primary">
            <mat-icon class="me-1">add_circle</mat-icon>
            Book Your First Appointment
          </button>
        </div>
      </div>

      <!-- Appointments Grid -->
      <div *ngIf="!loading && appointments.length > 0" class="appointments-section">
        <div class="section-header">
          <h2 class="section-title">Your Appointments</h2>
          <div class="section-actions d-none d-md-flex">
            <button mat-stroked-button class="filter-btn">
              <mat-icon class="me-1">filter_list</mat-icon>
              Filter
            </button>
            <button mat-stroked-button class="sort-btn">
              <mat-icon class="me-1">sort</mat-icon>
              Sort
            </button>
          </div>
        </div>

        <div class="appointments-grid">
          <div *ngFor="let appointment of appointments; trackBy: trackByAppointment; let i = index" 
               class="appointment-card-wrapper"
               [style.animation-delay.ms]="i * 100">
            <div class="modern-appointment-card slide-up" 
                 [ngClass]="'status-' + appointment.status">
              
              <!-- Card Header -->
              <div class="card-header">
                <div class="patient-info">
                  <div class="patient-avatar">
                    <mat-icon>person</mat-icon>
                  </div>
                  <div class="patient-details">
                    <h3 class="patient-name">{{ appointment.patientName }}</h3>
                    <p class="doctor-name">
                      <mat-icon class="doctor-icon">medical_services</mat-icon>
                      {{ appointment.doctorName }}
                    </p>
                  </div>
                </div>
                <div class="status-badge" [ngClass]="'status-' + appointment.status">
                  <mat-icon class="status-icon">{{ getStatusIcon(appointment.status) }}</mat-icon>
                  <span class="status-text">{{ appointment.statusLabel }}</span>
                </div>
              </div>

              <!-- Card Content -->
              <div class="card-content">
                <div class="appointment-datetime">
                  <div class="datetime-primary">
                    <mat-icon class="datetime-icon">event</mat-icon>
                    <span class="date-text">{{ formatDate(appointment.startTime) }}</span>
                  </div>
                  <div class="datetime-secondary">
                    <mat-icon class="time-icon">access_time</mat-icon>
                    <span class="time-text">
                      {{ formatTime(appointment.startTime) }} - {{ formatTime(appointment.endTime) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Card Actions -->
              <div class="card-actions">
                <button mat-button class="action-btn edit-btn" 
                        [routerLink]="['/appointments/edit', appointment.id]">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-button class="action-btn delete-btn" 
                        (click)="deleteAppointment(appointment)">
                  <mat-icon>delete</mat-icon>
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modern-dashboard {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
    }

    .dashboard-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .title-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: var(--primary-color);
    }

    .dashboard-subtitle {
      color: var(--text-secondary);
      font-size: 1.125rem;
      margin: 0.5rem 0 0 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: var(--surface-color);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .stat-icon {
      width: 3rem;
      height: 3rem;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon mat-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .stat-total {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    }

    .stat-today {
      background: linear-gradient(135deg, var(--warning-color), #fbbf24);
    }

    .stat-upcoming {
      background: linear-gradient(135deg, var(--success-color), #34d399);
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .loading-spinner {
      text-align: center;
    }

    .loading-text {
      margin: 1.5rem 0 0.5rem 0;
      color: var(--text-primary);
      font-weight: 600;
    }

    .loading-subtext {
      color: var(--text-secondary);
      margin: 0;
    }

    .empty-state {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 500px;
    }

    .empty-state-content {
      text-align: center;
      max-width: 400px;
    }

    .empty-state-icon {
      font-size: 5rem;
      width: 5rem;
      height: 5rem;
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    .empty-state-title {
      font-size: 1.875rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .empty-state-description {
      color: var(--text-secondary);
      font-size: 1.125rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .appointments-section {
      margin-top: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .section-actions {
      display: flex;
      gap: 0.75rem;
    }

    .appointments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .appointment-card-wrapper {
      animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
    }

    .modern-appointment-card {
      background: var(--surface-color);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .modern-appointment-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .modern-appointment-card.status-upcoming {
      border-left: 4px solid var(--primary-color);
    }

    .modern-appointment-card.status-today {
      border-left: 4px solid var(--warning-color);
    }

    .modern-appointment-card.status-past {
      border-left: 4px solid var(--text-muted);
    }

    .card-header {
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .patient-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }

    .patient-avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .patient-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }

    .doctor-name {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .status-badge {
      padding: 0.375rem 0.75rem;
      border-radius: var(--radius-lg);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex-shrink: 0;
    }

    .status-badge.status-upcoming {
      background: rgba(99, 102, 241, 0.1);
      color: var(--primary-color);
    }

    .status-badge.status-today {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning-color);
    }

    .status-badge.status-past {
      background: rgba(156, 163, 175, 0.1);
      color: var(--text-muted);
    }

    .card-content {
      padding: 0 1.5rem 1.5rem 1.5rem;
      flex: 1;
    }

    .appointment-datetime {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .datetime-primary, .datetime-secondary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .datetime-icon, .time-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
      color: var(--primary-color);
    }

    .date-text {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .time-text {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .card-actions {
      padding: 1rem 1.5rem;
      background: var(--surface-hover);
      border-top: 1px solid var(--border-light);
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .action-btn {
      display: flex !important;
      align-items: center !important;
      gap: 0.25rem !important;
      padding: 0.5rem 1rem !important;
      border-radius: var(--radius-md) !important;
      font-weight: 500 !important;
      transition: all 0.2s ease !important;
    }

    .edit-btn {
      color: var(--primary-color) !important;
    }

    .edit-btn:hover {
      background: rgba(99, 102, 241, 0.1) !important;
    }

    .delete-btn {
      color: var(--error-color) !important;
    }

    .delete-btn:hover {
      background: rgba(239, 68, 68, 0.1) !important;
    }

    @media (max-width: 768px) {
      .dashboard-title {
        font-size: 2rem;
      }

      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .appointments-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `]
})
export class AppointmentListComponent implements OnInit {
  appointments: AppointmentWithStatus[] = [];
  loading = true;

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments.sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.snackBar.open(error.message, 'Close', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  deleteAppointment(appointment: AppointmentWithStatus): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Cancel Appointment',
        message: `Are you sure you want to cancel the appointment for ${appointment.patientName} with ${appointment.doctorName}?`,
        confirmText: 'Cancel Appointment',
        cancelText: 'Keep Appointment'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.deleteAppointment(appointment.id).subscribe({
          next: () => {
            this.snackBar.open('Appointment cancelled successfully', 'Close', { duration: 3000 });
            this.loadAppointments();
          },
          error: (error) => {
            console.error('Error deleting appointment:', error);
            this.snackBar.open(error.message, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  trackByAppointment(index: number, appointment: AppointmentWithStatus): number {
    return appointment.id;
  }

  getTodayAppointments(): number {
    const today = new Date();
    const todayStr = today.toDateString();
    return this.appointments.filter(appointment => 
      new Date(appointment.startTime).toDateString() === todayStr
    ).length;
  }

  getUpcomingAppointments(): number {
    const now = new Date();
    return this.appointments.filter(appointment => 
      new Date(appointment.startTime) > now
    ).length;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'today':
        return 'today';
      case 'upcoming':
        return 'schedule';
      case 'past':
        return 'history';
      default:
        return 'event';
    }
  }
}
