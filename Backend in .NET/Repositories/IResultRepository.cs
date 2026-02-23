using SmartSchoolAPI.Models;

namespace SmartSchoolAPI.Repositories;

public interface IResultRepository
{
    Task<Result> CreateAsync(Result result);
    Task<Result?> GetByIdAsync(int resultId);
    Task<Result> UpdateAsync(Result result);
    Task<bool> DeleteAsync(int resultId);
    Task<List<Result>> GetByStudentIdAsync(int studentId);
    Task<List<Result>> GetAllAsync();
}

