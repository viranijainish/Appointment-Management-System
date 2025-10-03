using System.ComponentModel.DataAnnotations;

namespace AppointmentManagement.API.Models
{
    /// <summary>
    /// Represents a medical appointment
    /// </summary>
    public class Appointment
    {
        /// <summary>
        /// Unique identifier for the appointment
        /// </summary>
        public int Id { get; set; }
        
        /// <summary>
        /// Name of the patient for this appointment
        /// </summary>
        /// <example>John Doe</example>
        [Required(ErrorMessage = "Patient name is required")]
        [StringLength(100, ErrorMessage = "Patient name cannot exceed 100 characters")]
        public string PatientName { get; set; } = string.Empty;
        
        /// <summary>
        /// Start date and time of the appointment
        /// </summary>
        /// <example>2024-01-15T10:00:00</example>
        [Required(ErrorMessage = "Start time is required")]
        public DateTime StartTime { get; set; }
        
        /// <summary>
        /// End date and time of the appointment
        /// </summary>
        /// <example>2024-01-15T11:00:00</example>
        [Required(ErrorMessage = "End time is required")]
        public DateTime EndTime { get; set; }
        
        /// <summary>
        /// Name of the doctor for this appointment
        /// </summary>
        /// <example>Dr. Smith</example>
        [Required(ErrorMessage = "Doctor name is required")]
        [StringLength(100, ErrorMessage = "Doctor name cannot exceed 100 characters")]
        public string DoctorName { get; set; } = string.Empty;
    }
}
