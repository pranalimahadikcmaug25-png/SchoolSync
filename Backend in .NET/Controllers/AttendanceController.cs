using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSchoolAPI.DTOs;
using SmartSchoolAPI.Services;
using System.Security.Claims;

namespace SmartSchoolAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _attendanceService;

    public AttendanceController(IAttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

    [HttpPost("mark")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> MarkAttendance([FromBody] AttendanceDto attendanceDto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var result = await _attendanceService.MarkAttendanceAsync(attendanceDto, userId);
        if (result)
        {
            return Ok(new { message = "Attendance marked successfully" });
        }
        return BadRequest(new { message = "Failed to mark attendance" });
    }

    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetStudentAttendance(int studentId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "";

        // Students can only view their own attendance
        if (role == "Student")
        {
            // Verify student is viewing their own attendance
            // This would require additional logic to check studentId matches userId
        }

        var attendance = await _attendanceService.GetStudentAttendanceAsync(studentId);
        return Ok(attendance);
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<IActionResult> GetAllAttendance()
    {
        var attendance = await _attendanceService.GetAllAttendanceAsync();
        return Ok(attendance);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAttendance(int id)
    {
        var attendance = await _attendanceService.GetAttendanceByIdAsync(id);
        if (attendance == null) return NotFound();
        return Ok(attendance);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAttendance(int id, [FromBody] AttendanceDto attendanceDto)
    {
        var result = await _attendanceService.UpdateAttendanceAsync(id, attendanceDto);
        if (result)
        {
            return Ok(new { message = "Attendance updated successfully" });
        }
        return BadRequest(new { message = "Failed to update attendance" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAttendance(int id)
    {
        var result = await _attendanceService.DeleteAttendanceAsync(id);
        if (result)
        {
            return Ok(new { message = "Attendance deleted successfully" });
        }
        return BadRequest(new { message = "Failed to delete attendance" });
    }
}

