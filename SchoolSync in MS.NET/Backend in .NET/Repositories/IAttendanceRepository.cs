using SmartSchoolAPI.Models;

namespace SmartSchoolAPI.Repositories;

public interface IAttendanceRepository
{
    Task<Attendance> CreateAsync(Attendance attendance);
    Task<Attendance?> GetByIdAsync(int attendanceId);
    Task<Attendance> UpdateAsync(Attendance attendance);
    Task<bool> DeleteAsync(int attendanceId);
    Task<List<Attendance>> GetByStudentIdAsync(int studentId);
    Task<List<Attendance>> GetByDateAsync(DateTime date);
    Task<Attendance?> GetByStudentAndDateAsync(int studentId, DateTime date);
    Task<List<Attendance>> GetAllAsync();
}

