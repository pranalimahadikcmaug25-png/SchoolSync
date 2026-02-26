using SmartSchoolAPI.Models;

namespace SmartSchoolAPI.Repositories;

public interface IEnrollmentRepository
{
    Task<Enrollment> CreateAsync(Enrollment enrollment);
    Task<Enrollment?> GetByIdAsync(int enrollmentId);
    Task<Enrollment?> GetByStudentIdAsync(int studentId);
    Task<List<Enrollment>> GetAllAsync();
    Task<Enrollment> UpdateAsync(Enrollment enrollment);
    Task<bool> DeleteAsync(int enrollmentId);
}

