export interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  startTime: string;
  endTime: string;
}

export interface CreateAppointmentRequest {
  patientName: string;
  doctorName: string;
  startTime: string;
  endTime: string;
}

export interface UpdateAppointmentRequest extends CreateAppointmentRequest {
  id: number;
}

export enum AppointmentStatus {
  UPCOMING = 'upcoming',
  TODAY = 'today',
  PAST = 'past'
}

export interface AppointmentWithStatus extends Appointment {
  status: AppointmentStatus;
  statusLabel: string;
  statusColor: string;
}
