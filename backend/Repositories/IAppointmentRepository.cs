using AppointmentManagement.API.Models;

namespace AppointmentManagement.API.Repositories
{
    public interface IAppointmentRepository
    {
        Task<IEnumerable<Appointment>> GetAllAsync();
        Task<Appointment?> GetByIdAsync(int id);
        Task<Appointment> CreateAsync(Appointment appointment);
        Task<Appointment?> UpdateAsync(int id, Appointment appointment);
        Task<bool> DeleteAsync(int id);
        Task<bool> HasOverlappingAppointmentAsync(string doctorName, DateTime startTime, DateTime endTime, int? excludeId = null);
        Task<bool> ExistsAsync(int id);
    }
}
