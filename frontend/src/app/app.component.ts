import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div class="modern-app">
      <!-- Modern Header -->
      <header class="modern-header">
        <mat-toolbar>
          <div class="d-flex align-items-center">
            <div class="app-logo">
              <mat-icon class="logo-icon">medical_services</mat-icon>
            </div>
            <div class="app-title">
              <h1 class="mb-0">MediCare</h1>
              <small class="app-subtitle">Appointment Management</small>
            </div>
          </div>
          
          <span class="spacer"></span>
          
          <nav class="nav-links d-none d-md-flex">
            <button mat-button routerLink="/appointments" routerLinkActive="active" class="nav-btn">
              <mat-icon class="me-1">dashboard</mat-icon>
              Dashboard
            </button>
            <button mat-button routerLink="/appointments/new" routerLinkActive="active" class="nav-btn">
              <mat-icon class="me-1">add_circle</mat-icon>
              New Appointment
            </button>
          </nav>
          
          <div class="header-actions">
            <button mat-icon-button (click)="toggleTheme()" matTooltip="Toggle Dark Mode" class="theme-btn">
              <mat-icon>{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</mat-icon>
            </button>
          </div>
        </mat-toolbar>
      </header>

      <!-- Mobile Navigation -->
      <nav class="mobile-nav d-md-none">
        <div class="container-fluid">
          <div class="row">
            <div class="col-6">
              <button mat-button routerLink="/appointments" routerLinkActive="active" class="mobile-nav-btn w-100">
                <mat-icon>dashboard</mat-icon>
                <span>Dashboard</span>
              </button>
            </div>
            <div class="col-6">
              <button mat-button routerLink="/appointments/new" routerLinkActive="active" class="mobile-nav-btn w-100">
                <mat-icon>add_circle</mat-icon>
                <span>New</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <div class="container-fluid">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Floating Action Button for Mobile -->
      <button mat-fab class="fab-mobile d-md-none" routerLink="/appointments/new" matTooltip="New Appointment">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .modern-app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .modern-header {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .app-logo {
      margin-right: 1rem;
    }

    .logo-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: white;
    }

    .app-title h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      letter-spacing: -0.025em;
    }

    .app-subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
      font-weight: 400;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .nav-links {
      gap: 0.5rem;
    }

    .nav-btn {
      color: rgba(255, 255, 255, 0.9) !important;
      border-radius: 0.5rem !important;
      padding: 0.5rem 1rem !important;
      transition: all 0.2s ease !important;
    }

    .nav-btn:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
      color: white !important;
    }

    .nav-btn.active {
      background-color: rgba(255, 255, 255, 0.15) !important;
      color: white !important;
    }

    .theme-btn {
      color: rgba(255, 255, 255, 0.9) !important;
      margin-left: 0.5rem;
    }

    .theme-btn:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
      color: white !important;
    }

    .mobile-nav {
      background: var(--surface-color);
      border-bottom: 1px solid var(--border-light);
      padding: 0.5rem 0;
    }

    .mobile-nav-btn {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 0.25rem !important;
      padding: 0.75rem !important;
      color: var(--text-secondary) !important;
      border-radius: 0.5rem !important;
    }

    .mobile-nav-btn.active {
      color: var(--primary-color) !important;
      background-color: rgba(99, 102, 241, 0.1) !important;
    }

    .mobile-nav-btn span {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .main-content {
      flex: 1;
      padding: 2rem 0;
      background: var(--background-color);
    }

    .fab-mobile {
      position: fixed !important;
      bottom: 2rem;
      right: 2rem;
      background: var(--primary-color) !important;
      color: white !important;
      z-index: 1000;
    }

    @media (max-width: 768px) {
      .app-title h1 {
        font-size: 1.25rem;
      }
      
      .app-subtitle {
        font-size: 0.75rem;
      }
      
      .main-content {
        padding: 1rem 0;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'MediCare Appointment Management';
  isDarkMode = false;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme() {
    if (this.isDarkMode) {
      this.renderer.setAttribute(this.document.documentElement, 'data-theme', 'dark');
    } else {
      this.renderer.removeAttribute(this.document.documentElement, 'data-theme');
    }
  }
}
