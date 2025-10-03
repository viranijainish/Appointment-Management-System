using Microsoft.EntityFrameworkCore;
using AppointmentManagement.API.Models;

namespace AppointmentManagement.API.Data
{
    public class AppointmentContext : DbContext
    {
        public AppointmentContext(DbContextOptions<AppointmentContext> options) : base(options)
        {
        }

        public DbSet<Appointment> Appointments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure Appointment entity
            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.PatientName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.DoctorName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.StartTime).IsRequired();
                entity.Property(e => e.EndTime).IsRequired();
            });
        }
    }
}
