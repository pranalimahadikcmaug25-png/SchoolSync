using Microsoft.EntityFrameworkCore;
using SmartSchoolAPI.Data;
using SmartSchoolAPI.Models;

namespace SmartSchoolAPI.Repositories;

public class FeeRepository : IFeeRepository
{
    private readonly ApplicationDbContext _context;

    public FeeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Fee> CreateAsync(Fee fee)
    {
        _context.Fees.Add(fee);
        await _context.SaveChangesAsync();
        return fee;
    }

    public async Task<Fee?> GetByIdAsync(int feeId)
    {
        return await _context.Fees
            .Include(f => f.Student)
            .ThenInclude(s => s.User)
            .FirstOrDefaultAsync(f => f.FeeId == feeId);
    }

    public async Task<List<Fee>> GetByStudentIdAsync(int studentId)
    {
        return await _context.Fees
            .Include(f => f.Student)
            .ThenInclude(s => s.User)
            .Where(f => f.StudentId == studentId)
            .OrderByDescending(f => f.DueDate)
            .ToListAsync();
    }

    public async Task<List<Fee>> GetAllAsync()
    {
        return await _context.Fees
            .Include(f => f.Student)
            .ThenInclude(s => s.User)
            .OrderByDescending(f => f.DueDate)
            .ToListAsync();
    }

    public async Task<Fee> UpdateAsync(Fee fee)
    {
        _context.Fees.Update(fee);
        await _context.SaveChangesAsync();
        return fee;
    }

    public async Task<bool> DeleteAsync(int feeId)
    {
        var fee = await _context.Fees.FindAsync(feeId);
        if (fee == null) return false;
        _context.Fees.Remove(fee);
        await _context.SaveChangesAsync();
        return true;
    }
}

