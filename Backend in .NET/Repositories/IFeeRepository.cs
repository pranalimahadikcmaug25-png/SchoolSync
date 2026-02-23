using SmartSchoolAPI.Models;

namespace SmartSchoolAPI.Repositories;

public interface IFeeRepository
{
    Task<Fee> CreateAsync(Fee fee);
    Task<Fee?> GetByIdAsync(int feeId);
    Task<List<Fee>> GetByStudentIdAsync(int studentId);
    Task<List<Fee>> GetAllAsync();
    Task<Fee> UpdateAsync(Fee fee);
    Task<bool> DeleteAsync(int feeId);
}

