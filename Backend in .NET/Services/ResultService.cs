using SmartSchoolAPI.DTOs;
using SmartSchoolAPI.Models;
using SmartSchoolAPI.Repositories;

namespace SmartSchoolAPI.Services;

public class ResultService : IResultService
{
    private readonly IResultRepository _resultRepository;

    public ResultService(IResultRepository resultRepository)
    {
        _resultRepository = resultRepository;
    }

    public async Task<bool> UploadResultAsync(ResultDto resultDto)
    {
        var result = new Result
        {
            StudentId = resultDto.StudentId,
            Subject = resultDto.Subject,
            Marks = resultDto.Marks,
            CreatedAt = DateTime.UtcNow
        };

        await _resultRepository.CreateAsync(result);
        return true;
    }

    public async Task<List<object>> GetStudentResultsAsync(int studentId)
    {
        var results = await _resultRepository.GetByStudentIdAsync(studentId);
        return results.Select(r => new
        {
            resultId = r.ResultId,
            subject = r.Subject,
            marks = r.Marks,
            date = r.CreatedAt.ToString("yyyy-MM-dd")
        }).Cast<object>().ToList();
    }

    public async Task<List<object>> GetAllResultsAsync()
    {
        var results = await _resultRepository.GetAllAsync();
        return results.Select(r => new
        {
            resultId = r.ResultId,
            studentId = r.StudentId,
            studentName = r.Student.User.Username,
            rollNo = r.Student.RollNo,
            className = r.Student.Class,
            subject = r.Subject,
            marks = r.Marks,
            date = r.CreatedAt.ToString("yyyy-MM-dd")
        }).Cast<object>().ToList();
    }

    public async Task<object?> GetResultByIdAsync(int resultId)
    {
        var result = await _resultRepository.GetByIdAsync(resultId);
        if (result == null) return null;

        return new
        {
            resultId = result.ResultId,
            studentId = result.StudentId,
            studentName = result.Student.User.Username,
            rollNo = result.Student.RollNo,
            className = result.Student.Class,
            subject = result.Subject,
            marks = result.Marks,
            date = result.CreatedAt.ToString("yyyy-MM-dd")
        };
    }

    public async Task<bool> UpdateResultAsync(int resultId, ResultDto resultDto)
    {
        var result = await _resultRepository.GetByIdAsync(resultId);
        if (result == null) return false;

        result.StudentId = resultDto.StudentId;
        result.Subject = resultDto.Subject;
        result.Marks = resultDto.Marks;

        await _resultRepository.UpdateAsync(result);
        return true;
    }

    public async Task<bool> DeleteResultAsync(int resultId)
    {
        return await _resultRepository.DeleteAsync(resultId);
    }
}

