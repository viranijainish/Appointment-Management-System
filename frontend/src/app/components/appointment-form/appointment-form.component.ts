import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AppointmentService } from '../../services/appointment.service';
import { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="row justify-content-center">
      <div class="col-lg-8 col-xl-6">
        <mat-card class="fade-in">
          <mat-card-header>
            <mat-card-title class="d-flex align-items-center">
              <mat-icon class="me-2">{{ isEditMode ? 'edit' : 'add' }}</mat-icon>
              {{ isEditMode ? 'Edit Appointment' : 'Book New Appointment' }}
            </mat-card-title>
            <mat-card-subtitle>
              {{ isEditMode ? 'Update appointment details' : 'Fill in the appointment information' }}
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()" class="mt-3">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <mat-form-field appearance="outline">
                    <mat-label>Patient Name</mat-label>
                    <input matInput 
                           formControlName="patientName" 
                           placeholder="Enter patient name"
                           maxlength="100">
                    <mat-icon matSuffix>person</mat-icon>
                    <mat-error *ngIf="appointmentForm.get('patientName')?.hasError('required')">
                      Patient name is required
                    </mat-error>
                    <mat-error *ngIf="appointmentForm.get('patientName')?.hasError('maxlength')">
                      Patient name cannot exceed 100 characters
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="col-md-6 mb-3">
                  <mat-form-field appearance="outline">
                    <mat-label>Doctor</mat-label>
                    <mat-select formControlName="doctorName" placeholder="Select doctor">
                      <mat-option *ngFor="let doctor of doctors" [value]="doctor">
                        {{ doctor }}
                      </mat-option>
                    </mat-select>
                    <mat-icon matSuffix>medical_services</mat-icon>
                    <mat-error *ngIf="appointmentForm.get('doctorName')?.hasError('required')">
                      Doctor selection is required
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="col-md-6 mb-3">
                  <mat-form-field appearance="outline">
                    <mat-label>Start Date & Time</mat-label>
                    <input matInput 
                           type="datetime-local" 
                           formControlName="startTime"
                           [min]="minDateTime">
                    <mat-icon matSuffix>schedule</mat-icon>
                    <mat-error *ngIf="appointmentForm.get('startTime')?.hasError('required')">
                      Start time is required
                    </mat-error>
                    <mat-error *ngIf="appointmentForm.get('startTime')?.hasError('pastDate')">
                      Cannot book appointments in the past
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="col-md-6 mb-3">
                  <mat-form-field appearance="outline">
                    <mat-label>End Date & Time</mat-label>
                    <input matInput 
                           type="datetime-local" 
                           formControlName="endTime"
                           [min]="minDateTime">
                    <mat-icon matSuffix>schedule</mat-icon>
                    <mat-error *ngIf="appointmentForm.get('endTime')?.hasError('required')">
                      End time is required
                    </mat-error>
                    <mat-error *ngIf="appointmentForm.get('endTime')?.hasError('invalidEndTime')">
                      End time must be after start time
                    </mat-error>
                  </mat-form-field>
                </div>
              </div>
            </form>
          </mat-card-content>

          <mat-card-actions class="d-flex justify-content-between p-3">
            <button mat-button type="button" (click)="goBack()">
              <mat-icon class="me-1">arrow_back</mat-icon>
              Back to List
            </button>
            
            <div>
              <button mat-button 
                      type="button" 
                      (click)="resetForm()" 
                      [disabled]="loading">
                <mat-icon class="me-1">refresh</mat-icon>
                Reset
              </button>
              
              <button mat-raised-button 
                      color="primary" 
                      type="submit" 
                      (click)="onSubmit()"
                      [disabled]="appointmentForm.invalid || loading"
                      class="ms-2">
                <mat-spinner *ngIf="loading" diameter="20" class="me-2"></mat-spinner>
                <mat-icon *ngIf="!loading" class="me-1">{{ isEditMode ? 'save' : 'add' }}</mat-icon>
                {{ isEditMode ? 'Update' : 'Book' }} Appointment
              </button>
            </div>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    mat-card {
      margin-top: 20px;
    }
    
    mat-form-field {
      width: 100%;
    }
    
    .mat-mdc-card-actions {
      padding: 16px 24px;
    }
    
    mat-spinner {
      display: inline-block;
    }
  `]
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  isEditMode = false;
  appointmentId: number | null = null;
  loading = false;
  minDateTime: string = '';

  doctors = [
    'Dr. Smith',
    'Dr. Johnson', 
    'Dr. Williams',
    'Dr. Brown',
    'Dr. Davis',
    'Dr. Wilson',
    'Dr. Miller',
    'Dr. Taylor'
  ];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.appointmentForm = this.createForm();
    this.setMinDateTime();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.appointmentId = +params['id'];
        this.loadAppointment();
      }
    });

    // Auto-set end time when start time changes
    this.appointmentForm.get('startTime')?.valueChanges.subscribe(startTime => {
      if (startTime) {
        const start = new Date(startTime);
        const end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour
        this.appointmentForm.get('endTime')?.setValue(
          end.toISOString().slice(0, 16)
        );
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      patientName: ['', [Validators.required, Validators.maxLength(100)]],
      doctorName: ['', Validators.required],
      startTime: ['', [Validators.required, this.pastDateValidator]],
      endTime: ['', [Validators.required, this.endTimeValidator.bind(this)]]
    });
  }

  private setMinDateTime(): void {
    const now = new Date();
    this.minDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 16);
  }

  private pastDateValidator(control: any) {
    if (control.value) {
      const selectedDate = new Date(control.value);
      const now = new Date();
      if (selectedDate < now) {
        return { pastDate: true };
      }
    }
    return null;
  }

  private endTimeValidator(control: any) {
    if (control.value && this.appointmentForm) {
      const startTime = this.appointmentForm.get('startTime')?.value;
      if (startTime) {
        const start = new Date(startTime);
        const end = new Date(control.value);
        if (end <= start) {
          return { invalidEndTime: true };
        }
      }
    }
    return null;
  }

  private loadAppointment(): void {
    if (this.appointmentId) {
      this.loading = true;
      this.appointmentService.getAppointment(this.appointmentId).subscribe({
        next: (appointment) => {
          this.appointmentForm.patchValue({
            patientName: appointment.patientName,
            doctorName: appointment.doctorName,
            startTime: this.formatDateTimeForInput(appointment.startTime),
            endTime: this.formatDateTimeForInput(appointment.endTime)
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading appointment:', error);
          this.snackBar.open(error.message, 'Close', { duration: 5000 });
          this.loading = false;
          this.goBack();
        }
      });
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      this.loading = true;
      const formValue = this.appointmentForm.value;

      if (this.isEditMode && this.appointmentId) {
        const updateRequest: UpdateAppointmentRequest = {
          id: this.appointmentId,
          ...formValue
        };

        this.appointmentService.updateAppointment(this.appointmentId, updateRequest).subscribe({
          next: () => {
            this.snackBar.open('Appointment updated successfully!', 'Close', { duration: 3000 });
            this.goBack();
          },
          error: (error) => {
            console.error('Error updating appointment:', error);
            this.snackBar.open(error.message, 'Close', { duration: 5000 });
            this.loading = false;
          }
        });
      } else {
        const createRequest: CreateAppointmentRequest = formValue;

        this.appointmentService.createAppointment(createRequest).subscribe({
          next: () => {
            this.snackBar.open('Appointment booked successfully!', 'Close', { duration: 3000 });
            this.goBack();
          },
          error: (error) => {
            console.error('Error creating appointment:', error);
            this.snackBar.open(error.message, 'Close', { duration: 5000 });
            this.loading = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm(): void {
    this.appointmentForm.reset();
    if (this.isEditMode) {
      this.loadAppointment();
    }
  }

  goBack(): void {
    this.router.navigate(['/appointments']);
  }

  private formatDateTimeForInput(dateString: string): string {
    const date = new Date(dateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 16);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.appointmentForm.controls).forEach(key => {
      const control = this.appointmentForm.get(key);
      control?.markAsTouched();
    });
  }
}
