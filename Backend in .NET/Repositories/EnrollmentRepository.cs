using Microsoft.EntityFrameworkCore;
using SmartSchoolAPI.Data;
using SmartSchoolAPI.Models;

namespace SmartSchoolAPI.Repositories;

public class EnrollmentRepository : IEnrollmentRepository
{
    private readonly ApplicationDbContext _context;

    public EnrollmentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Enrollment> CreateAsync(Enrollment enrollment)
    {
        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();
        return enrollment;
    }

    public async Task<Enrollment?> GetByIdAsync(int enrollmentId)
    {
        return await _context.Enrollments
            .Include(e => e.Student)
            .ThenInclude(s => s.User)
            .FirstOrDefaultAsync(e => e.EnrollmentId == enrollmentId);
    }

    public async Task<Enrollment?> GetByStudentIdAsync(int studentId)
    {
        return await _context.Enrollments
            .Include(e => e.Student)
            .ThenInclude(s => s.User)
            .Where(e => e.StudentId == studentId && e.Status == "Active")
            .OrderByDescending(e => e.EnrollmentDate)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Enrollment>> GetAllAsync()
    {
        return await _context.Enrollments
            .Include(e => e.Student)
            .ThenInclude(s => s.User)
            .OrderByDescending(e => e.EnrollmentDate)
            .ToListAsync();
    }

    public async Task<Enrollment> UpdateAsync(Enrollment enrollment)
    {
        _context.Enrollments.Update(enrollment);
        await _context.SaveChangesAsync();
        return enrollment;
    }

    public async Task<bool> DeleteAsync(int enrollmentId)
    {
        var enrollment = await _context.Enrollments.FindAsync(enrollmentId);
        if (enrollment == null) return false;
        _context.Enrollments.Remove(enrollment);
        await _context.SaveChangesAsync();
        return true;
    }
}

