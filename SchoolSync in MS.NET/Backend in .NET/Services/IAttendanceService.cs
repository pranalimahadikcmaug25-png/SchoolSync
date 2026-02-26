using SmartSchoolAPI.DTOs;

namespace SmartSchoolAPI.Services;

public interface IAttendanceService
{
    Task<bool> MarkAttendanceAsync(AttendanceDto attendanceDto, int markedByUserId);
    Task<List<object>> GetStudentAttendanceAsync(int studentId);
    Task<List<object>> GetAllAttendanceAsync();
    Task<object?> GetAttendanceByIdAsync(int attendanceId);
    Task<bool> UpdateAttendanceAsync(int attendanceId, AttendanceDto attendanceDto);
    Task<bool> DeleteAttendanceAsync(int attendanceId);
}

