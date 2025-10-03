using Microsoft.AspNetCore.Mvc;
using AppointmentManagement.API.Models;
using AppointmentManagement.API.Repositories;
using System.ComponentModel.DataAnnotations;

namespace AppointmentManagement.API.Controllers
{
    /// <summary>
    /// Controller for managing medical appointments
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly ILogger<AppointmentsController> _logger;

        public AppointmentsController(IAppointmentRepository appointmentRepository, ILogger<AppointmentsController> logger)
        {
            _appointmentRepository = appointmentRepository;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves all appointments
        /// </summary>
        /// <returns>A list of all appointments</returns>
        /// <response code="200">Returns the list of appointments</response>
        /// <response code="500">If there was an internal server error</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Appointment>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            try
            {
                var appointments = await _appointmentRepository.GetAllAsync();
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving appointments");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Retrieves a specific appointment by ID
        /// </summary>
        /// <param name="id">The ID of the appointment to retrieve</param>
        /// <returns>The requested appointment</returns>
        /// <response code="200">Returns the requested appointment</response>
        /// <response code="404">If the appointment is not found</response>
        /// <response code="500">If there was an internal server error</response>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Appointment), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Appointment>> GetAppointment([Required] int id)
        {
            try
            {
                var appointment = await _appointmentRepository.GetByIdAsync(id);

                if (appointment == null)
                {
                    return NotFound($"Appointment with ID {id} not found");
                }

                return Ok(appointment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving appointment {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Creates a new appointment
        /// </summary>
        /// <param name="appointment">The appointment data to create</param>
        /// <returns>The created appointment</returns>
        /// <response code="201">Returns the newly created appointment</response>
        /// <response code="400">If the appointment data is invalid or conflicts with existing appointments</response>
        /// <response code="500">If there was an internal server error</response>
        [HttpPost]
        [ProducesResponseType(typeof(Appointment), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Appointment>> PostAppointment([Required] Appointment appointment)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Validate appointment times
                if (appointment.StartTime >= appointment.EndTime)
                {
                    return BadRequest("Start time must be before end time");
                }

                if (appointment.StartTime < DateTime.Now)
                {
                    return BadRequest("Cannot book appointments in the past");
                }

                // Check for overlapping appointments with the same doctor
                var hasOverlap = await _appointmentRepository.HasOverlappingAppointmentAsync(
                    appointment.DoctorName, 
                    appointment.StartTime, 
                    appointment.EndTime);

                if (hasOverlap)
                {
                    return BadRequest($"Doctor {appointment.DoctorName} already has an overlapping appointment during this time");
                }

                var createdAppointment = await _appointmentRepository.CreateAsync(appointment);

                return CreatedAtAction(nameof(GetAppointment), new { id = createdAppointment.Id }, createdAppointment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating appointment");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Updates an existing appointment
        /// </summary>
        /// <param name="id">The ID of the appointment to update</param>
        /// <param name="appointment">The updated appointment data</param>
        /// <returns>No content if successful</returns>
        /// <response code="204">If the appointment was successfully updated</response>
        /// <response code="400">If the appointment data is invalid or conflicts with existing appointments</response>
        /// <response code="404">If the appointment is not found</response>
        /// <response code="500">If there was an internal server error</response>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> PutAppointment([Required] int id, [Required] Appointment appointment)
        {
            try
            {
                if (id != appointment.Id)
                {
                    return BadRequest("ID mismatch");
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Validate appointment times
                if (appointment.StartTime >= appointment.EndTime)
                {
                    return BadRequest("Start time must be before end time");
                }

                if (appointment.StartTime < DateTime.Now)
                {
                    return BadRequest("Cannot book appointments in the past");
                }

                // Check for overlapping appointments with the same doctor (excluding current appointment)
                var hasOverlap = await _appointmentRepository.HasOverlappingAppointmentAsync(
                    appointment.DoctorName, 
                    appointment.StartTime, 
                    appointment.EndTime, 
                    id);

                if (hasOverlap)
                {
                    return BadRequest($"Doctor {appointment.DoctorName} already has an overlapping appointment during this time");
                }

                var updatedAppointment = await _appointmentRepository.UpdateAsync(id, appointment);

                if (updatedAppointment == null)
                {
                    return NotFound($"Appointment with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating appointment {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Deletes a specific appointment
        /// </summary>
        /// <param name="id">The ID of the appointment to delete</param>
        /// <returns>No content if successful</returns>
        /// <response code="204">If the appointment was successfully deleted</response>
        /// <response code="404">If the appointment is not found</response>
        /// <response code="500">If there was an internal server error</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteAppointment([Required] int id)
        {
            try
            {
                var deleted = await _appointmentRepository.DeleteAsync(id);
                
                if (!deleted)
                {
                    return NotFound($"Appointment with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting appointment {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
