using Microsoft.EntityFrameworkCore;
using AppointmentManagement.API.Data;
using AppointmentManagement.API.Models;

namespace AppointmentManagement.API.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly AppointmentContext _context;
        private readonly ILogger<AppointmentRepository> _logger;

        public AppointmentRepository(AppointmentContext context, ILogger<AppointmentRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Appointment>> GetAllAsync()
        {
            try
            {
                _logger.LogInformation("Retrieving all appointments");
                return await _context.Appointments
                    .OrderBy(a => a.StartTime)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all appointments");
                throw;
            }
        }

        public async Task<Appointment?> GetByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation("Retrieving appointment with ID: {Id}", id);
                return await _context.Appointments.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving appointment with ID: {Id}", id);
                throw;
            }
        }

        public async Task<Appointment> CreateAsync(Appointment appointment)
        {
            try
            {
                _logger.LogInformation("Creating new appointment for patient: {PatientName}", appointment.PatientName);
                
                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Successfully created appointment with ID: {Id}", appointment.Id);
                return appointment;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating appointment for patient: {PatientName}", appointment.PatientName);
                throw;
            }
        }

        public async Task<Appointment?> UpdateAsync(int id, Appointment appointment)
        {
            try
            {
                _logger.LogInformation("Updating appointment with ID: {Id}", id);
                
                var existingAppointment = await _context.Appointments.FindAsync(id);
                if (existingAppointment == null)
                {
                    _logger.LogWarning("Appointment with ID: {Id} not found for update", id);
                    return null;
                }

                // Update properties
                existingAppointment.PatientName = appointment.PatientName;
                existingAppointment.DoctorName = appointment.DoctorName;
                existingAppointment.StartTime = appointment.StartTime;
                existingAppointment.EndTime = appointment.EndTime;

                _context.Entry(existingAppointment).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Successfully updated appointment with ID: {Id}", id);
                return existingAppointment;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating appointment with ID: {Id}", id);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                _logger.LogInformation("Deleting appointment with ID: {Id}", id);
                
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null)
                {
                    _logger.LogWarning("Appointment with ID: {Id} not found for deletion", id);
                    return false;
                }

                _context.Appointments.Remove(appointment);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Successfully deleted appointment with ID: {Id}", id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting appointment with ID: {Id}", id);
                throw;
            }
        }

        public async Task<bool> HasOverlappingAppointmentAsync(string doctorName, DateTime startTime, DateTime endTime, int? excludeId = null)
        {
            try
            {
                _logger.LogInformation("Checking for overlapping appointments for doctor: {DoctorName}", doctorName);
                
                var query = _context.Appointments
                    .Where(a => a.DoctorName == doctorName &&
                               ((startTime >= a.StartTime && startTime < a.EndTime) ||
                                (endTime > a.StartTime && endTime <= a.EndTime) ||
                                (startTime <= a.StartTime && endTime >= a.EndTime)));

                if (excludeId.HasValue)
                {
                    query = query.Where(a => a.Id != excludeId.Value);
                }

                var hasOverlap = await query.AnyAsync();
                
                _logger.LogInformation("Overlap check result for doctor {DoctorName}: {HasOverlap}", doctorName, hasOverlap);
                return hasOverlap;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking for overlapping appointments for doctor: {DoctorName}", doctorName);
                throw;
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            try
            {
                return await _context.Appointments.AnyAsync(a => a.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if appointment exists with ID: {Id}", id);
                throw;
            }
        }
    }
}
