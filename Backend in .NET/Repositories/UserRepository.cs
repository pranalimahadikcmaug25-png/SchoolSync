using Microsoft.EntityFrameworkCore;
using SmartSchoolAPI.Data;
using SmartSchoolAPI.Models;

namespace SmartSchoolAPI.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User?> GetByIdAsync(int userId)
    {
        return await _context.Users.FindAsync(userId);
    }

    public async Task<User> UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<bool> DeleteAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Student?> GetStudentByUserIdAsync(int userId)
    {
        return await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.UserId == userId);
    }

    public async Task<Teacher?> GetTeacherByUserIdAsync(int userId)
    {
        return await _context.Teachers
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.UserId == userId);
    }

    public async Task<List<User>> GetAllUsersAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<List<Student>> GetAllStudentsAsync()
    {
        return await _context.Students
            .Include(s => s.User)
            .ToListAsync();
    }

    public async Task<List<Teacher>> GetAllTeachersAsync()
    {
        return await _context.Teachers
            .Include(t => t.User)
            .ToListAsync();
    }

    public async Task<Student?> GetStudentByIdAsync(int studentId)
    {
        return await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.StudentId == studentId);
    }

    public async Task<Student> CreateStudentAsync(Student student)
    {
        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        return student;
    }

    public async Task<Student> UpdateStudentAsync(Student student)
    {
        _context.Students.Update(student);
        await _context.SaveChangesAsync();
        return student;
    }

    public async Task<bool> DeleteStudentAsync(int studentId)
    {
        var student = await _context.Students.FindAsync(studentId);
        if (student == null) return false;
        _context.Students.Remove(student);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Teacher?> GetTeacherByIdAsync(int teacherId)
    {
        return await _context.Teachers
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.TeacherId == teacherId);
    }

    public async Task<Teacher> CreateTeacherAsync(Teacher teacher)
    {
        _context.Teachers.Add(teacher);
        await _context.SaveChangesAsync();
        return teacher;
    }

    public async Task<Teacher> UpdateTeacherAsync(Teacher teacher)
    {
        _context.Teachers.Update(teacher);
        await _context.SaveChangesAsync();
        return teacher;
    }

    public async Task<bool> DeleteTeacherAsync(int teacherId)
    {
        var teacher = await _context.Teachers.FindAsync(teacherId);
        if (teacher == null) return false;
        _context.Teachers.Remove(teacher);
        await _context.SaveChangesAsync();
        return true;
    }
}

