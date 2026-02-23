using Microsoft.EntityFrameworkCore;
using SmartSchoolAPI.Data;
using SmartSchoolAPI.Models;

namespace SmartSchoolAPI.Repositories;

public class ResultRepository : IResultRepository
{
    private readonly ApplicationDbContext _context;

    public ResultRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> CreateAsync(Result result)
    {
        _context.Results.Add(result);
        await _context.SaveChangesAsync();
        return result;
    }

    public async Task<List<Result>> GetByStudentIdAsync(int studentId)
    {
        return await _context.Results
            .Include(r => r.Student)
            .ThenInclude(s => s.User)
            .Where(r => r.StudentId == studentId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Result>> GetAllAsync()
    {
        return await _context.Results
            .Include(r => r.Student)
            .ThenInclude(s => s.User)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<Result?> GetByIdAsync(int resultId)
    {
        return await _context.Results
            .Include(r => r.Student)
            .ThenInclude(s => s.User)
            .FirstOrDefaultAsync(r => r.ResultId == resultId);
    }

    public async Task<Result> UpdateAsync(Result result)
    {
        _context.Results.Update(result);
        await _context.SaveChangesAsync();
        return result;
    }

    public async Task<bool> DeleteAsync(int resultId)
    {
        var result = await _context.Results.FindAsync(resultId);
        if (result == null) return false;
        _context.Results.Remove(result);
        await _context.SaveChangesAsync();
        return true;
    }
}

