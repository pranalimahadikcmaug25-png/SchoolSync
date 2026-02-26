using SmartSchoolAPI.DTOs;

namespace SmartSchoolAPI.Services;

public interface IResultService
{
    Task<bool> UploadResultAsync(ResultDto resultDto);
    Task<List<object>> GetStudentResultsAsync(int studentId);
    Task<List<object>> GetAllResultsAsync();
    Task<object?> GetResultByIdAsync(int resultId);
    Task<bool> UpdateResultAsync(int resultId, ResultDto resultDto);
    Task<bool> DeleteResultAsync(int resultId);
}

