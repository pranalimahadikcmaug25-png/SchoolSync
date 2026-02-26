using Microsoft.EntityFrameworkCore;
using SmartSchoolAPI.Data;
using SmartSchoolAPI.DTOs;
using SmartSchoolAPI.Models;
using SmartSchoolAPI.Repositories;

namespace SmartSchoolAPI.Services;

public class AttendanceService : IAttendanceService
{
    private readonly IAttendanceRepository _attendanceRepository;
    private readonly IUserRepository _userRepository;
    private readonly INotificationService _notificationService;
    private readonly ApplicationDbContext _context;

    public AttendanceService(
        IAttendanceRepository attendanceRepository,
        IUserRepository userRepository,
        INotificationService notificationService,
        ApplicationDbContext context)
    {
        _attendanceRepository = attendanceRepository;
        _userRepository = userRepository;
        _notificationService = notificationService;
        _context = context;
    }

    public async Task<bool> MarkAttendanceAsync(AttendanceDto attendanceDto, int markedByUserId)
    {
        // Check if attendance already exists for this date
        var existing = await _attendanceRepository.GetByStudentAndDateAsync(
            attendanceDto.StudentId, attendanceDto.Date);

        if (existing != null)
        {
            // Update existing attendance
            existing.Status = attendanceDto.Status;
            _context.Attendances.Update(existing);
            await _context.SaveChangesAsync();
        }
        else
        {
            // Create new attendance
            var attendance = new Attendance
            {
                StudentId = attendanceDto.StudentId,
                Date = attendanceDto.Date,
                Status = attendanceDto.Status,
                MarkedBy = markedByUserId
            };

            await _attendanceRepository.CreateAsync(attendance);
        }

        // If absent, send email notification
        if (attendanceDto.Status.ToUpper() == "ABSENT")
        {
            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.StudentId == attendanceDto.StudentId);

            if (student != null)
            {
                await _notificationService.SendAbsenceEmailAsync(student, attendanceDto.Date);
            }
        }

        return true;
    }

    public async Task<List<object>> GetStudentAttendanceAsync(int studentId)
    {
        var attendances = await _attendanceRepository.GetByStudentIdAsync(studentId);
        return attendances.Select(a => new
        {
            attendanceId = a.AttendanceId,
            date = a.Date.ToString("yyyy-MM-dd"),
            status = a.Status,
            studentName = a.Student.User.Username
        }).Cast<object>().ToList();
    }

    public async Task<List<object>> GetAllAttendanceAsync()
    {
        var attendances = await _attendanceRepository.GetAllAsync();
        return attendances.Select(a => new
        {
            attendanceId = a.AttendanceId,
            studentId = a.StudentId,
            studentName = a.Student.User.Username,
            rollNo = a.Student.RollNo,
            className = a.Student.Class,
            date = a.Date.ToString("yyyy-MM-dd"),
            status = a.Status,
            markedBy = a.MarkedBy
        }).Cast<object>().ToList();
    }

    public async Task<object?> GetAttendanceByIdAsync(int attendanceId)
    {
        var attendance = await _attendanceRepository.GetByIdAsync(attendanceId);
        if (attendance == null) return null;

        return new
        {
            attendanceId = attendance.AttendanceId,
            studentId = attendance.StudentId,
            studentName = attendance.Student.User.Username,
            rollNo = attendance.Student.RollNo,
            className = attendance.Student.Class,
            date = attendance.Date.ToString("yyyy-MM-dd"),
            status = attendance.Status,
            markedBy = attendance.MarkedBy
        };
    }

    public async Task<bool> UpdateAttendanceAsync(int attendanceId, AttendanceDto attendanceDto)
    {
        var attendance = await _attendanceRepository.GetByIdAsync(attendanceId);
        if (attendance == null) return false;

        attendance.StudentId = attendanceDto.StudentId;
        attendance.Date = attendanceDto.Date;
        attendance.Status = attendanceDto.Status;

        await _attendanceRepository.UpdateAsync(attendance);

        // If changed to absent, send notification
        if (attendanceDto.Status.ToUpper() == "ABSENT")
        {
            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.StudentId == attendanceDto.StudentId);

            if (student != null)
            {
                await _notificationService.SendAbsenceEmailAsync(student, attendanceDto.Date);
            }
        }

        return true;
    }

    public async Task<bool> DeleteAttendanceAsync(int attendanceId)
    {
        return await _attendanceRepository.DeleteAsync(attendanceId);
    }
}

