import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="d-flex align-items-center">
      <mat-icon class="me-2 text-warning">warning</mat-icon>
      {{ data.title }}
    </h2>
    
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    
    <mat-dialog-actions class="d-flex justify-content-end">
      <button mat-button (click)="onCancel()">
        {{ data.cancelText || 'Cancel' }}
      </button>
      <button mat-raised-button color="warn" (click)="onConfirm()" class="ms-2">
        {{ data.confirmText || 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      margin: 16px 0;
    }
    
    mat-dialog-actions {
      padding: 16px 0 0 0;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
