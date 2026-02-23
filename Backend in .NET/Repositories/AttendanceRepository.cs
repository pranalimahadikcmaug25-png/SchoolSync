using Microsoft.EntityFrameworkCore;
using SmartSchoolAPI.Data;
using SmartSchoolAPI.Models;

namespace SmartSchoolAPI.Repositories;

public class AttendanceRepository : IAttendanceRepository
{
    private readonly ApplicationDbContext _context;

    public AttendanceRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Attendance> CreateAsync(Attendance attendance)
    {
        _context.Attendances.Add(attendance);
        await _context.SaveChangesAsync();
        return attendance;
    }

    public async Task<List<Attendance>> GetByStudentIdAsync(int studentId)
    {
        return await _context.Attendances
            .Include(a => a.Student)
            .ThenInclude(s => s.User)
            .Where(a => a.StudentId == studentId)
            .OrderByDescending(a => a.Date)
            .ToListAsync();
    }

    public async Task<List<Attendance>> GetByDateAsync(DateTime date)
    {
        return await _context.Attendances
            .Include(a => a.Student)
            .ThenInclude(s => s.User)
            .Where(a => a.Date.Date == date.Date)
            .ToListAsync();
    }

    public async Task<Attendance?> GetByStudentAndDateAsync(int studentId, DateTime date)
    {
        return await _context.Attendances
            .Include(a => a.Student)
            .FirstOrDefaultAsync(a => a.StudentId == studentId && a.Date.Date == date.Date);
    }

    public async Task<List<Attendance>> GetAllAsync()
    {
        return await _context.Attendances
            .Include(a => a.Student)
            .ThenInclude(s => s.User)
            .OrderByDescending(a => a.Date)
            .ToListAsync();
    }

    public async Task<Attendance?> GetByIdAsync(int attendanceId)
    {
        return await _context.Attendances
            .Include(a => a.Student)
            .ThenInclude(s => s.User)
            .FirstOrDefaultAsync(a => a.AttendanceId == attendanceId);
    }

    public async Task<Attendance> UpdateAsync(Attendance attendance)
    {
        _context.Attendances.Update(attendance);
        await _context.SaveChangesAsync();
        return attendance;
    }

    public async Task<bool> DeleteAsync(int attendanceId)
    {
        var attendance = await _context.Attendances.FindAsync(attendanceId);
        if (attendance == null) return false;
        _context.Attendances.Remove(attendance);
        await _context.SaveChangesAsync();
        return true;
    }
}

